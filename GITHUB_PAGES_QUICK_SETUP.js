#!/usr/bin/env node

/**
 * GitHub Pages Deployment - Quick Setup Instructions
 * 
 * This script provides step-by-step instructions to set up GitHub Pages deployment.
 * Copy and follow each step carefully.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '═'.repeat(60));
  log(colors.bright + colors.blue, `  ${title}`);
  console.log('═'.repeat(60) + '\n');
}

function step(num, title, description) {
  log(colors.bright + colors.green, `STEP ${num}: ${title}`);
  console.log(description);
}

// Main output
console.clear();

section('🚀 GitHub Pages Deployment - Quick Setup');

log(colors.yellow, 'Follow these 3 simple steps to enable one-click deployment:\n');

step(1, 'Create GitHub Token', `
1. Open: https://github.com/settings/tokens
2. Click "Generate new token" → "Tokens (classic)"
3. Set:
   - Note: "WebGenie Deployment Token"
   - Expiration: "90 days"
   - Scopes: ✓ repo (only this one!)
4. Click "Generate token"
5. COPY THE TOKEN (won't show again!)
   Format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
`);

step(2, 'Add Token to Environment', `
1. Open file: .env.local
2. Find the section with OPENAI_API_KEY
3. Add these lines at the end:

   # GitHub Deployment Configuration
   GITHUB_TOKEN=YOUR_TOKEN_HERE
   GITHUB_USERNAME=Prish399

4. Replace YOUR_TOKEN_HERE with your actual token
5. Save the file
6. Restart development server: npm run dev
`);

step(3, 'Enable GitHub Pages', `
1. Go to: https://github.com/Prish399/ai-generated-sites
2. Click Settings (top menu)
3. Scroll to "Pages" (left sidebar)
4. Select:
   - Branch: main
   - Folder: / (root)
5. Click "Save"
6. Wait for: "Your site is published at:
   https://prish399.github.io/ai-generated-sites/"
`);

section('✅ Testing Your Setup');

log(colors.blue, 'Once all 3 steps are done, test it:\n');

console.log(`
  1. Go to: http://localhost:3000
  2. Generate a website (e.g., "A pizza shop landing page")
  3. Click the green "Deploy" button in preview
  4. Wait for success message
  5. Click the "Live ↗" link or visit:
     https://prish399.github.io/ai-generated-sites/
`);

section('📊 Deployment URLs');

console.log(`
  Your Website (GitHub Pages):
  🌐 https://prish399.github.io/ai-generated-sites/

  Your Repository (GitHub):
  💾 https://github.com/Prish399/ai-generated-sites
`);

section('🆘 Need Help?');

log(colors.yellow, 'Common Issues:\n');

console.log(`
  ❌ "GITHUB_TOKEN not configured"
     → Check .env.local has GITHUB_TOKEN=
     → Restart dev server after adding token

  ❌ "Repository not found"
     → Verify token has 'repo' permission
     → Check token isn't expired

  ❌ Website not showing
     → Wait 1-2 minutes for GitHub Pages
     → Check Pages enabled in Settings
     → Hard refresh browser (Ctrl+Shift+R)
`);

section('📖 Full Documentation');

log(colors.blue, 'For detailed information, read:\n');
console.log('📄 docs/GITHUB_PAGES_DEPLOYMENT_SETUP.md\n');

log(colors.bright + colors.green, '🎉 Ready to deploy? Start generating websites!\n');
