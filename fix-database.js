import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing database schema...');
    
    // Fix leads table
    await client.query(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact VARCHAR(255),
      ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS stage VARCHAR(50),
      ADD COLUMN IF NOT EXISTS probability INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS next_action VARCHAR(255),
      ADD COLUMN IF NOT EXISTS next_action_date DATE,
      ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    
    // Update the name column from company if needed
    await client.query(`
      UPDATE leads SET name = COALESCE(name, company) WHERE name IS NULL;
    `);
    
    // Create messages table for ClientCommunication
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES leads(id),
        name VARCHAR(255),
        email VARCHAR(255),
        company VARCHAR(255),
        message TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'inquiry',
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'unread',
        is_response BOOLEAN DEFAULT false,
        original_message_id INTEGER REFERENCES messages(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add sample data
    console.log('📊 Adding sample data...');
    
    // Add sample leads
    await client.query(`
      INSERT INTO leads (name, company, email, phone, status, stage, value, source, type) VALUES
      ('John Smith', 'Tech Startup Inc', 'john@techstartup.com', '+1-555-0123', 'active', 'qualified', 7500, 'website', 'ai-enhanced'),
      ('Sarah Johnson', 'E-commerce Plus', 'sarah@ecomplus.com', '+1-555-0124', 'active', 'proposal', 5000, 'referral', 'standard'),
      ('Mike Wilson', 'Local Services LLC', 'mike@localservices.com', '+1-555-0125', 'new', 'lead', 10000, 'direct', 'enterprise')
      ON CONFLICT DO NOTHING
    `);
    
    // Add sample projects
    await client.query(`
      INSERT INTO projects (name, status, progress, budget, description) VALUES
      ('Tech Startup CRM', 'in_progress', 45, 7500, 'Custom CRM development with AI features'),
      ('E-commerce Dashboard', 'planning', 10, 5000, 'Analytics dashboard for e-commerce platform'),
      ('Service Management App', 'development', 75, 10000, 'Complete service management solution')
      ON CONFLICT DO NOTHING
    `);
    
    // Add sample tasks
    await client.query(`
      INSERT INTO tasks (title, status, priority, description, project_id) VALUES
      ('Design UI mockups', 'in_progress', 'high', 'Create Figma designs for main screens', 1),
      ('Implement authentication', 'todo', 'high', 'Add login/signup functionality', 1),
      ('Database schema', 'completed', 'medium', 'Design and implement database structure', 2),
      ('API integration', 'todo', 'medium', 'Connect to third-party services', 3)
      ON CONFLICT DO NOTHING
    `);
    
    // Add sample messages
    await client.query(`
      INSERT INTO messages (name, email, company, message, message_type, priority) VALUES
      ('John Smith', 'john@techstartup.com', 'Tech Startup Inc', 'Hi, I need help with our CRM project. Can we schedule a call?', 'inquiry', 'high'),
      ('Sarah Johnson', 'sarah@ecomplus.com', 'E-commerce Plus', 'What is the status of our dashboard project?', 'question', 'medium'),
      ('Mike Wilson', 'mike@localservices.com', 'Local Services LLC', 'I would like to discuss adding new features to our app.', 'inquiry', 'medium')
      ON CONFLICT DO NOTHING
    `);
    
    // Add sample email templates
    await client.query(`
      INSERT INTO email_templates (name, category, subject, body_html, body_text) VALUES
      ('Welcome Email', 'onboarding', 'Welcome to App Suite!', '<h1>Welcome!</h1><p>Thank you for choosing App Suite.</p>', 'Welcome! Thank you for choosing App Suite.'),
      ('Project Update', 'project', 'Project Update: {{project_name}}', '<h2>Project Update</h2><p>Your project {{project_name}} is {{progress}}% complete.</p>', 'Project Update: Your project is progressing well.'),
      ('Invoice Reminder', 'billing', 'Invoice #{{invoice_number}} Due Soon', '<p>This is a reminder that invoice #{{invoice_number}} is due on {{due_date}}.</p>', 'Invoice reminder: Payment due soon.')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Database fixed and sample data added!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

fixDatabase();