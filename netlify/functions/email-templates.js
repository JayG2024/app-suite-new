// Netlify function for email templates management
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
        const templateId = event.queryStringParameters?.id;
        const category = event.queryStringParameters?.category;
        
        let query = 'SELECT * FROM email_templates';
        const params = [];
        const conditions = [];
        
        if (templateId) {
          conditions.push(`id = $${params.length + 1}`);
          params.push(templateId);
        }
        if (category) {
          conditions.push(`category = $${params.length + 1}`);
          params.push(category);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            templates: templateId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newTemplate = JSON.parse(event.body);
        
        const insertResult = await client.query(
          `INSERT INTO email_templates (name, category, subject, body_html, body_text, variables, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            newTemplate.name,
            newTemplate.category,
            newTemplate.subject,
            newTemplate.body_html,
            newTemplate.body_text,
            JSON.stringify(newTemplate.variables || []),
            newTemplate.created_by || 1 // Default to admin user
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ template: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE email_templates 
           SET name = $1, category = $2, subject = $3, body_html = $4, 
               body_text = $5, variables = $6, updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [
            updateData.name,
            updateData.category,
            updateData.subject,
            updateData.body_html,
            updateData.body_text,
            JSON.stringify(updateData.variables || []),
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ template: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Template ID required' })
          };
        }
        
        await client.query('DELETE FROM email_templates WHERE id = $1', [deleteId]);
        
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
    console.error('Email templates API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};