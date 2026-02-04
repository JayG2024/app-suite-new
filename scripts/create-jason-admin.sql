-- SQL Script to create super admin account for jason@jaydus.ai
-- Run this in your Supabase SQL Editor

-- Step 1: Create the auth user (if not exists)
-- Note: You'll need to do this through Supabase Dashboard > Authentication > Users
-- Click "Add User" and use:
-- Email: jason@jaydus.ai
-- Password: TempPassword123! (change after first login)
-- Confirm email: Yes

-- Step 2: After creating the auth user, get the user ID and insert profile
-- Replace 'USER_ID_HERE' with the actual UUID from the auth.users table

-- First, let's check if the profile exists
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'jason@jaydus.ai';

  IF v_user_id IS NOT NULL THEN
    -- Check if profile exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
      -- Update existing profile to admin
      UPDATE public.profiles
      SET 
        role = 'admin',
        name = 'Jason',
        updated_at = NOW()
      WHERE id = v_user_id;
      
      RAISE NOTICE 'Updated existing profile to admin role';
    ELSE
      -- Insert new profile
      INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
      VALUES (v_user_id, 'jason@jaydus.ai', 'Jason', 'admin', NOW(), NOW());
      
      RAISE NOTICE 'Created new admin profile';
    END IF;
  ELSE
    RAISE NOTICE 'Auth user not found. Please create the user first in Authentication > Users';
  END IF;
END $$;

-- Step 3: Verify the admin user was created
SELECT 
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at
FROM public.profiles p
WHERE p.email = 'jason@jaydus.ai';

-- Step 4: List all admin users
SELECT 
  p.id,
  p.email,
  p.name,
  p.role
FROM public.profiles p
WHERE p.role = 'admin'
ORDER BY p.name;
