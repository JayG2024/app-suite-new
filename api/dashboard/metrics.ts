import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Verify authentication
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  try {
    // Fetch all data needed for metrics
    const [
      { data: leads, error: leadsError },
      { data: projects, error: projectsError },
      { data: tasks, error: tasksError },
      { data: invoices, error: invoicesError }
    ] = await Promise.all([
      supabase.from('leads').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('invoices').select('*')
    ])

    if (leadsError) throw leadsError
    if (projectsError) throw projectsError
    if (tasksError) throw tasksError
    if (invoicesError) throw invoicesError

    // Calculate metrics
    const totalRevenue = leads
      .filter((lead: any) => lead.status === 'won')
      .reduce((sum: number, lead: any) => sum + (lead.value || 0), 0)

    const activeProjects = projects
      .filter((project: any) => ['in_progress', 'review'].includes(project.status))
      .length

    const totalClients = leads
      .filter((lead: any) => lead.status === 'won')
      .length

    const pipelineValue = leads
      .filter((lead: any) => ['qualified', 'proposal'].includes(lead.status))
      .reduce((sum: number, lead: any) => sum + (lead.value || 0), 0)

    const proposalsSent = leads
      .filter((lead: any) => lead.status === 'proposal')
      .length

    const wonDeals = leads.filter((lead: any) => lead.status === 'won').length
    const lostDeals = leads.filter((lead: any) => lead.status === 'lost').length
    const conversionRate = (wonDeals + lostDeals) > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0

    const averageProjectValue = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task: any) => task.status === 'done').length
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Calculate monthly growth (mock for now)
    const monthlyGrowth = 15

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
    }

    return res.status(200).json(metrics)

  } catch (error) {
    console.error('Dashboard Metrics API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 