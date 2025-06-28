# 🚀 Quick Netlify Environment Setup

## Required Environment Variables

Copy and paste these into your Netlify environment variables:

### 1. Go to Netlify Dashboard
https://app.netlify.com → Select your site → Site Configuration → Environment Variables

### 2. Add These Variables

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxx
```

### 3. Variable Details

| Variable | Purpose | Get Key From |
|----------|---------|--------------|
| `ANTHROPIC_API_KEY` | ASC.AI code generation, Call transcript analysis | [Anthropic Console](https://console.anthropic.com/) |
| `RESEND_API_KEY` | Email sending (proposals, notifications) | [Resend Dashboard](https://resend.com/api-keys) |

### 4. After Adding
- Click **Save**
- Wait 2-3 minutes for deployment
- Test features:
  - ASC.AI: Go to `/admin/asc-ai` → Try AI chat
  - Email: Send a test proposal

## ⚠️ Important
- Do NOT add `NEXT_PUBLIC_` or `VITE_` prefix
- These are server-side only for security
- Never commit these keys to Git

## Need Help?
- Check function logs in Netlify Dashboard → Functions
- See full guide: `/docs/ENVIRONMENT_VARIABLES.md`