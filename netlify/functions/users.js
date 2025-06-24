// Netlify function for users management
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const client = await pool.connect();

  try {
    switch (event.httpMethod) {
      case 'GET':
        const userId = event.queryStringParameters?.id;
        
        if (userId) {
          const result = await client.query(
            'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
            [userId]
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ user: result.rows[0] })
          };
        } else {
          // Get all users (excluding password hash)
          const result = await client.query(
            'SELECT id, email, name, role, created_at FROM users ORDER BY name'
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ users: result.rows })
          };
        }

      case 'POST':
        // Create new user (admin only)
        const newUser = JSON.parse(event.body);
        
        // Check if email already exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [newUser.email]
        );
        
        if (existingUser.rows.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email already exists' })
          };
        }
        
        const insertResult = await client.query(
          `INSERT INTO users (email, name, role)
           VALUES ($1, $2, $3)
           RETURNING id, email, name, role, created_at`,
          [
            newUser.email,
            newUser.name,
            newUser.role || 'user'
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ user: insertResult.rows[0] })
        };

      case 'PUT':
        // Update user
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE users 
           SET name = $1, role = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3
           RETURNING id, email, name, role, created_at`,
          [
            updateData.name,
            updateData.role,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ user: updateResult.rows[0] })
        };

      case 'DELETE':
        // Delete user (be careful with this!)
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User ID required' })
          };
        }
        
        // Don't allow deleting admin users
        const userToDelete = await client.query(
          'SELECT email FROM users WHERE id = $1',
          [deleteId]
        );
        
        if (userToDelete.rows[0]?.email === 'jason@jaydus.ai' || 
            userToDelete.rows[0]?.email === 'almir@jaydus.ai') {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ error: 'Cannot delete admin users' })
          };
        }
        
        await client.query('DELETE FROM users WHERE id = $1', [deleteId]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Users API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};