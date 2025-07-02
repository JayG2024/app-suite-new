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
        // Get all leads
        const { data: leads, error: getError } = await supabase
          .from('leads')
          .select(`
            *,
            assigned_to:profiles(name, email)
          `)
          .order('created_at', { ascending: false })

        if (getError) throw getError
        return res.status(200).json(leads)

      case 'POST':
        // Create new lead
        const { data: newLead, error: createError } = await supabase
          .from('leads')
          .insert({
            ...req.body,
            assigned_to: user.id // Assign to current user by default
          })
          .select(`
            *,
            assigned_to:profiles(name, email)
          `)
          .single()

        if (createError) throw createError

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: user.id,
          action: 'created_lead',
          entity_type: 'lead',
          entity_id: newLead.id,
          metadata: { lead_name: newLead.name }
        })

        return res.status(201).json(newLead)

      case 'PUT':
        // Bulk update leads (for status changes)
        const { ids, updates } = req.body
        
        const { data: updatedLeads, error: updateError } = await supabase
          .from('leads')
          .update(updates)
          .in('id', ids)
          .select()

        if (updateError) throw updateError

        // Log bulk activity
        await supabase.from('activity_log').insert(
          ids.map((id: string) => ({
            user_id: user.id,
            action: 'updated_lead_status',
            entity_type: 'lead',
            entity_id: id,
            metadata: { new_status: updates.status }
          }))
        )

        return res.status(200).json(updatedLeads)

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}