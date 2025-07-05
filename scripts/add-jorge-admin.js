// Script to add Jorge@jaydus.ai as an admin user in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addJorgeAsAdmin() {
  try {
    // Check if Jorge already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', 'jorge@jaydus.ai')
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingUser) {
      // Update existing user to admin role
      const { data: updateResult, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('email', 'jorge@jaydus.ai')
        .select()
        .single();
      
      if (updateError) throw updateError;
      console.log('Updated Jorge to admin role:', updateResult);
    } else {
      // Insert new admin user
      const { data: insertResult, error: insertError } = await supabase
        .from('users')
        .insert([
          { email: 'jorge@jaydus.ai', name: 'Jorge', role: 'admin' }
        ])
        .select()
        .single();
      
      if (insertError) throw insertError;
      console.log('Added Jorge as new admin:', insertResult);
    }
    
    // Verify all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('role', 'admin')
      .order('name');
    
    if (adminError) throw adminError;
    
    console.log('\nAll admin users:');
    adminUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
    
  } catch (error) {
    console.error('Error adding Jorge as admin:', error);
  }
}

// Run the script
addJorgeAsAdmin();