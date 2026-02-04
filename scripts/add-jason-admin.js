// Script to add jason@jaydus.ai as a super admin user in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addJasonAsAdmin() {
  try {
    console.log('Creating super admin account for jason@jaydus.ai...\n');

    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'jason@jaydus.ai',
      password: 'TempPassword123!', // You should change this after first login
      email_confirm: true,
      user_metadata: {
        name: 'Jason',
        role: 'admin'
      }
    });

    if (authError && authError.message !== 'User already registered') {
      throw authError;
    }

    const userId = authData?.user?.id;
    console.log('Auth user created/found:', userId);

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('email', 'jason@jaydus.ai')
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingProfile) {
      // Update existing profile to admin role
      const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          name: 'Jason',
          updated_at: new Date().toISOString() 
        })
        .eq('email', 'jason@jaydus.ai')
        .select()
        .single();
      
      if (updateError) throw updateError;
      console.log('✅ Updated Jason to admin role:', updateResult);
    } else if (userId) {
      // Insert new admin profile
      const { data: insertResult, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            email: 'jason@jaydus.ai', 
            name: 'Jason', 
            role: 'admin' 
          }
        ])
        .select()
        .single();
      
      if (insertError) throw insertError;
      console.log('✅ Added Jason as new admin:', insertResult);
    }
    
    // Verify all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('role', 'admin')
      .order('name');
    
    if (adminError) throw adminError;
    
    console.log('\n📋 All admin users:');
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    console.log('\n🔐 Login credentials:');
    console.log('   Email: jason@jaydus.ai');
    console.log('   Password: TempPassword123!');
    console.log('\n⚠️  Please change your password after first login!');
    
  } catch (error) {
    console.error('❌ Error adding Jason as admin:', error);
  }
}

// Run the script
addJasonAsAdmin();
