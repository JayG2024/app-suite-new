// Netlify function for leads management
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
        // Get all leads or single lead
        const leadId = event.queryStringParameters?.id;
        
        if (leadId) {
          const result = await client.query(
            'SELECT * FROM leads WHERE id = $1',
            [leadId]
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ lead: result.rows[0] })
          };
        } else {
          const result = await client.query(
            'SELECT * FROM leads ORDER BY created_at DESC'
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ leads: result.rows })
          };
        }

      case 'POST':
        // Create new lead
        const newLead = JSON.parse(event.body);
        
        try {
          // Try with all columns first
          const insertResult = await client.query(
            `INSERT INTO leads (name, company, email, phone, status, value, source, notes, type, stage, probability, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
            [
              newLead.name,
              newLead.company,
              newLead.email,
              newLead.phone,
              newLead.status || newLead.stage || 'new',
              newLead.value || 0,
              newLead.source || 'direct',
              newLead.notes,
              newLead.type || 'standard',
              newLead.stage || 'new',
              newLead.probability || 10,
              newLead.assigned_to || null
            ]
          );
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ lead: insertResult.rows[0] })
          };
        } catch (error) {
          // If that fails, try with basic columns only
          console.log('Full lead insert failed, trying basic columns:', error.message);
          const insertResult = await client.query(
            `INSERT INTO leads (name, company, email, phone, status, value, source, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
              newLead.name,
              newLead.company,
              newLead.email,
              newLead.phone,
              newLead.status || 'new',
              newLead.value || 0,
              newLead.source || 'direct',
              newLead.notes
            ]
          );
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ lead: insertResult.rows[0] })
          };
        }

      case 'PUT':
        // Update lead
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE leads 
           SET name = $1, company = $2, email = $3, phone = $4, 
               status = $5, value = $6, source = $7, notes = $8,
               type = $9, stage = $10, probability = $11, assigned_to = $12,
               next_action = $13, next_action_date = $14,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $15
           RETURNING *`,
          [
            updateData.name,
            updateData.company,
            updateData.email,
            updateData.phone,
            updateData.status || updateData.stage,
            updateData.value || 0,
            updateData.source,
            updateData.notes,
            updateData.type || 'standard',
            updateData.stage || updateData.status || 'new',
            updateData.probability || 10,
            updateData.assigned_to || null,
            updateData.next_action || null,
            updateData.next_action_date || null,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ lead: updateResult.rows[0] })
        };

      case 'DELETE':
        // Delete lead
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Lead ID required' })
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
    console.error('Leads API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};