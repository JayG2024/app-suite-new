# App Suite - Technical Overview

## Project Summary
App Suite is a custom business application development platform that builds tailored software solutions at transparent flat-rate pricing. This document provides an accurate technical overview of the current architecture and deployment setup on Netlify.

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: 
  - Tailwind CSS 3.4.11
  - Radix UI Components (full suite)
  - Custom CSS-in-JS with class-variance-authority
- **Routing**: React Router DOM 6.26.2
- **State Management**: React Context API
- **UI Components**:
  - Charts: Recharts 3.0.0
  - Forms: React Hook Form 7.58.1 with Zod validation
  - Icons: Lucide React, React Icons
  - Animations: Tailwind Animate, Vaul

### Backend/API
- **Runtime**: Node.js 20.x (specified in netlify.toml)
- **Database**: PostgreSQL (Neon Database via Netlify integration)
- **Authentication**: JWT (jsonwebtoken) with bcrypt
- **API Structure**: Netlify Functions (serverless)
- **Email Service**: Resend API
- **AI Integration**: Anthropic Claude API (via ANTHROPIC_API_KEY)
- **Edge Functions**: Netlify Edge Functions for cache control and security

### Development Tools
- **Package Manager**: Yarn
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript 5.5.3
- **Version Control**: Git + GitHub

## Architecture Overview

### Application Structure
```
appsuitenew/
├── src/                          # React application source
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Route-based page components
│   ├── contexts/                # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   └── data/                    # Static data and constants
├── netlify/                     # Netlify-specific configuration
│   ├── functions/               # Serverless API functions
│   │   ├── auth-login.js       # Authentication endpoints
│   │   ├── projects.js         # Project management
│   │   ├── leads.js            # Lead/client management
│   │   ├── tasks.js            # Task management
│   │   ├── chatbot-ai.js       # AI chatbot integration
│   │   └── send-email-resend.js # Email functionality
│   └── edge-functions/          # Edge functions
│       ├── cache-control.js     # Cache management
│       └── admin-security.ts    # Admin route security
├── public/                      # Static assets
├── dist/                        # Build output (gitignored)
└── netlify.toml                 # Netlify configuration
```

### Key Features
1. **Admin Dashboard**: Comprehensive business management at `/admin`
2. **Project & Task Management**: Full CRUD operations with database persistence
3. **Client/Lead Management**: CRM functionality with pipeline tracking
4. **AI Integration**: Claude-powered chatbot and content generation
5. **Email System**: Transactional emails via Resend API
6. **SEO Optimization**: Dynamic meta tags and sitemap generation
7. **Security**: JWT authentication, bcrypt hashing, edge function protection

## Deployment Configuration

### Current Hosting
- **Platform**: Netlify
- **Domain**: app-suite.io (primary, non-www)
- **SSL**: Automatic HTTPS via Let's Encrypt
- **CDN**: Netlify's global edge network
- **Database**: Neon PostgreSQL (via Netlify integration)

### Build Configuration (netlify.toml)
```toml
[build]
  command = "yarn build"
  publish = "dist"
  functions = "netlify/functions"
  edge_functions = "netlify/edge-functions"

[build.environment]
  NODE_VERSION = "20"
```

### Environment Variables (Set in Netlify Dashboard)
```
# Authentication
JWT_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://...
NETLIFY_DATABASE_URL=postgresql://...

# AI Integration
ANTHROPIC_API_KEY=sk-ant-api03-...

# Email Service
RESEND_API_KEY=re_...

# Optional Services
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## API Structure

### Netlify Functions
All API endpoints are serverless functions located in `/netlify/functions/`:

- **Authentication**: `auth-login.js`, `auth-reset-password.js`
- **Data Management**: `projects.js`, `tasks.js`, `leads.js`, `clients.js`
- **Communication**: `send-email-resend.js`, `messages.js`
- **AI Features**: `chatbot-ai.js`, `analyze-transcript-v2.js`
- **Analytics**: `dashboard-metrics.js`, `analytics.js`

### Function Example Structure
```javascript
// netlify/functions/example.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const handler = async (event, context) => {
  // Function logic here
};
```

## Current Architecture Benefits

### Netlify Advantages
1. **Automatic Deployments**: Git push triggers builds
2. **Preview Deployments**: Each PR gets a unique URL
3. **Edge Network**: Global CDN included
4. **Serverless Scaling**: Functions scale automatically
5. **Environment Management**: Secure variable storage
6. **Build Plugins**: Extensible build process

### Database Architecture
- **Provider**: Neon (Serverless PostgreSQL)
- **Connection**: Via `NETLIFY_DATABASE_URL`
- **Tables**: projects, tasks, leads, users, activity_log
- **Pooling**: Connection pooling via pg.Pool

## Security Measures
1. **Authentication**: JWT tokens with secure httpOnly cookies
2. **Password Security**: Bcrypt hashing with salt rounds
3. **CORS Configuration**: Restrictive CORS headers
4. **SQL Injection Prevention**: Parameterized queries
5. **Admin Protection**: Edge functions verify auth before serving
6. **Environment Isolation**: Secrets never in code
7. **HTTPS Only**: Forced SSL redirect

## Performance Optimizations
1. **Asset Hashing**: Cache busting via Vite (e.g., `index.[hash].js`)
2. **Code Splitting**: Dynamic imports for large components
3. **Edge Caching**: Static assets cached for 1 year
4. **Database Pooling**: Reused connections
5. **Compression**: Automatic gzip/brotli

## Monitoring & Debugging

### Available Tools
1. **Netlify Dashboard**: Deploy logs, function logs
2. **Function Logs**: Real-time at Netlify Dashboard → Functions
3. **Edge Function Logs**: Separate log stream
4. **Build Logs**: Detailed build process output

### Common Commands
```bash
# Local development
yarn dev                    # Start dev server on :8080

# Build & deploy
yarn build                  # Build for production
netlify deploy              # Deploy preview
netlify deploy --prod       # Deploy to production

# Debugging
netlify functions:serve     # Test functions locally
netlify logs:function       # Stream function logs
```

## Known Limitations

### Netlify Function Limits
- **Execution Time**: 10 seconds (default), 26 seconds (max)
- **Memory**: 1024 MB
- **Payload Size**: 6 MB
- **Concurrent Executions**: 500 (can be increased)

### Current Workarounds
1. **Large Operations**: Break into smaller chunks
2. **File Uploads**: Direct to client storage solutions
3. **Long Processes**: Use background jobs with status polling

## Maintenance & Updates

### Regular Tasks
1. **Dependency Updates**: Monthly security patches
2. **Database Backups**: Handled by Neon
3. **Log Monitoring**: Weekly review of error logs
4. **Performance Review**: Monthly metrics check

### Deployment Process
1. **Development**: Work on feature branches
2. **Testing**: Preview deployments for each PR
3. **Review**: Code review required
4. **Merge**: Auto-deploy to production on main branch

## Contact & Support
- **Developer**: Jason Gordon
- **Email**: jason@app-suite.io
- **Documentation**: This file and /docs directory
- **Issue Tracking**: GitHub Issues

---

*Last Updated: December 2024*
*This document reflects the current production architecture on Netlify.*