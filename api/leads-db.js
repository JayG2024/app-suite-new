// API endpoint for database-backed leads management
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
        return await getLeads(req, res, client);
      case 'POST':
        return await createLead(req, res, client);
      case 'PUT':
        return await updateLead(req, res, client);
      case 'DELETE':
        return await deleteLead(req, res, client);
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

async function getLeads(req, res, client) {
  try {
    const result = await client.query(`
      SELECT l.*, 
             u1.name as assigned_to_name,
             u2.name as created_by_name
      FROM leads l
      LEFT JOIN users u1 ON l.assigned_to = u1.id
      LEFT JOIN users u2 ON l.created_by = u2.id
      ORDER BY l.created_date DESC
    `);

    const leads = result.rows.map(row => ({
      id: row.id.toString(),
      company: row.company_name,
      contact: row.contact_name,
      email: row.email,
      phone: row.phone || '',
      value: row.estimated_value || 0,
      type: row.project_type || 'standard',
      stage: row.status || 'lead',
      probability: row.probability || 25,
      nextAction: row.next_action || 'Initial contact',
      nextActionDate: row.next_action_date ? row.next_action_date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      source: row.source || 'website',
      notes: row.notes || '',
      createdDate: row.created_date.toISOString().split('T')[0],
      assignedTo: row.assigned_to,
      assignedToName: row.assigned_to_name,
      createdBy: row.created_by,
      createdByName: row.created_by_name
    }));

    return res.status(200).json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

async function createLead(req, res, client) {
  try {
    const {
      company,
      contact,
      email,
      phone,
      type,
      source,
      notes,
      assignedTo,
      createdBy
    } = req.body;

    const baseValues = {
      standard: 5000,
      "ai-enhanced": 7500,
      enterprise: 10000
    };

    const result = await client.query(`
      INSERT INTO leads (
        company_name, contact_name, email, phone, project_type, 
        estimated_value, source, notes, assigned_to, created_by,
        next_action, next_action_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      company,
      contact,
      email,
      phone || '',
      type,
      baseValues[type] || 5000,
      source,
      notes || '',
      assignedTo || null,
      createdBy || null,
      'Initial contact',
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    ]);

    return res.status(201).json({ 
      success: true, 
      leadId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ error: 'Failed to create lead' });
  }
}

async function updateLead(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        company: 'company_name',
        contact: 'contact_name',
        email: 'email',
        phone: 'phone',
        type: 'project_type',
        value: 'estimated_value',
        stage: 'status',
        probability: 'probability',
        nextAction: 'next_action',
        nextActionDate: 'next_action_date',
        source: 'source',
        notes: 'notes',
        assignedTo: 'assigned_to'
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
      UPDATE leads 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({ error: 'Failed to update lead' });
  }
}

async function deleteLead(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM leads WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
}