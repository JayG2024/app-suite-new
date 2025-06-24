// API endpoint for database-backed projects management
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
        return await getProjects(req, res, client);
      case 'POST':
        return await createProject(req, res, client);
      case 'PUT':
        return await updateProject(req, res, client);
      case 'DELETE':
        return await deleteProject(req, res, client);
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

async function getProjects(req, res, client) {
  try {
    const result = await client.query(`
      SELECT p.*, 
             u1.name as assigned_to_name,
             u2.name as created_by_name,
             l.company_name as client_company_name
      FROM projects p
      LEFT JOIN users u1 ON p.assigned_to = u1.id
      LEFT JOIN users u2 ON p.created_by = u2.id
      LEFT JOIN leads l ON p.lead_id = l.id
      ORDER BY p.created_date DESC
    `);

    const projects = result.rows.map(row => ({
      id: row.id.toString(),
      clientName: row.client_company || row.client_company_name || 'Unknown Client',
      projectName: row.project_name || 'Untitled Project',
      type: row.project_type || 'standard',
      price: row.estimated_value || 0,
      actualPrice: row.actual_value,
      status: row.status || 'planning',
      progress: row.progress_percentage || 0,
      startDate: row.start_date ? row.start_date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      deadline: row.deadline ? row.deadline.toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completionDate: row.completion_date ? row.completion_date.toISOString().split('T')[0] : null,
      developer: row.assigned_to_name || 'Unassigned',
      assignedTo: row.assigned_to,
      lastUpdate: row.updated_date ? getTimeAgo(row.updated_date) : 'Recently',
      notes: row.notes || '',
      leadId: row.lead_id,
      createdBy: row.created_by,
      createdByName: row.created_by_name,
      tasks: {
        total: 20, // TODO: Implement task tracking
        completed: Math.floor(row.progress_percentage / 5) || 0
      }
    }));

    return res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

async function createProject(req, res, client) {
  try {
    const {
      projectName,
      clientName,
      type,
      estimatedValue,
      startDate,
      deadline,
      assignedTo,
      createdBy,
      leadId,
      notes
    } = req.body;

    const result = await client.query(`
      INSERT INTO projects (
        project_name, client_company, project_type, estimated_value,
        start_date, deadline, assigned_to, created_by, lead_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      projectName,
      clientName,
      type,
      estimatedValue || 5000,
      startDate || new Date(),
      deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedTo || null,
      createdBy || null,
      leadId || null,
      notes || ''
    ]);

    return res.status(201).json({ 
      success: true, 
      projectId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
}

async function updateProject(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        projectName: 'project_name',
        clientName: 'client_company',
        type: 'project_type',
        price: 'estimated_value',
        actualPrice: 'actual_value',
        status: 'status',
        progress: 'progress_percentage',
        startDate: 'start_date',
        deadline: 'deadline',
        completionDate: 'completion_date',
        assignedTo: 'assigned_to',
        notes: 'notes'
      }[key];

      if (dbField) {
        updateFields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Add updated_date
    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
}

async function deleteProject(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM projects WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}