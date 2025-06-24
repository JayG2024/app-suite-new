import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config({ path: '.env.local' });

console.log('🔍 Testing Database Connection...\n');

async function testConnection() {
  // Test 1: Check if DATABASE_URL exists
  console.log('1️⃣ Checking DATABASE_URL...');
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is not set!');
    return;
  }
  console.log('✅ DATABASE_URL is set');
  console.log(`   URL: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')}\n`);

  // Test 2: Try to connect
  console.log('2️⃣ Attempting to connect...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Test 3: Check tables
    console.log('3️⃣ Checking database tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 Found tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Test 4: Check leads table
    console.log('\n4️⃣ Checking leads table...');
    const leadsResult = await client.query('SELECT COUNT(*) FROM leads');
    console.log(`✅ Leads table has ${leadsResult.rows[0].count} records`);

    // Test 5: Run the same query as dashboard-metrics
    console.log('\n5️⃣ Testing dashboard metrics query...');
    const metricsResult = await client.query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as won_deals
      FROM leads
    `);
    console.log('✅ Metrics query successful:', metricsResult.rows[0]);

    await client.end();
    console.log('\n✅ All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n🔧 Fix: Check if the database host is correct');
    } else if (error.code === '28P01') {
      console.error('\n🔧 Fix: Check username/password in DATABASE_URL');
    } else if (error.code === '3D000') {
      console.error('\n🔧 Fix: Database does not exist');
    }
  }
}

testConnection();