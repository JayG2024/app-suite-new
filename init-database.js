// Initialize database with schema
import dotenv from 'dotenv';
import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing database...');
    
    // Read and execute schema
    const schema = fs.readFileSync(path.join(__dirname, 'database-schema.sql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        await client.query(statement + ';');
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (err) {
        console.error('❌ Failed to execute:', statement.substring(0, 50) + '...');
        console.error(err.message);
      }
    }
    
    // Insert some sample data
    console.log('\n📊 Inserting sample data...');
    
    // Sample leads
    await client.query(`
      INSERT INTO leads (name, company, email, phone, status, value, source) VALUES
      ('John Smith', 'Tech Corp', 'john@techcorp.com', '555-0101', 'qualified', 15000, 'website'),
      ('Sarah Johnson', 'Design Studio', 'sarah@designstudio.com', '555-0102', 'proposal', 25000, 'referral'),
      ('Mike Chen', 'StartupXYZ', 'mike@startupxyz.com', '555-0103', 'negotiation', 35000, 'website'),
      ('Emily Davis', 'Retail Plus', 'emily@retailplus.com', '555-0104', 'new', 20000, 'email')
      ON CONFLICT DO NOTHING
    `);
    
    // Sample projects
    await client.query(`
      INSERT INTO projects (name, client_id, status, progress, budget, description) VALUES
      ('E-commerce Platform', 1, 'in_progress', 65, 15000, 'Custom e-commerce solution with inventory management'),
      ('Brand Website Redesign', 2, 'planning', 20, 25000, 'Complete redesign of company website with CMS'),
      ('Mobile App Development', 3, 'in_progress', 40, 35000, 'Cross-platform mobile app for customer engagement')
      ON CONFLICT DO NOTHING
    `);
    
    // Sample tasks
    await client.query(`
      INSERT INTO tasks (title, project_id, status, priority, description) VALUES
      ('Setup development environment', 1, 'completed', 'high', 'Configure local and staging environments'),
      ('Design database schema', 1, 'completed', 'high', 'Create PostgreSQL schema for all entities'),
      ('Implement user authentication', 1, 'in_progress', 'high', 'JWT-based auth with role management'),
      ('Create product catalog', 1, 'todo', 'medium', 'Product CRUD with categories and variants'),
      ('Setup payment integration', 1, 'todo', 'high', 'Integrate Stripe for payment processing')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization
initDatabase().catch(console.error);