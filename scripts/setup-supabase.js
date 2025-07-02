#!/usr/bin/env node

/**
 * Supabase Setup Script
 * Run this after creating your Supabase project
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '../.env.local') })

// Admin users to create
const ADMIN_USERS = [
  { email: 'jason@jaydus.ai', name: 'Jason', password: 'AppSuite2025!' },
  { email: 'almir@jaydus.ai', name: 'Almir', password: 'AppSuite2025!' },
  { email: 'jorge@jaydus.ai', name: 'Jorge', password: 'AppSuite2025!' }
]

async function setupSupabase() {
  console.log('🚀 Setting up Supabase for App Suite...\n')

  // Validate environment variables
  const requiredEnvs = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      console.error(`❌ Missing required environment variable: ${env}`)
      console.log('\nPlease set up your .env.local file with:')
      console.log('1. Create a Supabase project at https://supabase.com')
      console.log('2. Copy .env.supabase.example to .env.local')
      console.log('3. Fill in your Supabase credentials')
      process.exit(1)
    }
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    // Step 1: Run database migrations
    console.log('📄 Running database migrations...')
    const migrationSQL = readFileSync(
      join(__dirname, '../supabase/migrations/001_initial_schema.sql'),
      'utf8'
    )
    
    // Note: In production, run migrations through Supabase dashboard
    console.log('⚠️  Please run the migration SQL in your Supabase SQL editor:')
    console.log('   Dashboard → SQL Editor → New Query → Paste & Run')
    console.log('   Migration file: supabase/migrations/001_initial_schema.sql\n')

    // Step 2: Create admin users
    console.log('👥 Creating admin users...')
    
    for (const admin of ADMIN_USERS) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            name: admin.name
          }
        })

        if (authError) {
          if (authError.message.includes('already exists')) {
            console.log(`   ⚠️  User ${admin.email} already exists`)
            continue
          }
          throw authError
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: admin.email,
            name: admin.name,
            role: 'admin'
          })

        if (profileError && !profileError.message.includes('duplicate')) {
          throw profileError
        }

        console.log(`   ✅ Created admin user: ${admin.email}`)
      } catch (error) {
        console.error(`   ❌ Error creating ${admin.email}:`, error.message)
      }
    }

    // Step 3: Create sample data
    console.log('\n📊 Creating sample data...')
    
    // Sample email templates
    const templates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to {{company}}!',
        body: 'Hi {{name}},\\n\\nWelcome aboard! We're excited to have you.',
        category: 'onboarding'
      },
      {
        name: 'Invoice Reminder',
        subject: 'Invoice #{{invoice_number}} Due Soon',
        body: 'Dear {{client_name}},\\n\\nThis is a friendly reminder...',
        category: 'billing'
      }
    ]

    for (const template of templates) {
      const { error } = await supabase
        .from('email_templates')
        .insert(template)
      
      if (!error) {
        console.log(`   ✅ Created template: ${template.name}`)
      }
    }

    console.log('\n🎉 Supabase setup complete!')
    console.log('\n📋 Next steps:')
    console.log('1. Run the migration SQL in Supabase dashboard')
    console.log('2. Update your code to use Supabase client')
    console.log('3. Deploy to Vercel: vercel --prod')
    console.log('\n🔐 Admin credentials:')
    ADMIN_USERS.forEach(admin => {
      console.log(`   ${admin.email} / ${admin.password}`)
    })

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setupSupabase()