import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('🧪 Testing Supabase connection...\n')
  
  try {
    // Test 1: Auth
    console.log('Testing authentication...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'jason@jaydus.ai',
      password: 'AppSuite2025!'
    })
    
    if (error) {
      console.error('❌ Auth failed:', error.message)
    } else {
      console.log('✅ Auth successful!')
      console.log('   User:', data.user.email)
      
      // Test 2: Profile query
      console.log('\nTesting database...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('❌ Profile query failed:', profileError.message)
        console.log('\n⚠️  Run the migration SQL first!')
      } else {
        console.log('✅ Database working!')
        console.log('   Profile:', profile)
      }
      
      // Sign out
      await supabase.auth.signOut()
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testConnection()