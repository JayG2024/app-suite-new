#!/usr/bin/env node

// Script to set up the database tables
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
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

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Connected to database...');
    
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, 'database-schema.sql'), 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      console.log(`\n📝 Executing: ${statement.substring(0, 50)}...`);
      try {
        await client.query(statement);
        console.log('✅ Success');
      } catch (err) {
        console.error('❌ Error:', err.message);
      }
    }
    
    // Insert default admin users if they don't exist
    console.log('\n👤 Setting up admin users...');
    
    // Check if users exist
    const userCheck = await client.query('SELECT email FROM users WHERE email IN ($1, $2)', [
      'jason@jaydus.ai',
      'almir@jaydus.ai'
    ]);
    
    if (userCheck.rows.length === 0) {
      // Insert admin users with bcrypt hashed password 'admin123'
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await client.query(`
        INSERT INTO users (email, name, role, password_hash) VALUES
        ('jason@jaydus.ai', 'Jason Gordon', 'admin', $1),
        ('almir@jaydus.ai', 'Almir', 'admin', $1)
        ON CONFLICT (email) DO NOTHING
      `, [hashedPassword]);
      
      console.log('✅ Admin users created');
    } else {
      console.log('✅ Admin users already exist');
    }
    
    // Add some sample data
    console.log('\n📊 Adding sample data...');
    
    // Add sample leads
    await client.query(`
      INSERT INTO leads (name, company, email, phone, status, value, source) VALUES
      ('John Smith', 'Tech Startup Inc', 'john@techstartup.com', '+1-555-0123', 'qualified', 7500, 'website'),
      ('Sarah Johnson', 'E-commerce Plus', 'sarah@ecomplus.com', '+1-555-0124', 'proposal', 5000, 'referral'),
      ('Mike Wilson', 'Local Services LLC', 'mike@localservices.com', '+1-555-0125', 'new', 10000, 'direct')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('\n✅ Database setup complete!');
    console.log('\n🎉 You can now log in with:');
    console.log('   Email: jason@jaydus.ai');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the setup
setupDatabase();