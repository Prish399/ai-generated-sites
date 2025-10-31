#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoName = 'ai-generated-sites';

// Detect the generated project folder
function detectGeneratedProjectFolder() {
  const markers = ['src', 'package.json', 'vite.config.js', 'index.html', 'app.jsx', 'app.tsx'];
  
  const checkDir = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const hasMarkers = markers.filter(m => 
      files.some(f => f.name === m)
    ).length >= 2;
    return hasMarkers;
  };

  const subdirs = fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(f => f.isDirectory() && !f.name.startsWith('.'))
    .map(f => f.name);

  for (const subdir of subdirs) {
    const fullPath = path.join(__dirname, subdir);
    if (checkDir(fullPath)) {
      console.log(`✅ Detected generated project folder: ${subdir}`);
      return fullPath;
    }
  }

  if (checkDir(__dirname)) {
    console.log('✅ Using current directory as generated project folder');
    return __dirname;
  }

  throw new Error('Could not detect generated project folder.');
}

async function getGithubUsername(token) {
  if (process.env.GITHUB_USERNAME) return process.env.GITHUB_USERNAME;
  try {
    const res = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'deploy-script' }
    });
    return res.data.login;
  } catch (err) {
    throw new Error('Unable to determine GitHub username. Set GITHUB_USERNAME env or provide a valid GITHUB_TOKEN.');
  }
}

async function pushGeneratedSiteToGitHub({ githubToken, owner, repo, projectPath, branch = 'main' }) {
  console.log(`Initializing git in generated project folder: ${projectPath}`);
  const git = simpleGit(projectPath);

  if (!fs.existsSync(path.join(projectPath, '.git'))) {
    await git.init();
    console.log('Git repository initialized.');
  }

  try {
    const name = (await git.raw(['config', '--get', 'user.name'])).trim();
    if (!name) await git.addConfig('user.name', 'webgenie-bot');
  } catch (e) {}
  
  try {
    const email = (await git.raw(['config', '--get', 'user.email'])).trim();
    if (!email) await git.addConfig('user.email', 'webgenie-bot@example.com');
  } catch (e) {}

  console.log('Adding files to git...');
  await git.add('.');
  try {
    await git.commit('chore: updated generated site');
    console.log('Files committed.');
  } catch (err) {
    console.log('Note: commit may have failed (possibly nothing to commit)');
  }

  const remoteName = 'origin';
  const remoteUrl = `https://${owner}:${githubToken}@github.com/${owner}/${repo}.git`;
  const remotes = await git.getRemotes(true);
  const hasOrigin = remotes.some((r) => r.name === remoteName);
  
  if (!hasOrigin) {
    await git.addRemote(remoteName, remoteUrl);
  } else {
    await git.remote(['set-url', remoteName, remoteUrl]);
  }

  console.log(`Pushing to https://github.com/${owner}/${repo} (branch: ${branch})...`);
  try {
    await git.push(remoteName, branch, { '--force': null, '--set-upstream': null });
    console.log('✅ Generated site pushed to GitHub successfully!');
  } catch (err) {
    throw new Error('Failed to push to GitHub: ' + (err.message || JSON.stringify(err)));
  }

  try {
    await git.remote(['set-url', remoteName, `https://github.com/${owner}/${repo}.git`]);
  } catch (e) {}

  return `https://github.com/${owner}/${repo}`;
}

async function triggerVercelRedeployment(githubRepoUrl, githubToken) {
  console.log('🔄 Triggering Vercel redeployment via GitHub webhook...');
  
  // Vercel listens to GitHub push events automatically
  // The push we just did should trigger a deployment automatically
  // Just inform the user to check the Vercel dashboard
  
  console.log('📋 Deployment triggered! Check status at:');
  console.log(`   Vercel Dashboard: https://vercel.com/dashboard`);
  console.log(`   GitHub Repo: ${githubRepoUrl}`);
  console.log('\n💡 Vercel automatically redeploys when you push to the main branch.');
  console.log('   The deployment should start within seconds.\n');
  
  return {
    status: 'triggered',
    url: githubRepoUrl
  };
}

async function main() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) throw new Error('Missing GITHUB_TOKEN in environment');

    const projectPath = detectGeneratedProjectFolder();
    const username = await getGithubUsername(GITHUB_TOKEN);
    console.log('Using GitHub username:', username);

    const githubUrl = await pushGeneratedSiteToGitHub({
      githubToken: GITHUB_TOKEN,
      owner: username,
      repo: repoName,
      projectPath,
      branch: 'main'
    });

    console.log('\n🚀 Pushing code to GitHub triggers Vercel deployment automatically...');
    const result = await triggerVercelRedeployment(githubUrl, GITHUB_TOKEN);
    
    console.log('\n✅ Deployment process initiated!');
    console.log('📌 Live site will be available shortly at your Vercel project URL.');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message || err);
    process.exitCode = 1;
  }
}

main();
