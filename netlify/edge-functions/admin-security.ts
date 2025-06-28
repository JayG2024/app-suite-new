import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Check if this is an admin route
  if (url.pathname.startsWith('/admin')) {
    const response = await context.next();
    
    // Add security headers for admin routes
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'same-origin');
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    
    return response;
  }
  
  // For non-admin routes, continue normally
  return context.next();
};

export const config = {
  path: "/*"
};