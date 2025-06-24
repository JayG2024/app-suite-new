// Netlify function for campaigns management
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
        const campaignId = event.queryStringParameters?.id;
        const status = event.queryStringParameters?.status;
        const type = event.queryStringParameters?.type;
        
        let query = `
          SELECT c.*, u.name as created_by_name,
            (SELECT COUNT(*) FROM leads WHERE campaign_id = c.id) as leads_generated,
            (SELECT COUNT(*) FROM leads WHERE campaign_id = c.id AND status = 'closed-won') as conversions
          FROM campaigns c
          LEFT JOIN users u ON c.created_by = u.id
        `;
        const params = [];
        const conditions = [];
        
        if (campaignId) {
          conditions.push(`c.id = $${params.length + 1}`);
          params.push(campaignId);
        }
        if (status) {
          conditions.push(`c.status = $${params.length + 1}`);
          params.push(status);
        }
        if (type) {
          conditions.push(`c.type = $${params.length + 1}`);
          params.push(type);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY c.created_at DESC';
        
        const result = await client.query(query, params);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            campaigns: campaignId ? result.rows[0] : result.rows 
          })
        };

      case 'POST':
        const newCampaign = JSON.parse(event.body);
        
        const insertResult = await client.query(
          `INSERT INTO campaigns (name, type, status, budget, start_date, end_date, goals, metrics, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [
            newCampaign.name,
            newCampaign.type,
            newCampaign.status || 'draft',
            newCampaign.budget || 0,
            newCampaign.start_date,
            newCampaign.end_date,
            JSON.stringify(newCampaign.goals || {}),
            JSON.stringify(newCampaign.metrics || {
              impressions: 0,
              clicks: 0,
              conversions: 0,
              cost_per_acquisition: 0
            }),
            newCampaign.created_by || 1 // Default to admin user
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ campaign: insertResult.rows[0] })
        };

      case 'PUT':
        const updateData = JSON.parse(event.body);
        const updateId = updateData.id;
        
        const updateResult = await client.query(
          `UPDATE campaigns 
           SET name = $1, type = $2, status = $3, budget = $4, 
               start_date = $5, end_date = $6, goals = $7, metrics = $8,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $9
           RETURNING *`,
          [
            updateData.name,
            updateData.type,
            updateData.status,
            updateData.budget,
            updateData.start_date,
            updateData.end_date,
            JSON.stringify(updateData.goals || {}),
            JSON.stringify(updateData.metrics || {}),
            updateId
          ]
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ campaign: updateResult.rows[0] })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Campaign ID required' })
          };
        }
        
        await client.query('DELETE FROM campaigns WHERE id = $1', [deleteId]);
        
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
    console.error('Campaigns API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};