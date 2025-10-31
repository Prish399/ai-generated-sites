#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import axios from 'axios';

const git = simpleGit();
const repoName = 'ai-generated-sites';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getGithubUsername(token) {
  if (process.env.GITHUB_USERNAME) return process.env.GITHUB_USERNAME;
  try {
    const res = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'deploy-script' }
    });
    return res.data.login;
  } catch (err) {
    throw new Error('Unable to determine GitHub username. Set GITHUB_USERNAME env or provide a valid GITHUB_TOKEN. ' + (err.response?.data?.message || err.message));
  }
}

async function ensureGithubRepo(token, owner, name) {
  const repoUrl = `https://api.github.com/repos/${owner}/${name}`;
  try {
    await axios.get(repoUrl, { headers: { Authorization: `token ${token}`, 'User-Agent': 'deploy-script' } });
    console.log(`✅ GitHub repository ${owner}/${name} already exists.`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`Repository ${owner}/${name} not found. Creating...`);
      const createUrl = 'https://api.github.com/user/repos';
      const body = { name, private: false };
      const resp = await axios.post(createUrl, body, { headers: { Authorization: `token ${token}`, 'User-Agent': 'deploy-script' } });
      if (resp.status >= 200 && resp.status < 300) {
        console.log(`✅ Created GitHub repository: ${resp.data.full_name}`);
      } else {
        throw new Error('Failed to create GitHub repository: ' + JSON.stringify(resp.data));
      }
    } else {
      throw new Error('Error checking GitHub repository: ' + (err.response?.data?.message || err.message));
    }
  }
}

async function pushCodeToGitHub({ githubToken, owner, repo, branch = 'main' }) {
  const cwd = process.cwd();
  // Init if needed
  if (!fs.existsSync(path.join(cwd, '.git'))) {
    console.log('Initializing git repository...');
    await git.init();
  } else {
    console.log('.git exists — using existing repository');
  }

  // Configure simple user if none set (helps some CI)
  try {
    const name = (await git.raw(['config', '--get', 'user.name'])).trim();
    const email = (await git.raw(['config', '--get', 'user.email'])).trim();
    if (!name) await git.addConfig('user.name', 'webgenie-bot');
    if (!email) await git.addConfig('user.email', 'webgenie-bot@example.com');
  } catch (e) {
    // ignore
  }

  await git.add('./*');
  try {
    await git.commit('chore: add generated site');
  } catch (err) {
    // commit may fail if nothing to commit
    console.log('Note: commit step may have failed (possibly nothing changed):', err.message);
  }

  // Ensure remote set with token auth
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
    console.log('✅ Code pushed to GitHub successfully!');
  } catch (err) {
    throw new Error('Failed to push to GitHub: ' + (err.message || JSON.stringify(err)));
  }
  // For security: remove token from remote URL after pushing so it's not stored in .git/config
  try {
    await git.remote(['set-url', remoteName, `https://github.com/${owner}/${repo}.git`]);
  } catch (e) {
    // non-fatal
  }
}

async function triggerVercelDeployment({ vercelToken, owner, repo, name }) {
  console.log('🚀 Triggering deployment on Vercel...');
  const url = 'https://api.vercel.com/v13/deployments';
  const body = {
    name,
    gitSource: {
      type: 'github',
      repoId: `${owner}/${repo}`,
      ref: 'main'
    },
    target: 'production'
  };

  const headers = {
    Authorization: `Bearer ${vercelToken}`,
    'Content-Type': 'application/json'
  };

  let resp;
  try {
    resp = await axios.post(url, body, { headers });
  } catch (err) {
    // Log detailed Vercel error for debugging
    const status = err.response?.status;
    const data = err.response?.data;
    console.error('Vercel API error. Status:', status);
    try {
      console.error('Vercel response body:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Vercel response body (raw):', data);
    }
    throw new Error('Failed to start Vercel deployment: ' + (err.message || status));
  }
  if (!(resp.status >= 200 && resp.status < 300)) {
    console.error('Vercel returned non-2xx status:', resp.status);
    console.error('Vercel response body:', JSON.stringify(resp.data, null, 2));
    throw new Error('Failed to start Vercel deployment: ' + JSON.stringify(resp.data));
  }
  const deployment = resp.data;
  console.log('Vercel deployment started, id:', deployment.uid || deployment.id || deployment._id);

  const deploymentId = deployment.uid || deployment.id || deployment._id;
  const waitUrl = `https://api.vercel.com/v13/deployments/${deploymentId}`;

  // Poll for readiness
  const maxAttempts = 60;
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const statusResp = await axios.get(waitUrl, { headers });
      const state = statusResp.data.state || statusResp.data.status || statusResp.data.readyState;
      // Vercel uses 'READY' or 'ERROR'
      if (state === 'READY' || state === 'ready') {
        const liveUrl = statusResp.data.url || statusResp.data.meta?.url || `${statusResp.data.name}.vercel.app`;
        console.log('🌐 Live site URL:', `https://${liveUrl}`);
        return `https://${liveUrl}`;
      }
      if (state === 'ERROR' || state === 'error') {
        throw new Error('Vercel deployment failed: ' + JSON.stringify(statusResp.data));
      }
      process.stdout.write('.');
    } catch (err) {
      // ignore transient
    }
    await sleep(3000);
  }
  throw new Error('Timed out waiting for Vercel deployment to become ready.');
}

async function main() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

    if (!VERCEL_TOKEN) throw new Error('Missing VERCEL_TOKEN in environment');

    let username = GITHUB_USERNAME;

    if (GITHUB_TOKEN) {
      // If token is provided, determine username and ensure repo + push
      username = await getGithubUsername(GITHUB_TOKEN);
      console.log('Using GitHub username:', username);
      await ensureGithubRepo(GITHUB_TOKEN, username, repoName);
      await pushCodeToGitHub({ githubToken: GITHUB_TOKEN, owner: username, repo: repoName, branch: 'main' });
    } else {
      // No token provided: only proceed if username is set and repo already exists
      if (!username) throw new Error('Missing GITHUB_TOKEN and GITHUB_USERNAME; provide one to proceed.');
      console.log('GITHUB_TOKEN not provided — skipping GitHub push. Using username:', username);
    }

    const live = await triggerVercelDeployment({ vercelToken: VERCEL_TOKEN, owner: username, repo: repoName, name: repoName });
    console.log('\n✅ Deployment finished. Live URL:', live);
  } catch (err) {
    console.error('\n❌ Error:', err.message || err);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && process.argv[1].endsWith('deploy.js')) {
  main();
}
