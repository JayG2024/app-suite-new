# Create Super Admin Account for jason@jaydus.ai

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Create Auth User
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **"Add User"** or **"Invite User"**
4. Fill in:
   - **Email**: `jason@jaydus.ai`
   - **Password**: `TempPassword123!` (or your preferred password)
   - **Auto Confirm User**: ✅ Check this box
5. Click **"Create User"** or **"Send Invitation"**

### Step 2: Run SQL Script
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the contents of `scripts/create-jason-admin.sql`
4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. You should see a success message and the admin user details

### Step 3: Verify Admin Access
1. Go to **SQL Editor** and run:
```sql
SELECT id, email, name, role 
FROM public.profiles 
WHERE email = 'jason@jaydus.ai';
```
2. Verify that `role` is set to `'admin'`

### Step 4: Login
1. Go to your app login page
2. Use credentials:
   - **Email**: `jason@jaydus.ai`
   - **Password**: `TempPassword123!` (or the password you set)
3. Change your password after first login!

---

## Option 2: Using Node Script (Requires Environment Variables)

### Prerequisites
You need a `.env` or `.env.local` file with:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Run the Script
```bash
node scripts/add-jason-admin.js
```

---

## Option 3: Manual SQL (If Script Doesn't Work)

Run this in Supabase SQL Editor:

```sql
-- 1. First, manually create the auth user in Authentication > Users
-- Then get the user ID and run:

-- Replace 'YOUR_USER_ID_HERE' with the actual UUID
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- Get this from auth.users table
  'jason@jaydus.ai',
  'Jason',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  name = 'Jason',
  updated_at = NOW();
```

---

## Troubleshooting

### If you get "User already exists"
Run this to update the existing user to admin:
```sql
UPDATE public.profiles
SET role = 'admin', name = 'Jason', updated_at = NOW()
WHERE email = 'jason@jaydus.ai';
```

### If profile table doesn't exist
Make sure you've run the migrations:
```bash
# Check if migrations exist
ls supabase/migrations/

# If using Supabase CLI
supabase db push
```

### Verify Admin Role
```sql
SELECT * FROM public.profiles WHERE email = 'jason@jaydus.ai';
```

---

## Security Notes

⚠️ **Important**: 
- Change the default password immediately after first login
- Keep your service role key secure and never commit it to git
- The service role key bypasses Row Level Security - use with caution

---

## Default Credentials

**Email**: `jason@jaydus.ai`  
**Password**: `TempPassword123!`

🔐 **Change this password after your first login!**
