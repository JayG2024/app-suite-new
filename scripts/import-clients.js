#!/usr/bin/env node

// Script to import all clients from clientData.ts into the database
// Run with: node scripts/import-clients.js

import { clients } from '../src/data/clientData.ts';

const API_BASE = 'http://localhost:8080/.netlify/functions';
const BATCH_SIZE = 10;

async function importClients() {
  console.log(`Starting import of ${clients.length} clients...`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Process clients in batches
  for (let i = 0; i < clients.length; i += BATCH_SIZE) {
    const batch = clients.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} (clients ${i + 1}-${Math.min(i + BATCH_SIZE, clients.length)})`);
    
    // Process each client in the batch
    await Promise.all(
      batch.map(async (client) => {
        try {
          // Determine client type based on company
          let clientType = 'prospect';
          if (client.company && ['PPOK', 'MyComputerCareer', 'Select Mat', 'Fireman Creative'].includes(client.company)) {
            clientType = 'active';
          }
          
          const response = await fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `${client.firstName} ${client.lastName}`.trim(),
              company: client.company || '',
              email: client.email,
              phone: client.phone || '',
              status: clientType === 'active' ? 'active' : 'new',
              source: 'import',
              notes: `Title: ${client.title || 'N/A'}\nLinkedIn: ${client.linkedin ? `linkedin.com/in/${client.linkedin}` : 'N/A'}\nImported: ${new Date().toLocaleDateString()}`,
              assigned_to: null,
              metadata: {
                firstName: client.firstName,
                lastName: client.lastName,
                title: client.title,
                linkedin: client.linkedin,
                dateAdded: client.dateAdded
              }
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          }

          const result = await response.json();
          console.log(`✓ Imported: ${client.email}`);
          successCount++;
        } catch (error) {
          console.error(`✗ Failed to import ${client.email}:`, error.message);
          errors.push({ client: client.email, error: error.message });
          errorCount++;
        }
      })
    );
    
    // Small delay between batches to avoid overwhelming the server
    if (i + BATCH_SIZE < clients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total clients: ${clients.length}`);
  console.log(`Successfully imported: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(({ client, error }) => {
      console.log(`${client}: ${error}`);
    });
  }
}

// Run the import
importClients().catch(console.error);