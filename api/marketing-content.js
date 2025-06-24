// API endpoint for marketing content management
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
        return await getContent(req, res, client);
      case 'POST':
        return await createContent(req, res, client);
      case 'PUT':
        return await updateContent(req, res, client);
      case 'DELETE':
        return await deleteContent(req, res, client);
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

async function getContent(req, res, client) {
  try {
    const result = await client.query(`
      SELECT c.*, 
             u.name as created_by_name,
             mc.name as campaign_name
      FROM marketing_content c
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN marketing_campaigns mc ON c.campaign_id = mc.id
      ORDER BY 
        CASE c.status
          WHEN 'scheduled' THEN 1
          WHEN 'draft' THEN 2
          WHEN 'published' THEN 3
        END,
        c.scheduled_date ASC NULLS LAST,
        c.created_date DESC
    `);

    const content = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content || '',
      contentType: row.content_type || 'blog',
      status: row.status || 'draft',
      platform: row.platform || '',
      scheduledDate: row.scheduled_date ? row.scheduled_date.toISOString().split('T')[0] : null,
      publishedDate: row.published_date ? row.published_date.toISOString().split('T')[0] : null,
      campaignId: row.campaign_id,
      campaignName: row.campaign_name || null,
      keywords: row.keywords ? JSON.parse(row.keywords) : [],
      metrics: {
        views: row.views || 0,
        clicks: row.clicks || 0,
        shares: row.shares || 0,
        engagement: row.engagement || 0
      },
      createdBy: row.created_by,
      createdByName: row.created_by_name || 'Unknown',
      createdDate: row.created_date,
      notes: row.notes || ''
    }));

    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}

async function createContent(req, res, client) {
  try {
    const {
      title,
      content,
      contentType,
      platform,
      scheduledDate,
      campaignId,
      keywords,
      createdBy,
      notes
    } = req.body;

    const result = await client.query(`
      INSERT INTO marketing_content (
        title, content, content_type, platform, scheduled_date, campaign_id,
        keywords, created_by, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      title,
      content || '',
      contentType || 'blog',
      platform || '',
      scheduledDate || null,
      campaignId || null,
      keywords ? JSON.stringify(keywords) : '[]',
      createdBy || null,
      notes || ''
    ]);

    return res.status(201).json({ 
      success: true, 
      contentId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return res.status(500).json({ error: 'Failed to create content' });
  }
}

async function updateContent(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        title: 'title',
        content: 'content',
        status: 'status',
        contentType: 'content_type',
        platform: 'platform',
        scheduledDate: 'scheduled_date',
        publishedDate: 'published_date',
        campaignId: 'campaign_id',
        keywords: 'keywords',
        views: 'views',
        clicks: 'clicks',
        shares: 'shares',
        engagement: 'engagement',
        notes: 'notes'
      }[key];

      if (dbField) {
        if (key === 'keywords') {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    // If marking as published, set published_date
    if (updates.status === 'published' && !updates.publishedDate) {
      updateFields.push(`published_date = NOW()`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE marketing_content 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({ error: 'Failed to update content' });
  }
}

async function deleteContent(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM marketing_content WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ error: 'Failed to delete content' });
  }
}