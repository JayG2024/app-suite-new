// Simple test to see what pages are defined
const fs = require('fs');

// Read the SEO script
const scriptContent = fs.readFileSync('scripts/generate-seo-pages.js', 'utf-8');

// Extract the pages array
const pagesMatch = scriptContent.match(/const pages = \[([\s\S]*?)\];/);
if (pagesMatch) {
    console.log('Found pages array');
    // Count the number of path entries
    const pathMatches = pagesMatch[1].match(/path: '[^']*'/g);
    console.log(`Number of pages found: ${pathMatches ? pathMatches.length : 0}`);
    if (pathMatches) {
        pathMatches.forEach((path, index) => {
            console.log(`${index + 1}. ${path}`);
        });
    }
} else {
    console.log('Could not find pages array');
}