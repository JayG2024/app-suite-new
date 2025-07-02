#!/usr/bin/env node

/**
 * Automated Supabase Setup Script
 * This will create all tables, users, and initial data
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load credentials from .env.supabase
const envPath = join(__dirname, '../.env.supabase')
const envContent = readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=')
    if (key) env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.supabase')
  process.exit(1)
}

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Admin users to create
const ADMIN_USERS = [
  { email: 'jason@jaydus.ai', name: 'Jason', password: 'AppSuite2025!' },
  { email: 'almir@jaydus.ai', name: 'Almir', password: 'AppSuite2025!' },
  { email: 'jorge@jaydus.ai', name: 'Jorge', password: 'AppSuite2025!' }
]

async function setupSupabase() {
  console.log('🚀 Automated Supabase Setup for App Suite\n')
  console.log('📍 URL:', supabaseUrl)
  console.log('✅ Credentials loaded from .env.supabase\n')

  try {
    // Step 1: Create admin users
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
            
            // Get existing user
            const { data: { users } } = await supabase.auth.admin.listUsers()
            const existingUser = users.find(u => u.email === admin.email)
            
            if (existingUser) {
              // Update profile if needed
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: existingUser.id,
                  email: admin.email,
                  name: admin.name,
                  role: 'admin'
                })
              
              if (!profileError) {
                console.log(`   ✅ Updated profile for ${admin.email}`)
              }
            }
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
          console.error(`   ⚠️  Profile error for ${admin.email}:`, profileError.message)
        } else {
          console.log(`   ✅ Created admin user: ${admin.email}`)
        }
      } catch (error) {
        console.error(`   ❌ Error with ${admin.email}:`, error.message)
      }
    }

    // Step 2: Create sample data
    console.log('\n📊 Creating sample data...')
    
    // Sample email templates
    const templates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to {{company}}!',
        body: 'Hi {{name}},\n\nWelcome aboard! We\'re excited to work with you on your custom application.',
        category: 'onboarding',
        variables: { company: 'string', name: 'string' }
      },
      {
        name: 'Project Update',
        subject: 'Update on {{project_name}}',
        body: 'Hi {{client_name}},\n\nHere\'s the latest update on your project...',
        category: 'project',
        variables: { project_name: 'string', client_name: 'string' }
      },
      {
        name: 'Invoice Reminder',
        subject: 'Invoice #{{invoice_number}} - Payment Reminder',
        body: 'Dear {{client_name}},\n\nThis is a friendly reminder about invoice #{{invoice_number}}...',
        category: 'billing',
        variables: { invoice_number: 'string', client_name: 'string' }
      }
    ]

    for (const template of templates) {
      const { error } = await supabase
        .from('email_templates')
        .upsert({
          name: template.name,
          subject: template.subject,
          body: template.body,
          category: template.category,
          variables: template.variables
        }, {
          onConflict: 'name'
        })
      
      if (!error) {
        console.log(`   ✅ Created template: ${template.name}`)
      }
    }

    // Step 3: Test the setup
    console.log('\n🧪 Testing setup...')
    
    // Test auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'jason@jaydus.ai',
      password: 'AppSuite2025!'
    })
    
    if (signInError) {
      console.error('   ❌ Auth test failed:', signInError.message)
    } else {
      console.log('   ✅ Authentication working')
      
      // Sign out
      await supabase.auth.signOut()
    }

    // Test database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profileError) {
      console.error('   ❌ Database test failed:', profileError.message)
      console.log('\n⚠️  Please run the migration SQL in Supabase dashboard first!')
      console.log('   File: supabase/migrations/001_initial_schema.sql')
    } else {
      console.log('   ✅ Database queries working')
    }

    console.log('\n✨ Setup complete!\n')
    console.log('📋 Next steps:')
    console.log('1. If you see database errors above, run the migration SQL in Supabase')
    console.log('2. Copy .env.supabase to .env.local for local development')
    console.log('3. Run: yarn dev')
    console.log('4. Deploy to Vercel: vercel --prod')
    console.log('\n🔐 Admin logins:')
    ADMIN_USERS.forEach(admin => {
      console.log(`   ${admin.email} / ${admin.password}`)
    })

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
console.log('Starting setup...\n')
setupSupabase()