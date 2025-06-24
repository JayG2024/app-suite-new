// API endpoint for client communication management
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
        return await getMessages(req, res, client);
      case 'POST':
        return await createMessage(req, res, client);
      case 'PUT':
        return await updateMessage(req, res, client);
      case 'DELETE':
        return await deleteMessage(req, res, client);
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

async function getMessages(req, res, client) {
  try {
    const { clientId } = req.query;

    let query = `
      SELECT cm.*, 
             l.company_name as client_company,
             l.contact_name as client_name,
             l.email as client_email,
             l.phone as client_phone,
             p.project_name as project_name,
             p.status as project_status
      FROM contact_messages cm
      LEFT JOIN leads l ON cm.email = l.email
      LEFT JOIN projects p ON l.id = p.lead_id
    `;
    
    let params = [];
    
    if (clientId) {
      query += ` WHERE cm.id = $1`;
      params = [clientId];
    }
    
    query += ` ORDER BY cm.created_date DESC`;

    const result = await client.query(query, params);

    const messages = result.rows.map(row => ({
      id: row.id.toString(),
      clientId: row.id.toString(),
      clientName: row.client_name || row.name,
      clientCompany: row.client_company || row.company || 'Unknown Company',
      clientEmail: row.client_email || row.email,
      clientPhone: row.client_phone,
      projectName: row.project_name || 'No Project Assigned',
      projectStatus: row.project_status || 'pending',
      messageType: row.message_type || 'general',
      status: row.status || 'new',
      priority: row.priority || 'medium',
      content: row.message,
      notes: row.notes || '',
      timestamp: row.created_date,
      respondedDate: row.responded_date,
      lastContact: getTimeAgo(row.created_date),
      unreadMessages: row.status === 'new' ? 1 : 0
    }));

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function createMessage(req, res, client) {
  try {
    const {
      name,
      email,
      company,
      message,
      messageType,
      priority,
      isResponse,
      originalMessageId
    } = req.body;

    const result = await client.query(`
      INSERT INTO contact_messages (
        name, email, company, message, message_type, priority,
        status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      name,
      email,
      company || '',
      message,
      messageType || 'general',
      priority || 'medium',
      isResponse ? 'responded' : 'new',
      isResponse ? `Response to message ${originalMessageId}` : ''
    ]);

    // If this is a response, update the original message
    if (isResponse && originalMessageId) {
      await client.query(`
        UPDATE contact_messages 
        SET status = 'responded', responded_date = NOW()
        WHERE id = $1
      `, [originalMessageId]);
    }

    return res.status(201).json({ 
      success: true, 
      messageId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ error: 'Failed to create message' });
  }
}

async function updateMessage(req, res, client) {
  try {
    const { id } = req.query;
    const { status, priority, notes } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (priority) {
      updateFields.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }

    if (status === 'responded') {
      updateFields.push(`responded_date = NOW()`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);

    const query = `
      UPDATE contact_messages 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({ error: 'Failed to update message' });
  }
}

async function deleteMessage(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM contact_messages WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}