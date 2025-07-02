# App Suite Migration Plan: Netlify + Neon → Vercel + Supabase

## Overview
This document outlines the complete migration strategy for moving App Suite from Netlify + Neon to Vercel + Supabase.

## Migration Benefits
- **Simpler Auth**: Supabase Auth replaces custom authentication
- **Better Performance**: Vercel's edge network + Supabase's global infrastructure
- **Cost Savings**: ~$70/month saved (no separate vector database needed)
- **Unified Stack**: One platform for auth, database, storage, and real-time
- **No Module Issues**: Vercel handles CommonJS/ESM seamlessly

## Phase 1: Setup New Infrastructure

### 1.1 Create Supabase Project
```bash
# Go to supabase.com and create account
# Create new project "app-suite-production"
# Save these values:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx (for admin operations)
```

### 1.2 Create Vercel Project
```bash
# Install Vercel CLI
npm i -g vercel

# In project directory
vercel link
# Select "Create new project"
# Name: "app-suite"
```

## Phase 2: Database Migration

### 2.1 Export Neon Data
```sql
-- Run in Neon console
pg_dump DATABASE_URL > neon_backup.sql
```

### 2.2 Supabase Schema Setup
```sql
-- Users table with Supabase Auth integration
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Migrate other tables (keep same structure)
-- Just change SERIAL to uuid with gen_random_uuid()
```

### 2.3 Auth Migration
```sql
-- Insert admin users into Supabase Auth
-- Use Supabase dashboard or API to create users:
-- jason@jaydus.ai
-- almir@jaydus.ai  
-- jorge@jaydus.ai
```

## Phase 3: Convert Netlify Functions to Vercel

### 3.1 Directory Structure
```
/api (Vercel API routes)
├── auth/
│   ├── login.ts
│   └── logout.ts
├── leads/
│   ├── index.ts
│   └── [id].ts
├── projects/
│   └── index.ts
└── ai/
    └── generate.ts
```

### 3.2 Function Conversion Example
```typescript
// From: netlify/functions/auth-login.js
// To: api/auth/login.ts

import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { email, password } = req.body
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return res.status(401).json({ error: error.message })
  }
  
  return res.status(200).json({ user: data.user, session: data.session })
}
```

## Phase 4: Frontend Updates

### 4.1 Install Supabase Client
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-react
```

### 4.2 Update Auth Context
```typescript
// src/contexts/AuthContext.tsx
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}
```

### 4.3 Update API Calls
```typescript
// Replace fetch calls with Supabase client
// Before:
const response = await fetch('/.netlify/functions/leads')

// After:
const { data, error } = await supabase
  .from('leads')
  .select('*')
```

## Phase 5: Deployment

### 5.1 Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key
```

### 5.2 Deploy to Vercel
```bash
# Test locally
npm run dev

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Phase 6: DNS Update
1. Update domain DNS from Netlify to Vercel
2. Add custom domain in Vercel dashboard
3. SSL certificates auto-provision

## Migration Checklist

- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Migrate user authentication
- [ ] Convert Netlify functions to Vercel API routes
- [ ] Update frontend to use Supabase client
- [ ] Test all functionality locally
- [ ] Deploy to Vercel preview
- [ ] Migrate production data
- [ ] Update DNS records
- [ ] Monitor for 24 hours
- [ ] Decommission Netlify/Neon

## Rollback Plan
1. Keep Netlify deployment active for 7 days
2. Database backups before migration
3. DNS can be reverted in 5 minutes
4. All code changes in separate branch

## Timeline
- Day 1-2: Infrastructure setup
- Day 3-4: Code migration
- Day 5: Testing
- Day 6: Production deployment
- Day 7: Monitoring & cleanup