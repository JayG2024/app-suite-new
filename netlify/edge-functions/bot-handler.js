export default async (request, context) => {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // List of known bot user agents
  const botPatterns = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'slack',
    'discord',
    'telegram',
    'applebot',
    'semrushbot',
    'ahrefsbot',
    'bytespider',
    'claude-web',
    'chatgpt',
    'gptbot',
    'anthropic',
    'openai',
    'perplexitybot',
    'you.com',
    'neeva',
    'cohere-ai'
  ];
  
  // Check if the request is from a bot
  const isBot = botPatterns.some(bot => userAgent.toLowerCase().includes(bot));
  
  // Only handle HTML requests
  if (!url.pathname.includes('.') || url.pathname.endsWith('.html')) {
    if (isBot) {
      // Log bot visit
      console.log(`Bot detected: ${userAgent} visiting ${url.pathname}`);
      
      // For blog pages, inject structured content
      if (url.pathname.startsWith('/blog/')) {
        const response = await context.next();
        const html = await response.text();
        
        // Check if it's the geo-blocking article
        if (url.pathname.includes('hidden-cost-geo-blocking')) {
          // Inject the content directly into the HTML for bots
          const enhancedHtml = html.replace(
            '<div id="root"></div>',
            `<div id="root">
              <article>
                <h1>The Hidden Cost of Geo-Blocking: How Geographic Restrictions May Be Hurting Your AI Search Visibility</h1>
                <p>Research reveals 95% of AI crawlers are blocked by geographic restrictions. This comprehensive white paper explores how geo-blocking impacts your visibility in AI-powered search engines.</p>
                <h2>Key Findings</h2>
                <ul>
                  <li>95% of AI crawlers blocked by geo-restrictions</li>
                  <li>15% of searches now show AI overviews</li>
                  <li>300% growth in AI-powered search engines</li>
                  <li>99%+ accuracy with modern spam prevention</li>
                </ul>
                <p>Read the full analysis to learn how to maintain security while ensuring AI search visibility.</p>
              </article>
            </div>`
          );
          
          return new Response(enhancedHtml, {
            headers: response.headers
          });
        }
      }
    }
  }
  
  // Pass through for non-bot requests or non-HTML resources
  return context.next();
};

export const config = {
  path: "/*"
};