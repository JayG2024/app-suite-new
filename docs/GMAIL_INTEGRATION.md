# Gmail Integration Setup Guide

## Overview
This guide walks through setting up Gmail integration for the App Suite dashboard using Google OAuth 2.0 and the Gmail API.

## Prerequisites
- Google Cloud Console account
- Netlify Functions enabled
- Environment variables configured

## Step 1: Google Cloud Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Note your Project ID

### 1.2 Enable Gmail API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: External
   - App name: App Suite
   - Support email: your-email@domain.com
   - Scopes: 
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.modify`
4. Create OAuth client:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:8080/.netlify/functions/gmail-callback`
     - `https://app-suite.io/.netlify/functions/gmail-callback`

### 1.4 Save Credentials
Download the credentials JSON and extract:
- Client ID
- Client Secret

## Step 2: Environment Variables

Add to Netlify environment variables:
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://app-suite.io/.netlify/functions/gmail-callback
JWT_SECRET=your-jwt-secret
DATABASE_URL=your-database-url
```

## Step 3: Database Schema

Add these tables to track Gmail connections:

```sql
-- Gmail connections
CREATE TABLE gmail_connections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email cache (optional for performance)
CREATE TABLE email_cache (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  thread_id VARCHAR(255),
  subject TEXT,
  snippet TEXT,
  body TEXT,
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  date TIMESTAMP,
  labels JSONB,
  attachments JSONB,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 4: Implementation Flow

### 4.1 User Initiates Connection
```javascript
// Frontend: GmailInbox.tsx
const connectGmail = async () => {
  const response = await fetch('/.netlify/functions/gmail-auth');
  const { authUrl } = await response.json();
  window.location.href = authUrl;
};
```

### 4.2 OAuth Flow
1. User redirected to Google consent screen
2. User approves permissions
3. Google redirects to callback URL with auth code
4. Exchange code for access/refresh tokens
5. Store tokens securely
6. Redirect user back to dashboard

### 4.3 Fetching Emails
```javascript
// Netlify Function: gmail-fetch.js
const { google } = require('googleapis');

exports.handler = async (event, context) => {
  const userId = getUserFromToken(event.headers.authorization);
  const tokens = await getTokensFromDB(userId);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials(tokens);
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 50,
    q: 'in:inbox'
  });
  
  // Fetch full message details
  const messages = await Promise.all(
    response.data.messages.map(msg => 
      gmail.users.messages.get({ userId: 'me', id: msg.id })
    )
  );
  
  return {
    statusCode: 200,
    body: JSON.stringify({ emails: messages })
  };
};
```

## Step 5: Features to Implement

### Core Features:
1. **Inbox View** - List emails with pagination
2. **Email Details** - View full email with attachments
3. **Send Email** - Compose and send from dashboard
4. **Reply/Forward** - Thread-based conversations
5. **Labels** - Organize with Gmail labels
6. **Search** - Full-text email search
7. **Attachments** - Download and preview

### Advanced Features:
1. **Real-time Updates** - Webhook for new emails
2. **Templates** - Save email templates
3. **Bulk Actions** - Archive/delete multiple
4. **Filters** - Auto-organize emails
5. **Analytics** - Email metrics and insights

## Step 6: Security Considerations

1. **Token Storage**: Encrypt tokens in database
2. **Scope Limitation**: Request minimal permissions
3. **Token Refresh**: Auto-refresh expired tokens
4. **Rate Limiting**: Implement API rate limits
5. **User Privacy**: Clear data on disconnect

## Step 7: Testing

1. Test OAuth flow locally
2. Verify token refresh
3. Test error handling
4. Check rate limits
5. Validate permissions

## Deployment Checklist

- [ ] Google Cloud project configured
- [ ] OAuth credentials created
- [ ] Environment variables set
- [ ] Database tables created
- [ ] Netlify functions deployed
- [ ] SSL certificate active
- [ ] Privacy policy updated
- [ ] User documentation ready

## Troubleshooting

### Common Issues:
1. **Invalid redirect URI**: Ensure exact match in Google Console
2. **Token expired**: Implement automatic refresh
3. **Scope errors**: User needs to re-authenticate
4. **Rate limits**: Implement caching and batching

### Debug Mode:
Set `GMAIL_DEBUG=true` to log detailed API responses.

## Resources
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)