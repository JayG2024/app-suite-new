// Browser console script to import clients
// 1. Navigate to http://localhost:8080/admin
// 2. Open browser console (F12)
// 3. Paste and run this script

async function importClientsFromConsole() {
  // First, we need to import the client data
  const response = await fetch('/src/data/clientData.ts');
  const content = await response.text();
  
  // Parse the clients array from the file content
  const clientsMatch = content.match(/export const clients.*?=\s*(\[[\s\S]*?\]);/);
  if (!clientsMatch) {
    console.error('Could not find clients data');
    return;
  }
  
  // Evaluate the clients array (be careful with eval in production!)
  const clients = eval(clientsMatch[1]);
  console.log(`Found ${clients.length} clients to import`);
  
  const BATCH_SIZE = 10;
  let successCount = 0;
  let errorCount = 0;

  // Process clients in batches
  for (let i = 0; i < clients.length; i += BATCH_SIZE) {
    const batch = clients.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
    
    await Promise.all(
      batch.map(async (client) => {
        try {
          // Determine client type
          let clientType = 'prospect';
          if (client.company && ['PPOK', 'MyComputerCareer', 'Select Mat', 'Fireman Creative'].includes(client.company)) {
            clientType = 'active';
          }
          
          const response = await fetch('/.netlify/functions/clients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
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

          if (response.ok) {
            successCount++;
            console.log(`✓ Imported: ${client.email}`);
          } else {
            errorCount++;
            console.error(`✗ Failed: ${client.email}`);
          }
        } catch (error) {
          errorCount++;
          console.error(`✗ Error importing ${client.email}:`, error);
        }
      })
    );
    
    // Delay between batches
    if (i + BATCH_SIZE < clients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Total: ${clients.length}`);
  
  // Refresh the page to see the imported clients
  if (confirm('Import complete! Refresh the page to see the imported clients?')) {
    window.location.reload();
  }
}

// Alternative: Just click the Import button programmatically
function clickImportButton() {
  const importButton = Array.from(document.querySelectorAll('button')).find(
    btn => btn.textContent.includes('Import Clients')
  );
  
  if (importButton) {
    importButton.click();
    console.log('Import button clicked! Watch the UI for progress updates.');
  } else {
    console.error('Import Clients button not found. Make sure you are on the Clients tab.');
  }
}

console.log('=== Client Import Helper ===');
console.log('Option 1: Run importClientsFromConsole() to import via API');
console.log('Option 2: Run clickImportButton() to click the Import button');