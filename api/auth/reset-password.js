// API endpoint for password reset
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Resend
const resend = new Resend(process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Authorized emails and their reset passwords
const AUTHORIZED_USERS = {
  'jason@jaydus.ai': {
    name: 'Jason',
    tempPassword: 'TempPass2025!'
  },
  'almir@jaydus.ai': {
    name: 'Almir',
    tempPassword: 'TempPass2025!'
  }
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if email is authorized
  const authorizedUser = AUTHORIZED_USERS[email.toLowerCase()];
  
  if (!authorizedUser) {
    // Return success even for unauthorized emails to prevent email enumeration
    return res.status(200).json({ success: true });
  }

  try {
    // Send reset email
    const emailContent = `
      <h2>Password Reset Request</h2>
      <p>Hi ${authorizedUser.name},</p>
      <p>You requested a password reset for your App Suite admin account.</p>
      <p>Your temporary password is: <strong>${authorizedUser.tempPassword}</strong></p>
      <p>Please log in with this temporary password and change it immediately.</p>
      <br>
      <p>If you didn't request this reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>App Suite Team</p>
    `;

    await resend.emails.send({
      from: 'App Suite <admin@app-suite.io>',
      to: email,
      subject: 'Password Reset - App Suite Admin',
      html: emailContent,
    });

    // Log the temporary password for development
    console.log(`Password reset for ${email}: ${authorizedUser.tempPassword}`);

    return res.status(200).json({ 
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    // Return success to prevent timing attacks
    return res.status(200).json({ success: true });
  }
}