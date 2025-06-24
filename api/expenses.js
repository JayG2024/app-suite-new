// API endpoint for expense management
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
        return await getExpenses(req, res, client);
      case 'POST':
        return await createExpense(req, res, client);
      case 'PUT':
        return await updateExpense(req, res, client);
      case 'DELETE':
        return await deleteExpense(req, res, client);
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

async function getExpenses(req, res, client) {
  try {
    const result = await client.query(`
      SELECT e.*, 
             u.name as created_by_name,
             p.project_name
      FROM expenses e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN projects p ON e.project_id = p.id
      ORDER BY e.expense_date DESC
    `);

    const expenses = result.rows.map(row => ({
      id: row.id.toString(),
      description: row.description || '',
      amount: row.amount || 0,
      category: row.category || 'general',
      subcategory: row.subcategory || '',
      vendor: row.vendor || '',
      projectName: row.project_name || null,
      projectId: row.project_id,
      expenseDate: row.expense_date ? row.expense_date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      receipt: row.receipt_url || '',
      notes: row.notes || '',
      status: row.status || 'pending',
      recurring: row.is_recurring || false,
      recurringFrequency: row.recurring_frequency || null,
      createdBy: row.created_by,
      createdByName: row.created_by_name || 'Unknown',
      createdDate: row.created_date.toISOString().split('T')[0],
      taxDeductible: row.tax_deductible || false
    }));

    return res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

async function createExpense(req, res, client) {
  try {
    const {
      description,
      amount,
      category,
      subcategory,
      vendor,
      projectId,
      expenseDate,
      notes,
      status,
      recurring,
      recurringFrequency,
      createdBy,
      taxDeductible
    } = req.body;

    const result = await client.query(`
      INSERT INTO expenses (
        description, amount, category, subcategory, vendor,
        project_id, expense_date, notes, status, is_recurring,
        recurring_frequency, created_by, tax_deductible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      description,
      amount || 0,
      category || 'general',
      subcategory || '',
      vendor || '',
      projectId || null,
      expenseDate || new Date(),
      notes || '',
      status || 'pending',
      recurring || false,
      recurringFrequency || null,
      createdBy || null,
      taxDeductible || false
    ]);

    return res.status(201).json({ 
      success: true, 
      expenseId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ error: 'Failed to create expense' });
  }
}

async function updateExpense(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        description: 'description',
        amount: 'amount',
        category: 'category',
        subcategory: 'subcategory',
        vendor: 'vendor',
        projectId: 'project_id',
        expenseDate: 'expense_date',
        notes: 'notes',
        status: 'status',
        recurring: 'is_recurring',
        recurringFrequency: 'recurring_frequency',
        taxDeductible: 'tax_deductible'
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
      UPDATE expenses 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ error: 'Failed to update expense' });
  }
}

async function deleteExpense(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM expenses WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ error: 'Failed to delete expense' });
  }
}