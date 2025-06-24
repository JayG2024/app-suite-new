// Netlify function for user authentication
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Only allow these two emails
const AUTHORIZED_EMAILS = ['jason@jaydus.ai', 'almir@jaydus.ai'];

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Unauthorized email. Access restricted to authorized administrators only.' })
      };
    }

    // Hardcoded users
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
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    // Verify password (check both regular and temporary password)
    const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidTempPassword = await bcrypt.compare(password, user.tempPassword);

    if (!isValidPassword && !isValidTempPassword) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
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

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};