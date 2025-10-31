#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import axios from 'axios';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoName = 'ai-generated-sites';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Detect the generated project folder
function detectGeneratedProjectFolder() {
  // Common markers for a generated project
  const markers = ['src', 'package.json', 'vite.config.js', 'index.html', 'app.jsx', 'app.tsx'];
  
  const checkDir = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const hasMarkers = markers.filter(m => 
      files.some(f => f.name === m)
    ).length >= 2; // At least 2 markers present
    return hasMarkers;
  };

  // Check subdirectories first (e.g., /app, /generated-site, /src)
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

  // Fallback: check if current directory has the markers
  if (checkDir(__dirname)) {
    console.log('✅ Using current directory as generated project folder');
    return __dirname;
  }

  throw new Error('Could not detect generated project folder. Make sure it has src/, package.json, and other standard project files.');
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

  // Init git if needed
  if (!fs.existsSync(path.join(projectPath, '.git'))) {
    await git.init();
    console.log('Git repository initialized in generated project folder.');
  }

  // Configure git user
  try {
    const name = (await git.raw(['config', '--get', 'user.name'])).trim();
    const email = (await git.raw(['config', '--get', 'user.email'])).trim();
    if (!name) await git.addConfig('user.name', 'webgenie-bot');
    if (!email) await git.addConfig('user.email', 'webgenie-bot@example.com');
  } catch (e) {
    // ignore
  }

  // Add and commit
  console.log('Adding files to git...');
  await git.add('.');
  try {
    await git.commit('chore: initial commit of generated site');
    console.log('Files committed.');
  } catch (err) {
    console.log('Note: commit may have failed (possibly nothing to commit):', err.message);
  }

  // Set remote and push
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
    await git.push(remoteName, branch, { '--set-upstream': null });
    console.log('✅ Generated site pushed to GitHub successfully!');
  } catch (err) {
    throw new Error('Failed to push to GitHub: ' + (err.message || JSON.stringify(err)));
  }

  // Remove token from remote (security)
  try {
    await git.remote(['set-url', remoteName, `https://github.com/${owner}/${repo}.git`]);
  } catch (e) {
    // non-fatal
  }
}

function deployWithVercelCLI(projectPath, vercelToken, projectName) {
  return new Promise((resolve, reject) => {
    const cmd = `npx --yes vercel --prod --yes --token ${vercelToken} --name ${projectName}`;
    console.log('Running Vercel CLI deployment...');
    const cp = exec(cmd, { cwd: projectPath, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Vercel CLI failed:', stderr || error.message);
        return reject(new Error('Vercel CLI deploy failed: ' + (stderr || error.message)));
      }
      // Parse stdout for a URL
      const urlMatch = stdout.match(/https?:\/\/[^\s]+vercel\.app/);
      if (urlMatch) {
        const live = urlMatch[0];
        console.log('🌐 Live site URL:', live);
        return resolve(live);
      }
      console.log('Vercel CLI output:\n', stdout);
      return resolve(null);
    });

    cp.stdout?.pipe(process.stdout);
    cp.stderr?.pipe(process.stderr);
  });
}

async function main() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    if (!GITHUB_TOKEN) throw new Error('Missing GITHUB_TOKEN in environment');
    if (!VERCEL_TOKEN) throw new Error('Missing VERCEL_TOKEN in environment');

    // Step 1: Detect generated project folder
    const projectPath = detectGeneratedProjectFolder();

    // Step 2: Get GitHub username
    const username = await getGithubUsername(GITHUB_TOKEN);
    console.log('Using GitHub username:', username);

    // Step 3: Push generated site to GitHub
    await pushGeneratedSiteToGitHub({
      githubToken: GITHUB_TOKEN,
      owner: username,
      repo: repoName,
      projectPath,
      branch: 'main'
    });

    // Step 4: Deploy to Vercel
    console.log('🚀 Triggering deployment on Vercel...');
    const live = await deployWithVercelCLI(projectPath, VERCEL_TOKEN, repoName);
    if (live) {
      console.log('\n✅ Deployment finished. Live URL:', live);
    } else {
      console.log('\n✅ Deployment triggered. Check Vercel dashboard for status.');
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message || err);
    process.exitCode = 1;
  }
}

main();
