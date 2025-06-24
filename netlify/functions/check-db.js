// Check database structure
import pg from 'pg';
const { Pool } = pg;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    // Check what tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    // Check if key tables exist
    const requiredTables = ['users', 'leads', 'projects', 'tasks', 'invoices', 'messages'];
    const existingTables = tablesResult.rows.map(r => r.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    // Get sample data from leads if it exists
    let leadsCount = 0;
    if (existingTables.includes('leads')) {
      const countResult = await client.query('SELECT COUNT(*) FROM leads');
      leadsCount = parseInt(countResult.rows[0].count);
    }
    
    client.release();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        tables: existingTables,
        missingTables,
        leadsCount,
        databaseUrl: process.env.NETLIFY_DATABASE_URL ? 'Set' : 'Not set'
      })
    };
  } catch (error) {
    console.error('Database check error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database check failed',
        message: error.message,
        detail: error.detail || error.code
      })
    };
  }
};