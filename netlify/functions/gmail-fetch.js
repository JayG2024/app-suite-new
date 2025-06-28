const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const { verifyToken } = require('./utils/auth');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper to parse email headers
const getHeader = (headers, name) => {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
};

// Helper to parse email body
const getEmailBody = (payload) => {
  let body = '';
  
  if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  } else if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        break;
      } else if (part.mimeType === 'text/html' && part.body && part.body.data && !body) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    }
  }
  
  return body;
};

// Helper to get attachments
const getAttachments = (payload) => {
  const attachments = [];
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.filename && part.body && part.body.attachmentId) {
        attachments.push({
          id: part.body.attachmentId,
          name: part.filename,
          mimeType: part.mimeType,
          size: part.body.size
        });
      }
    }
  }
  
  return attachments;
};

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify auth token
    const authHeader = event.headers.authorization;
    const user = await verifyToken(authHeader);
    
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Get Gmail connection
    const { data: connection, error: connError } = await supabase
      .from('gmail_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (connError || !connection) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Gmail not connected' })
      };
    }

    // Setup OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: connection.access_token,
      refresh_token: connection.refresh_token,
      expiry_date: new Date(connection.token_expiry).getTime()
    });

    // Auto-refresh token if needed
    const newTokens = await oauth2Client.refreshAccessToken();
    if (newTokens.credentials) {
      await supabase
        .from('gmail_connections')
        .update({
          access_token: newTokens.credentials.access_token,
          token_expiry: new Date(newTokens.credentials.expiry_date).toISOString()
        })
        .eq('id', connection.id);
    }

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Get query parameters
    const { maxResults = 20, pageToken, q = 'in:inbox' } = event.queryStringParameters || {};

    // List messages
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      pageToken,
      q
    });

    if (!listResponse.data.messages) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: [], nextPageToken: null })
      };
    }

    // Fetch full message details
    const emails = await Promise.all(
      listResponse.data.messages.map(async (msg) => {
        try {
          const message = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id
          });

          const payload = message.data.payload;
          const headers = payload.headers || [];

          return {
            id: message.data.id,
            threadId: message.data.threadId,
            from: {
              email: getHeader(headers, 'from').match(/<(.+)>/)?.[1] || getHeader(headers, 'from'),
              name: getHeader(headers, 'from').match(/^([^<]+)/)?.[1]?.trim() || getHeader(headers, 'from')
            },
            to: getHeader(headers, 'to').split(',').map(addr => ({
              email: addr.match(/<(.+)>/)?.[1] || addr.trim(),
              name: addr.match(/^([^<]+)/)?.[1]?.trim() || addr.trim()
            })),
            subject: getHeader(headers, 'subject'),
            snippet: message.data.snippet,
            body: getEmailBody(payload),
            date: new Date(parseInt(message.data.internalDate)).toISOString(),
            read: !message.data.labelIds?.includes('UNREAD'),
            starred: message.data.labelIds?.includes('STARRED') || false,
            important: message.data.labelIds?.includes('IMPORTANT') || false,
            labels: message.data.labelIds || [],
            attachments: getAttachments(payload)
          };
        } catch (err) {
          console.error('Error fetching message:', err);
          return null;
        }
      })
    );

    // Filter out any failed messages
    const validEmails = emails.filter(email => email !== null);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails: validEmails,
        nextPageToken: listResponse.data.nextPageToken || null
      })
    };
  } catch (error) {
    console.error('Gmail fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch emails',
        details: error.message 
      })
    };
  }
};