#!/usr/bin/env node

/**
 * Partner Portal Setup Script
 * 
 * This script sets up the partner portal by:
 * 1. Running the database migration
 * 2. Creating a test partner account
 * 3. Verifying the setup
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   VITE_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('📦 Running partner portal migration...')
  
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/004_partner_portal_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Migration failed:', error.message)
      return false
    }
    
    console.log('✅ Migration completed successfully')
    return true
  } catch (error) {
    console.error('❌ Migration error:', error.message)
    return false
  }
}

async function createTestPartner() {
  console.log('👤 Creating test partner account...')
  
  try {
    // First, create a user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@partner.com',
      password: 'testpartner123',
      email_confirm: true,
      user_metadata: {
        name: 'Test Partner'
      }
    })
    
    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message)
      return false
    }
    
    console.log('✅ Auth user created:', authData.user.email)
    
    // Get the bronze discount tier
    const { data: discountTier, error: tierError } = await supabase
      .from('discount_tiers')
      .select('id')
      .eq('name', 'Bronze')
      .single()
    
    if (tierError) {
      console.error('❌ Failed to get discount tier:', tierError.message)
      return false
    }
    
    // Create partner profile
    const { data: partnerData, error: partnerError } = await supabase
      .from('partner_profiles')
      .insert({
        id: authData.user.id,
        company_name: 'Test Partner Company',
        contact_email: 'test@partner.com',
        discount_tier_id: discountTier.id,
        status: 'active',
        branding_level: 'co-branded'
      })
      .select()
      .single()
    
    if (partnerError) {
      console.error('❌ Failed to create partner profile:', partnerError.message)
      return false
    }
    
    console.log('✅ Test partner created successfully')
    console.log('   Email: test@partner.com')
    console.log('   Password: testpartner123')
    console.log('   Company: Test Partner Company')
    console.log('   Status: active')
    
    return true
  } catch (error) {
    console.error('❌ Error creating test partner:', error.message)
    return false
  }
}

async function verifySetup() {
  console.log('🔍 Verifying partner portal setup...')
  
  try {
    // Check if tables exist
    const tables = [
      'discount_tiers',
      'partner_profiles',
      'price_quotes',
      'resources',
      'resource_categories'
    ]
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.error(`❌ Table ${table} not accessible:`, error.message)
        return false
      }
      
      console.log(`✅ Table ${table} is accessible`)
    }
    
    // Check if discount tiers were created
    const { data: tiers, error: tiersError } = await supabase
      .from('discount_tiers')
      .select('name')
    
    if (tiersError) {
      console.error('❌ Failed to fetch discount tiers:', tiersError.message)
      return false
    }
    
    console.log(`✅ Found ${tiers.length} discount tiers:`, tiers.map(t => t.name).join(', '))
    
    // Check if resource categories were created
    const { data: categories, error: categoriesError } = await supabase
      .from('resource_categories')
      .select('name')
    
    if (categoriesError) {
      console.error('❌ Failed to fetch resource categories:', categoriesError.message)
      return false
    }
    
    console.log(`✅ Found ${categories.length} resource categories:`, categories.map(c => c.name).join(', '))
    
    return true
  } catch (error) {
    console.error('❌ Verification error:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Setting up Partner Portal...\n')
  
  // Run migration
  const migrationSuccess = await runMigration()
  if (!migrationSuccess) {
    console.log('\n❌ Setup failed at migration step')
    process.exit(1)
  }
  
  console.log('')
  
  // Create test partner
  const partnerSuccess = await createTestPartner()
  if (!partnerSuccess) {
    console.log('\n⚠️  Setup completed with warnings (migration successful, but test partner creation failed)')
    process.exit(0)
  }
  
  console.log('')
  
  // Verify setup
  const verificationSuccess = await verifySetup()
  if (!verificationSuccess) {
    console.log('\n⚠️  Setup completed with warnings (some verification checks failed)')
    process.exit(0)
  }
  
  console.log('\n🎉 Partner Portal setup completed successfully!')
  console.log('\nNext steps:')
  console.log('1. Start your development server: npm run dev')
  console.log('2. Visit: http://localhost:5173/partners/login')
  console.log('3. Login with: test@partner.com / testpartner123')
  console.log('4. Explore the partner portal features')
}

main().catch(console.error)