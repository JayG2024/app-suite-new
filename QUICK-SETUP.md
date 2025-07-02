# 🚀 Quick Setup Instructions

## Step 1: Run SQL Migration in Supabase

1. Go to: https://supabase.com/dashboard/project/imeigitblspjedqwsigf/sql/new
2. You'll see "SQL Editor" page
3. Copy ALL contents from this file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Paste into the SQL editor
5. Click "Run" button (bottom right)
6. You should see "Success. No rows returned"

## Step 2: Connect Vercel

1. Go to: https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import: https://github.com/JayG2024/app-suite-new
5. It will auto-detect settings
6. Click "Deploy"

## Step 3: Add Environment Variables in Vercel

After deployment, go to:
- Project Settings → Environment Variables
- Add these:

```
VITE_SUPABASE_URL = https://imeigitblspjedqwsigf.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWlnaXRibHNwamVkcXdzaWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDA3NDksImV4cCI6MjA2NzAxNjc0OX0.h8Nq1MyWOAVZNQErqnktxl5TXotzvWV_X4o87gdv1hE
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWlnaXRibHNwamVkcXdzaWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0MDc0OSwiZXhwIjoyMDY3MDE2NzQ5fQ.9icrIfO2H-POTc5tVpo93zqhn9TAQaqr2DH9sy8piBA
OPENAI_API_KEY = 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
RESEND_API_KEY = re_VdrBP7W3_AjMjbFkLk4dDU8LFGxxVX6kb
```

## Step 4: I'll Push Updates

Once you've done steps 1-3, tell me and I'll:
- Update all code to use Supabase
- Push to GitHub
- Vercel will auto-deploy

## Admin Logins (after setup):
- jason@jaydus.ai / AppSuite2025!
- almir@jaydus.ai / AppSuite2025!
- jorge@jaydus.ai / AppSuite2025!