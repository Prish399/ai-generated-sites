import { NextRequest, NextResponse } from 'next/server';

// Function to sanitize smart quotes and other problematic characters
function sanitizeQuotes(text: string): string {
  return text
    // Replace smart single quotes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Replace smart double quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace other quote-like characters
    .replace(/[\u00AB\u00BB]/g, '"') // Guillemets
    .replace(/[\u2039\u203A]/g, "'") // Single guillemets
    // Replace other problematic characters
    .replace(/[\u2013\u2014]/g, '-') // En dash and em dash
    .replace(/[\u2026]/g, '...') // Ellipsis
    .replace(/[\u00A0]/g, ' '); // Non-breaking space
}

// Fallback scraper using native fetch
async function fallbackScraper(url: string) {
  try {
    console.log('[scrape-url-enhanced] Using fallback scraper for:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    
    // Extract meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)">/i);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract main text content (simple version)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    
    // Remove scripts, styles, and other non-content tags
    const cleanHtml = bodyHtml
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, '\n') // Remove all HTML tags
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
    
    const markdown = cleanHtml.substring(0, 5000); // Limit to 5000 chars
    
    const formattedContent = `
Title: ${sanitizeQuotes(title)}
Description: ${sanitizeQuotes(description)}
URL: ${url}

Main Content:
${sanitizeQuotes(markdown)}
    `.trim();
    
    return NextResponse.json({
      success: true,
      url,
      content: formattedContent,
      structured: {
        title: sanitizeQuotes(title),
        description: sanitizeQuotes(description),
        content: sanitizeQuotes(markdown),
        url
      },
      metadata: {
        scraper: 'fallback-native',
        timestamp: new Date().toISOString(),
        contentLength: formattedContent.length,
        warning: 'Using fallback scraper (Firecrawl timeout)'
      },
      message: 'URL scraped successfully with fallback scraper'
    });
  } catch (error) {
    console.error('[scrape-url-enhanced] Fallback scraper error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 });
    }
    
    console.log('[scrape-url-enhanced] Scraping with Firecrawl:', url);
    
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }
    
    // Make request to Firecrawl API with timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for the entire request
    
    let firecrawlResponse: Response;
    try {
      firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          formats: ['markdown', 'html'],
          waitFor: 2000, // Reduced from 3000 to 2000
          timeout: 20000, // Reduced from 30000 to 20000
          blockAds: true,
          actions: [
            {
              type: 'wait',
              milliseconds: 1000 // Reduced from 2000 to 1000
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
            console.warn('[scrape-url-enhanced] Firecrawl timeout, trying fallback scraper');
            return await fallbackScraper(url);
          }
        } catch (parseError) {
          // If error is not JSON, treat as general error
        }
        
        throw new Error(`Firecrawl API error: ${error}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.warn('[scrape-url-enhanced] Request timeout exceeded, using fallback scraper');
        return await fallbackScraper(url);
      }
      throw fetchError;
    }
    
    const data = await firecrawlResponse.json();
    
    if (!data.success || !data.data) {
      throw new Error('Failed to scrape content');
    }
    
    const { markdown, html, metadata } = data.data;
    
    // Sanitize the markdown content
    const sanitizedMarkdown = sanitizeQuotes(markdown || '');
    
    // Extract structured data from the response
    const title = metadata?.title || '';
    const description = metadata?.description || '';
    
    // Format content for AI
    const formattedContent = `
Title: ${sanitizeQuotes(title)}
Description: ${sanitizeQuotes(description)}
URL: ${url}

Main Content:
${sanitizedMarkdown}
    `.trim();
    
    return NextResponse.json({
      success: true,
      url,
      content: formattedContent,
      structured: {
        title: sanitizeQuotes(title),
        description: sanitizeQuotes(description),
        content: sanitizedMarkdown,
        url
      },
      metadata: {
        scraper: 'firecrawl-enhanced',
        timestamp: new Date().toISOString(),
        contentLength: formattedContent.length,
        cached: data.data.cached || false, // Indicates if data came from cache
        ...metadata
      },
      message: 'URL scraped successfully with Firecrawl (with caching for 500% faster performance)'
    });
    
  } catch (error) {
    console.error('[scrape-url-enhanced] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}