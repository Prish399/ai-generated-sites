# 🚀 GitHub & Vercel Deployment Feature

## Overview
After generating code in the sandbox, users can now click a **"Deploy"** button to automatically:
1. Push generated code to GitHub
2. Deploy to Vercel for live hosting
3. Get a live URL instantly

## UI Implementation

### Deploy Button
- **Location**: Top right of the preview panel, next to "Open" button
- **Visibility**: Only shows when:
  - Sandbox is ready
  - Code has been generated
  - Generation is complete (not currently generating)
- **States**:
  - **Ready**: Green button with GitHub icon - "Deploy"
  - **Deploying**: Loading spinner - "Deploying..."
  - **Success**: Green badge showing live link with checkmark
  - **Error**: Red badge showing error status

### Button States

```
[Before Generation]
- Button hidden
- "Open" button visible to view sandbox

[During Generation]
- Button hidden
- Status shows "Live code generation"

[After Generation - Ready to Deploy]
- Green "Deploy" button visible
- "Open" button visible

[While Deploying]
- Button disabled with spinner
- Status shows "Deploying..."

[Deployment Success]
- Green "Live ↗" link badge
- Can click to view deployed site
- "Deploy" button hidden

[Deployment Error]
- Red error badge
- Error message shown in chat
- Can retry by clicking Deploy again
```

## Backend Implementation

### New API Endpoint: `/api/deploy-generated-site`

**Method**: POST

**Request Body**:
```json
{
  "sandboxId": "string",    // e2b sandbox ID
  "sandboxUrl": "string"    // e2b sandbox URL
}
```

**Response (Success)**:
```json
{
  "success": true,
  "deploymentUrl": "https://...",
  "repoUrl": "https://github.com/...",
  "message": "Deployment initiated successfully",
  "sandboxId": "...",
  "instructions": "..."
}
```

**Environment Variables Required**:
- `GITHUB_TOKEN` - Personal access token with repo scope
- `VERCEL_TOKEN` - Optional, for Vercel API access
- `GITHUB_USERNAME` - Optional, defaults to "Prish399"

## How It Works

### Step 1: User Generates Code
```
1. User writes prompt (e.g., "Create a portfolio website")
2. WebGenie creates e2b sandbox
3. AI generates code in sandbox
4. User clicks "Deploy" button
```

### Step 2: Deploy Handler Executes
```
1. Checks GitHub token is set
2. Verifies with GitHub API
3. Gets GitHub username
4. Prepares deployment
```

### Step 3: GitHub Integration
- Pushes generated code to `ai-generated-sites` repository
- Uses token-based authentication
- Creates commit with timestamp

### Step 4: Vercel Deployment
- If `VERCEL_TOKEN` is set:
  - Uses Vercel API to create deployment
  - Links to GitHub repo
  - Deploys to production
  - Returns live URL (e.g., `https://generated-site-xxx.vercel.app`)

- If `VERCEL_TOKEN` not set:
  - Still succeeds with warning
  - Code is on GitHub
  - User can manually connect to Vercel

### Step 5: Show Results
- Live URL appears in green badge
- Chat message shows deployment success
- User can click to visit live site
- URL is copied to clipboard automatically

## Code Files

### New Files
- `app/api/deploy-generated-site/route.ts` - Deployment endpoint

### Modified Files
- `app/page.tsx`:
  - Added `deploymentState` state management
  - Added `deployGeneratedSite()` handler function
  - Added Deploy button to preview panel
  - Added deployment status badges

## User Experience Flow

```
┌─────────────────────────┐
│   Write Prompt          │
│   (e.g., "Portfolio")   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Code Generated         │
│  [Deploy] button shows  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Click [Deploy]         │
│  ⏳ Deploying...        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  ✅ Deployment Success  │
│  [Live ↗] Link          │
│  Copy URL to clipboard  │
│  Chat: "🚀 Successfully │
│  deployed! Your site    │
│  is live at: https://..." 
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  View Live Website      │
│  Share URL              │
│  Version control setup  │
└─────────────────────────┘
```

## Error Handling

### Possible Errors and Recovery

1. **Missing GITHUB_TOKEN**
   - Error: "GITHUB_TOKEN not configured"
   - Solution: Set environment variable

2. **GitHub Authentication Failed**
   - Error: "GitHub authentication failed"
   - Solution: Verify token is valid and has repo scope

3. **Missing VERCEL_TOKEN**
   - Warning (not error): Deployment still succeeds
   - Code is on GitHub
   - Manual Vercel connection needed

4. **Vercel API Error**
   - Still returns success
   - Code pushed to GitHub
   - User can check Vercel dashboard

## Testing

### Test Cases

1. **Generate and Deploy**
   ```
   1. Write prompt: "Create a simple React counter app"
   2. Wait for code generation
   3. Click "Deploy" button
   4. Verify "Deploying..." spinner shows
   5. Wait for success
   6. Verify green "Live ↗" badge appears
   7. Click to verify site is live
   ```

2. **Multiple Deployments**
   ```
   1. Deploy first site
   2. Generate new code
   3. Deploy second site
   4. Verify both are live at different URLs
   ```

3. **Error Cases**
   ```
   1. Remove GITHUB_TOKEN
   2. Click Deploy
   3. Verify error message in chat
   4. Add token back
   5. Click Deploy again
   6. Verify success
   ```

## Security Considerations

- ✅ Tokens passed via environment variables (not hardcoded)
- ✅ GitHub token not exposed in client-side code
- ✅ API endpoint on backend for token usage
- ✅ No tokens logged to console in production
- ⚠️ Users should regenerate tokens after sharing in chat

## Future Enhancements

1. **Multiple Repository Support**
   - Create separate repos per deployment
   - Custom repo names

2. **Deployment History**
   - Show previous deployments
   - Allow rollback

3. **Custom Domain Support**
   - Configure custom domains
   - Set up SSL/TLS

4. **Advanced Deployment Options**
   - Preview deployments (staging)
   - Environment variables
   - Build logs in UI

5. **Team Collaboration**
   - Share deployments
   - Collaborative editing
   - Comments/reviews

## References

- Vercel API: https://vercel.com/docs/rest-api
- GitHub API: https://docs.github.com/en/rest
- e2b Documentation: https://e2b.dev/docs
