# 🚀 Quick Supabase + Vercel Setup Guide

## Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - Project name: `app-suite-production`
   - Database password: (save this!)
   - Region: Choose closest to you
4. Click "Create Project" and wait ~2 minutes

## Step 2: Get Your Credentials

Once project is ready:
1. Go to Settings → API
2. Copy these values:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Up Database

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (should see "Success" message)

## Step 4: Configure Local Environment

```bash
# Copy environment template
cp .env.supabase.example .env.local

# Edit .env.local with your credentials
# Add your Supabase URL and keys
```

## Step 5: Create Admin Users

```bash
# Install dependencies
npm install @supabase/supabase-js

# Run setup script
node scripts/setup-supabase.js
```

## Step 6: Install Vercel CLI

```bash
# Install globally
npm i -g vercel

# Login to Vercel
vercel login
```

## Step 7: Deploy to Vercel

```bash
# Link to Vercel project
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Step 8: Set Production Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add all variables from `.env.local`
4. Redeploy for changes to take effect

## 🎉 Done!

Your app is now running on Vercel with Supabase!

### Test Admin Login:
- URL: `https://your-app.vercel.app/admin`
- Email: `jason@jaydus.ai`
- Password: `AppSuite2025!`

### Troubleshooting:

**"Missing environment variables" error:**
- Make sure all vars are set in Vercel dashboard
- Redeploy after adding variables

**"Auth error" when logging in:**
- Check that users were created in Supabase Auth
- Verify email is confirmed in Supabase dashboard

**"Database error":**
- Make sure migration SQL was run successfully
- Check RLS policies are enabled