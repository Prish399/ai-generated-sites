# 🎯 Quick Start: Deploy Your Generated Website

## What You Can Do Now ✨

After generating code in WebGenie:
1. ✅ Preview the site in the sandbox
2. ✅ Click **"Deploy"** button
3. ✅ Automatically push to GitHub
4. ✅ Automatically deploy to Vercel
5. ✅ Get a live URL instantly

---

## How to Use

### 1. **Generate Your Website**
```
User: "Create a portfolio website with React"
   ↓
WebGenie generates code in e2b sandbox
   ↓
Preview appears in the right panel
```

### 2. **Click Deploy Button**
- Look for the green **"Deploy"** button in the top right
- It appears after code generation is complete
- Button only shows when ready to deploy

### 3. **Watch the Magic ✨**
```
Click Deploy
   ↓
[Deploying...] spinner shows
   ↓
GitHub: Code pushed to your repo
   ↓
Vercel: Deployment triggered
   ↓
✅ Success: [Live ↗] button appears
```

### 4. **Share Your Website**
- Click the **[Live ↗]** button to visit your deployed site
- URL is automatically copied to clipboard
- Share with anyone!

---

## What Happens Behind the Scenes

```
┌─────────────────────────────────────────┐
│  Your Generated Code                    │
│  (in e2b sandbox)                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  GitHub Push   │
        │  (Your Repo)   │
        └────────┬───────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  Vercel Deploy       │
      │  (Auto from GitHub)  │
      └──────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  🌐 Live Website   │
        │  https://...       │
        └────────────────────┘
```

---

## Example Workflows

### Portfolio Website
```
Prompt: "Create a modern portfolio website with my projects"
  ↓
[Preview in sandbox]
  ↓
[Click Deploy]
  ↓
✅ Live at: https://generated-portfolio-xyz.vercel.app
  ↓
Share: "Check out my new portfolio!"
```

### Landing Page
```
Prompt: "Create a landing page for my SaaS startup"
  ↓
[Preview in sandbox]
  ↓
Edit code as needed
  ↓
[Click Deploy]
  ↓
✅ Live at: https://generated-landing-xyz.vercel.app
  ↓
Add custom domain
```

### Component Showcase
```
Prompt: "Create a library of React components"
  ↓
[Preview in sandbox]
  ↓
[Click Deploy]
  ↓
✅ Live at: https://generated-components-xyz.vercel.app
  ↓
Embed in documentation
```

---

## Repository Setup

### GitHub Repository
- **Name**: `ai-generated-sites`
- **URL**: `https://github.com/Prish399/ai-generated-sites`
- **Branch**: `main`
- **Access**: Public (you can change in GitHub settings)

### Your Code Is Saved
- Every deployment is committed to GitHub
- Version history is preserved
- You can see all changes

### Vercel Dashboard
- Visit: https://vercel.com/dashboard
- See all your deployments
- Monitor performance
- Configure custom domains

---

## Troubleshooting

### Problem: "Deploy button doesn't appear"
**Solution**: 
- Make sure code generation is complete
- Check that sandbox is ready
- Refresh the page

### Problem: "Deploy button is grayed out"
**Solution**:
- Code might still be generating
- Wait for "COMPLETE" status
- Try again in a few seconds

### Problem: "Deployment failed - GitHub error"
**Solution**:
- GitHub token might be missing or expired
- Check environment variables
- Try regenerating the token

### Problem: "Deployment succeeded but site shows error"
**Solution**:
- Vercel might still be building
- Wait 2-3 minutes
- Check Vercel dashboard for build logs
- Try refreshing the site

---

## Features

### ✅ What Works Now
- Generate code
- Preview in sandbox
- One-click deploy to GitHub
- One-click deploy to Vercel
- Instant live URLs
- Automatic clipboard copy
- Error handling & recovery

### 🔜 Coming Soon
- Multiple repositories
- Deployment history
- Custom domains
- Environment variables
- Team sharing
- Rollback to previous versions

---

## Environment Variables (For Admin)

Make sure these are set:

```bash
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxx          # Personal Access Token
GITHUB_USERNAME=Prish399                # Your GitHub username

# Optional (but recommended)
VERCEL_TOKEN=xxxxxxxxxxxxx              # Vercel API Token
```

**Where to get them**:
- **GitHub Token**: https://github.com/settings/tokens
  - Scopes needed: `repo` (full control of private repositories)
- **Vercel Token**: https://vercel.com/account/tokens
  - Recommended scope: `Full Account`

---

## Security Notes

⚠️ **Important**:
- Never share your tokens publicly
- Regenerate tokens after sharing in chat
- Use environment variables, not hardcoded values
- GitHub repo is public - code is visible

---

## Support

If you encounter issues:
1. Check the chat for error messages
2. Review the build logs in Vercel dashboard
3. Verify tokens are set correctly
4. Check browser console for debugging info

---

**Happy Coding! 🚀**

Your website is now one click away from going live!
