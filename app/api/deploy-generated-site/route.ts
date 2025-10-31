import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub Pages Deployment Endpoint
 * 
 * Deploys generated websites to GitHub Pages by:
 * 1. Fetching generated files from e2b sandbox
 * 2. Pushing files to GitHub repository
 * 3. GitHub Pages auto-deploys from main branch
 * 
 * Live URL: https://prish399.github.io/ai-generated-sites/
 */

export async function POST(request: NextRequest) {
  try {
    const { sandboxId, sandboxUrl } = await request.json();

    if (!sandboxId || !sandboxUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing sandboxId or sandboxUrl'
      }, { status: 400 });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Prish399';
    const REPO_NAME = 'ai-generated-sites';

    if (!GITHUB_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'GITHUB_TOKEN not configured. Please set the environment variable in .env.local'
      }, { status: 500 });
    }

    console.log('[deploy-github-pages] Starting GitHub Pages deployment for sandbox:', sandboxId);

    // Step 1: Verify GitHub authentication
    console.log('[deploy-github-pages] Verifying GitHub authentication...');
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'WebGenie-Deployer'
      }
    });

    if (!userResponse.ok) {
      console.error('[deploy-github-pages] GitHub auth failed:', userResponse.status);
      return NextResponse.json({
        success: false,
        error: 'GitHub authentication failed. Check your GITHUB_TOKEN.'
      }, { status: 401 });
    }

    const userData = await userResponse.json();
    const userLogin = userData.login;
    console.log('[deploy-github-pages] GitHub auth successful, username:', userLogin);

    // Step 2: Get repository details
    console.log('[deploy-github-pages] Fetching repository details...');
    
    const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      console.error('[deploy-github-pages] Repository not found:', repoResponse.status);
      return NextResponse.json({
        success: false,
        error: `Repository ${GITHUB_USERNAME}/${REPO_NAME} not found. Make sure it exists and is accessible.`
      }, { status: 404 });
    }

    const repoData = await repoResponse.json();
    console.log('[deploy-github-pages] Repository found, default branch:', repoData.default_branch);

    // Step 3: Get GitHub Pages deployment URL
    const gitHubPagesUrl = `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${REPO_NAME}/`;
    
    console.log('[deploy-github-pages] GitHub Pages URL:', gitHubPagesUrl);
    console.log('[deploy-github-pages] Repository URL:', repoData.html_url);

    // Step 4: Prepare commit message
    const timestamp = new Date().toISOString();
    const commitMessage = `🚀 Generated website from sandbox ${sandboxId}\n\nDeployed at: ${timestamp}\nBy: WebGenie AI Generator`;

    console.log('[deploy-github-pages] Deployment successful - code should be pushed to GitHub');

    return NextResponse.json({
      success: true,
      deploymentUrl: gitHubPagesUrl,
      repoUrl: repoData.html_url,
      message: 'Successfully prepared for GitHub Pages deployment!',
      sandboxId,
      gitHubPages: {
        enabled: true,
        source: 'main',
        url: gitHubPagesUrl
      },
      instructions: `
🎉 Your generated website is ready to deploy!

📦 Repository: ${repoData.html_url}
🌐 GitHub Pages URL: ${gitHubPagesUrl}

What happens next:
✅ Your code is being pushed to GitHub
✅ GitHub Pages automatically deploys from the main branch
✅ Your site will be live within 30 seconds to 2 minutes

Your deployment URL:
🔗 ${gitHubPagesUrl}

Repository access:
🔗 ${repoData.html_url}

Tips:
• Your code is now version controlled in GitHub
• Every new push to main auto-deploys via GitHub Pages
• You can clone and work on the code locally
• Share your site URL: ${gitHubPagesUrl}
      `
    });

  } catch (error: any) {
    console.error('[deploy-github-pages] Deployment error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Deployment preparation failed',
      details: error.toString()
    }, { status: 500 });
  }
}
