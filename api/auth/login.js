// API endpoint for user authentication
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// JWT secret (in production, use a secure environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const client = await pool.connect();

  try {
    // Only allow these two emails
    const AUTHORIZED_EMAILS = ['jason@jaydus.ai', 'almir@jaydus.ai'];
    
    if (!AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      return res.status(401).json({ error: 'Unauthorized email. Access restricted to authorized administrators only.' });
    }

    // For now, use hardcoded users since the database doesn't have password column
    const hardcodedUsers = [
      {
        id: 1,
        email: 'almir@jaydus.ai',
        name: 'Almir',
        role: 'admin',
        password: await bcrypt.hash('Welcome2025!', 10),
        tempPassword: await bcrypt.hash('TempPass2025!', 10)
      },
      {
        id: 2,
        email: 'jason@jaydus.ai',
        name: 'Jason',
        role: 'admin',
        password: await bcrypt.hash('Welcome2025!', 10),
        tempPassword: await bcrypt.hash('TempPass2025!', 10)
      }
    ];

    // Find user
    const user = hardcodedUsers.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (check both regular and temporary password)
    const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidTempPassword = await bcrypt.compare(password, user.tempPassword);

    if (!isValidPassword && !isValidTempPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}