#!/usr/bin/env node

/**
 * Database Diagnostic Script
 * Checks the current state of Supabase database and identifies issues
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function diagnoseDatabase() {
  console.log('🔍 Diagnosing App Suite Database...\n')
  
  try {
    // Test 1: Check authentication
    console.log('1️⃣ Testing Authentication...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jason@jaydus.ai',
      password: 'AppSuite2025!'
    })
    
    if (authError) {
      console.error('   ❌ Auth failed:', authError.message)
      return
    }
    
    console.log('   ✅ Authentication working')
    console.log('   👤 User:', authData.user.email)
    
    // Test 2: Check profiles table
    console.log('\n2️⃣ Checking Profiles Table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('   ❌ Profiles query failed:', profilesError.message)
    } else {
      console.log(`   ✅ Found ${profiles.length} profiles`)
      profiles.forEach(profile => {
        console.log(`      - ${profile.name} (${profile.email}) - ${profile.role}`)
      })
    }
    
    // Test 3: Check leads table
    console.log('\n3️⃣ Checking Leads Table...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (leadsError) {
      console.error('   ❌ Leads query failed:', leadsError.message)
    } else {
      console.log(`   ✅ Found ${leads.length} leads`)
      if (leads.length > 0) {
        console.log('   📊 Recent leads:')
        leads.slice(0, 5).forEach(lead => {
          console.log(`      - ${lead.name} (${lead.company}) - ${lead.status} - $${lead.value || 0}`)
        })
      }
    }
    
    // Test 4: Check projects table
    console.log('\n4️⃣ Checking Projects Table...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (projectsError) {
      console.error('   ❌ Projects query failed:', projectsError.message)
    } else {
      console.log(`   ✅ Found ${projects.length} projects`)
      if (projects.length > 0) {
        console.log('   📁 Recent projects:')
        projects.slice(0, 5).forEach(project => {
          console.log(`      - ${project.name} - ${project.status} - ${project.progress}%`)
        })
      }
    }
    
    // Test 5: Check tasks table
    console.log('\n5️⃣ Checking Tasks Table...')
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (tasksError) {
      console.error('   ❌ Tasks query failed:', tasksError.message)
    } else {
      console.log(`   ✅ Found ${tasks.length} tasks`)
    }
    
    // Test 6: Check RLS policies
    console.log('\n6️⃣ Checking Row Level Security...')
    try {
      const { data: rlsPolicies, error: rlsError } = await supabase
        .rpc('get_rls_policies')
      
      if (rlsError) {
        console.log('   ⚠️  Could not check RLS policies (this is normal)')
      } else {
        console.log('   ✅ RLS policies configured')
      }
    } catch (error) {
      console.log('   ⚠️  Could not check RLS policies (this is normal)')
    }
    
    // Test 7: Check API endpoints
    console.log('\n7️⃣ Testing API Endpoints...')
    
    // Test leads API
    try {
      const response = await fetch(`${process.env.VITE_SUPABASE_URL?.replace('/rest/v1', '')}/api/leads`, {
        headers: {
          'Authorization': `Bearer ${authData.session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('   ✅ Leads API working')
      } else {
        console.log(`   ⚠️  Leads API returned ${response.status}`)
      }
    } catch (apiError) {
      console.log('   ⚠️  Leads API not accessible (may be local development)')
    }
    
    // Summary
    console.log('\n📋 Summary:')
    console.log(`   - Profiles: ${profiles?.length || 0}`)
    console.log(`   - Leads: ${leads?.length || 0}`)
    console.log(`   - Projects: ${projects?.length || 0}`)
    console.log(`   - Tasks: ${tasks?.length || 0}`)
    
    if ((leads?.length || 0) === 0 && (projects?.length || 0) === 0) {
      console.log('\n⚠️  ISSUE DETECTED: No data found in leads or projects tables')
      console.log('   This suggests data is being deleted or not properly saved')
      console.log('\n🔧 Recommended Actions:')
      console.log('   1. Check if data is being saved to localStorage instead of database')
      console.log('   2. Verify API endpoints are properly configured')
      console.log('   3. Check for any data cleanup scripts running')
      console.log('   4. Ensure RLS policies allow proper access')
    } else {
      console.log('\n✅ Database appears to be working correctly')
    }
    
    // Sign out
    await supabase.auth.signOut()
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

diagnoseDatabase() 