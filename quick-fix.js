import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function quickFix() {
  const client = await pool.connect();
  
  try {
    // Drop and recreate leads table with all needed columns
    console.log('🔄 Recreating leads table...');
    
    await client.query('DROP TABLE IF EXISTS leads CASCADE');
    
    await client.query(`
      CREATE TABLE leads (
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
    
    // Add sample leads
    await client.query(`
      INSERT INTO leads (name, company, contact, email, phone, status, stage, value, source, type) VALUES
      ('Tech Startup Inc', 'Tech Startup Inc', 'John Smith', 'john@techstartup.com', '+1-555-0123', 'active', 'qualified', 7500, 'website', 'ai-enhanced'),
      ('E-commerce Plus', 'E-commerce Plus', 'Sarah Johnson', 'sarah@ecomplus.com', '+1-555-0124', 'active', 'proposal', 5000, 'referral', 'standard'),
      ('Local Services LLC', 'Local Services LLC', 'Mike Wilson', 'mike@localservices.com', '+1-555-0125', 'new', 'lead', 10000, 'direct', 'enterprise'),
      ('Digital Marketing Co', 'Digital Marketing Co', 'Emma Davis', 'emma@digitalco.com', '+1-555-0126', 'active', 'negotiation', 8500, 'website', 'ai-enhanced'),
      ('Healthcare Solutions', 'Healthcare Solutions', 'Dr. Brown', 'info@healthsol.com', '+1-555-0127', 'active', 'closed-won', 15000, 'referral', 'enterprise')
    `);
    
    console.log('✅ Leads table recreated with sample data');
    
    // Ensure other tables exist
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
    
    await client.query(`
      INSERT INTO messages (name, email, company, message, priority) VALUES
      ('John Smith', 'john@techstartup.com', 'Tech Startup Inc', 'Need help with CRM integration', 'high'),
      ('Sarah Johnson', 'sarah@ecomplus.com', 'E-commerce Plus', 'Project status update?', 'medium')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ All dashboard components should work now!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    pool.end();
  }
}

quickFix();