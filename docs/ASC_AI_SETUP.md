# ASC.AI Setup Instructions

## Overview
ASC.AI (App Suite Code AI) is a secure, AI-powered development platform that helps you build applications quickly. It uses Claude AI on the backend while keeping your API key secure.

## Security Architecture

### Frontend (Browser)
- ASC Dashboard UI
- WebContainers for Node.js runtime
- Terminal emulation
- File system management
- Preview functionality

### Backend (Netlify Functions)
- Secure API key storage
- Claude AI integration
- Protected endpoints

## Setup Instructions

### 1. Set Up Anthropic API Key in Netlify

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Navigate to: **Site Configuration → Environment Variables**
4. Add a new environment variable:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-api03-`)
   - **Scope**: Production (and optionally Deploy Previews)

⚠️ **IMPORTANT**: Do NOT use `NEXT_PUBLIC_` or `VITE_` prefix for the API key. This would expose it to the client.

### 2. Deploy the Functions

The ASC.AI functions are automatically deployed when you push to your repository:

- `/netlify/functions/asc-generate.js` - Main AI generation endpoint
- `/netlify/functions/asc-code-gen.js` - Legacy endpoint (can be removed)

### 3. Test the Integration

1. Go to `/admin/asc-ai` in your dashboard
2. Create a new project
3. Use the AI Assistant tab
4. Ask: "Help me create a simple React component"
5. You should receive a proper AI response

## API Endpoints

### ASC Generate
```
POST /.netlify/functions/asc-generate
```

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Your prompt here" }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

Response:
```json
{
  "content": "AI response here",
  "usage": {
    "input_tokens": 100,
    "output_tokens": 200
  }
}
```

## Troubleshooting

### API Key Not Working
1. Verify the key is set correctly in Netlify
2. Check the function logs in Netlify
3. Ensure the key has valid credits

### Fallback Mode
If the API key is not configured, ASC.AI will use mock responses so you can still test the UI.

### Function Errors
Check the Netlify function logs:
1. Go to Netlify Dashboard
2. Navigate to Functions → asc-generate
3. View recent invocations and logs

## Local Development

For local development, create a `.env` file:
```bash
ANTHROPIC_API_KEY=your-key-here
```

Then run:
```bash
netlify dev
```

This will use your local environment variables while running the functions.

## Cost Management

- Each AI request uses tokens
- Monitor usage in your Anthropic dashboard
- Consider implementing rate limiting for production use

## Security Best Practices

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Monitor usage** regularly
4. **Implement rate limiting** for production
5. **Add authentication** to the ASC endpoints if needed

## Support

For issues or questions:
- Check function logs in Netlify
- Review browser console for errors
- Ensure API key has valid credits
- Contact support if issues persist