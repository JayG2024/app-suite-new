import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getEnvConfig } from '@/utils/envValidation'

const env = getEnvConfig();
const supabaseUrl = env.VITE_SUPABASE_URL!;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})

// Helper functions for common operations
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Lead management helpers
export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      assigned_to:profiles(name, email)
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createLead = async (lead: any) => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()
  return { data, error }
}

export const updateLead = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Project management helpers
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:leads(name, company),
      assigned_to:profiles(name, email)
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createProject = async (project: any) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  return { data, error }
}

// Task management helpers
export const getTasks = async (projectId?: string) => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      project:projects(name),
      assigned_to:profiles(name, email)
    `)
  
  if (projectId) {
    query = query.eq('project_id', projectId)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const createTask = async (task: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  return { data, error }
}

export const updateTask = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Real-time subscriptions
export const subscribeToLeads = (callback: (payload: any) => void) => {
  return supabase
    .channel('leads-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, callback)
    .subscribe()
}

export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('projects-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
    .subscribe()
}

export const subscribeToTasks = (callback: (payload: any) => void) => {
  return supabase
    .channel('tasks-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe()
}