// Netlify function for password reset
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY);

// Authorized users and their reset passwords
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

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Check if email is authorized
    const authorizedUser = AUTHORIZED_USERS[email.toLowerCase()];
    
    if (!authorizedUser) {
      // Return success even for unauthorized emails to prevent email enumeration
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: true })
      };
    }

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
      from: 'App Suite <noreply@app-suite.io>',
      to: email,
      subject: 'Password Reset - App Suite Admin',
      html: emailContent,
    });

    // Log for development
    console.log(`Password reset for ${email}: ${authorizedUser.tempPassword}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Password reset email sent successfully'
      })
    };

  } catch (error) {
    console.error('Password reset error:', error);
    // Return success to prevent timing attacks
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true })
    };
  }
};