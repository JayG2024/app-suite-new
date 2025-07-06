import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Authorized emails for password reset
const AUTHORIZED_EMAILS = ['jason@jaydus.ai', 'almir@jaydus.ai', 'jorge@jaydus.ai'];

// Allowed domains for password reset redirect
const ALLOWED_DOMAINS = [
  'https://app-suite.ai',
  'https://www.app-suite.ai',
  'https://jaydus.ai',
  'https://www.jaydus.ai',
  'http://localhost:5173', // For local development
  'http://localhost:3000'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'Unauthorized email address' });
    }

    // Get the origin from the request headers
    const origin = req.headers.origin || req.headers.referer || '';
    
    // Determine the redirect URL based on the origin
    let redirectTo = 'https://app-suite.ai/admin';
    
    for (const domain of ALLOWED_DOMAINS) {
      if (origin.startsWith(domain)) {
        redirectTo = `${domain}/admin`;
        break;
      }
    }

    // Send password reset email
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({ error: 'Failed to send password reset email' });
    }

    return res.status(200).json({ 
      message: 'Password reset email sent successfully',
      redirectTo 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}