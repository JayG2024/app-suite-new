import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Neon connection
const neonClient = new pg.Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_PNKhwVk18jzs@ep-morning-math-a46r9c11-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

// Supabase connection
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Status mappings
const leadStatusMap = {
  'active': 'contacted',
  'new': 'new',
  'qualified': 'qualified',
  'unqualified': 'lost',
  'proposal': 'proposal',
  'negotiation': 'proposal',
  'closed-won': 'won',
  'closed-lost': 'lost'
};

const projectStatusMap = {
  'active': 'in_progress',
  'planning': 'planning',
  'completed': 'completed',
  'on-hold': 'on_hold',
  'cancelled': 'on_hold'
};

async function migrateData() {
  console.log('🚀 Starting Neon to Supabase migration...\n');

  try {
    // Connect to Neon
    await neonClient.connect();
    console.log('✅ Connected to Neon database');

    // Get user mapping
    console.log('\n📋 Creating user ID mapping...');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email');
    
    const emailToId = {};
    profiles.forEach(p => {
      if (p.email === 'jason@jaydus.ai') emailToId[1] = p.id;
      if (p.email === 'almir@jaydus.ai') emailToId[2] = p.id;
      if (p.email === 'jorge@jaydus.ai') emailToId[3] = p.id;
    });

    console.log('User mapping:', emailToId);

    // Clear existing data (optional - comment out if you want to keep existing)
    console.log('\n🧹 Clearing existing data...');
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Migrate Leads
    console.log('\n📊 Migrating leads...');
    const leadsResult = await neonClient.query('SELECT * FROM leads ORDER BY created_at');
    console.log(`Found ${leadsResult.rows.length} leads to migrate`);

    const leadIdMapping = {};
    
    for (const lead of leadsResult.rows) {
      const mappedStatus = leadStatusMap[lead.status] || 'new';
      
      const supabaseLead = {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: mappedStatus,
        value: lead.value,
        source: lead.source,
        notes: lead.notes || lead.description,
        assigned_to: emailToId[lead.assigned_to] || null,
        created_at: lead.created_at,
        updated_at: lead.updated_at
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(supabaseLead)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error migrating lead ${lead.name}:`, error.message);
      } else {
        leadIdMapping[lead.id] = data.id;
        console.log(`✅ Migrated lead: ${lead.name} (${lead.status} → ${mappedStatus})`);
      }
    }

    // Migrate Projects
    console.log('\n📁 Migrating projects...');
    const projectsResult = await neonClient.query('SELECT * FROM projects ORDER BY created_date');
    console.log(`Found ${projectsResult.rows.length} projects to migrate`);

    const projectIdMapping = {};

    for (const project of projectsResult.rows) {
      const mappedStatus = projectStatusMap[project.status] || 'planning';
      
      const supabaseProject = {
        name: project.project_name,
        client_id: leadIdMapping[project.lead_id] || null,
        status: mappedStatus,
        progress: project.progress_percentage || 0,
        start_date: project.start_date,
        end_date: project.deadline,
        budget: project.estimated_value || project.actual_value,
        description: project.notes,
        assigned_to: emailToId[project.assigned_to] || null,
        created_at: project.created_date,
        updated_at: project.updated_date
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(supabaseProject)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error migrating project ${project.project_name}:`, error.message);
      } else {
        projectIdMapping[project.id] = data.id;
        console.log(`✅ Migrated project: ${project.project_name}`);
      }
    }

    // Migrate Tasks
    console.log('\n✅ Migrating tasks...');
    const tasksResult = await neonClient.query('SELECT * FROM tasks ORDER BY created_date');
    console.log(`Found ${tasksResult.rows.length} tasks to migrate`);

    for (const task of tasksResult.rows) {
      const taskStatus = task.status === 'completed' ? 'done' : 
                        task.status === 'in-progress' ? 'in_progress' : 
                        'todo';
      
      const supabaseTask = {
        title: task.title,
        description: task.description,
        project_id: projectIdMapping[task.project_id] || null,
        assigned_to: emailToId[task.assigned_to] || null,
        status: taskStatus,
        priority: task.priority || 'medium',
        due_date: task.due_date,
        completed_at: task.completed_at || task.completed_date,
        created_at: task.created_date,
        updated_at: task.updated_date
      };

      const { error } = await supabase
        .from('tasks')
        .insert(supabaseTask);

      if (error) {
        console.error(`❌ Error migrating task ${task.title}:`, error.message);
      } else {
        console.log(`✅ Migrated task: ${task.title}`);
      }
    }

    // Check for invoices table
    try {
      const invoicesResult = await neonClient.query('SELECT * FROM invoices ORDER BY created_at');
      console.log(`\n💰 Found ${invoicesResult.rows.length} invoices to migrate`);
      
      for (const invoice of invoicesResult.rows) {
        const supabaseInvoice = {
          invoice_number: invoice.invoice_number,
          project_id: projectIdMapping[invoice.project_id] || null,
          client_id: leadIdMapping[invoice.client_id] || null,
          amount: invoice.amount,
          status: invoice.status || 'draft',
          due_date: invoice.due_date,
          paid_date: invoice.paid_date,
          items: invoice.items,
          created_at: invoice.created_at,
          updated_at: invoice.updated_at
        };

        const { error } = await supabase
          .from('invoices')
          .insert(supabaseInvoice);

        if (error) {
          console.error(`❌ Error migrating invoice ${invoice.invoice_number}:`, error.message);
        } else {
          console.log(`✅ Migrated invoice: ${invoice.invoice_number}`);
        }
      }
    } catch (e) {
      console.log('\n💰 No invoices table found in Neon');
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`- Leads: ${leadsResult.rows.length} migrated`);
    console.log(`- Projects: ${projectsResult.rows.length} migrated`);
    console.log(`- Tasks: ${tasksResult.rows.length} migrated`);

    console.log('\n✨ Migration complete!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await neonClient.end();
  }
}

// Run migration
migrateData();