#!/usr/bin/env node

/**
 * Cleanup Duplicate Data Script
 * Removes duplicate projects and tasks from the database
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate data...\n')
  
  try {
    // Get all projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (!projects) {
      console.log('No projects found')
      return
    }
    
    console.log(`Found ${projects.length} total projects`)
    
    // Find duplicates by name
    const projectGroups = {}
    projects.forEach(project => {
      if (!projectGroups[project.name]) {
        projectGroups[project.name] = []
      }
      projectGroups[project.name].push(project)
    })
    
    // Keep the oldest project of each name, delete the rest
    const projectsToDelete = []
    
    Object.entries(projectGroups).forEach(([name, projectList]) => {
      if (projectList.length > 1) {
        console.log(`Found ${projectList.length} duplicates for "${name}"`)
        
        // Sort by created_at and keep the oldest
        projectList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        
        // Mark all but the first (oldest) for deletion
        for (let i = 1; i < projectList.length; i++) {
          projectsToDelete.push(projectList[i].id)
        }
      }
    })
    
    if (projectsToDelete.length === 0) {
      console.log('✅ No duplicate projects found')
    } else {
      console.log(`🗑️  Deleting ${projectsToDelete.length} duplicate projects...`)
      
      // Delete duplicate projects
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .in('id', projectsToDelete)
      
      if (deleteError) {
        console.error('❌ Error deleting duplicate projects:', deleteError.message)
      } else {
        console.log('✅ Duplicate projects deleted successfully')
      }
    }
    
    // Also clean up any orphaned tasks (tasks without valid project_id)
    console.log('\n🔍 Checking for orphaned tasks...')
    
    const { data: allTasks } = await supabase
      .from('tasks')
      .select('id, project_id')
    
    if (allTasks) {
      const validProjectIds = projects.filter(p => !projectsToDelete.includes(p.id)).map(p => p.id)
      const orphanedTasks = allTasks.filter(task => task.project_id && !validProjectIds.includes(task.project_id))
      
      if (orphanedTasks.length > 0) {
        console.log(`🗑️  Deleting ${orphanedTasks.length} orphaned tasks...`)
        
        const { error: taskDeleteError } = await supabase
          .from('tasks')
          .delete()
          .in('id', orphanedTasks.map(t => t.id))
        
        if (taskDeleteError) {
          console.error('❌ Error deleting orphaned tasks:', taskDeleteError.message)
        } else {
          console.log('✅ Orphaned tasks deleted successfully')
        }
      } else {
        console.log('✅ No orphaned tasks found')
      }
    }
    
    // Final count
    const { data: finalProjects } = await supabase
      .from('projects')
      .select('*')
    
    const { data: finalTasks } = await supabase
      .from('tasks')
      .select('*')
    
    console.log('\n📊 Final Counts:')
    console.log(`   - Projects: ${finalProjects?.length || 0}`)
    console.log(`   - Tasks: ${finalTasks?.length || 0}`)
    
    console.log('\n✨ Cleanup completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

cleanupDuplicates() 