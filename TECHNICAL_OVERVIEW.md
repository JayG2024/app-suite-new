# App Suite - Technical Overview

## Project Summary
App Suite is a custom business application development platform that builds tailored software solutions at transparent flat-rate pricing. This document provides a technical overview of the current architecture and deployment setup.

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
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL (via pg driver)
- **Authentication**: JWT (jsonwebtoken) with bcrypt
- **API Structure**: Serverless functions (Vercel Functions)
- **Email Service**: Resend
- **File Storage**: AWS S3 (via AWS SDK)
- **AI Integration**: OpenAI API

### Third-Party Services
- **Payment Processing**: Stripe
- **Analytics**: Vercel Analytics
- **Calendar Integration**: Google APIs
- **Document Processing**: XLSX, jsPDF, html2canvas

### Development Tools
- **Package Manager**: Yarn
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript 5.5.3

## Architecture Overview

### Application Structure
```
appsuitenew/
├── src/                    # React application source
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-based page components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── api/                   # Serverless API functions
│   ├── auth/             # Authentication endpoints
│   ├── ai/               # AI integration endpoints
│   └── ...               # Other API endpoints
├── public/               # Static assets
└── dist/                 # Build output
```

### Key Features
1. **Multi-tenant SaaS Architecture**: Supports multiple businesses with isolated data
2. **Real-time Features**: WebSocket support (development only)
3. **SEO Optimization**: Server-side rendering for crawlers via API routes
4. **Progressive Web App**: Offline capability and mobile optimization
5. **AI Integration**: OpenAI-powered content generation and automation

## Deployment Configuration

### Current Hosting
- **Platform**: Vercel
- **Domain**: app-suite.io
- **SSL**: Automatic HTTPS via Vercel
- **CDN**: Global edge network

### Build Configuration
```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `OPENAI_API_KEY` - OpenAI API access
- `RESEND_API_KEY` - Email service
- `STRIPE_SECRET_KEY` - Payment processing
- `AWS_ACCESS_KEY_ID` - S3 storage
- `AWS_SECRET_ACCESS_KEY` - S3 storage
- `AWS_REGION` - S3 region

## Current Issues & Limitations

### 1. WebSocket Support
- **Issue**: Vercel doesn't support persistent WebSocket connections
- **Current Solution**: WebSockets disabled in production
- **Alternative Options**: 
  - Pusher for real-time features
  - Supabase Realtime
  - Server-Sent Events (SSE)

### 2. Large Bundle Size
- Main JavaScript bundle: ~2.2MB (593KB gzipped)
- Recommendation: Implement code splitting and lazy loading

### 3. Serverless Limitations
- API functions have 10-second timeout
- No persistent server state
- Cold start latency on first request

## Migration Considerations

### For Traditional Hosting (VPS/Dedicated)
1. Convert Vercel Functions to Express.js endpoints
2. Set up Node.js server with PM2 process manager
3. Configure Nginx reverse proxy
4. Implement WebSocket server for real-time features

### For Alternative Platforms
- **Railway.app**: Minimal changes needed, supports Node.js + PostgreSQL
- **Render.com**: Similar to Vercel, good for full-stack apps
- **Fly.io**: Better WebSocket support, global deployment
- **AWS/GCP/Azure**: Requires more configuration but offers more control

### For Cloudflare Pages
- Frontend can be deployed as-is
- API routes would need conversion to Cloudflare Workers
- Database would need external hosting (e.g., Neon, Supabase)

## Performance Metrics
- **Build Time**: ~4 seconds
- **Time to Interactive**: ~2-3 seconds
- **Lighthouse Score**: 85-90 (estimated)
- **API Response Time**: <200ms average

## Security Measures
- JWT-based authentication
- Bcrypt password hashing
- CORS configuration
- Environment variable isolation
- SQL injection prevention via parameterized queries

## Recommended Improvements
1. Implement Redis caching for API responses
2. Add rate limiting to prevent abuse
3. Implement proper logging and monitoring
4. Set up automated testing suite
5. Add database backup automation
6. Implement CDN for static assets
7. Add Web Application Firewall (WAF)

## Contact & Support
- **Developer**: Jason Gordon
- **Email**: jason@jaydus.ai
- **Repository**: Private (available upon request)

---

*This document provides a high-level technical overview. Detailed documentation for specific components is available upon request.*