// Netlify function for expenses management
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
        const expenseId = event.queryStringParameters?.id;
        const projectId = event.queryStringParameters?.project_id;
        const category = event.queryStringParameters?.category;
        
        let query = `
          SELECT e.*, p.name as project_name, u.name as created_by_name
          FROM expenses e
          LEFT JOIN projects p ON e.project_id = p.id
          LEFT JOIN users u ON e.created_by = u.id
        `;
        const params = [];
        const conditions = [];
        
        if (expenseId) {
          conditions.push(`e.id = $${params.length + 1}`);
          params.push(expenseId);
        }
        if (projectId) {
          conditions.push(`e.project_id = $${params.length + 1}`);
          params.push(projectId);
        }
        if (category) {
          conditions.push(`e.category = $${params.length + 1}`);
          params.push(category);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY e.date DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            expenses: expenseId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newExpense = JSON.parse(event.body);
        
        const insertResult = await client.query(
          `INSERT INTO expenses (project_id, category, description, amount, date, receipt_url, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            newExpense.project_id,
            newExpense.category,
            newExpense.description,
            newExpense.amount,
            newExpense.date || new Date().toISOString().split('T')[0],
            newExpense.receipt_url,
            newExpense.created_by || 1 // Default to admin user
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ expense: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE expenses 
           SET project_id = $1, category = $2, description = $3, 
               amount = $4, date = $5, receipt_url = $6,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [
            updateData.project_id,
            updateData.category,
            updateData.description,
            updateData.amount,
            updateData.date,
            updateData.receipt_url,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ expense: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Expense ID required' })
          };
        }
        
        await client.query('DELETE FROM expenses WHERE id = $1', [deleteId]);
        
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
    console.error('Expenses API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};