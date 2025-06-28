# Environment Variables Guide

## Overview
This guide covers all environment variables needed for App Suite to function properly in production.

## Required Environment Variables for Netlify

### 1. AI Services

#### Anthropic API Key
- **Variable**: `ANTHROPIC_API_KEY`
- **Format**: `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx`
- **Used for**: ASC.AI code generation, call transcript analysis
- **Get it from**: [Anthropic Console](https://console.anthropic.com/)

### 2. Email Services

#### Resend API Key
- **Variable**: `RESEND_API_KEY`
- **Format**: `re_xxxxxxxxxxxxxx`
- **Used for**: Sending emails (proposals, notifications, newsletters)
- **Get it from**: [Resend Dashboard](https://resend.com/api-keys)

### 3. Database (Optional - for future features)

#### Neon Database URL
- **Variable**: `DATABASE_URL`
- **Format**: `postgresql://user:password@host/database`
- **Used for**: Storing user data, projects, analytics
- **Get it from**: [Neon Dashboard](https://neon.tech/)

### 4. Authentication (Optional - for enhanced security)

#### JWT Secret
- **Variable**: `JWT_SECRET`
- **Format**: Random 32+ character string
- **Used for**: Securing user sessions
- **Generate**: `openssl rand -base64 32`

## How to Add to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `app-suite-new`
3. Navigate to: **Site Configuration → Environment Variables**
4. Click **Add a variable**
5. For each variable:
   - Enter the **Key** (e.g., `ANTHROPIC_API_KEY`)
   - Enter the **Value** (your actual API key)
   - Select **Scopes**: 
     - ✅ Production
     - ✅ Deploy Previews (optional)
     - ❌ Builds (not needed)
6. Click **Save**

## Current Status

### Already Configured ✅
- `ANTHROPIC_API_KEY` - Used in functions
- `RESEND_API_KEY` - Used in email functions

### Need to Configure 🔧
Add these in Netlify Dashboard:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxx
```

## Security Best Practices

### DO ✅
- Store all API keys in Netlify environment variables
- Use different keys for development and production
- Rotate keys periodically
- Monitor usage in respective dashboards

### DON'T ❌
- Never commit API keys to Git
- Don't use `NEXT_PUBLIC_` or `VITE_` prefixes (exposes to client)
- Don't share keys in chat or documentation
- Don't hardcode fallback keys in functions

## Testing Your Configuration

### 1. Test ASC.AI (Anthropic)
```bash
# Go to /admin/asc-ai
# Try the AI chat
# Should get intelligent responses
```

### 2. Test Email (Resend)
```bash
# Go to /admin/clients
# Send a test proposal
# Check email delivery
```

## Troubleshooting

### API Key Not Working
1. Check Netlify function logs
2. Verify key format is correct
3. Ensure key has valid credits/permissions
4. Check for typos in variable names

### View Function Logs
1. Go to Netlify Dashboard
2. Navigate to **Functions**
3. Click on the function name
4. View recent invocations

## Local Development

Create `.env.local` file:
```bash
# Copy from .env.example
cp .env.example .env.local

# Add your actual keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxx
```

Run with Netlify Dev:
```bash
netlify dev
```

## Cost Management

### Anthropic (ASC.AI)
- Monitor at: [Anthropic Console](https://console.anthropic.com/)
- Set usage alerts
- ~$0.015 per 1K tokens for Claude 3 Opus

### Resend (Email)
- Monitor at: [Resend Dashboard](https://resend.com/)
- Free tier: 100 emails/day
- Paid: $20/month for 50K emails

## Support

For issues:
1. Check function logs in Netlify
2. Verify environment variables are set
3. Test with `netlify dev` locally
4. Contact support if needed