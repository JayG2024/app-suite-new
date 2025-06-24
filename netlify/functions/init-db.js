// Initialize database tables
import pg from 'pg';
const { Pool } = pg;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  // Simple auth check
  const authHeader = event.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-init-2024') {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create leads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        contact VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'new',
        stage VARCHAR(50) DEFAULT 'lead',
        type VARCHAR(50) DEFAULT 'standard',
        value DECIMAL(10, 2),
        probability INTEGER DEFAULT 0,
        source VARCHAR(100),
        notes TEXT,
        description TEXT,
        next_action VARCHAR(255),
        next_action_date DATE,
        assigned_to INTEGER,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        client_id INTEGER,
        status VARCHAR(50) DEFAULT 'planning',
        progress INTEGER DEFAULT 0,
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10, 2),
        description TEXT,
        assigned_to INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        project_id INTEGER,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        assigned_to INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        project_id INTEGER,
        client_id INTEGER,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        due_date DATE,
        paid_date DATE,
        items JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        name VARCHAR(255),
        email VARCHAR(255),
        company VARCHAR(255),
        message TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'inquiry',
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'unread',
        is_response BOOLEAN DEFAULT false,
        original_message_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add sample data
    await client.query(`
      INSERT INTO leads (name, company, contact, email, phone, status, stage, value, source, type) VALUES
      ('Tech Startup Inc', 'Tech Startup Inc', 'John Smith', 'john@techstartup.com', '+1-555-0123', 'active', 'qualified', 7500, 'website', 'ai-enhanced'),
      ('E-commerce Plus', 'E-commerce Plus', 'Sarah Johnson', 'sarah@ecomplus.com', '+1-555-0124', 'active', 'proposal', 5000, 'referral', 'standard'),
      ('Local Services LLC', 'Local Services LLC', 'Mike Wilson', 'mike@localservices.com', '+1-555-0125', 'new', 'lead', 10000, 'direct', 'enterprise')
      ON CONFLICT DO NOTHING
    `);

    client.release();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database initialized successfully'
      })
    };
    
  } catch (error) {
    client.release();
    console.error('Database init error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database initialization failed',
        message: error.message
      })
    };
  }
};