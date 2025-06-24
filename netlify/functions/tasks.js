// Netlify function for tasks management
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
        const taskId = event.queryStringParameters?.id;
        const projectId = event.queryStringParameters?.project_id;
        
        let query = `
          SELECT t.*, u.name as assigned_to_name, p.name as project_name
          FROM tasks t
          LEFT JOIN users u ON t.assigned_to = u.id
          LEFT JOIN projects p ON t.project_id = p.id
        `;
        const params = [];
        
        if (taskId) {
          query += ' WHERE t.id = $1';
          params.push(taskId);
        } else if (projectId) {
          query += ' WHERE t.project_id = $1';
          params.push(projectId);
        }
        
        query += ' ORDER BY t.created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            tasks: taskId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newTask = JSON.parse(event.body);
        const insertResult = await client.query(
          `INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            newTask.title,
            newTask.description,
            newTask.project_id,
            newTask.assigned_to,
            newTask.status || 'todo',
            newTask.priority || 'medium',
            newTask.due_date
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ task: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        // If marking as completed, set completed_at
        const completedAt = updateData.status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
        
        const updateResult = await client.query(
          `UPDATE tasks 
           SET title = $1, description = $2, project_id = $3, assigned_to = $4,
               status = $5, priority = $6, due_date = $7,
               completed_at = ${completedAt},
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $8
           RETURNING *`,
          [
            updateData.title,
            updateData.description,
            updateData.project_id,
            updateData.assigned_to,
            updateData.status,
            updateData.priority,
            updateData.due_date,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ task: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Task ID required' })
          };
        }
        
        await client.query('DELETE FROM tasks WHERE id = $1', [deleteId]);
        
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
    console.error('Tasks API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};