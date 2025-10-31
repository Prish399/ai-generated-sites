import { NextRequest, NextResponse } from 'next/server';

// Fallback screenshot using Puppeteer via a simple placeholder
async function fallbackScreenshot(url: string): Promise<string> {
  try {
    console.log('[scrape-screenshot] Using fallback: generating placeholder screenshot');
    
    // Create a simple base64 placeholder image (1px transparent PNG)
    // In production, you might use Puppeteer or similar to generate a real screenshot
    const placeholderPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    return `data:image/png;base64,${placeholderPng}`;
  } catch (error) {
    console.error('[scrape-screenshot] Fallback error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('[scrape-screenshot] Attempting to capture screenshot:', url);

    // Use Firecrawl API to capture screenshot with timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second hard limit

    let firecrawlResponse: Response;
    try {
      firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          formats: ['screenshot'], // Regular viewport screenshot
          waitFor: 2000, // Reduced from 3000
          timeout: 20000, // Reduced from 30000
          blockAds: true,
          actions: [
            {
              type: 'wait',
              milliseconds: 1000 // Reduced from 2000
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!firecrawlResponse.ok) {
        const error = await firecrawlResponse.text();
        try {
          const errorData = JSON.parse(error);
          
          // Handle timeout errors gracefully
          if (errorData?.error?.code === 'SCRAPE_TIMEOUT' || errorData?.code === 'SCRAPE_TIMEOUT') {
            console.warn('[scrape-screenshot] Firecrawl timeout, using fallback screenshot');
            const screenshotBase64 = await fallbackScreenshot(url);
            return NextResponse.json({
              success: true,
              screenshot: screenshotBase64,
              metadata: {
                source: 'fallback-placeholder',
                timestamp: new Date().toISOString(),
                warning: 'Using placeholder screenshot due to Firecrawl timeout'
              }
            });
          }
        } catch (parseError) {
          // If error is not JSON, treat as general error
        }

        throw new Error(`Firecrawl API error: ${error}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.warn('[scrape-screenshot] Request timeout exceeded, using fallback screenshot');
        const screenshotBase64 = await fallbackScreenshot(url);
        return NextResponse.json({
          success: true,
          screenshot: screenshotBase64,
          metadata: {
            source: 'fallback-placeholder',
            timestamp: new Date().toISOString(),
            warning: 'Using placeholder screenshot due to timeout'
          }
        });
      }
      throw fetchError;
    }

    const data = await firecrawlResponse.json();
    
    if (!data.success || !data.data?.screenshot) {
      throw new Error('Failed to capture screenshot');
    }
    
    return NextResponse.json({
      success: true,
      screenshot: data.data.screenshot,
      metadata: {
        source: 'firecrawl',
        timestamp: new Date().toISOString(),
        ...data.data.metadata
      }
    });

  } catch (error: any) {
    console.error('Screenshot capture error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to capture screenshot',
      success: false
    }, { status: 500 });
  }
}
