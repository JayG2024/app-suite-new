# 🚀 Deploy to Netlify - Quick Guide

Your app is built and ready! The production files are in the `dist` folder.

## Option 1: Drag & Drop Deploy (Fastest!)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `dist` folder from this directory into the browser
3. Your site will be live instantly!
4. Click "Site settings" to customize domain name

## Option 2: GitHub Deploy (Recommended for updates)

1. First, push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/app-suite-new.git
   git branch -M main
   git push -u origin main
   ```

2. Then connect to Netlify:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Deploy settings are already configured in `netlify.toml`

## Option 3: CLI Deploy (Once logged in)

```bash
# Login first (one time)
netlify login

# Then deploy
netlify deploy --dir=dist --prod
```

## Your Build Info:
- ✅ Build completed successfully
- 📁 Production files in: `/dist`
- 🔒 Repository is private (package.json)
- ⚡ Ready for deployment!

## Environment Variables to Add in Netlify:
```
VITE_OPENAI_API_KEY=your-key-here
VITE_RESEND_API_KEY=your-key-here
VITE_STRIPE_SECRET_KEY=your-key-here
VITE_SITE_URL=https://app-suite.io
```

Add these in: Site Settings → Environment Variables