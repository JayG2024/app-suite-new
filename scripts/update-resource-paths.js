import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateResourcePaths() {
  try {
    console.log('Updating resource file paths...');

    // Update existing resources with file paths
    const updates = [
      {
        title: 'Web Development Process Guide',
        file_path: '/resources/web-development-process.pdf'
      },
      {
        title: 'Security & Compliance Overview',
        file_path: '/resources/security-compliance.pdf'
      },
      {
        title: 'Service Comparison Chart',
        file_path: '/resources/service-comparison.pdf'
      },
      {
        title: 'ROI Calculator Template',
        file_path: '/resources/roi-calculator.xlsx'
      },
      {
        title: 'Project Proposal Template',
        file_path: '/resources/project-proposal-template.docx'
      },
      {
        title: 'Statement of Work Template',
        file_path: '/resources/sow-template.docx'
      },
      {
        title: 'Partner Onboarding Guide',
        file_path: '/resources/partner-onboarding.pdf'
      },
      {
        title: 'Sales Best Practices',
        file_path: '/resources/sales-best-practices.pdf'
      }
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('resources')
        .update({ file_path: update.file_path })
        .eq('title', update.title);

      if (error) {
        console.error(`Error updating ${update.title}:`, error);
      } else {
        console.log(`Updated ${update.title}`);
      }
    }

    console.log('Resource paths updated successfully!');
  } catch (error) {
    console.error('Error updating resource paths:', error);
  }
}

updateResourcePaths();