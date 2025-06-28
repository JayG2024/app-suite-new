const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { code, state, error } = event.queryStringParameters || {};

  // Handle errors from Google
  if (error) {
    return {
      statusCode: 302,
      headers: {
        Location: '/dashboard?gmail_error=' + encodeURIComponent(error)
      }
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No authorization code provided' })
    };
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Get user from auth token (passed in state parameter)
    let userId;
    if (state) {
      try {
        const decoded = jwt.verify(state, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        console.error('Invalid state token:', err);
      }
    }

    // Store or update Gmail connection
    const { data, error: dbError } = await supabase
      .from('gmail_connections')
      .upsert({
        user_id: userId || 1, // Default to user 1 for now
        email: userInfo.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date).toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save Gmail connection');
    }

    // Redirect back to dashboard with success
    return {
      statusCode: 302,
      headers: {
        Location: '/dashboard?gmail_connected=true&section=gmail'
      }
    };
  } catch (error) {
    console.error('Gmail callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/dashboard?gmail_error=' + encodeURIComponent(error.message)
      }
    };
  }
};