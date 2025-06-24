// API endpoint for document management
import dotenv from 'dotenv';
import pkg from 'pg';
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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const client = await pool.connect();

  try {
    switch (req.method) {
      case 'GET':
        return await getDocuments(req, res, client);
      case 'POST':
        return await createDocument(req, res, client);
      case 'PUT':
        return await updateDocument(req, res, client);
      case 'DELETE':
        return await deleteDocument(req, res, client);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

async function getDocuments(req, res, client) {
  try {
    const result = await client.query(`
      SELECT d.*, 
             u1.name as created_by_name,
             u2.name as updated_by_name,
             p.project_name
      FROM documents d
      LEFT JOIN users u1 ON d.created_by = u1.id
      LEFT JOIN users u2 ON d.updated_by = u2.id
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.updated_date DESC
    `);

    const documents = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content || '',
      type: row.document_type || 'document',
      category: row.category || 'general',
      url: row.url || null,
      fileSize: row.file_size || null,
      projectName: row.project_name || null,
      projectId: row.project_id,
      createdBy: row.created_by,
      createdByName: row.created_by_name || 'Unknown',
      updatedBy: row.updated_by,
      updatedByName: row.updated_by_name || 'Unknown',
      createdDate: row.created_date,
      updatedDate: row.updated_date,
      tags: row.tags ? JSON.parse(row.tags) : [],
      isPublic: row.is_public || false,
      version: row.version || '1.0'
    }));

    return res.status(200).json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

async function createDocument(req, res, client) {
  try {
    const {
      title,
      content,
      type,
      category,
      url,
      fileSize,
      projectId,
      createdBy,
      tags,
      isPublic
    } = req.body;

    const result = await client.query(`
      INSERT INTO documents (
        title, content, document_type, category, url, file_size,
        project_id, created_by, updated_by, tags, is_public
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      title,
      content || '',
      type || 'document',
      category || 'general',
      url || null,
      fileSize || null,
      projectId || null,
      createdBy || null,
      createdBy || null, // updated_by same as created_by initially
      tags ? JSON.stringify(tags) : '[]',
      isPublic || false
    ]);

    return res.status(201).json({ 
      success: true, 
      documentId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
}

async function updateDocument(req, res, client) {
  try {
    const { id } = req.query;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = {
        title: 'title',
        content: 'content',
        type: 'document_type',
        category: 'category',
        url: 'url',
        fileSize: 'file_size',
        projectId: 'project_id',
        updatedBy: 'updated_by',
        tags: 'tags',
        isPublic: 'is_public',
        version: 'version'
      }[key];

      if (dbField) {
        if (key === 'tags') {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_date = NOW()`);
    values.push(id);

    const query = `
      UPDATE documents 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `;

    await client.query(query, values);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ error: 'Failed to update document' });
  }
}

async function deleteDocument(req, res, client) {
  try {
    const { id } = req.query;

    await client.query('DELETE FROM documents WHERE id = $1', [id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ error: 'Failed to delete document' });
  }
}