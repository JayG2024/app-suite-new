import multer from 'multer';
import * as XLSX from 'xlsx';
import { db } from '@/lib/db';
import { parse } from 'csv-parse/sync';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type, mode = 'append' } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Import type is required' });
    }

    try {
      let data;

      // Parse file based on type
      if (req.file.mimetype === 'text/csv') {
        const csvContent = req.file.buffer.toString('utf-8');
        data = parse(csvContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });
      } else {
        // Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      }

      if (!data || data.length === 0) {
        return res.status(400).json({ error: 'No data found in file' });
      }

      // Process import based on type
      let result;
      switch (type) {
        case 'projects':
          result = await importProjects(data, mode);
          break;
        case 'leads':
          result = await importLeads(data, mode);
          break;
        case 'tasks':
          result = await importTasks(data, mode);
          break;
        default:
          return res.status(400).json({ error: 'Invalid import type' });
      }

      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Import error:', error);
      return res.status(500).json({ 
        error: 'Import failed', 
        details: error.message 
      });
    }
  });
}

async function importProjects(data, mode) {
  const client = await db.connect();
  let imported = 0;
  let errors = [];

  try {
    await client.query('BEGIN');

    // If mode is replace, delete existing projects
    if (mode === 'replace') {
      await client.query('DELETE FROM projects');
    }

    for (const row of data) {
      try {
        // Validate required fields
        if (!row.project_name || !row.client_name) {
          errors.push({
            row: imported + 1,
            error: 'Missing required fields: project_name or client_name'
          });
          continue;
        }

        // Map CSV fields to database columns
        const projectData = {
          name: row.project_name,
          client_name: row.client_name,
          project_type: row.project_type || 'standard',
          status: row.status || 'planning',
          progress: parseInt(row.progress) || 0,
          budget: parseFloat(row.budget) || 5000,
          start_date: row.start_date || new Date().toISOString(),
          deadline: row.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          notes: row.notes || ''
        };

        await client.query(
          `INSERT INTO projects (
            name, client_name, project_type, status, progress, 
            budget, start_date, deadline, notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
          [
            projectData.name,
            projectData.client_name,
            projectData.project_type,
            projectData.status,
            projectData.progress,
            projectData.budget,
            projectData.start_date,
            projectData.deadline,
            projectData.notes
          ]
        );

        imported++;
      } catch (error) {
        errors.push({
          row: imported + 1,
          error: error.message
        });
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return {
    imported,
    total: data.length,
    errors: errors.length > 0 ? errors : undefined
  };
}

async function importLeads(data, mode) {
  const client = await db.connect();
  let imported = 0;
  let errors = [];

  try {
    await client.query('BEGIN');

    if (mode === 'replace') {
      await client.query('DELETE FROM leads');
    }

    for (const row of data) {
      try {
        // Validate required fields
        if (!row.lead_name || !row.email) {
          errors.push({
            row: imported + 1,
            error: 'Missing required fields: lead_name or email'
          });
          continue;
        }

        // Check for duplicate email
        const existing = await client.query(
          'SELECT id FROM leads WHERE email = $1',
          [row.email]
        );

        if (existing.rows.length > 0 && mode !== 'replace') {
          errors.push({
            row: imported + 1,
            error: `Email ${row.email} already exists`
          });
          continue;
        }

        const leadData = {
          lead_name: row.lead_name,
          company_name: row.company_name || '',
          email: row.email,
          phone: row.phone || '',
          lead_source: row.lead_source || 'imported',
          status: row.status || 'new',
          lead_value: parseFloat(row.lead_value) || 0,
          notes: row.notes || ''
        };

        await client.query(
          `INSERT INTO leads (
            lead_name, company_name, email, phone, lead_source, 
            status, lead_value, notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [
            leadData.lead_name,
            leadData.company_name,
            leadData.email,
            leadData.phone,
            leadData.lead_source,
            leadData.status,
            leadData.lead_value,
            leadData.notes
          ]
        );

        imported++;
      } catch (error) {
        errors.push({
          row: imported + 1,
          error: error.message
        });
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return {
    imported,
    total: data.length,
    errors: errors.length > 0 ? errors : undefined
  };
}

async function importTasks(data, mode) {
  const client = await db.connect();
  let imported = 0;
  let errors = [];

  try {
    await client.query('BEGIN');

    for (const row of data) {
      try {
        // Validate required fields
        if (!row.title) {
          errors.push({
            row: imported + 1,
            error: 'Missing required field: title'
          });
          continue;
        }

        // Find project by name if provided
        let projectId = null;
        if (row.project_name) {
          const project = await client.query(
            'SELECT id FROM projects WHERE name = $1',
            [row.project_name]
          );
          
          if (project.rows.length > 0) {
            projectId = project.rows[0].id;
          } else {
            errors.push({
              row: imported + 1,
              error: `Project "${row.project_name}" not found`
            });
            continue;
          }
        }

        const taskData = {
          title: row.title,
          description: row.description || '',
          project_id: projectId,
          status: row.status || 'todo',
          priority: row.priority || 'medium',
          estimated_hours: parseInt(row.estimated_hours) || 0,
          due_date: row.due_date || null
        };

        await client.query(
          `INSERT INTO tasks (
            title, description, project_id, status, priority, 
            estimated_hours, due_date, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            taskData.title,
            taskData.description,
            taskData.project_id,
            taskData.status,
            taskData.priority,
            taskData.estimated_hours,
            taskData.due_date
          ]
        );

        imported++;
      } catch (error) {
        errors.push({
          row: imported + 1,
          error: error.message
        });
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return {
    imported,
    total: data.length,
    errors: errors.length > 0 ? errors : undefined
  };
}