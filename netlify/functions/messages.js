// Netlify function for client messages management
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
        const messageId = event.queryStringParameters?.id;
        const clientId = event.queryStringParameters?.client_id;
        const status = event.queryStringParameters?.status;
        
        let query = `
          SELECT m.*, l.name as client_name, l.company as client_company
          FROM messages m
          LEFT JOIN leads l ON m.client_id = l.id
        `;
        const params = [];
        const conditions = [];
        
        if (messageId) {
          conditions.push(`m.id = $${params.length + 1}`);
          params.push(messageId);
        }
        if (clientId) {
          conditions.push(`m.client_id = $${params.length + 1}`);
          params.push(clientId);
        }
        if (status) {
          conditions.push(`m.status = $${params.length + 1}`);
          params.push(status);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY m.created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            messages: messageId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newMessage = JSON.parse(event.body);
        
        // Create messages table if it doesn't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            client_id INTEGER REFERENCES leads(id),
            name VARCHAR(255),
            email VARCHAR(255),
            company VARCHAR(255),
            message TEXT NOT NULL,
            message_type VARCHAR(50) DEFAULT 'inquiry',
            priority VARCHAR(20) DEFAULT 'medium',
            status VARCHAR(50) DEFAULT 'unread',
            is_response BOOLEAN DEFAULT false,
            original_message_id INTEGER REFERENCES messages(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        const insertResult = await client.query(
          `INSERT INTO messages (client_id, name, email, company, message, message_type, priority, status, is_response, original_message_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING *`,
          [
            newMessage.client_id,
            newMessage.name,
            newMessage.email,
            newMessage.company,
            newMessage.message,
            newMessage.messageType || newMessage.message_type || 'inquiry',
            newMessage.priority || 'medium',
            newMessage.status || 'unread',
            newMessage.isResponse || newMessage.is_response || false,
            newMessage.originalMessageId || newMessage.original_message_id
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ message: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE messages 
           SET status = $1, priority = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3
           RETURNING *`,
          [
            updateData.status,
            updateData.priority,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Message ID required' })
          };
        }
        
        await client.query('DELETE FROM messages WHERE id = $1', [deleteId]);
        
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
    console.error('Messages API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};