// Netlify function for activity log tracking
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        // Get activity logs with filtering
        const userId = event.queryStringParameters?.userId;
        const projectId = event.queryStringParameters?.projectId;
        const entityType = event.queryStringParameters?.entityType;
        const entityId = event.queryStringParameters?.entityId;
        const action = event.queryStringParameters?.action;
        const startDate = event.queryStringParameters?.startDate;
        const endDate = event.queryStringParameters?.endDate;
        const limit = event.queryStringParameters?.limit || 50;
        const offset = event.queryStringParameters?.offset || 0;
        
        let query = 'SELECT * FROM activity_logs WHERE 1=1';
        const params = [];
        
        if (userId) {
          params.push(userId);
          query += ` AND user_id = $${params.length}`;
        }
        
        if (projectId) {
          params.push(projectId);
          query += ` AND project_id = $${params.length}`;
        }
        
        if (entityType) {
          params.push(entityType);
          query += ` AND entity_type = $${params.length}`;
        }
        
        if (entityId) {
          params.push(entityId);
          query += ` AND entity_id = $${params.length}`;
        }
        
        if (action) {
          params.push(action);
          query += ` AND action = $${params.length}`;
        }
        
        if (startDate) {
          params.push(startDate);
          query += ` AND created_at >= $${params.length}`;
        }
        
        if (endDate) {
          params.push(endDate);
          query += ` AND created_at <= $${params.length}`;
        }
        
        query += ' ORDER BY created_at DESC';
        
        // Add pagination
        params.push(limit);
        query += ` LIMIT $${params.length}`;
        params.push(offset);
        query += ` OFFSET $${params.length}`;
        
        const result = await client.query(query, params);
        
        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM activity_logs WHERE 1=1';
        const countParams = [];
        
        if (userId) {
          countParams.push(userId);
          countQuery += ` AND user_id = $${countParams.length}`;
        }
        
        if (projectId) {
          countParams.push(projectId);
          countQuery += ` AND project_id = $${countParams.length}`;
        }
        
        if (entityType) {
          countParams.push(entityType);
          countQuery += ` AND entity_type = $${countParams.length}`;
        }
        
        if (entityId) {
          countParams.push(entityId);
          countQuery += ` AND entity_id = $${countParams.length}`;
        }
        
        if (action) {
          countParams.push(action);
          countQuery += ` AND action = $${countParams.length}`;
        }
        
        if (startDate) {
          countParams.push(startDate);
          countQuery += ` AND created_at >= $${countParams.length}`;
        }
        
        if (endDate) {
          countParams.push(endDate);
          countQuery += ` AND created_at <= $${countParams.length}`;
        }
        
        const countResult = await client.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            activities: result.rows,
            pagination: {
              total: totalCount,
              limit: parseInt(limit),
              offset: parseInt(offset),
              hasMore: totalCount > parseInt(offset) + parseInt(limit)
            }
          })
        };

      case 'POST':
        // Create new activity log entry
        const newActivity = JSON.parse(event.body);
        
        // Validate required fields
        if (!newActivity.user_id || !newActivity.action || !newActivity.entity_type) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Missing required fields: user_id, action, entity_type' 
            })
          };
        }
        
        const insertResult = await client.query(
          `INSERT INTO activity_logs (
            user_id, project_id, action, entity_type, entity_id,
            entity_name, details, ip_address, user_agent
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *`,
          [
            newActivity.user_id,
            newActivity.project_id,
            newActivity.action,
            newActivity.entity_type,
            newActivity.entity_id,
            newActivity.entity_name,
            JSON.stringify(newActivity.details || {}),
            newActivity.ip_address || event.headers['x-forwarded-for'] || event.headers['client-ip'],
            newActivity.user_agent || event.headers['user-agent']
          ]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ activity: insertResult.rows[0] })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Activity log API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};