// Script to add Jorge@jaydus.ai as an admin user
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addJorgeAsAdmin() {
  const client = await pool.connect();
  
  try {
    // Check if Jorge already exists
    const existingUser = await client.query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      ['jorge@jaydus.ai']
    );
    
    if (existingUser.rows.length > 0) {
      // Update existing user to admin role
      const updateResult = await client.query(
        `UPDATE users 
         SET role = 'admin', updated_at = CURRENT_TIMESTAMP
         WHERE email = $1
         RETURNING id, email, name, role`,
        ['jorge@jaydus.ai']
      );
      console.log('Updated Jorge to admin role:', updateResult.rows[0]);
    } else {
      // Insert new admin user
      const insertResult = await client.query(
        `INSERT INTO users (email, name, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, role, created_at`,
        ['jorge@jaydus.ai', 'Jorge', 'admin']
      );
      console.log('Added Jorge as new admin:', insertResult.rows[0]);
    }
    
    // Verify all admin users
    const adminUsers = await client.query(
      'SELECT id, email, name, role FROM users WHERE role = $1 ORDER BY name',
      ['admin']
    );
    
    console.log('\nAll admin users:');
    adminUsers.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
    
  } catch (error) {
    console.error('Error adding Jorge as admin:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
addJorgeAsAdmin();