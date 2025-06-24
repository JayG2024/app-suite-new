// Application configuration
export const APP_CONFIG = {
  // Use environment variable with fallback for local development
  url: import.meta.env.VITE_SITE_URL || 'http://localhost:8080',
  
  // Extract domain for email addresses
  get domain() {
    try {
      const url = new URL(this.url);
      return url.hostname.replace('www.', '');
    } catch {
      // Fallback to localhost domain
      return 'localhost';
    }
  },
  
  // Email configuration
  get emailFrom() {
    return `noreply@${this.domain}`;
  },
  
  get supportEmail() {
    return `support@${this.domain}`;
  },
  
  // Company info
  company: 'App Suite'
};