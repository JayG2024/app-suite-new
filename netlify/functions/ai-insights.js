const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize database connection
const getDatabaseUrl = () => {
  return process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
};

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query, dataType, includeMetrics = true } = JSON.parse(event.body);

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Fetch relevant data based on dataType
    let contextData = {};
    
    if (includeMetrics) {
      // Connect to database to fetch metrics
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: getDatabaseUrl(),
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      try {
        // Fetch various metrics based on dataType
        switch (dataType) {
          case 'projects':
            const projectsResult = await pool.query(`
              SELECT 
                COUNT(*) as total_projects,
                COUNT(CASE WHEN status = 'deployed' THEN 1 END) as completed_projects,
                COUNT(CASE WHEN status IN ('development', 'testing') THEN 1 END) as active_projects,
                SUM(budget) as total_revenue,
                AVG(EXTRACT(DAY FROM (COALESCE(completion_date, CURRENT_DATE) - start_date))) as avg_delivery_days
              FROM projects
            `);
            contextData.projects = projectsResult.rows[0];
            break;

          case 'tasks':
            const tasksResult = await pool.query(`
              SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 1 END) as overdue_tasks
              FROM tasks
            `);
            contextData.tasks = tasksResult.rows[0];
            break;

          case 'financials':
            const financialsResult = await pool.query(`
              SELECT 
                (SELECT SUM(total_amount) FROM invoices WHERE status = 'paid') as total_revenue,
                (SELECT SUM(total_amount) FROM invoices WHERE status IN ('sent', 'overdue')) as pending_revenue,
                (SELECT SUM(amount) FROM expenses WHERE status = 'approved') as total_expenses,
                (SELECT COUNT(*) FROM invoices WHERE status = 'overdue') as overdue_invoices
            `);
            contextData.financials = financialsResult.rows[0];
            break;

          case 'clients':
            const clientsResult = await pool.query(`
              SELECT 
                COUNT(DISTINCT l.id) as total_clients,
                COUNT(CASE WHEN l.status = 'active' THEN 1 END) as active_clients,
                AVG(p.budget) as avg_project_value
              FROM leads l
              LEFT JOIN projects p ON l.id = p.client_id
              WHERE l.status IN ('active', 'closed-won')
            `);
            contextData.clients = clientsResult.rows[0];
            break;

          default:
            // Fetch general overview
            const overviewResult = await pool.query(`
              SELECT 
                (SELECT COUNT(*) FROM projects) as total_projects,
                (SELECT COUNT(*) FROM tasks) as total_tasks,
                (SELECT COUNT(*) FROM leads WHERE status = 'active') as total_clients,
                (SELECT SUM(total_amount) FROM invoices WHERE status = 'paid') as total_revenue
            `);
            contextData.overview = overviewResult.rows[0];
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without metrics if database fails
      } finally {
        await pool.end();
      }
    }

    // Create a context-aware prompt
    const systemPrompt = `You are an AI business intelligence assistant for App Suite's internal dashboard. You have access to real-time business data and can provide insights, analysis, and recommendations.

Current Business Metrics:
${JSON.stringify(contextData, null, 2)}

Your responsibilities:
1. Analyze business data and provide actionable insights
2. Answer questions about projects, tasks, clients, and finances
3. Identify trends and patterns in the data
4. Suggest optimizations and improvements
5. Help with forecasting and planning

Always be specific and data-driven in your responses. When making recommendations, explain the reasoning based on the data.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.3, // Lower temperature for more consistent data analysis
      max_tokens: 1000
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: completion.choices[0].message.content,
        data: contextData,
        usage: completion.usage
      })
    };
  } catch (error) {
    console.error('AI insights error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while generating insights.' 
      })
    };
  }
};