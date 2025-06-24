import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { startDate, endDate, userId } = req.query;

  try {
    // Get date range
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();

    // Fetch all analytics data in parallel
    const [
      revenue,
      projects,
      leads,
      tasks,
      activities,
      proposals,
      invoices
    ] = await Promise.all([
      getRevenueMetrics(start, end),
      getProjectMetrics(start, end),
      getLeadMetrics(start, end),
      getTaskMetrics(start, end, userId),
      getActivityMetrics(start, end),
      getProposalMetrics(start, end),
      getInvoiceMetrics(start, end)
    ]);

    // Calculate growth rates
    const previousPeriodStart = new Date(new Date(start).getTime() - (new Date(end).getTime() - new Date(start).getTime())).toISOString();
    const previousRevenue = await getRevenueMetrics(previousPeriodStart, start);
    
    const revenueGrowth = previousRevenue.total > 0 
      ? ((revenue.total - previousRevenue.total) / previousRevenue.total * 100).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        revenue: {
          ...revenue,
          growth: revenueGrowth
        },
        projects,
        leads,
        tasks,
        activities,
        proposals,
        invoices,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

async function getRevenueMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_invoices,
      SUM(amount) as total_revenue,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_revenue,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_revenue,
      AVG(amount) as average_invoice,
      COUNT(DISTINCT project_id) as projects_billed
    FROM invoices
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  const monthlyRevenue = await db.query(`
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      SUM(amount) as revenue,
      COUNT(*) as invoice_count
    FROM invoices
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY month
    ORDER BY month
  `, [startDate, endDate]);

  return {
    total: parseFloat(result.rows[0].total_revenue || 0),
    paid: parseFloat(result.rows[0].paid_revenue || 0),
    pending: parseFloat(result.rows[0].pending_revenue || 0),
    averageInvoice: parseFloat(result.rows[0].average_invoice || 0),
    invoiceCount: parseInt(result.rows[0].total_invoices || 0),
    projectsBilled: parseInt(result.rows[0].projects_billed || 0),
    monthly: monthlyRevenue.rows.map(row => ({
      month: row.month,
      revenue: parseFloat(row.revenue),
      count: parseInt(row.invoice_count)
    }))
  };
}

async function getProjectMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_projects,
      COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning,
      COUNT(CASE WHEN status = 'discovery' THEN 1 END) as discovery,
      COUNT(CASE WHEN status = 'design' THEN 1 END) as design,
      COUNT(CASE WHEN status = 'development' THEN 1 END) as development,
      COUNT(CASE WHEN status = 'testing' THEN 1 END) as testing,
      COUNT(CASE WHEN status = 'deployed' THEN 1 END) as deployed,
      AVG(progress) as average_progress,
      COUNT(CASE WHEN project_type = 'standard' THEN 1 END) as standard_count,
      COUNT(CASE WHEN project_type = 'ai_enhanced' THEN 1 END) as ai_enhanced_count,
      COUNT(CASE WHEN project_type = 'enterprise' THEN 1 END) as enterprise_count
    FROM projects
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  const completionTime = await db.query(`
    SELECT 
      AVG(EXTRACT(day FROM (completed_at - created_at))) as avg_completion_days
    FROM projects
    WHERE completed_at IS NOT NULL
    AND created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  return {
    total: parseInt(result.rows[0].total_projects || 0),
    byStatus: {
      planning: parseInt(result.rows[0].planning || 0),
      discovery: parseInt(result.rows[0].discovery || 0),
      design: parseInt(result.rows[0].design || 0),
      development: parseInt(result.rows[0].development || 0),
      testing: parseInt(result.rows[0].testing || 0),
      deployed: parseInt(result.rows[0].deployed || 0)
    },
    byType: {
      standard: parseInt(result.rows[0].standard_count || 0),
      aiEnhanced: parseInt(result.rows[0].ai_enhanced_count || 0),
      enterprise: parseInt(result.rows[0].enterprise_count || 0)
    },
    averageProgress: parseFloat(result.rows[0].average_progress || 0),
    averageCompletionDays: parseFloat(completionTime.rows[0].avg_completion_days || 0)
  };
}

async function getLeadMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_leads,
      COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
      COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
      COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified,
      COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
      COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost,
      AVG(CASE WHEN status = 'converted' THEN lead_value ELSE NULL END) as avg_deal_size,
      SUM(CASE WHEN status = 'converted' THEN lead_value ELSE 0 END) as total_converted_value
    FROM leads
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  const conversionRate = result.rows[0].total_leads > 0
    ? (result.rows[0].converted / result.rows[0].total_leads * 100).toFixed(1)
    : 0;

  const sources = await db.query(`
    SELECT 
      lead_source,
      COUNT(*) as count,
      COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted
    FROM leads
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY lead_source
    ORDER BY count DESC
  `, [startDate, endDate]);

  return {
    total: parseInt(result.rows[0].total_leads || 0),
    byStatus: {
      new: parseInt(result.rows[0].new_leads || 0),
      contacted: parseInt(result.rows[0].contacted || 0),
      qualified: parseInt(result.rows[0].qualified || 0),
      converted: parseInt(result.rows[0].converted || 0),
      lost: parseInt(result.rows[0].lost || 0)
    },
    conversionRate: parseFloat(conversionRate),
    averageDealSize: parseFloat(result.rows[0].avg_deal_size || 0),
    totalConvertedValue: parseFloat(result.rows[0].total_converted_value || 0),
    bySources: sources.rows.map(row => ({
      source: row.lead_source,
      count: parseInt(row.count),
      converted: parseInt(row.converted),
      conversionRate: row.count > 0 ? (row.converted / row.count * 100).toFixed(1) : 0
    }))
  };
}

async function getTaskMetrics(startDate, endDate, userId) {
  const userCondition = userId ? 'AND assigned_to = $3' : '';
  const params = userId ? [startDate, endDate, userId] : [startDate, endDate];

  const result = await db.query(`
    SELECT 
      COUNT(*) as total_tasks,
      COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo,
      COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      SUM(estimated_hours) as total_estimated_hours,
      SUM(actual_hours) as total_actual_hours,
      AVG(CASE WHEN status = 'completed' THEN actual_hours ELSE NULL END) as avg_completion_hours
    FROM tasks
    WHERE created_at BETWEEN $1 AND $2
    ${userCondition}
  `, params);

  const completionRate = result.rows[0].total_tasks > 0
    ? (result.rows[0].completed / result.rows[0].total_tasks * 100).toFixed(1)
    : 0;

  const productivity = await db.query(`
    SELECT 
      DATE_TRUNC('day', completed_at) as day,
      COUNT(*) as tasks_completed,
      SUM(actual_hours) as hours_spent
    FROM tasks
    WHERE completed_at BETWEEN $1 AND $2
    ${userCondition}
    GROUP BY day
    ORDER BY day
  `, params);

  return {
    total: parseInt(result.rows[0].total_tasks || 0),
    byStatus: {
      todo: parseInt(result.rows[0].todo || 0),
      inProgress: parseInt(result.rows[0].in_progress || 0),
      completed: parseInt(result.rows[0].completed || 0)
    },
    completionRate: parseFloat(completionRate),
    estimatedHours: parseFloat(result.rows[0].total_estimated_hours || 0),
    actualHours: parseFloat(result.rows[0].total_actual_hours || 0),
    averageCompletionHours: parseFloat(result.rows[0].avg_completion_hours || 0),
    dailyProductivity: productivity.rows.map(row => ({
      date: row.day,
      tasksCompleted: parseInt(row.tasks_completed),
      hoursSpent: parseFloat(row.hours_spent || 0)
    }))
  };
}

async function getActivityMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      activity_type,
      COUNT(*) as count
    FROM project_activities
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY activity_type
    ORDER BY count DESC
  `, [startDate, endDate]);

  const byUser = await db.query(`
    SELECT 
      u.name as user_name,
      COUNT(pa.id) as activity_count
    FROM project_activities pa
    JOIN users u ON pa.user_id = u.id
    WHERE pa.created_at BETWEEN $1 AND $2
    GROUP BY u.id, u.name
    ORDER BY activity_count DESC
    LIMIT 10
  `, [startDate, endDate]);

  const timeline = await db.query(`
    SELECT 
      DATE_TRUNC('day', created_at) as day,
      COUNT(*) as activity_count
    FROM project_activities
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY day
    ORDER BY day
  `, [startDate, endDate]);

  return {
    byType: result.rows.map(row => ({
      type: row.activity_type,
      count: parseInt(row.count)
    })),
    byUser: byUser.rows.map(row => ({
      userName: row.user_name,
      count: parseInt(row.activity_count)
    })),
    timeline: timeline.rows.map(row => ({
      date: row.day,
      count: parseInt(row.activity_count)
    }))
  };
}

async function getProposalMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_proposals,
      COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
      COUNT(CASE WHEN status = 'declined' THEN 1 END) as declined,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      SUM(amount) as total_value,
      AVG(amount) as average_value
    FROM proposals
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  const acceptanceRate = result.rows[0].total_proposals > 0
    ? (result.rows[0].accepted / result.rows[0].total_proposals * 100).toFixed(1)
    : 0;

  return {
    total: parseInt(result.rows[0].total_proposals || 0),
    accepted: parseInt(result.rows[0].accepted || 0),
    declined: parseInt(result.rows[0].declined || 0),
    pending: parseInt(result.rows[0].pending || 0),
    acceptanceRate: parseFloat(acceptanceRate),
    totalValue: parseFloat(result.rows[0].total_value || 0),
    averageValue: parseFloat(result.rows[0].average_value || 0)
  };
}

async function getInvoiceMetrics(startDate, endDate) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_invoices,
      COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue,
      SUM(amount) as total_amount,
      AVG(CASE 
        WHEN status = 'paid' AND paid_at IS NOT NULL 
        THEN EXTRACT(day FROM (paid_at - created_at))
        ELSE NULL 
      END) as avg_payment_days
    FROM invoices
    WHERE created_at BETWEEN $1 AND $2
  `, [startDate, endDate]);

  const paymentMethods = await db.query(`
    SELECT 
      payment_method,
      COUNT(*) as count,
      SUM(amount) as total
    FROM invoices
    WHERE status = 'paid'
    AND created_at BETWEEN $1 AND $2
    AND payment_method IS NOT NULL
    GROUP BY payment_method
  `, [startDate, endDate]);

  return {
    total: parseInt(result.rows[0].total_invoices || 0),
    paid: parseInt(result.rows[0].paid || 0),
    pending: parseInt(result.rows[0].pending || 0),
    overdue: parseInt(result.rows[0].overdue || 0),
    totalAmount: parseFloat(result.rows[0].total_amount || 0),
    averagePaymentDays: parseFloat(result.rows[0].avg_payment_days || 0),
    byPaymentMethod: paymentMethods.rows.map(row => ({
      method: row.payment_method,
      count: parseInt(row.count),
      total: parseFloat(row.total)
    }))
  };
}