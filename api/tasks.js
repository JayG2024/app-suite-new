// API endpoint for task management
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables
dotenv.config({ path: '.env.local' });

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const client = await pool.connect();

  try {
    switch (req.method) {
      case 'GET':
        return await getTasks(req, res, client);
      case 'POST':
        return await createTask(req, res, client);
      case 'PUT':
        return await updateTask(req, res, client);
      case 'DELETE':
        return await deleteTask(req, res, client);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

async function getTasks(req, res, client) {
  try {
    const result = await client.query(`
      SELECT t.*, 
             u1.name as assigned_to_name,
             u2.name as created_by_name,
             p.project_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY 
        CASE 
          WHEN t.priority = 'high' THEN 1
          WHEN t.priority = 'medium' THEN 2
          WHEN t.priority = 'low' THEN 3
        END,
        t.due_date ASC NULLS LAST,
        t.created_date DESC
    `);

    const tasks = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description || '',
      status: row.status || 'todo',
      priority: row.priority || 'medium',
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
      estimatedHours: row.estimated_hours || 0,
      actualHours: row.actual_hours || 0,
      projectName: row.project_name || null,
      projectId: row.project_id,
      assignedTo: row.assigned_to,
      assignedToName: row.assigned_to_name || 'Unassigned',
      createdBy: row.created_by,
      createdByName: row.created_by_name || 'Unknown',
      createdDate: row.created_date,
      completedDate: row.completed_date,
      tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
      notes: row.notes || ''
    }));

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function createTask(req, res, client) {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedHours,
      projectId,
      assignedTo,
      createdBy,
      tags,
      notes
    } = req.body;

    const result = await client.query(`
      INSERT INTO tasks (
        title, description, status, priority, due_date, estimated_hours,
        project_id, assigned_to, created_by, tags, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      title,
      description || '',
      status || 'todo',
      priority || 'medium',
      dueDate || null,
      estimatedHours || 0,
      projectId || null,
      assignedTo || null,
      createdBy || null,
      tags ? JSON.stringify(tags) : '[]',
      notes || ''
    ]);

    return res.status(201).json({ 
      success: true, 
      taskId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

async function updateTask(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        title: 'title',
        description: 'description',
        status: 'status',
        priority: 'priority',
        dueDate: 'due_date',
        estimatedHours: 'estimated_hours',
        actualHours: 'actual_hours',
        projectId: 'project_id',
        assignedTo: 'assigned_to',
        tags: 'tags',
        notes: 'notes'
      }[key];

      if (dbField) {
        if (key === 'tags') {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    // If marking as completed, set completed_date
    if (updates.status === 'completed') {
      updateFields.push(`completed_date = NOW()`);
    } else if (updates.status && updates.status !== 'completed') {
      updateFields.push(`completed_date = NULL`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE tasks 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
}

async function deleteTask(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM tasks WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}