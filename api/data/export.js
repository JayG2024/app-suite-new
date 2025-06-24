import { db } from '@/lib/db';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, format = 'csv', startDate, endDate } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Export type is required' });
  }

  try {
    let data;
    let filename;

    // Fetch data based on type
    switch (type) {
      case 'projects':
        data = await exportProjects(startDate, endDate);
        filename = `projects_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'leads':
        data = await exportLeads(startDate, endDate);
        filename = `leads_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'tasks':
        data = await exportTasks(startDate, endDate);
        filename = `tasks_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'invoices':
        data = await exportInvoices(startDate, endDate);
        filename = `invoices_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'activities':
        data = await exportActivities(startDate, endDate);
        filename = `activities_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'financial-report':
        data = await exportFinancialReport(startDate, endDate);
        filename = `financial_report_${new Date().toISOString().split('T')[0]}`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    // Convert to requested format
    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      return res.send(buffer);
    } else {
      // Default to CSV
      const csv = convertToCSV(data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csv);
    }
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Export failed' });
  }
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

async function exportProjects(startDate, endDate) {
  const query = `
    SELECT 
      p.id,
      p.name as project_name,
      p.client_name,
      p.project_type,
      p.status,
      p.progress,
      p.budget,
      p.actual_cost,
      p.start_date,
      p.deadline,
      p.completed_at,
      u.name as assigned_to,
      p.notes,
      p.created_at,
      p.updated_at
    FROM projects p
    LEFT JOIN users u ON p.assigned_to = u.id
    WHERE ($1::date IS NULL OR p.created_at >= $1)
      AND ($2::date IS NULL OR p.created_at <= $2)
    ORDER BY p.created_at DESC
  `;
  
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
}

async function exportLeads(startDate, endDate) {
  const query = `
    SELECT 
      l.id,
      l.lead_name,
      l.company_name,
      l.email,
      l.phone,
      l.lead_source,
      l.status,
      l.lead_value,
      l.notes,
      u.name as assigned_to,
      l.created_at,
      l.updated_at
    FROM leads l
    LEFT JOIN users u ON l.assigned_to = u.id
    WHERE ($1::date IS NULL OR l.created_at >= $1)
      AND ($2::date IS NULL OR l.created_at <= $2)
    ORDER BY l.created_at DESC
  `;
  
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
}

async function exportTasks(startDate, endDate) {
  const query = `
    SELECT 
      t.id,
      t.title,
      t.description,
      p.name as project_name,
      t.status,
      t.priority,
      t.estimated_hours,
      t.actual_hours,
      u.name as assigned_to,
      t.due_date,
      t.completed_at,
      t.created_at,
      t.updated_at
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE ($1::date IS NULL OR t.created_at >= $1)
      AND ($2::date IS NULL OR t.created_at <= $2)
    ORDER BY t.created_at DESC
  `;
  
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
}

async function exportInvoices(startDate, endDate) {
  const query = `
    SELECT 
      i.id,
      i.invoice_number,
      p.name as project_name,
      p.client_name,
      i.amount,
      i.status,
      i.payment_method,
      i.payment_intent_id,
      i.paid_at,
      i.due_date,
      i.created_at
    FROM invoices i
    LEFT JOIN projects p ON i.project_id = p.id
    WHERE ($1::date IS NULL OR i.created_at >= $1)
      AND ($2::date IS NULL OR i.created_at <= $2)
    ORDER BY i.created_at DESC
  `;
  
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
}

async function exportActivities(startDate, endDate) {
  const query = `
    SELECT 
      pa.id,
      p.name as project_name,
      pa.activity_type,
      pa.activity_description,
      u.name as performed_by,
      pa.created_at
    FROM project_activities pa
    LEFT JOIN projects p ON pa.project_id = p.id
    LEFT JOIN users u ON pa.user_id = u.id
    WHERE ($1::date IS NULL OR pa.created_at >= $1)
      AND ($2::date IS NULL OR pa.created_at <= $2)
    ORDER BY pa.created_at DESC
  `;
  
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
}

async function exportFinancialReport(startDate, endDate) {
  // Get comprehensive financial data
  const revenue = await db.query(`
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as invoice_count,
      SUM(amount) as total_revenue,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_revenue,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_revenue,
      AVG(amount) as average_invoice
    FROM invoices
    WHERE ($1::date IS NULL OR created_at >= $1)
      AND ($2::date IS NULL OR created_at <= $2)
    GROUP BY month
    ORDER BY month
  `, [startDate, endDate]);

  const expenses = await db.query(`
    SELECT 
      DATE_TRUNC('month', expense_date) as month,
      category,
      SUM(amount) as total_expenses,
      COUNT(*) as expense_count
    FROM expenses
    WHERE ($1::date IS NULL OR expense_date >= $1)
      AND ($2::date IS NULL OR expense_date <= $2)
    GROUP BY month, category
    ORDER BY month, category
  `, [startDate, endDate]);

  // Combine data for financial report
  const report = [];
  
  revenue.rows.forEach(rev => {
    const monthExpenses = expenses.rows.filter(exp => 
      exp.month.getTime() === rev.month.getTime()
    );
    
    const totalExpenses = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.total_expenses), 0);
    
    report.push({
      month: rev.month.toISOString().split('T')[0],
      invoice_count: rev.invoice_count,
      total_revenue: rev.total_revenue,
      paid_revenue: rev.paid_revenue,
      pending_revenue: rev.pending_revenue,
      total_expenses: totalExpenses,
      net_profit: parseFloat(rev.paid_revenue) - totalExpenses,
      average_invoice: rev.average_invoice
    });
  });

  return report;
}