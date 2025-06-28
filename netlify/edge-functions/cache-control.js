export default async (request, context) => {
  const url = new URL(request.url);
  
  // Force no-cache for admin routes
  if (url.pathname.startsWith('/admin')) {
    const response = await context.next();
    const headers = new Headers(response.headers);
    
    // Aggressive cache prevention
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Surrogate-Control', 'no-store');
    headers.set('Clear-Site-Data', '"cache"');
    
    // Add timestamp to force refresh
    headers.set('X-Timestamp', new Date().toISOString());
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  
  return context.next();
};

export const config = {
  path: "/*"
};