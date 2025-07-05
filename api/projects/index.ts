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
        // Get all projects with related data
        const { data: projects, error: getError } = await supabase
          .from('projects')
          .select(`
            *,
            client:leads(name, company),
            assigned_to:profiles(name, email),
            tasks(id, title, status)
          `)
          .order('created_at', { ascending: false })

        if (getError) throw getError

        // Transform data to match frontend expectations
        const transformedProjects = projects.map((project: any) => ({
          ...project,
          id: project.id.toString(),
          clientName: project.client?.name || 'Unknown Client',
          projectName: project.name || 'Untitled Project',
          assignedToName: project.assigned_to?.name || 'Unassigned',
          tasks: {
            total: project.tasks?.length || 0,
            completed: project.tasks?.filter((t: any) => t.status === 'done').length || 0
          }
        }))

        return res.status(200).json({ projects: transformedProjects })

      case 'POST':
        // Create new project
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert({
            ...req.body,
            assigned_to: user.id // Assign to current user by default
          })
          .select(`
            *,
            client:leads(name, company),
            assigned_to:profiles(name, email)
          `)
          .single()

        if (createError) throw createError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'created_project',
          entity_type: 'project',
          entity_id: newProject.id,
          metadata: { project_name: newProject.name }
        })

        return res.status(201).json(newProject)

      case 'PUT':
        // Update project
        const { id, ...updates } = req.body
        
        const { data: updatedProject, error: updateError } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            client:leads(name, company),
            assigned_to:profiles(name, email)
          `)
          .single()

        if (updateError) throw updateError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'updated_project',
          entity_type: 'project',
          entity_id: id,
          metadata: { project_name: updatedProject.name }
        })

        return res.status(200).json(updatedProject)

      case 'DELETE':
        // Delete project
        const { id: deleteId } = req.body
        
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', deleteId)

        if (deleteError) throw deleteError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'deleted_project',
          entity_type: 'project',
          entity_id: deleteId,
          metadata: { project_id: deleteId }
        })

        return res.status(200).json({ message: 'Project deleted successfully' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('Projects API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 