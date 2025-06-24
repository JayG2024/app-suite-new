// Netlify function for clients management
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
        // For now, we'll use the leads table as our clients table
        // In the future, we can create a dedicated clients table
        const clientId = event.queryStringParameters?.id;
        
        if (clientId) {
          const result = await client.query(
            `SELECT l.*, u.name as assigned_to_name 
             FROM leads l
             LEFT JOIN users u ON l.assigned_to = u.id
             WHERE l.id = $1`,
            [clientId]
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ client: result.rows[0] })
          };
        } else {
          const result = await client.query(
            `SELECT l.*, u.name as assigned_to_name,
                    COUNT(DISTINCT p.id) as total_projects,
                    COALESCE(SUM(p.budget), 0) as total_revenue
             FROM leads l
             LEFT JOIN users u ON l.assigned_to = u.id
             LEFT JOIN projects p ON p.client_id = l.id
             GROUP BY l.id, u.name
             ORDER BY l.created_at DESC`
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ clients: result.rows })
          };
        }

      case 'POST':
        const newClient = JSON.parse(event.body);
        
        // Extract metadata fields
        const metadata = newClient.metadata || {};
        
        const insertResult = await client.query(
          `INSERT INTO leads (
            name, company, email, phone, status, stage, source, 
            notes, assigned_to, type, value, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [
            newClient.name,
            newClient.company || newClient.name,
            newClient.email,
            newClient.phone,
            newClient.status || 'new',
            newClient.stage || 'lead',
            newClient.source || 'direct',
            newClient.notes,
            newClient.assigned_to,
            newClient.type || 'standard',
            newClient.value || 0,
            JSON.stringify(metadata) // Store additional data as JSON
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ client: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id || event.queryStringParameters?.id;
        
        if (!updateId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Client ID required' })
          };
        }
        
        const updateResult = await client.query(
          `UPDATE leads 
           SET name = $1, company = $2, email = $3, phone = $4,
               status = $5, notes = $6, assigned_to = $7,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $8
           RETURNING *`,
          [
            updateData.name,
            updateData.company,
            updateData.email,
            updateData.phone,
            updateData.status,
            updateData.notes,
            updateData.assigned_to,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ client: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Client ID required' })
          };
        }
        
        // Check if client has active projects
        const projectCheck = await client.query(
          'SELECT COUNT(*) FROM projects WHERE client_id = $1',
          [deleteId]
        );
        
        if (parseInt(projectCheck.rows[0].count) > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Cannot delete client with active projects. Archive instead.' 
            })
          };
        }
        
        await client.query('DELETE FROM leads WHERE id = $1', [deleteId]);
        
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
    console.error('Clients API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  } finally {
    client.release();
  }
};