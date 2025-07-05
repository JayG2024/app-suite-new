#!/usr/bin/env node

/**
 * Add Sample Data Script
 * Adds sample projects and tasks to the database for testing
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

async function addSampleData() {
  console.log('🚀 Adding sample data to App Suite database...\n')
  
  try {
    // Get admin user ID
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'jason@jaydus.ai')
      .single()
    
    if (!profiles) {
      console.error('❌ Could not find admin user')
      return
    }
    
    const adminUserId = profiles.id
    console.log('✅ Found admin user:', adminUserId)
    
    // Get existing leads to use as clients
    const { data: leads } = await supabase
      .from('leads')
      .select('id, name, company')
      .limit(3)
    
    if (!leads || leads.length === 0) {
      console.error('❌ No leads found to create projects from')
      return
    }
    
    console.log(`✅ Found ${leads.length} leads to create projects from`)
    
    // Sample projects data
    const sampleProjects = [
      {
        name: 'E-commerce Platform Development',
        client_id: leads[0].id,
        status: 'in_progress',
        progress: 65,
        start_date: '2024-12-01',
        end_date: '2025-02-15',
        budget: 25000,
        description: 'Full-stack e-commerce platform with payment integration and inventory management',
        assigned_to: adminUserId
      },
      {
        name: 'AI-Powered Analytics Dashboard',
        client_id: leads[1].id,
        status: 'planning',
        progress: 15,
        start_date: '2025-01-15',
        end_date: '2025-04-30',
        budget: 35000,
        description: 'Machine learning dashboard for business intelligence and predictive analytics',
        assigned_to: adminUserId
      },
      {
        name: 'Mobile App for Healthcare',
        client_id: leads[2].id,
        status: 'review',
        progress: 90,
        start_date: '2024-11-01',
        end_date: '2025-01-31',
        budget: 45000,
        description: 'HIPAA-compliant mobile application for patient management and telemedicine',
        assigned_to: adminUserId
      }
    ]
    
    // Insert projects
    console.log('\n📁 Creating sample projects...')
    const projectIds = []
    
    for (const project of sampleProjects) {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert(project)
        .select('id')
        .single()
      
      if (error) {
        console.error(`❌ Error creating project ${project.name}:`, error.message)
      } else {
        projectIds.push(newProject.id)
        console.log(`✅ Created project: ${project.name}`)
      }
    }
    
    // Sample tasks data
    const sampleTasks = [
      // Project 1 tasks
      {
        title: 'Design database schema',
        description: 'Create ERD and implement PostgreSQL schema',
        project_id: projectIds[0],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2024-12-10',
        completed_at: '2024-12-08'
      },
      {
        title: 'Implement user authentication',
        description: 'Set up JWT authentication with role-based access',
        project_id: projectIds[0],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2024-12-15',
        completed_at: '2024-12-12'
      },
      {
        title: 'Create product catalog',
        description: 'Build product listing and search functionality',
        project_id: projectIds[0],
        assigned_to: adminUserId,
        status: 'in_progress',
        priority: 'medium',
        due_date: '2024-12-25'
      },
      {
        title: 'Integrate payment gateway',
        description: 'Connect Stripe payment processing',
        project_id: projectIds[0],
        assigned_to: adminUserId,
        status: 'todo',
        priority: 'high',
        due_date: '2025-01-05'
      },
      
      // Project 2 tasks
      {
        title: 'Requirements gathering',
        description: 'Meet with stakeholders to define analytics requirements',
        project_id: projectIds[1],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2025-01-20',
        completed_at: '2025-01-18'
      },
      {
        title: 'Data pipeline design',
        description: 'Design ETL processes for data ingestion',
        project_id: projectIds[1],
        assigned_to: adminUserId,
        status: 'in_progress',
        priority: 'medium',
        due_date: '2025-02-01'
      },
      {
        title: 'ML model development',
        description: 'Build predictive analytics models',
        project_id: projectIds[1],
        assigned_to: adminUserId,
        status: 'todo',
        priority: 'high',
        due_date: '2025-03-15'
      },
      
      // Project 3 tasks
      {
        title: 'UI/UX design',
        description: 'Create wireframes and mockups',
        project_id: projectIds[2],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2024-11-15',
        completed_at: '2024-11-12'
      },
      {
        title: 'Frontend development',
        description: 'Build React Native mobile app',
        project_id: projectIds[2],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2024-12-15',
        completed_at: '2024-12-10'
      },
      {
        title: 'Backend API development',
        description: 'Create RESTful APIs for mobile app',
        project_id: projectIds[2],
        assigned_to: adminUserId,
        status: 'done',
        priority: 'high',
        due_date: '2024-12-20',
        completed_at: '2024-12-18'
      },
      {
        title: 'Security audit',
        description: 'Conduct HIPAA compliance review',
        project_id: projectIds[2],
        assigned_to: adminUserId,
        status: 'in_progress',
        priority: 'high',
        due_date: '2025-01-25'
      },
      {
        title: 'User testing',
        description: 'Conduct beta testing with healthcare providers',
        project_id: projectIds[2],
        assigned_to: adminUserId,
        status: 'todo',
        priority: 'medium',
        due_date: '2025-01-30'
      }
    ]
    
    // Insert tasks
    console.log('\n✅ Creating sample tasks...')
    let createdTasks = 0
    
    for (const task of sampleTasks) {
      const { error } = await supabase
        .from('tasks')
        .insert(task)
      
      if (error) {
        console.error(`❌ Error creating task ${task.title}:`, error.message)
      } else {
        createdTasks++
        console.log(`✅ Created task: ${task.title}`)
      }
    }
    
    console.log('\n📊 Summary:')
    console.log(`   - Projects created: ${projectIds.length}`)
    console.log(`   - Tasks created: ${createdTasks}`)
    console.log('\n✨ Sample data added successfully!')
    console.log('\n🔗 You can now test the admin portal at /admin')
    
  } catch (error) {
    console.error('\n❌ Error adding sample data:', error.message)
    console.error('Stack:', error.stack)
  }
}

addSampleData() 