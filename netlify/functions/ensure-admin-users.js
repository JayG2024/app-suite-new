// Ensure admin users exist in the database
import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pg;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Define admin users
    const adminUsers = [
      {
        email: 'jason@jaydus.ai',
        name: 'Jason Gordon',
        role: 'admin',
        password_hash: passwordHash
      },
      {
        email: 'almir@jaydus.ai',
        name: 'Almir',
        role: 'admin',
        password_hash: passwordHash
      }
    ];
    
    const results = [];
    
    for (const user of adminUsers) {
      try {
        // Check if user exists
        const existing = await client.query(
          'SELECT id, name FROM users WHERE email = $1',
          [user.email]
        );
        
        if (existing.rows.length > 0) {
          // Update existing user
          await client.query(
            `UPDATE users 
             SET name = $1, role = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP
             WHERE email = $4`,
            [user.name, user.role, user.password_hash, user.email]
          );
          results.push({ email: user.email, action: 'updated' });
        } else {
          // Insert new user
          await client.query(
            `INSERT INTO users (email, name, role, password_hash)
             VALUES ($1, $2, $3, $4)`,
            [user.email, user.name, user.role, user.password_hash]
          );
          results.push({ email: user.email, action: 'created' });
        }
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        results.push({ email: user.email, action: 'error', message: error.message });
      }
    }
    
    client.release();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Admin users processed',
        results
      })
    };
    
  } catch (error) {
    client.release();
    console.error('Admin users setup error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to ensure admin users',
        message: error.message
      })
    };
  }
};