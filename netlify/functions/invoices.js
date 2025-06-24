// Netlify function for invoices management
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
        const invoiceId = event.queryStringParameters?.id;
        const projectId = event.queryStringParameters?.project_id;
        const status = event.queryStringParameters?.status;
        
        let query = `
          SELECT i.*, p.name as project_name, l.name as client_name, l.company as client_company
          FROM invoices i
          LEFT JOIN projects p ON i.project_id = p.id
          LEFT JOIN leads l ON i.client_id = l.id
        `;
        const params = [];
        const conditions = [];
        
        if (invoiceId) {
          conditions.push(`i.id = $${params.length + 1}`);
          params.push(invoiceId);
        }
        if (projectId) {
          conditions.push(`i.project_id = $${params.length + 1}`);
          params.push(projectId);
        }
        if (status) {
          conditions.push(`i.status = $${params.length + 1}`);
          params.push(status);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY i.created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            invoices: invoiceId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newInvoice = JSON.parse(event.body);
        
        // Generate invoice number if not provided
        const invoiceNumber = newInvoice.invoice_number || 
          `INV-${Date.now().toString().slice(-6)}`;
        
        const insertResult = await client.query(
          `INSERT INTO invoices (invoice_number, project_id, client_id, amount, status, due_date, items)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            invoiceNumber,
            newInvoice.project_id,
            newInvoice.client_id,
            newInvoice.amount,
            newInvoice.status || 'draft',
            newInvoice.due_date,
            JSON.stringify(newInvoice.items || [])
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ invoice: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE invoices 
           SET project_id = $1, client_id = $2, amount = $3, status = $4, 
               due_date = $5, paid_date = $6, items = $7,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $8
           RETURNING *`,
          [
            updateData.project_id,
            updateData.client_id,
            updateData.amount,
            updateData.status,
            updateData.due_date,
            updateData.paid_date,
            JSON.stringify(updateData.items || []),
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ invoice: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invoice ID required' })
          };
        }
        
        await client.query('DELETE FROM invoices WHERE id = $1', [deleteId]);
        
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
    console.error('Invoices API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};