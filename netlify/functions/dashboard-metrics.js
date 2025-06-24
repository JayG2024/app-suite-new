// Netlify function for dashboard metrics
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const client = await pool.connect();

  try {
    // Get leads metrics
    const leadsResult = await client.query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as won_deals,
        COUNT(CASE WHEN status = 'closed-lost' THEN 1 END) as lost_deals,
        COUNT(CASE WHEN status IN ('qualified', 'proposal', 'negotiation') THEN 1 END) as active_deals,
        SUM(CASE WHEN status = 'closed-won' THEN value ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status IN ('qualified', 'proposal', 'negotiation') THEN value ELSE 0 END) as pipeline_value
      FROM leads
    `);

    // Get projects metrics
    const projectsResult = await client.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        AVG(progress) as average_progress
      FROM projects
    `);

    // Get tasks metrics
    const tasksResult = await client.query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks
      FROM tasks
    `);

    // Get invoices metrics
    const invoicesResult = await client.query(`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(amount) as total_invoiced,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
      FROM invoices
    `);

    // Get expenses metrics
    const expensesResult = await client.query(`
      SELECT 
        COUNT(*) as total_expenses,
        SUM(amount) as total_expenses_amount
      FROM expenses
    `);

    // Calculate metrics
    const leads = leadsResult.rows[0];
    const projects = projectsResult.rows[0];
    const tasks = tasksResult.rows[0];
    const invoices = invoicesResult.rows[0];
    const expenses = expensesResult.rows[0];

    const totalRevenue = parseFloat(leads.total_revenue || 0);
    const activeProjects = parseInt(projects.active_projects || 0);
    const totalClients = parseInt(leads.won_deals || 0);
    const pipelineValue = parseFloat(leads.pipeline_value || 0);
    
    // Calculate conversion rate
    const totalClosed = parseInt(leads.won_deals || 0) + parseInt(leads.lost_deals || 0);
    const conversionRate = totalClosed > 0 ? Math.round((parseInt(leads.won_deals || 0) / totalClosed) * 100) : 0;
    
    // Calculate average project value
    const averageProjectValue = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;
    
    // Calculate task completion rate
    const totalTasks = parseInt(tasks.total_tasks || 0);
    const completedTasks = parseInt(tasks.completed_tasks || 0);
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate monthly growth (placeholder - would need historical data)
    const monthlyGrowth = 12.5;

    // Count proposals (would need a proposals table in production)
    const proposalsSent = Math.floor(parseInt(leads.active_deals || 0) * 0.7);

    const metrics = {
      totalRevenue,
      activeProjects,
      totalClients,
      monthlyGrowth,
      pipelineValue,
      proposalsSent,
      conversionRate,
      averageProjectValue,
      totalTasks,
      completedTasks,
      taskCompletionRate
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(metrics)
    };

  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    client.release();
  }
};