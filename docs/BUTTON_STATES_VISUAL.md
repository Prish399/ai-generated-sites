// Button Component Preview
// This shows what the Deploy button looks like in different states

/* ============================================
   1. DEFAULT STATE (Before Generation)
   ============================================ */
// Button: Hidden
// Location: Not visible
// Reason: No code generated yet

/* ============================================
   2. READY STATE (After Generation)
   ============================================ */
// Button: Visible
// Style: Green background
// Icon: GitHub logo
// Text: "Deploy"
// Location: Top right of preview panel
// 
// Visual:
// ┌─────────────────────────────────────────┐
// │ [Code] [Preview]   [Gen] [Deploy] [Open] │
// │                          ▲              │
// │                     New button here     │
// └─────────────────────────────────────────┘
//
// HTML:
// <button
//   onClick={deployGeneratedSite}
//   disabled={deploymentState.isDeploying}
//   className="inline-flex items-center gap-2 px-3 py-1 h-8 
//              text-sm rounded-[10px] font-medium 
//              bg-green-600 text-white hover:bg-green-700
//              disabled:bg-gray-500"
// >
//   <FiGithub className="w-4 h-4" />
//   Deploy
// </button>

/* ============================================
   3. LOADING STATE (While Deploying)
   ============================================ */
// Button: Disabled with spinner
// Style: Still green but disabled opacity
// Icon: Spinning circle
// Text: "Deploying..."
// 
// Visual:
// ┌────────────────────────────────────────┐
// │ ⏳ Deploying...                         │
// │ (Button shows loading spinner)         │
// └────────────────────────────────────────┘
//
// HTML:
// <button disabled>
//   <div className="w-3 h-3 border-2 border-white
//        border-t-transparent rounded-full animate-spin" />
//   Deploying...
// </button>

/* ============================================
   4. SUCCESS STATE (After Deployment)
   ============================================ */
// Badge: Green success indicator
// Style: Small green badge
// Icon: Checkmark
// Text: "Live ↗"
// Link: Clickable to visit deployed site
// 
// Visual:
// ┌────────────────────────────────────────┐
// │ ✅ [Live ↗]                            │
// │ (Click to visit deployed website)      │
// └────────────────────────────────────────┘
//
// HTML:
// <div className="flex items-center gap-2 px-3 py-1 h-8
//      text-sm rounded-[10px] bg-green-100 text-green-800
//      border border-green-300">
//   <svg className="w-4 h-4">...</svg>
//   <a href={deploymentState.deploymentUrl}>Live ↗</a>
// </div>

/* ============================================
   5. ERROR STATE (If Deployment Fails)
   ============================================ */
// Badge: Red error indicator
// Style: Small red badge
// Icon: X symbol
// Text: "Error"
// 
// Visual:
// ┌────────────────────────────────────────┐
// │ ❌ Error                               │
// │ (Error message shown in chat)          │
// └────────────────────────────────────────┘
//
// HTML:
// <div className="flex items-center gap-2 px-3 py-1 h-8
//      text-sm rounded-[10px] bg-red-100 text-red-800
//      border border-red-300">
//   <svg className="w-4 h-4">...</svg>
//   Error
// </div>

/* ============================================
   6. FULL BUTTON SET IN HEADER BAR
   ============================================ */
// Complete layout showing all buttons:
//
// ┌─ Preview Panel Header ────────────────────────────────────────┐
// │                                                                │
// │  Tab Selector    │    Status          │ Action Buttons       │
// │  ┌──────────────┐│ [15 files Complete]│  ┌──────────┐        │
// │  │ [C] [P]      ││ ✅ COMPLETE        │  │ [Deploy] │ [Open] │
// │  └──────────────┘│                    │  └──────────┘        │
// │                                                                │
// │  [C] = Code tab  [P] = Preview tab                           │
// │                                                                │
// └─────────────────────────────────────────────────────────────── ┘

/* ============================================
   7. DEPLOYMENT FLOW WITH CHAT
   ============================================ */
// 
// ┌─ CHAT AREA ──────────────────────────────────────────┐
// │                                                      │
// │  👤 "Create a React portfolio"                      │
// │                                                      │
// │  🤖 "Generating React portfolio component..."       │
// │     [loading animation]                            │
// │                                                      │
// │  🤖 "Code generated! 15 files created"             │
// │     📦 Files: portfolio.tsx, styles.css, ...        │
// │                                                      │
// └──────────────────────────────────────────────────────┘
//
// ┌─ PREVIEW PANEL ──────────────────────────────────────┐
// │                                                      │
// │  Header Bar:                                         │
// │  [Code] [Preview] [15 files] [Deploy] [Open ↗]    │
// │                              ↑                      │
// │                      Green Deploy button            │
// │                                                      │
// │  Content:                                            │
// │  ┌────────────────────────────────────────────┐    │
// │  │  LIVE PREVIEW (iframe)                     │    │
// │  │  ┌────────────────────────────────────┐    │    │
// │  │  │ Portfolio Website (HTML/React)     │    │    │
// │  │  │                                     │    │    │
// │  │  │ [Home] [About] [Projects]          │    │    │
// │  │  │                                     │    │    │
// │  │  │ John Doe                           │    │    │
// │  │  │ Full Stack Developer                │    │    │
// │  │  │                                     │    │    │
// │  │  │ [See My Work ↓]                    │    │    │
// │  │  │                                     │    │    │
// │  │  └────────────────────────────────────┘    │    │
// │  └────────────────────────────────────────────┘    │
// │                                                      │
// └──────────────────────────────────────────────────────┘

/* ============================================
   8. AFTER CLICK: DEPLOYMENT STATUS
   ============================================ */
//
// ┌─ PREVIEW PANEL ──────────────────────────────────────┐
// │                                                      │
// │  Header Bar (During Deployment):                     │
// │  [Code] [Preview] [15 files] [⏳ Deploying...] [Open ↗] │
// │                              ↑                      │
// │                      Loading spinner               │
// │                                                      │
// └──────────────────────────────────────────────────────┘
//
// ┌─ PREVIEW PANEL ──────────────────────────────────────┐
// │                                                      │
// │  Header Bar (After Success):                         │
// │  [Code] [Preview] [15 files] [✅ Live ↗] [Open ↗]   │
// │                              ↑                      │
// │                      Green success badge           │
// │                      (clickable link)              │
// │                                                      │
// └──────────────────────────────────────────────────────┘
//
// ┌─ CHAT AREA ──────────────────────────────────────────┐
// │                                                      │
// │  🤖 "🚀 Successfully deployed!"                      │
// │     "Your site is live at:"                         │
// │     "https://generated-portfolio-xyz.vercel.app"   │
// │     ""                                              │
// │     "Repository:"                                   │
// │     "https://github.com/Prish399/ai-generated-sites" │
// │                                                      │
// └──────────────────────────────────────────────────────┘

/* ============================================
   9. RESPONSIVE BEHAVIOR
   ============================================ */
//
// Desktop:
// ┌────────────────────────────────────────────┐
// │ [Code] [Preview] [Status] [Deploy] [Open]  │
// └────────────────────────────────────────────┘
//
// Tablet:
// ┌──────────────────────────────────┐
// │ [Code] [Preview]                 │
// │ [Status] [Deploy] [Open]         │
// └──────────────────────────────────┘
//
// Mobile:
// ┌──────────────────┐
// │ [Code] [Preview] │
// │ [Deploy] [Open]  │
// └──────────────────┘

/* ============================================
   10. ANIMATIONS & INTERACTIONS
   ============================================ */
//
// Hover (Ready state):
// - Button brightens (darker green)
// - Button scales slightly up (1.02x)
// - Smooth shadow increase
//
// Click:
// - Button scales down (0.97x)
// - Immediate feedback
//
// Loading:
// - Spinner rotates continuously
// - Button disabled (no clicks)
// - Cursor shows "not-allowed"
//
// Success:
// - Green checkmark appears
// - Badge fades in smoothly
// - Link is clickable
// - Hover shows underline
//
// Error:
// - Red X appears
// - Badge fades in
// - Complementary error message in chat
// - Can retry by clicking Deploy again

/* ============================================
   COMPLETE JSX COMPONENT
   ============================================ */
//
// {/* Deploy to GitHub & Vercel Button */}
// {sandboxData && !generationProgress.isGenerating && generationProgress.files.length > 0 && (
//   <button
//     onClick={deployGeneratedSite}
//     disabled={deploymentState.isDeploying}
//     className="inline-flex items-center justify-center gap-2 px-3 py-1 h-8 
//                text-sm whitespace-nowrap rounded-[10px] font-medium 
//                bg-green-600 text-white hover:bg-green-700 
//                disabled:bg-gray-500 disabled:cursor-not-allowed 
//                transition-all duration-200 
//                [box-shadow:inset_0px_-2px_0px_0px_rgba(0,0,0,0.2),_0px_1px_6px_0px_rgba(34,197,94,0.3)]
//                hover:translate-y-[1px] hover:scale-[0.98]
//                hover:[box-shadow:inset_0px_-1px_0px_0px_rgba(0,0,0,0.2),_0px_1px_3px_0px_rgba(34,197,94,0.2)]
//                active:translate-y-[2px] active:scale-[0.97]"
//     title={deploymentState.isDeploying ? 'Deploying...' : 'Push to GitHub and deploy to Vercel'}
//   >
//     {deploymentState.isDeploying ? (
//       <>
//         <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
//         Deploying...
//       </>
//     ) : (
//       <>
//         <FiGithub className="w-4 h-4" />
//         Deploy
//       </>
//     )}
//   </button>
// )}
//
// {/* Show deployment success status */}
// {deploymentState.deploymentUrl && !deploymentState.isDeploying && (
//   <div className="flex items-center gap-2 px-3 py-1 h-8 text-sm rounded-[10px] 
//                   bg-green-100 text-green-800 border border-green-300">
//     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     <a href={deploymentState.deploymentUrl} target="_blank" rel="noopener noreferrer"
//        className="hover:underline font-medium">
//       Live ↗
//     </a>
//   </div>
// )}
