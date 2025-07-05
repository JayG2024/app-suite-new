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

  try {
    switch (req.method) {
      case 'GET':
        // Get all tasks with related data
        const { data: tasks, error: getError } = await supabase
          .from('tasks')
          .select(`
            *,
            project:projects(name),
            assigned_to:profiles(name, email)
          `)
          .order('created_at', { ascending: false })

        if (getError) throw getError

        // Transform data to match frontend expectations
        const transformedTasks = tasks.map((task: any) => ({
          ...task,
          id: task.id.toString(),
          project_name: task.project?.name || 'No Project',
          assigned_to_name: task.assigned_to?.name || 'Unassigned',
          estimated_hours: task.estimated_hours || 0,
          actual_hours: task.actual_hours || 0,
          tags: task.tags || [],
          checklist: task.checklist || []
        }))

        return res.status(200).json({ tasks: transformedTasks })

      case 'POST':
        // Create new task
        const { data: newTask, error: createError } = await supabase
          .from('tasks')
          .insert({
            ...req.body,
            assigned_to: req.body.assigned_to || user.id // Assign to current user by default
          })
          .select(`
            *,
            project:projects(name),
            assigned_to:profiles(name, email)
          `)
          .single()

        if (createError) throw createError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'created_task',
          entity_type: 'task',
          entity_id: newTask.id,
          metadata: { task_title: newTask.title }
        })

        return res.status(201).json(newTask)

      case 'PUT':
        // Update task
        const { id, ...updates } = req.body
        
        const { data: updatedTask, error: updateError } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            project:projects(name),
            assigned_to:profiles(name, email)
          `)
          .single()

        if (updateError) throw updateError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'updated_task',
          entity_type: 'task',
          entity_id: id,
          metadata: { task_title: updatedTask.title }
        })

        return res.status(200).json(updatedTask)

      case 'DELETE':
        // Delete task
        const { id: deleteId } = req.body
        
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', deleteId)

        if (deleteError) throw deleteError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'deleted_task',
          entity_type: 'task',
          entity_id: deleteId,
          metadata: { task_id: deleteId }
        })

        return res.status(200).json({ message: 'Task deleted successfully' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('Tasks API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 