import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config({ path: '.env.local' });

async function checkProject() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Check the specific project
    const projectId = '0de813e5-a341-4455-b8f1-7bc5735725d3';
    console.log(`🔍 Looking for project: ${projectId}\n`);
    
    // First check if it exists in projects table
    const projectResult = await client.query(
      'SELECT * FROM projects WHERE id = $1 OR name = $1',
      [projectId]
    );
    
    if (projectResult.rows.length > 0) {
      console.log('✅ Found in projects table:');
      console.log(projectResult.rows[0]);
    } else {
      console.log('❌ Not found in projects table');
    }
    
    // Check all projects to see what's there
    console.log('\n📊 All projects in database:');
    const allProjects = await client.query(
      'SELECT id, name, status, created_at FROM projects ORDER BY created_at DESC'
    );
    
    allProjects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ID: ${project.id}, Name: "${project.name}", Status: ${project.status}`);
    });
    
    // Check if it might be in another table
    console.log('\n🔍 Checking other tables...');
    
    // Check leads
    const leadResult = await client.query(
      'SELECT id, name, company FROM leads WHERE id::text = $1',
      [projectId]
    );
    if (leadResult.rows.length > 0) {
      console.log('Found in leads table:', leadResult.rows[0]);
    }
    
    // Check tasks
    const taskResult = await client.query(
      'SELECT id, title FROM tasks WHERE id::text = $1',
      [projectId]
    );
    if (taskResult.rows.length > 0) {
      console.log('Found in tasks table:', taskResult.rows[0]);
    }
    
    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProject();