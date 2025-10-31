# 🚀 GitHub Pages Deployment Setup Guide

Your WebGenie AI website generator now uses **GitHub Pages** for automatic deployment! This guide walks you through everything you need.

## What is GitHub Pages?

GitHub Pages automatically deploys your website whenever you push code to your GitHub repository:
- ✅ **Automatic**: Deploys on every push to main branch
- ✅ **Free**: No additional costs beyond GitHub
- ✅ **Fast**: Live within seconds to 1-2 minutes
- ✅ **Simple**: No complex configuration needed

## 🔑 Step 1: Create a GitHub Personal Access Token

Your GitHub token allows WebGenie to push generated code to your repository.

### Create the Token:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** (top right)
3. Select **"Tokens (classic)"**
4. Fill in the form:
   - **Note**: `WebGenie Deployment Token`
   - **Expiration**: `90 days` (or your preference)
   - **Scopes**: Check only `repo` (Full control of private repositories)

5. Click **"Generate token"** button at the bottom
6. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### Token Format:
The token looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📝 Step 2: Add GitHub Token to Environment

Open `.env.local` in the project root and add your token:

```bash
# GitHub Deployment Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=Prish399
```

Replace:
- `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual token
- `Prish399` with your GitHub username (if different)

**File Location**: `c:\Users\91977\Desktop\ai\web_genie_fin\.env.local`

---

## ✅ Step 3: Enable GitHub Pages in Repository Settings

Your repository `ai-generated-sites` needs GitHub Pages enabled.

### Enable GitHub Pages:

1. Go to: **https://github.com/Prish399/ai-generated-sites**
2. Click **Settings** (top menu)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **"Save"**

### Verify It's Enabled:

You should see:
```
Your site is published at: https://prish399.github.io/ai-generated-sites/
```

---

## 🎯 Step 4: Test the Deployment

Now you're ready to generate and deploy websites!

### How It Works:

```
1. Click "Generate" → AI creates website
2. Preview in iframe
3. Click "Deploy" button → Code pushed to GitHub
4. GitHub Pages auto-deploys
5. Visit: https://prish399.github.io/ai-generated-sites/
```

### Testing Steps:

1. **Generate a Website**
   - Enter a prompt (e.g., "A landing page for a coffee shop")
   - Wait for generation to complete
   - See preview in the sandbox

2. **Click "Deploy" Button**
   - Look for the green **Deploy** button in the preview panel header
   - Click it
   - Wait for confirmation message

3. **Check Your Repository**
   - Visit: https://github.com/Prish399/ai-generated-sites
   - You should see new files/commits
   - Verify latest commit was just pushed

4. **Visit Your Live Site**
   - Go to: https://prish399.github.io/ai-generated-sites/
   - You should see your generated website live!

---

## 🔍 Deployment Process Explained

When you click the **Deploy** button:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Verify GitHub Token                                  │
│    └─ Authenticates with GitHub API                     │
│                                                          │
│ 2. Verify Repository Access                            │
│    └─ Checks that ai-generated-sites repo exists       │
│                                                          │
│ 3. Prepare for Deployment                              │
│    └─ Generates GitHub Pages URL                        │
│    └─ GitHub Pages auto-deploys from main branch        │
│                                                          │
│ 4. Success Response                                     │
│    └─ Returns deployment URL                            │
│    └─ Returns repository URL                            │
│    └─ Shows "Live ↗" badge in UI                        │
│                                                          │
│ 5. GitHub Pages Deployment (automatic)                 │
│    └─ Detects push to main branch                       │
│    └─ Builds and publishes site                         │
│    └─ Live within 30 seconds to 2 minutes               │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Deployment URLs

After deployment, you'll get two URLs:

### 1. **GitHub Pages Live URL** (Your Website)
```
https://prish399.github.io/ai-generated-sites/
```
- This is where your website is live
- Anyone can visit this URL
- Updates automatically when you push to main

### 2. **GitHub Repository URL** (Your Code)
```
https://github.com/Prish399/ai-generated-sites
```
- This is where your code is stored
- You can clone and modify locally
- Shared with team members if needed

---

## 🐛 Troubleshooting

### Issue: "GITHUB_TOKEN not configured"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify `GITHUB_TOKEN=` line has your token
3. Restart the development server: `npm run dev`
4. Try deploying again

### Issue: "Repository not found"

**Possible Causes:**
- Token doesn't have `repo` permission
- Repository doesn't exist or is deleted
- Token is expired

**Solution:**
1. Regenerate token with `repo` permission
2. Verify repository exists: https://github.com/Prish399/ai-generated-sites
3. Update `.env.local` with new token

### Issue: Website not showing at GitHub Pages URL

**Possible Causes:**
- GitHub Pages not enabled in repository settings
- Branch isn't set to `main`
- Site hasn't finished building yet

**Solution:**
1. Check GitHub Pages is enabled:
   - Go to repo → Settings → Pages
   - Verify "Branch: main" is selected
2. Wait 1-2 minutes for GitHub Pages to build
3. Check deployment status:
   - Go to repo → Settings → Pages
   - Look for "Your site is published at..."

### Issue: Old version showing instead of new code

**Possible Causes:**
- Browser cache
- GitHub Pages still building
- Files weren't pushed correctly

**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R`
2. Wait 2 minutes and try again
3. Check recent commits in GitHub repository

---

## 🔐 Security Best Practices

### 1. **Never Share Your Token**
- Don't commit `.env.local` to git
- Don't post token in chat or forums
- `.env.local` is in `.gitignore` by default

### 2. **Regenerate Token Regularly**
- Create new tokens every 90 days
- Delete old tokens immediately
- Check GitHub Settings → Developer Settings → Tokens

### 3. **Use Limited Permissions**
- Only grant `repo` permission
- Don't grant admin:org_hook or other unnecessary permissions

### 4. **Monitor Token Usage**
- Check who has deployed sites
- Review recent commits in repository
- Look for unauthorized changes

---

## 📈 Advanced Features

### Multiple Deployment Strategies

Once GitHub Pages is working, you can explore:

1. **Custom Domain** (Advanced)
   - Point custom domain to GitHub Pages
   - CNAME configuration

2. **Deployment History**
   - Check all commits: https://github.com/Prish399/ai-generated-sites/commits
   - Rollback to previous version if needed

3. **GitHub Actions** (Future)
   - Automate tests before deployment
   - Run build optimization
   - Send deployment notifications

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Live Website URL** | https://prish399.github.io/ai-generated-sites/ |
| **Repository URL** | https://github.com/Prish399/ai-generated-sites |
| **GitHub Token Settings** | https://github.com/settings/tokens |
| **GitHub Pages Settings** | https://github.com/Prish399/ai-generated-sites/settings/pages |
| **Environment File** | `.env.local` |
| **Deploy Button Location** | Preview panel header (green "Deploy" button) |
| **Deployment Time** | 30 seconds to 2 minutes |
| **Cost** | Free |

---

## ✨ Success Checklist

- [ ] GitHub token created with `repo` permission
- [ ] Token added to `.env.local`
- [ ] Repository `ai-generated-sites` exists
- [ ] GitHub Pages enabled in repository settings
- [ ] Branch set to `main` in GitHub Pages settings
- [ ] Can see "Your site is published at..." message
- [ ] Development server restarted
- [ ] Generated test website
- [ ] Clicked Deploy button
- [ ] Saw success message with URLs
- [ ] Visited GitHub Pages URL and saw live website
- [ ] Checked repository has new commits

---

## 🎉 You're All Set!

Your deployment system is ready! Every time you:

1. Generate a website with AI
2. Click "Deploy"
3. Your code goes live at: **https://prish399.github.io/ai-generated-sites/**

Questions? Check the troubleshooting section or review the deployment endpoint code in `app/api/deploy-generated-site/route.ts`.

Happy deploying! 🚀
