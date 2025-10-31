# Firecrawl Scraping Timeout Fix

## Problem
The `/api/scrape-url-enhanced` endpoint was timing out when scraping certain websites:
- Firecrawl API returns: `{"success":false,"code":"SCRAPE_TIMEOUT","error":"Scrape timed out"}`
- Request hangs for 30+ seconds, eventually returning 500 error

## Root Cause
1. **Long page load times** - Some websites take too long to load and render
2. **Firecrawl timeout** - The Firecrawl service has a 30-second timeout by default
3. **No fallback mechanism** - When Firecrawl fails, the entire request fails

## Solution Implemented

### 1. Reduced Firecrawl Timeouts
```typescript
waitFor: 2000,        // Reduced from 3000ms
timeout: 20000,       // Reduced from 30000ms
```
- Fail faster so we can fallback more quickly
- Most websites load in under 2 seconds

### 2. Added Timeout Handling
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 45000);
signal: controller.signal
```
- Sets a 45-second hard limit on the entire Firecrawl request
- Prevents requests from hanging indefinitely

### 3. Graceful Fallback Scraper
When Firecrawl times out, automatically fall back to native HTTP fetch:
- Direct HTML fetch with 15-second timeout
- Extracts title, description, and main content
- Cleans HTML tags and normalizes formatting
- Returns structured data in same format as Firecrawl

### 4. Better Error Handling
- Detects `SCRAPE_TIMEOUT` error codes and triggers fallback
- Catches abort errors from timeout
- Provides clear logging for debugging

## Benefits
✅ **Faster failure** - Times out faster (2-20s instead of 30s)
✅ **Better resilience** - Falls back to native fetch instead of failing
✅ **User experience** - Website generation doesn't get stuck
✅ **Logging** - Clear logs show when fallback is used

## Response Format
Both Firecrawl and fallback scraper return the same format:
```json
{
  "success": true,
  "url": "https://example.com",
  "content": "formatted content with title and text",
  "structured": {
    "title": "...",
    "description": "...",
    "content": "...",
    "url": "..."
  },
  "metadata": {
    "scraper": "firecrawl-enhanced" | "fallback-native",
    "timestamp": "2025-10-31T...",
    "contentLength": 1234,
    "warning": "Using fallback scraper (Firecrawl timeout)" // if applicable
  }
}
```

## Testing
To test the fix:
1. Try scraping a slow website (e.g., one that takes >3 seconds to load)
2. Check logs to see if fallback scraper is used
3. Verify that website generation continues successfully

## Environment Variables
- `FIRECRAWL_API_KEY` - Required for Firecrawl API (fallback doesn't need this)

## Files Modified
- `app/api/scrape-url-enhanced/route.ts`
  - Added `fallbackScraper()` function
  - Added timeout handling with AbortController
  - Improved error parsing for timeout detection
