# Cloud Development Environment Usage Guide

## Overview

The App Suite Cloud Development Environment allows you to build, test, and deploy client applications directly from your browser using WebContainers technology.

## Getting Started

### 1. Access Cloud Development

Navigate to **Command Center** → **Cloud Dev** in your dashboard.

### 2. Create a New Project

1. Click **"New Project"** button
2. Enter project details:
   - **Project Name**: Your application name
   - **Client Name**: The client this project is for
   - **Template**: Choose from available templates:
     - React CRM Template
     - Next.js Analytics Dashboard

3. Click **"Create Project"**

### 3. Start Development

1. Find your project in the projects grid
2. Click **"Start"** to boot the WebContainer
3. Wait for the environment to initialize

## Development Workflow

### Using the Editor

1. **File Explorer** (left panel):
   - Browse project files
   - Click any file to open in editor
   - File icons indicate file types

2. **Code Editor** (right panel):
   - Edit files with syntax highlighting
   - Auto-save or manual save with Cmd/Ctrl+S
   - Full VS Code-like experience

### Using the Terminal

The integrated terminal provides a full Node.js environment:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Install new packages
npm install axios react-query

# Git operations
git init
git add .
git commit -m "Initial commit"
```

### AI Assistant

1. Switch to the **AI Assistant** tab
2. Describe what you want to build
3. Claude will generate code for you
4. Review and apply the generated code

Example prompts:
- "Create a user authentication form"
- "Add a data table component with sorting"
- "Create an API service for fetching customer data"

### Preview

1. Run `npm run dev` in the terminal
2. Switch to the **Preview** tab
3. Your application will appear in the preview window
4. Changes auto-reload as you save files

## Deployment

### Quick Deploy

From the terminal:
```bash
# Deploy to Netlify
netlify deploy

# Deploy to Vercel
vercel

# Deploy to Railway
railway up
```

### Using Deployment Manager

1. Go to **Command Center** → **Deployments**
2. Click **"New Deployment"**
3. Follow the 4-step wizard:
   - Choose platform
   - Configure project
   - Set environment variables
   - Review and deploy

## Best Practices

### Project Organization

```
project/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   └── utils/        # Utility functions
├── public/           # Static assets
├── package.json      # Dependencies
└── vite.config.js    # Build configuration
```

### Performance Tips

1. **Use the terminal efficiently**:
   - Run `npm install` once at project start
   - Use `npm run dev` for hot-reloading
   - Keep terminal commands simple

2. **Save frequently**:
   - Changes are stored in memory
   - Save important work regularly
   - Use git for version control

3. **AI assistance**:
   - Be specific in your prompts
   - Review generated code before using
   - Combine AI suggestions with your expertise

## Troubleshooting

### WebContainer Won't Start

1. Refresh the page
2. Check browser console for errors
3. Ensure you're using a modern browser (Chrome, Edge, Firefox)
4. Clear browser cache if needed

### Terminal Commands Not Working

1. Ensure WebContainer is fully loaded
2. Check for typos in commands
3. Some commands may not be available (e.g., sudo)
4. Use npm/yarn for package management

### Preview Not Loading

1. Make sure dev server is running (`npm run dev`)
2. Check terminal for error messages
3. Verify package.json has correct scripts
4. Port 3000 should be available

## Advanced Features

### Environment Variables

Set environment variables in your project:

```javascript
// .env file
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My CRM
```

Access in your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Custom Templates

Create your own project templates:

1. Build a starter project
2. Export the file structure
3. Save as a new template
4. Reuse for similar projects

### Collaborative Development

Coming soon:
- Real-time collaboration
- Shared terminals
- Live code sharing
- Team workspaces

## Security Notes

- Code runs in isolated WebContainers
- No access to local file system
- Network requests are sandboxed
- Each project is isolated from others

## Support

If you encounter issues:

1. Check the terminal for error messages
2. Review browser console logs
3. Contact support with:
   - Project name
   - Error messages
   - Steps to reproduce

Happy coding! 🚀