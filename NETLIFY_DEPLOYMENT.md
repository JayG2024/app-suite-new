# 🚀 Netlify Deployment Guide for App Suite

This comprehensive guide covers everything you need to deploy and manage App Suite on Netlify.

## Table of Contents
- [Quick Deploy](#quick-deploy)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
- [API Functions](#api-functions)
- [Domain Setup](#domain-setup)
- [Monitoring & Debugging](#monitoring--debugging)
- [Local Development](#local-development)

## Quick Deploy

### Prerequisites
- Node.js 20+ installed
- Git repository (GitHub recommended)
- Netlify account

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/app-suite-new.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize access
   - Choose your repository
   - Build settings will auto-detect from `netlify.toml`
   - Click "Deploy"

3. **Set Environment Variables** (see [Environment Variables](#environment-variables) section)

### Option 2: Drag & Drop Deploy

1. **Build locally:**
   ```bash
   yarn build
   ```

2. **Deploy:**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder into the browser
   - Your site will be live instantly!

### Option 3: CLI Deploy

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and deploy:**
   ```bash
   netlify login
   netlify init
   netlify deploy --dir=dist
   netlify deploy --dir=dist --prod  # For production
   ```

## Environment Variables

### Required Variables

Add these in **Netlify Dashboard** → **Site Configuration** → **Environment Variables**:

| Variable | Description | Get Key From |
|----------|-------------|--------------|
| `ANTHROPIC_API_KEY` | Powers ASC.AI code generation and call analysis | [Anthropic Console](https://console.anthropic.com/) |
| `RESEND_API_KEY` | Sends emails (proposals, notifications) | [Resend Dashboard](https://resend.com/api-keys) |

### Optional Variables

| Variable | Description | Default/Notes |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | Optional - for future features |
| `JWT_SECRET` | Session security | Generate: `openssl rand -base64 32` |
| `VITE_SITE_URL` | Your domain | `https://app-suite.io` |

### How to Add Variables

1. Go to your site in [Netlify Dashboard](https://app.netlify.com)
2. Navigate to **Site Configuration** → **Environment Variables**
3. Click **Add a variable**
4. For each variable:
   - Enter the **Key** (e.g., `ANTHROPIC_API_KEY`)
   - Enter the **Value** (your actual API key)
   - Select **Scopes**:
     - ✅ Production
     - ✅ Deploy Previews (optional)
     - ❌ Builds (not needed for server-side vars)
5. Click **Save**
6. Redeploy your site or wait for next automatic deployment

### Security Best Practices

**DO ✅**
- Store all API keys in Netlify environment variables
- Use different keys for development and production
- Rotate keys periodically
- Monitor usage in respective dashboards

**DON'T ❌**
- Never commit API keys to Git
- Don't use `VITE_` prefix for server-side secrets
- Don't share keys in documentation
- Don't hardcode fallback keys

## Deployment Options

### Production Deployment

Your main branch auto-deploys to production:
- URL: `https://app-suite.io` (after domain setup)
- Build command: `yarn build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Deploy Previews

Every pull request gets a unique preview URL:
- Automatic deployment on PR creation
- Updates on every commit
- Separate environment variables (optional)
- Comments added to PR with preview link

### Branch Deploys

Deploy specific branches to unique URLs:
1. Go to **Site Configuration** → **Build & Deploy** → **Branches**
2. Add branch patterns (e.g., `staging`, `feature/*`)
3. Each branch gets its own URL

## API Functions

### Available Functions

App Suite includes 37+ serverless functions:

**AI & Content:**
- `/api/ai-generate-content` - Generate content with AI
- `/api/asc-code-gen` - ASC.AI code generation
- `/api/claude-code-gen` - Claude code generation
- `/api/analyze-transcript` - Analyze call transcripts

**Business Operations:**
- `/api/clients` - Client management
- `/api/projects` - Project tracking
- `/api/tasks` - Task management
- `/api/invoices` - Invoice handling
- `/api/leads` - Lead management

**Communication:**
- `/api/send-email` - Send emails via Resend
- `/api/gmail-auth` - Gmail authentication
- `/api/gmail-fetch` - Fetch Gmail messages

**Analytics & Admin:**
- `/api/analytics` - Site analytics
- `/api/dashboard-metrics` - Dashboard data
- `/api/activity-log` - User activity tracking

### Calling Functions

Functions are accessed via `/.netlify/functions/[function-name]`:

```javascript
// Example: Generate content
const response = await fetch('/.netlify/functions/ai-generate-content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a blog post about AI',
    type: 'blog'
  })
});
```

### Function Structure

All functions follow this pattern:

```javascript
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Your function logic
    const result = await processRequest(event);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## Domain Setup

### Custom Domain Configuration

1. **Add Domain:**
   - Go to **Domain Management** in Netlify
   - Click **Add a domain**
   - Enter `app-suite.io`

2. **DNS Configuration:**
   - Option A: Use Netlify DNS (recommended)
   - Option B: Add DNS records to your provider:
     ```
     Type: A
     Name: @
     Value: 75.2.60.5
     
     Type: CNAME
     Name: www
     Value: [your-site-name].netlify.app
     ```

3. **SSL Certificate:**
   - Automatic via Let's Encrypt
   - Force HTTPS in `netlify.toml` (already configured)

### Redirects

Configured in `netlify.toml`:
- Force HTTPS
- Redirect www to non-www
- Handle SPA routing
- API function routing

## Monitoring & Debugging

### Function Logs

1. Go to **Functions** tab in Netlify Dashboard
2. Click on any function name
3. View:
   - Recent invocations
   - Success/error rates
   - Execution time
   - Log output

### Build Logs

1. Go to **Deploys** tab
2. Click on any deploy
3. View:
   - Build output
   - Error messages
   - Deploy summary

### Analytics

Netlify Analytics provides:
- Page views
- Unique visitors
- Top pages
- Top sources
- Client-side performance

### Debug Locally

Use Netlify Dev for local testing:

```bash
# Install CLI
npm install -g netlify-cli

# Run locally with functions
netlify dev

# Access at http://localhost:8888
# Functions at http://localhost:8888/.netlify/functions/
```

## Local Development

### Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/app-suite-new.git
   cd app-suite-new
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Create `.env.local`:**
   ```bash
   # Copy example
   cp .env.example .env.local
   
   # Add your keys
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   RESEND_API_KEY=re_xxxxx
   ```

4. **Run development server:**
   ```bash
   # With Netlify Dev (recommended - includes functions)
   netlify dev
   
   # Or standard Vite
   yarn dev
   ```

### Testing Functions Locally

```bash
# Test a function
curl http://localhost:8888/.netlify/functions/test-connection

# Test with data
curl -X POST http://localhost:8888/.netlify/functions/ai-generate-content \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello AI"}'
```

## Troubleshooting

### Common Issues

**Build Fails:**
- Check Node version (requires 20+)
- Review build logs for errors
- Ensure all dependencies are listed
- Check environment variables

**Functions Not Working:**
- Verify environment variables are set
- Check function logs for errors
- Test locally with `netlify dev`
- Ensure proper CORS headers

**Environment Variables Not Loading:**
- Redeploy after adding variables
- Check variable names (case-sensitive)
- Verify scopes are set correctly
- Don't use `VITE_` for server-side

### Getting Help

1. **Check Logs:** Function and build logs in Netlify Dashboard
2. **Test Locally:** Use `netlify dev` to debug
3. **Documentation:** [docs.netlify.com](https://docs.netlify.com)
4. **Support:** Netlify support or community forums

## Cost Management

### Netlify Pricing
- **Free Tier:** 100GB bandwidth, 300 build minutes
- **Pro:** $19/month per member
- **Functions:** 125k invocations free

### API Services
- **Anthropic:** ~$0.015 per 1K tokens
- **Resend:** 100 emails/day free, then $20/month

### Monitoring Usage
- Check Netlify Dashboard for bandwidth/builds
- Monitor API dashboards for usage
- Set up billing alerts

## Next Steps

1. ✅ Deploy your site
2. ✅ Add environment variables
3. ✅ Configure custom domain
4. ✅ Test all functions
5. ✅ Set up monitoring
6. 🚀 Launch your App Suite!

---

**Need help?** Check function logs, test locally with `netlify dev`, or refer to the [Netlify documentation](https://docs.netlify.com).