// API endpoint for marketing campaigns management
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
        return await getCampaigns(req, res, client);
      case 'POST':
        return await createCampaign(req, res, client);
      case 'PUT':
        return await updateCampaign(req, res, client);
      case 'DELETE':
        return await deleteCampaign(req, res, client);
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

async function getCampaigns(req, res, client) {
  try {
    const result = await client.query(`
      SELECT c.*, 
             u.name as created_by_name
      FROM marketing_campaigns c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.start_date DESC
    `);

    const campaigns = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description || '',
      status: row.status || 'planning',
      campaignType: row.campaign_type || 'general',
      platform: row.platform || '',
      startDate: row.start_date ? row.start_date.toISOString().split('T')[0] : null,
      endDate: row.end_date ? row.end_date.toISOString().split('T')[0] : null,
      budget: row.budget || 0,
      spent: row.spent || 0,
      leads: row.leads_generated || 0,
      conversions: row.conversions || 0,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      createdBy: row.created_by,
      createdByName: row.created_by_name || 'Unknown',
      createdDate: row.created_date,
      notes: row.notes || ''
    }));

    return res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}

async function createCampaign(req, res, client) {
  try {
    const {
      name,
      description,
      campaignType,
      platform,
      startDate,
      endDate,
      budget,
      createdBy,
      notes
    } = req.body;

    const result = await client.query(`
      INSERT INTO marketing_campaigns (
        name, description, campaign_type, platform, start_date, end_date,
        budget, created_by, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      name,
      description || '',
      campaignType || 'general',
      platform || '',
      startDate || null,
      endDate || null,
      budget || 0,
      createdBy || null,
      notes || ''
    ]);

    return res.status(201).json({ 
      success: true, 
      campaignId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
}

async function updateCampaign(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        name: 'name',
        description: 'description',
        status: 'status',
        campaignType: 'campaign_type',
        platform: 'platform',
        startDate: 'start_date',
        endDate: 'end_date',
        budget: 'budget',
        spent: 'spent',
        leads: 'leads_generated',
        conversions: 'conversions',
        clicks: 'clicks',
        impressions: 'impressions',
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

    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE marketing_campaigns 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({ error: 'Failed to update campaign' });
  }
}

async function deleteCampaign(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM marketing_campaigns WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return res.status(500).json({ error: 'Failed to delete campaign' });
  }
}