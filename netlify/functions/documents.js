// Netlify function for documents management
const { Pool } = require('pg');

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

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const client = await pool.connect();

  try {
    switch (event.httpMethod) {
      case 'GET':
        const documentId = event.queryStringParameters?.id;
        const projectId = event.queryStringParameters?.project_id;
        const clientId = event.queryStringParameters?.client_id;
        const type = event.queryStringParameters?.type;
        
        let query = `
          SELECT d.*, p.name as project_name, l.name as client_name, u.name as uploaded_by_name
          FROM documents d
          LEFT JOIN projects p ON d.project_id = p.id
          LEFT JOIN leads l ON d.client_id = l.id
          LEFT JOIN users u ON d.uploaded_by = u.id
        `;
        const params = [];
        const conditions = [];
        
        if (documentId) {
          conditions.push(`d.id = $${params.length + 1}`);
          params.push(documentId);
        }
        if (projectId) {
          conditions.push(`d.project_id = $${params.length + 1}`);
          params.push(projectId);
        }
        if (clientId) {
          conditions.push(`d.client_id = $${params.length + 1}`);
          params.push(clientId);
        }
        if (type) {
          conditions.push(`d.type = $${params.length + 1}`);
          params.push(type);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY d.created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            documents: documentId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newDocument = JSON.parse(event.body);
        
        const insertResult = await client.query(
          `INSERT INTO documents (name, type, url, project_id, client_id, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            newDocument.name,
            newDocument.type,
            newDocument.url,
            newDocument.project_id,
            newDocument.client_id,
            newDocument.uploaded_by || 1 // Default to admin user
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ document: insertResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Document ID required' })
          };
        }
        
        await client.query('DELETE FROM documents WHERE id = $1', [deleteId]);
        
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
    console.error('Documents API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};