# Netlify Deployment Guide

## Quick Deploy (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/app-suite-new.git
   git push -u origin main
   ```

2. **Deploy to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository
   - Build settings will auto-detect from `netlify.toml`
   - Click "Deploy"

## Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_OPENAI_API_KEY=your-openai-key
VITE_RESEND_API_KEY=your-resend-key
VITE_STRIPE_SECRET_KEY=your-stripe-key
VITE_SITE_URL=https://your-site.netlify.app
```

## Important Notes

⚠️ **API Routes Migration Required**: The current API routes are written for Vercel. They'll need minor adjustments to work with Netlify Functions:

- Move from `/api` folder to `/netlify/functions`
- Change export format from `export default handler` to `exports.handler`
- The rest of the logic remains the same

## Manual Deploy (Alternative)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   yarn build
   netlify deploy
   netlify deploy --prod
   ```

## Custom Domain

1. In Netlify Dashboard → Domain Management
2. Add your custom domain
3. Follow DNS configuration steps
4. SSL certificate is automatic

## Monitoring

- Check function logs: Netlify Dashboard → Functions tab
- Build logs: Netlify Dashboard → Deploys tab
- Analytics: Automatically included

Your site will be live at `https://[your-site-name].netlify.app` within minutes!