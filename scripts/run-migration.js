import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Supabase credentials
const supabaseUrl = 'https://imeigitblspjedqwsigf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWlnaXRibHNwamVkcXdzaWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0MDc0OSwiZXhwIjoyMDY3MDE2NzQ5fQ.9icrIfO2H-POTc5tVpo93zqhn9TAQaqr2DH9sy8piBA'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🚀 Running database migration...\n')
  
  try {
    // Read migration file
    const migrationSQL = readFileSync(
      join(__dirname, '../supabase/migrations/001_initial_schema.sql'),
      'utf8'
    )
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`Found ${statements.length} SQL statements to execute\n`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      // Skip if just whitespace
      if (statement.trim().length <= 1) continue
      
      // Get operation type
      const operation = statement.trim().substring(0, 50).replace(/\n/g, ' ')
      console.log(`[${i + 1}/${statements.length}] Executing: ${operation}...`)
      
      // For complex statements, we need to use raw SQL execution
      if (statement.includes('CREATE TYPE') || 
          statement.includes('CREATE EXTENSION') ||
          statement.includes('CREATE POLICY') ||
          statement.includes('CREATE TRIGGER') ||
          statement.includes('CREATE FUNCTION')) {
        
        // These need to be run through SQL editor
        console.log('   ⚠️  Complex statement - needs SQL editor')
        continue
      }
      
      // Try to execute simple CREATE TABLE statements
      if (statement.includes('CREATE TABLE')) {
        try {
          // Extract table name
          const tableMatch = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:public\.)?(\w+)/i)
          const tableName = tableMatch ? tableMatch[1] : 'unknown'
          
          // Check if table exists
          const { data: tables } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', tableName)
          
          if (tables && tables.length > 0) {
            console.log(`   ✓ Table '${tableName}' already exists`)
          } else {
            console.log(`   ⚠️  Table '${tableName}' needs to be created in SQL editor`)
          }
        } catch (e) {
          console.log('   ⚠️  Needs SQL editor')
        }
      }
    }
    
    console.log('\n❌ Migration requires Supabase SQL Editor\n')
    console.log('📋 Please follow these steps:\n')
    console.log('1. Open: https://supabase.com/dashboard/project/imeigitblspjedqwsigf/sql/new')
    console.log('2. Copy the contents of: supabase/migrations/001_initial_schema.sql')
    console.log('3. Paste into SQL editor')
    console.log('4. Click "Run" button')
    console.log('\nThe migration creates:')
    console.log('- Custom types (user_role, lead_status, etc.)')
    console.log('- All tables with proper relationships')
    console.log('- Row Level Security policies')
    console.log('- Indexes for performance')
    console.log('- Triggers for updated_at timestamps')
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

runMigration()