# Cloud Development Environment Setup

## Overview
This guide explains how to set up a fully functional browser-based development environment in your App Suite dashboard, allowing you to build client projects without leaving the browser.

## Implementation Options

### Option 1: StackBlitz WebContainers (Recommended) 🚀

WebContainers allow you to run Node.js natively in the browser with no backend infrastructure.

#### Setup Steps:

1. **Install WebContainer API**
```bash
yarn add @webcontainer/api
```

2. **Update CloudDevelopment.tsx**
```typescript
import { WebContainer } from '@webcontainer/api';

// Initialize WebContainer
const webcontainerInstance = await WebContainer.boot();

// Mount file system
await webcontainerInstance.mount({
  'package.json': {
    file: {
      contents: JSON.stringify(packageJson, null, 2)
    }
  },
  'src': {
    directory: {
      'App.tsx': {
        file: {
          contents: appContent
        }
      }
    }
  }
});

// Install dependencies
const installProcess = await webcontainerInstance.spawn('npm', ['install']);

// Start dev server
const startProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
```

3. **Environment Variables**
```env
# Not needed - runs entirely in browser!
```

### Option 2: CodeSandbox API

Use CodeSandbox's cloud infrastructure for more powerful development environments.

#### Setup Steps:

1. **Get CodeSandbox API Key**
- Sign up at https://codesandbox.io
- Generate API key from settings

2. **Install SDK**
```bash
yarn add @codesandbox/sdk
```

3. **Create Sandbox**
```typescript
import { createSandbox } from '@codesandbox/sdk';

const sandbox = await createSandbox({
  template: 'react-ts',
  title: 'Client Project',
  files: {
    '/src/App.tsx': appContent,
    '/package.json': packageJson
  }
});

// Get embed URL
const embedUrl = `https://codesandbox.io/embed/${sandbox.id}`;
```

### Option 3: GitHub Codespaces Integration

For full VS Code experience with powerful cloud VMs.

#### Setup Steps:

1. **Create GitHub App**
- Go to GitHub Settings > Developer settings
- Create new GitHub App
- Set permissions for Codespaces

2. **Implement OAuth Flow**
```typescript
// Netlify function: github-codespace-auth.js
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // Create codespace
  const { data } = await octokit.codespaces.createForAuthenticatedUser({
    repository_id: repoId,
    machine: 'standardLinux32gb',
    display_name: 'Client Project'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ codespaceUrl: data.web_url })
  };
};
```

## Making the Terminal Functional

### 1. **For WebContainers (Best Option)**

```typescript
// Execute real commands in WebContainer
const executeCommand = async (command: string) => {
  const [cmd, ...args] = command.split(' ');
  
  const process = await webcontainerInstance.spawn(cmd, args);
  
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        setTerminalOutput(prev => [...prev, data]);
      }
    })
  );
  
  const exitCode = await process.exit;
  return exitCode;
};
```

### 2. **Connect to Real Deployment Platforms**

```typescript
// Netlify deployment
const deployToNetlify = async (projectFiles: FileSystem) => {
  // Create deployment
  const response = await fetch('/.netlify/functions/deploy-client-project', {
    method: 'POST',
    body: JSON.stringify({
      files: projectFiles,
      projectName: 'client-project'
    })
  });
  
  const { deployUrl } = await response.json();
  return deployUrl;
};
```

### 3. **Integrate Claude for Code Generation**

```typescript
// Claude integration in terminal
const handleClaudeCommand = async (prompt: string) => {
  const response = await fetch('/.netlify/functions/claude-code-gen', {
    method: 'POST',
    body: JSON.stringify({ 
      prompt,
      context: currentFileContent,
      projectType: 'react'
    })
  });
  
  const { code, explanation } = await response.json();
  
  // Apply code to current file
  await webcontainerInstance.fs.writeFile(currentFile, code);
  
  return { code, explanation };
};
```

## Complete Implementation Example

```typescript
// Full CloudDevelopment component with WebContainers
import { WebContainer } from '@webcontainer/api';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const CloudDevelopment = () => {
  const [webcontainer, setWebcontainer] = useState<WebContainer>();
  const terminalRef = useRef<Terminal>();

  useEffect(() => {
    async function init() {
      // Boot WebContainer
      const instance = await WebContainer.boot();
      setWebcontainer(instance);

      // Setup terminal
      const terminal = new Terminal({
        convertEol: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace'
      });
      
      terminal.open(terminalRef.current!);
      
      // Connect terminal to WebContainer
      const shellProcess = await instance.spawn('jsh');
      
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          }
        })
      );

      const input = shellProcess.input.getWriter();
      
      terminal.onData((data) => {
        input.write(data);
      });
    }
    
    init();
  }, []);

  return (
    <div ref={terminalRef} className="h-full" />
  );
};
```

## Deployment Automation

### Create Netlify Function for Auto-Deployment

```javascript
// netlify/functions/deploy-client-project.js
const { NetlifyAPI } = require('netlify');
const AdmZip = require('adm-zip');

exports.handler = async (event) => {
  const { files, projectName } = JSON.parse(event.body);
  
  // Create zip of project files
  const zip = new AdmZip();
  
  Object.entries(files).forEach(([path, content]) => {
    zip.addFile(path, Buffer.from(content, 'utf8'));
  });
  
  // Deploy to Netlify
  const client = new NetlifyAPI(process.env.NETLIFY_TOKEN);
  
  const site = await client.createSite({
    body: {
      name: projectName,
      custom_domain: `${projectName}.app-suite-clients.com`
    }
  });
  
  const deploy = await client.createSiteDeploy({
    site_id: site.id,
    body: zip.toBuffer()
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      deployUrl: site.url,
      customDomain: site.custom_domain
    })
  };
};
```

## Security Considerations

1. **Sandbox Isolation**: WebContainers run in a secure sandbox
2. **Resource Limits**: Set memory and CPU limits
3. **File System Restrictions**: Limit file access to project directory
4. **Network Policies**: Control external API access
5. **Authentication**: Require login for cloud development access

## Cost Analysis

### WebContainers (StackBlitz)
- **Free**: For open source
- **Teams**: $20/user/month
- **Enterprise**: Custom pricing

### CodeSandbox
- **Personal**: Free with limits
- **Team Pro**: $15/user/month
- **Organization**: $30/user/month

### GitHub Codespaces
- **Free**: 120 core hours/month
- **Paid**: $0.18/core hour
- **Storage**: $0.07/GB/month

## Recommended Setup for App Suite

1. **Use WebContainers** for instant browser-based development
2. **Netlify Functions** for deployment automation
3. **Claude API** for AI code generation
4. **GitHub** for version control

This gives you:
- Zero infrastructure cost
- Instant project creation
- AI-powered development
- One-click deployment
- No server maintenance

## Next Steps

1. Install `@webcontainer/api`
2. Update CloudDevelopment component
3. Create deployment functions
4. Add Claude integration
5. Test with a sample project

Would you like me to implement the WebContainer integration now?