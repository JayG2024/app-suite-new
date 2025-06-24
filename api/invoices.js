// API endpoint for invoice management
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
        return await getInvoices(req, res, client);
      case 'POST':
        return await createInvoice(req, res, client);
      case 'PUT':
        return await updateInvoice(req, res, client);
      case 'DELETE':
        return await deleteInvoice(req, res, client);
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

async function getInvoices(req, res, client) {
  try {
    const result = await client.query(`
      SELECT i.*, 
             p.project_name,
             l.company_name as client_company,
             l.contact_name as client_name,
             l.email as client_email
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN leads l ON p.lead_id = l.id
      ORDER BY i.created_date DESC
    `);

    const invoices = result.rows.map(row => ({
      id: row.id.toString(),
      invoiceNumber: row.invoice_number || `INV-${row.id.toString().padStart(4, '0')}`,
      clientName: row.client_name || 'Unknown Client',
      clientCompany: row.client_company || 'Unknown Company',
      clientEmail: row.client_email || '',
      projectName: row.project_name || 'General Services',
      projectId: row.project_id,
      amount: row.amount || 0,
      status: row.status || 'draft',
      description: row.description || '',
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
      issueDate: row.issue_date ? row.issue_date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paidDate: row.paid_date ? row.paid_date.toISOString().split('T')[0] : null,
      notes: row.notes || '',
      createdDate: row.created_date.toISOString().split('T')[0],
      taxAmount: row.tax_amount || 0,
      totalAmount: (row.amount || 0) + (row.tax_amount || 0)
    }));

    return res.status(200).json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
}

async function createInvoice(req, res, client) {
  try {
    const {
      clientName,
      clientCompany,
      clientEmail,
      projectName,
      projectId,
      amount,
      description,
      dueDate,
      notes,
      taxAmount
    } = req.body;

    // Generate invoice number
    const countResult = await client.query('SELECT COUNT(*) as count FROM invoices');
    const invoiceNumber = `INV-${(parseInt(countResult.rows[0].count) + 1).toString().padStart(4, '0')}`;

    const result = await client.query(`
      INSERT INTO invoices (
        invoice_number, client_name, client_company, client_email,
        project_name, project_id, amount, description, due_date,
        notes, tax_amount, status, issue_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      invoiceNumber,
      clientName,
      clientCompany || '',
      clientEmail || '',
      projectName || 'General Services',
      projectId || null,
      amount || 0,
      description || '',
      dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes || '',
      taxAmount || 0,
      'draft',
      new Date()
    ]);

    return res.status(201).json({ 
      success: true, 
      invoiceId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}

async function updateInvoice(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        clientName: 'client_name',
        clientCompany: 'client_company',
        clientEmail: 'client_email',
        projectName: 'project_name',
        projectId: 'project_id',
        amount: 'amount',
        status: 'status',
        description: 'description',
        dueDate: 'due_date',
        paidDate: 'paid_date',
        notes: 'notes',
        taxAmount: 'tax_amount'
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

    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE invoices 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Failed to update invoice' });
  }
}

async function deleteInvoice(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM invoices WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ error: 'Failed to delete invoice' });
  }
}