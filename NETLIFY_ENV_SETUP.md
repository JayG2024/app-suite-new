# Netlify Environment Variables Setup

## Required Environment Variables

Add these to your Netlify Dashboard → Site Settings → Environment Variables:

### Email Service (Resend)
- **Variable Name**: `RESEND_API_KEY`
- **Value**: `re_3QavMQ2R_NDnZrCC8UJ4EsmoLyA52XVnq`

### Other Required Variables
- **Variable Name**: `VITE_SITE_URL`
- **Value**: `https://app-suite.io`

- **Variable Name**: `JWT_SECRET`
- **Value**: Generate a secure random string (32+ characters)

- **Variable Name**: `VITE_RESEND_API_KEY`
- **Value**: `re_3QavMQ2R_NDnZrCC8UJ4EsmoLyA52XVnq` (same as RESEND_API_KEY)

- **Variable Name**: `ADMIN_EMAIL`
- **Value**: `jason@jaydus.ai`

## How to Add Variables in Netlify

1. Go to your Netlify Dashboard
2. Select your site (app-suite-new)
3. Navigate to Site Settings → Environment Variables
4. Click "Add a variable"
5. Enter the key and value
6. Click "Save"
7. Trigger a new deployment for changes to take effect

## Security Notes
- Never commit API keys to Git
- Rotate keys regularly
- Use different keys for development and production
- The Resend API key should have permissions for:
  - Sending transactional emails
  - Using your verified domain (app-suite.io)

## Verifying Setup
After adding the variables and redeploying:
1. Test password reset functionality
2. Test contact form submissions
3. Check Netlify Functions logs for any errors