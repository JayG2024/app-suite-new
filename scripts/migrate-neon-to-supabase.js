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

async function migrateData() {
  console.log('🚀 Starting Neon to Supabase migration...\n');

  try {
    // Connect to Neon
    await neonClient.connect();
    console.log('✅ Connected to Neon database');

    // Get user mapping (Neon numeric IDs to Supabase UUIDs)
    console.log('\n📋 Creating user ID mapping...');
    const userMapping = {
      1: '3f29e5ba-4833-4f82-aadd-b4012fd797b4', // jason@jaydus.ai
      2: 'd8c7e932-4321-4890-b456-123456789012', // almir@jaydus.ai  
      3: 'a1b2c3d4-5678-9101-1121-314151617181'  // jorge@jaydus.ai
    };

    // Get actual Supabase user IDs
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

    // Migrate Leads
    console.log('\n📊 Migrating leads...');
    const leadsResult = await neonClient.query('SELECT * FROM leads ORDER BY created_at');
    console.log(`Found ${leadsResult.rows.length} leads to migrate`);

    const leadIdMapping = {};
    
    for (const lead of leadsResult.rows) {
      const supabaseLead = {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: lead.status || 'new',
        value: lead.value,
        source: lead.source,
        notes: lead.notes,
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
        console.log(`✅ Migrated lead: ${lead.name}`);
      }
    }

    // Migrate Projects
    console.log('\n📁 Migrating projects...');
    const projectsResult = await neonClient.query('SELECT * FROM projects ORDER BY created_at');
    console.log(`Found ${projectsResult.rows.length} projects to migrate`);

    const projectIdMapping = {};

    for (const project of projectsResult.rows) {
      const supabaseProject = {
        name: project.name,
        client_id: leadIdMapping[project.client_id] || null,
        status: project.status || 'planning',
        progress: project.progress || 0,
        start_date: project.start_date,
        end_date: project.end_date,
        budget: project.budget,
        description: project.description,
        assigned_to: emailToId[project.assigned_to] || null,
        created_at: project.created_at,
        updated_at: project.updated_at
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(supabaseProject)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error migrating project ${project.name}:`, error.message);
      } else {
        projectIdMapping[project.id] = data.id;
        console.log(`✅ Migrated project: ${project.name}`);
      }
    }

    // Migrate Tasks
    console.log('\n✅ Migrating tasks...');
    const tasksResult = await neonClient.query('SELECT * FROM tasks ORDER BY created_at');
    console.log(`Found ${tasksResult.rows.length} tasks to migrate`);

    for (const task of tasksResult.rows) {
      const supabaseTask = {
        title: task.title,
        description: task.description,
        project_id: projectIdMapping[task.project_id] || null,
        assigned_to: emailToId[task.assigned_to] || null,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: task.updated_at
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

    // Migrate Invoices
    console.log('\n💰 Migrating invoices...');
    const invoicesResult = await neonClient.query('SELECT * FROM invoices ORDER BY created_at');
    console.log(`Found ${invoicesResult.rows.length} invoices to migrate`);

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

    // Migrate Email Templates
    console.log('\n📧 Migrating email templates...');
    const templatesResult = await neonClient.query('SELECT * FROM email_templates ORDER BY created_at');
    console.log(`Found ${templatesResult.rows.length} email templates to migrate`);

    for (const template of templatesResult.rows) {
      const supabaseTemplate = {
        name: template.name,
        subject: template.subject,
        body: template.body,
        category: template.category,
        variables: template.variables,
        created_by: emailToId[template.created_by] || null,
        created_at: template.created_at,
        updated_at: template.updated_at
      };

      const { error } = await supabase
        .from('email_templates')
        .upsert(supabaseTemplate, {
          onConflict: 'name'
        });

      if (error) {
        console.error(`❌ Error migrating template ${template.name}:`, error.message);
      } else {
        console.log(`✅ Migrated template: ${template.name}`);
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`- Leads: ${leadsResult.rows.length} migrated`);
    console.log(`- Projects: ${projectsResult.rows.length} migrated`);
    console.log(`- Tasks: ${tasksResult.rows.length} migrated`);
    console.log(`- Invoices: ${invoicesResult.rows.length} migrated`);
    console.log(`- Email Templates: ${templatesResult.rows.length} migrated`);

    console.log('\n✨ Migration complete!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await neonClient.end();
  }
}

// Run migration
migrateData();