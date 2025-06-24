import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, types = 'all', limit = 20 } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  try {
    const searchTerm = `%${query}%`;
    const results = {};

    // Determine which types to search
    const searchTypes = types === 'all' 
      ? ['projects', 'leads', 'tasks', 'invoices', 'documents', 'users']
      : types.split(',');

    // Search projects
    if (searchTypes.includes('projects')) {
      const projects = await db.query(`
        SELECT 
          id,
          name,
          client_name,
          status,
          project_type,
          'project' as type
        FROM projects
        WHERE 
          name ILIKE $1 
          OR client_name ILIKE $1 
          OR notes ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.projects = projects.rows;
    }

    // Search leads
    if (searchTypes.includes('leads')) {
      const leads = await db.query(`
        SELECT 
          id,
          lead_name as name,
          company_name,
          email,
          status,
          'lead' as type
        FROM leads
        WHERE 
          lead_name ILIKE $1 
          OR company_name ILIKE $1 
          OR email ILIKE $1
          OR notes ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.leads = leads.rows;
    }

    // Search tasks
    if (searchTypes.includes('tasks')) {
      const tasks = await db.query(`
        SELECT 
          t.id,
          t.title as name,
          t.description,
          t.status,
          p.name as project_name,
          'task' as type
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE 
          t.title ILIKE $1 
          OR t.description ILIKE $1
        ORDER BY t.created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.tasks = tasks.rows;
    }

    // Search invoices
    if (searchTypes.includes('invoices')) {
      const invoices = await db.query(`
        SELECT 
          i.id,
          i.invoice_number as name,
          i.amount,
          i.status,
          p.name as project_name,
          p.client_name,
          'invoice' as type
        FROM invoices i
        LEFT JOIN projects p ON i.project_id = p.id
        WHERE 
          i.invoice_number ILIKE $1 
          OR p.client_name ILIKE $1
        ORDER BY i.created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.invoices = invoices.rows;
    }

    // Search documents
    if (searchTypes.includes('documents')) {
      const documents = await db.query(`
        SELECT 
          d.id,
          d.original_name as name,
          d.mime_type,
          d.url,
          p.name as project_name,
          'document' as type
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.id
        WHERE 
          d.original_name ILIKE $1 
          OR d.filename ILIKE $1
        ORDER BY d.created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.documents = documents.rows;
    }

    // Search users
    if (searchTypes.includes('users')) {
      const users = await db.query(`
        SELECT 
          id,
          name,
          email,
          role,
          'user' as type
        FROM users
        WHERE 
          name ILIKE $1 
          OR email ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2
      `, [searchTerm, limit]);
      
      results.users = users.rows;
    }

    // Combine all results and sort by relevance
    const allResults = [];
    Object.values(results).forEach(typeResults => {
      allResults.push(...typeResults);
    });

    // Calculate relevance score (exact matches score higher)
    allResults.forEach(result => {
      const lowerQuery = query.toLowerCase();
      const lowerName = (result.name || '').toLowerCase();
      
      if (lowerName === lowerQuery) {
        result.relevance = 100;
      } else if (lowerName.startsWith(lowerQuery)) {
        result.relevance = 80;
      } else if (lowerName.includes(lowerQuery)) {
        result.relevance = 60;
      } else {
        result.relevance = 40;
      }
    });

    // Sort by relevance
    allResults.sort((a, b) => b.relevance - a.relevance);

    return res.status(200).json({
      success: true,
      query,
      totalResults: allResults.length,
      results: allResults.slice(0, limit),
      resultsByType: {
        projects: results.projects?.length || 0,
        leads: results.leads?.length || 0,
        tasks: results.tasks?.length || 0,
        invoices: results.invoices?.length || 0,
        documents: results.documents?.length || 0,
        users: results.users?.length || 0
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}