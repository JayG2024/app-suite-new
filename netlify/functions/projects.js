// Netlify function for projects management
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
        // Get all projects with client info
        const projectId = event.queryStringParameters?.id;
        
        if (projectId) {
          const result = await client.query(
            `SELECT p.*, l.name as client_name, l.company as client_company 
             FROM projects p
             LEFT JOIN leads l ON p.client_id = l.id
             WHERE p.id = $1`,
            [projectId]
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ project: result.rows[0] })
          };
        } else {
          const result = await client.query(
            `SELECT p.*, l.name as client_name, l.company as client_company,
                    COUNT(DISTINCT t.id) as total_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks
             FROM projects p
             LEFT JOIN leads l ON p.client_id = l.id
             LEFT JOIN tasks t ON p.id = t.project_id
             GROUP BY p.id, l.name, l.company
             ORDER BY p.created_at DESC`
          );
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ projects: result.rows })
          };
        }

      case 'POST':
        // Create new project
        const newProject = JSON.parse(event.body);
        const insertResult = await client.query(
          `INSERT INTO projects (name, client_id, status, progress, start_date, end_date, budget, description, assigned_to)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [
            newProject.name,
            newProject.client_id,
            newProject.status || 'planning',
            newProject.progress || 0,
            newProject.start_date,
            newProject.end_date,
            newProject.budget,
            newProject.description,
            newProject.assigned_to
          ]
        );
        
        // Log activity
        await client.query(
          `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
           VALUES ($1, $2, $3, $4, $5)`,
          [1, 'created', 'project', insertResult.rows[0].id, { name: newProject.name }]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ project: insertResult.rows[0] })
        };

      case 'PUT':
        // Update project
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE projects 
           SET name = $1, client_id = $2, status = $3, progress = $4,
               start_date = $5, end_date = $6, budget = $7, description = $8,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $9
           RETURNING *`,
          [
            updateData.name,
            updateData.client_id,
            updateData.status,
            updateData.progress,
            updateData.start_date,
            updateData.end_date,
            updateData.budget,
            updateData.description,
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ project: updateResult.rows[0] })
        };

      case 'DELETE':
        // Delete project
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Project ID required' })
          };
        }
        
        // Delete related tasks first
        await client.query('DELETE FROM tasks WHERE project_id = $1', [deleteId]);
        await client.query('DELETE FROM projects WHERE id = $1', [deleteId]);
        
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
    console.error('Projects API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};