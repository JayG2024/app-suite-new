import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

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

async function fixMissingProfiles() {
  console.log('🔧 Fixing missing profiles...\n')

  try {
    // Get all auth users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) throw usersError
    
    console.log(`Found ${users.length} auth users\n`)

    for (const user of users) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log(`Creating profile for ${user.email}...`)
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            role: ['jason@jaydus.ai', 'almir@jaydus.ai', 'jorge@jaydus.ai'].includes(user.email) ? 'admin' : 'user',
            created_at: user.created_at
          })

        if (insertError) {
          console.error(`  ❌ Error creating profile: ${insertError.message}`)
        } else {
          console.log(`  ✅ Profile created`)
        }
      } else if (profile) {
        console.log(`✓ Profile exists for ${user.email}`)
      }
    }

    console.log('\n✨ Profile sync complete!')

  } catch (error) {
    console.error('Error:', error)
  }
}

fixMissingProfiles()