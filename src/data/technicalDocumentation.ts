/**
 * Technical Documentation Content
 * Task 8.1: Comprehensive technical documentation resources for partner portal
 * 
 * This file contains the actual content for technical documentation resources
 * that partners can access, customize, and download.
 */

export interface TechnicalDocContent {
  id: string;
  title: string;
  category: 'process' | 'security' | 'hosting' | 'technology' | 'performance';
  summary: string;
  content: string;
  keyPoints: string[];
  relatedResources?: string[];
}

export const technicalDocumentation: TechnicalDocContent[] = [
  // Web Development Process Documentation
  {
    id: 'web-dev-process',
    title: 'Web Development Process Guide',
    category: 'process',
    summary: 'Comprehensive guide to our agile web development methodology, from requirements gathering through deployment and maintenance.',
    content: `
# Web Development Process Guide

## Overview
Our web development process follows industry-leading agile methodologies, ensuring transparent communication, iterative progress, and high-quality deliverables.

## Development Phases

### 1. Discovery & Planning (Week 1)
- Initial consultation and requirements gathering
- Technical feasibility assessment
- Project scope definition
- Timeline and milestone planning
- Technology stack selection

### 2. Design & Prototyping (Weeks 2-3)
- Wireframing and user flow mapping
- UI/UX design creation
- Interactive prototype development
- Client review and feedback incorporation
- Design system establishment

### 3. Development (Weeks 4-8)
- Frontend development with React 18 and TypeScript
- Backend API development with Supabase
- Database schema implementation
- Third-party integrations
- Continuous testing and quality assurance

### 4. Testing & Quality Assurance (Week 9)
- Unit testing and integration testing
- Cross-browser compatibility testing
- Mobile responsiveness verification
- Performance optimization
- Security audit and penetration testing

### 5. Deployment & Launch (Week 10)
- Production environment setup
- Domain and SSL configuration
- Final client review and approval
- Go-live deployment
- Post-launch monitoring

### 6. Support & Maintenance (Ongoing)
- 30-day post-launch support included
- Bug fixes and issue resolution
- Performance monitoring
- Security updates
- Optional ongoing maintenance packages

## Communication & Collaboration
- Weekly progress updates
- Dedicated project management dashboard
- Real-time communication via Slack/email
- Bi-weekly demo sessions
- Transparent issue tracking

## Quality Standards
- Code review process for all changes
- Automated testing with 80%+ coverage
- Performance benchmarks (Core Web Vitals)
- Accessibility compliance (WCAG 2.1 AA)
- Security best practices (OWASP Top 10)
    `,
    keyPoints: [
      'Agile methodology with 2-week sprints',
      'Transparent communication throughout project',
      'Iterative development with regular client feedback',
      'Comprehensive testing before deployment',
      '30-day post-launch support included',
      'Clear milestones and deliverables'
    ],
    relatedResources: ['agile-methodology', 'project-lifecycle', 'testing-standards']
  },

  // Security and Compliance
  {
    id: 'security-best-practices',
    title: 'Web Application Security Best Practices',
    category: 'security',
    summary: 'Essential security measures and best practices implemented in all our web applications to protect against common vulnerabilities.',
    content: `
# Web Application Security Best Practices

## Security-First Development Approach
Every application we build incorporates enterprise-grade security measures from the ground up, not as an afterthought.

## Core Security Measures

### 1. Authentication & Authorization
- **Supabase Auth Integration**: Industry-standard authentication with JWT tokens
- **Multi-Factor Authentication (MFA)**: Optional 2FA for enhanced security
- **Role-Based Access Control (RBAC)**: Granular permission management
- **Session Management**: Secure session handling with automatic expiration
- **Password Security**: Bcrypt hashing with salt, minimum complexity requirements

### 2. Data Protection
- **Encryption at Rest**: All sensitive data encrypted in PostgreSQL database
- **Encryption in Transit**: TLS 1.3 for all data transmission
- **Input Validation**: Comprehensive validation on client and server side
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content Security Policy (CSP) headers, input sanitization

### 3. API Security
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **CORS Configuration**: Strict cross-origin resource sharing policies
- **API Authentication**: Token-based authentication for all endpoints
- **Request Validation**: Schema validation using Zod
- **Error Handling**: Secure error messages without sensitive information exposure

### 4. Infrastructure Security
- **HTTPS Only**: Automatic redirect from HTTP to HTTPS
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **DDoS Protection**: Cloudflare or similar CDN protection
- **Regular Updates**: Automated dependency updates and security patches
- **Vulnerability Scanning**: Continuous monitoring for known vulnerabilities

## OWASP Top 10 Protection

### A01: Broken Access Control
- Implement proper authorization checks on all routes
- Use Row Level Security (RLS) in Supabase
- Validate user permissions server-side

### A02: Cryptographic Failures
- Use strong encryption algorithms (AES-256)
- Secure key management practices
- TLS 1.3 for all communications

### A03: Injection
- Parameterized queries exclusively
- Input validation and sanitization
- ORM usage to prevent SQL injection

### A04: Insecure Design
- Security requirements in design phase
- Threat modeling for critical features
- Security review before deployment

### A05: Security Misconfiguration
- Secure default configurations
- Minimal attack surface
- Regular security audits

### A06: Vulnerable Components
- Automated dependency scanning
- Regular updates and patches
- Minimal dependency footprint

### A07: Authentication Failures
- Strong password policies
- MFA support
- Account lockout mechanisms

### A08: Software and Data Integrity
- Code signing and verification
- Integrity checks for critical data
- Secure CI/CD pipeline

### A09: Logging and Monitoring
- Comprehensive audit logging
- Real-time security monitoring
- Incident response procedures

### A10: Server-Side Request Forgery
- URL validation and whitelisting
- Network segmentation
- Request origin verification

## Compliance Standards
- **GDPR**: Data protection and privacy compliance
- **CCPA**: California Consumer Privacy Act compliance
- **PCI DSS**: Payment card industry standards (when applicable)
- **SOC 2**: Security and availability controls
    `,
    keyPoints: [
      'Enterprise-grade authentication with Supabase Auth',
      'End-to-end encryption for data protection',
      'OWASP Top 10 vulnerability protection',
      'Regular security audits and updates',
      'GDPR and privacy compliance built-in',
      'Automated vulnerability scanning'
    ],
    relatedResources: ['gdpr-compliance', 'authentication-standards', 'secure-coding']
  },

  // Hosting and Deployment
  {
    id: 'cloud-hosting-architecture',
    title: 'Cloud Hosting Architecture Overview',
    category: 'hosting',
    summary: 'Modern cloud hosting architecture using Vercel, Netlify, or AWS for scalable, reliable, and high-performance web applications.',
    content: `
# Cloud Hosting Architecture Overview

## Modern Cloud Infrastructure
Our applications leverage cutting-edge cloud platforms for optimal performance, scalability, and reliability.

## Hosting Platform Options

### Vercel (Recommended for React/Next.js)
**Advantages:**
- Zero-configuration deployment
- Automatic HTTPS and SSL certificates
- Global CDN with edge caching
- Serverless functions support
- Automatic preview deployments
- Built-in analytics and monitoring

**Performance:**
- Sub-100ms response times globally
- Automatic image optimization
- Smart CDN caching strategies
- 99.99% uptime SLA

**Pricing:**
- Free tier for small projects
- Pro tier: $20/month per member
- Enterprise: Custom pricing

### Netlify (Alternative Platform)
**Advantages:**
- Continuous deployment from Git
- Form handling and serverless functions
- Split testing and A/B testing
- Identity and authentication services
- Large file support

**Performance:**
- Global CDN distribution
- Instant cache invalidation
- Automatic asset optimization
- 99.99% uptime guarantee

### AWS (Enterprise Solutions)
**Services Used:**
- **S3**: Static asset storage
- **CloudFront**: Global CDN
- **Lambda**: Serverless functions
- **RDS**: Managed PostgreSQL (alternative to Supabase)
- **Route 53**: DNS management
- **Certificate Manager**: SSL/TLS certificates

## Architecture Components

### 1. Frontend Hosting
- Static site generation (SSG) for optimal performance
- Server-side rendering (SSR) when needed
- Edge caching for global distribution
- Automatic compression (Brotli/Gzip)

### 2. Backend Services
- **Supabase**: PostgreSQL database, authentication, storage
- **Edge Functions**: Serverless API endpoints
- **Real-time**: WebSocket connections for live updates
- **Storage**: File uploads and media management

### 3. CDN & Caching
- Global edge network (200+ locations)
- Intelligent caching strategies
- Cache invalidation on deployment
- Asset optimization and compression

### 4. Security & SSL
- Automatic SSL certificate provisioning
- TLS 1.3 support
- DDoS protection
- Web Application Firewall (WAF)

### 5. Monitoring & Analytics
- Real-time performance monitoring
- Error tracking with Sentry
- User analytics
- Uptime monitoring
- Custom alerts and notifications

## Deployment Pipeline

### Continuous Integration/Deployment (CI/CD)
1. **Code Commit**: Push to Git repository (GitHub/GitLab)
2. **Automated Build**: Trigger build process
3. **Testing**: Run automated test suite
4. **Preview Deploy**: Create preview environment
5. **Review**: Client/team review
6. **Production Deploy**: Merge to main branch
7. **Monitoring**: Track performance and errors

### Environment Management
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live application environment
- **Environment Variables**: Secure configuration management

## Scalability & Performance

### Automatic Scaling
- Serverless architecture scales automatically
- No manual server management required
- Pay only for actual usage
- Handle traffic spikes seamlessly

### Performance Optimization
- Static asset caching (1 year)
- API response caching
- Database connection pooling
- Image optimization and lazy loading
- Code splitting and lazy loading

## Backup & Disaster Recovery

### Database Backups
- Automated daily backups (Supabase)
- Point-in-time recovery
- Geographic redundancy
- Backup retention: 30 days minimum

### Application Backups
- Git version control for all code
- Deployment history and rollback capability
- Configuration backups
- Asset backups in cloud storage

## Cost Optimization
- Serverless pricing model (pay per use)
- Efficient caching reduces bandwidth costs
- Optimized asset delivery
- Predictable monthly costs
- No infrastructure management overhead

## Migration Support
- Seamless migration between platforms
- Zero-downtime deployment strategies
- DNS management and domain transfer
- Data migration assistance
    `,
    keyPoints: [
      'Zero-configuration deployment with Vercel/Netlify',
      'Global CDN for sub-100ms response times',
      '99.99% uptime SLA guarantee',
      'Automatic SSL certificates and security',
      'Serverless architecture scales automatically',
      'Comprehensive monitoring and analytics'
    ],
    relatedResources: ['vercel-deployment', 'cdn-optimization', 'backup-strategies']
  },

  // Modern Web Technologies
  {
    id: 'react-typescript-stack',
    title: 'React 18 & TypeScript Modern Stack',
    category: 'technology',
    summary: 'Comprehensive guide to our modern technology stack featuring React 18, TypeScript, and Supabase for building scalable web applications.',
    content: `
# React 18 & TypeScript Modern Stack

## Technology Stack Overview
Our applications are built with cutting-edge technologies that provide superior performance, developer experience, and maintainability.

## Core Technologies

### React 18
**Why React 18?**
- Industry-leading component library
- Massive ecosystem and community support
- Concurrent rendering for better performance
- Automatic batching for optimized updates
- Suspense for data fetching
- Server Components support

**Key Features:**
- **Component-Based Architecture**: Reusable, maintainable code
- **Virtual DOM**: Efficient rendering and updates
- **Hooks**: Modern state management and side effects
- **Context API**: Built-in state management
- **React Query**: Server state management
- **React Router**: Client-side routing

**Performance Benefits:**
- Fast initial page load with code splitting
- Optimized re-renders with React.memo
- Lazy loading for improved performance
- Concurrent features for better UX

### TypeScript
**Why TypeScript?**
- Static type checking catches errors early
- Enhanced IDE support and autocomplete
- Better code documentation
- Easier refactoring and maintenance
- Improved team collaboration

**Benefits:**
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better developer experience
- **Refactoring**: Safe code changes
- **Documentation**: Self-documenting code
- **Scalability**: Easier to maintain large codebases

**Type System Features:**
- Interface definitions for data structures
- Generic types for reusable components
- Union and intersection types
- Type inference for cleaner code
- Strict null checking

### Supabase (Backend as a Service)
**Why Supabase?**
- Open-source Firebase alternative
- PostgreSQL database (most advanced open-source database)
- Built-in authentication
- Real-time subscriptions
- File storage
- Edge functions
- Auto-generated APIs

**Core Services:**

#### 1. Database (PostgreSQL)
- Powerful relational database
- ACID compliance
- Advanced querying capabilities
- Full-text search
- JSON support
- Row Level Security (RLS)

#### 2. Authentication
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- JWT token-based
- Multi-factor authentication
- User management

#### 3. Storage
- File upload and management
- Image transformation
- Access control
- CDN integration
- Automatic backups

#### 4. Real-time
- WebSocket connections
- Database change subscriptions
- Presence tracking
- Broadcast messaging

#### 5. Edge Functions
- Serverless TypeScript functions
- Global deployment
- Database access
- Third-party API integration

## Additional Technologies

### Vite (Build Tool)
- Lightning-fast development server
- Hot Module Replacement (HMR)
- Optimized production builds
- Native ES modules support
- Plugin ecosystem

### Tailwind CSS
- Utility-first CSS framework
- Rapid UI development
- Consistent design system
- Responsive design utilities
- Dark mode support
- Custom theming

### shadcn/ui
- High-quality React components
- Built on Radix UI primitives
- Fully customizable
- Accessible by default
- TypeScript support

### React Hook Form + Zod
- Performant form handling
- Schema validation
- TypeScript integration
- Minimal re-renders
- Easy error handling

## Architecture Patterns

### Component Structure
\`\`\`
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
\`\`\`

### State Management Strategy
- **Local State**: useState for component-specific state
- **Server State**: React Query for API data
- **Global State**: Context API or Zustand
- **Form State**: React Hook Form
- **URL State**: React Router

### Data Fetching Patterns
- React Query for caching and synchronization
- Optimistic updates for better UX
- Automatic refetching and invalidation
- Loading and error states
- Pagination and infinite scroll

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports
- Vendor chunk optimization

### Rendering Optimization
- React.memo for expensive components
- useMemo and useCallback hooks
- Virtual scrolling for large lists
- Debouncing and throttling

### Asset Optimization
- Image optimization and lazy loading
- Font optimization
- SVG optimization
- CSS purging with Tailwind

## Development Workflow

### Local Development
\`\`\`bash
npm run dev              # Start development server
npm run build            # Production build
npm run preview          # Preview production build
npm run test             # Run test suite
npm run lint             # Lint code
\`\`\`

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks with Husky
- Automated testing

## Testing Strategy
- Unit tests with Vitest
- Component tests with React Testing Library
- Integration tests
- E2E tests with Playwright
- Property-based tests with fast-check

## Why This Stack?

### Developer Experience
- Fast development with hot reload
- Type safety catches errors early
- Excellent tooling and IDE support
- Large community and resources

### Performance
- Fast initial load times
- Optimized runtime performance
- Efficient data fetching
- Automatic code splitting

### Scalability
- Component-based architecture
- Type-safe codebase
- Modular design patterns
- Easy to add new features

### Maintainability
- Self-documenting code with TypeScript
- Consistent code style
- Easy refactoring
- Clear separation of concerns

### Cost-Effective
- Open-source technologies
- Serverless backend (Supabase)
- Efficient hosting (Vercel/Netlify)
- Reduced development time
    `,
    keyPoints: [
      'React 18 with concurrent features for optimal performance',
      'TypeScript for type safety and better developer experience',
      'Supabase provides complete backend infrastructure',
      'Modern build tools (Vite) for fast development',
      'Component-based architecture for maintainability',
      'Comprehensive testing and quality assurance'
    ],
    relatedResources: ['supabase-architecture', 'component-patterns', 'state-management']
  },

  // Performance Optimization
  {
    id: 'performance-optimization',
    title: 'Web Performance Optimization Guide',
    category: 'performance',
    summary: 'Comprehensive strategies for optimizing web application performance, including Core Web Vitals, image optimization, and caching.',
    content: `
# Web Performance Optimization Guide

## Performance-First Approach
Every application we build is optimized for speed, ensuring excellent user experience and SEO rankings.

## Core Web Vitals

### Largest Contentful Paint (LCP)
**Target: < 2.5 seconds**

**Optimization Strategies:**
- Optimize and compress images
- Implement lazy loading
- Use CDN for static assets
- Minimize render-blocking resources
- Server-side rendering for critical content
- Preload critical resources

**Our Results:**
- Average LCP: 1.2 seconds
- 95th percentile: 1.8 seconds

### First Input Delay (FID)
**Target: < 100 milliseconds**

**Optimization Strategies:**
- Minimize JavaScript execution time
- Code splitting and lazy loading
- Use web workers for heavy computations
- Optimize event handlers
- Defer non-critical JavaScript

**Our Results:**
- Average FID: 45 milliseconds
- 95th percentile: 75 milliseconds

### Cumulative Layout Shift (CLS)
**Target: < 0.1**

**Optimization Strategies:**
- Set explicit dimensions for images and videos
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS transforms for animations
- Preload fonts to prevent FOIT/FOUT

**Our Results:**
- Average CLS: 0.05
- 95th percentile: 0.08

## Image Optimization

### Techniques
1. **Format Selection**
   - WebP for modern browsers (30% smaller than JPEG)
   - AVIF for cutting-edge performance (50% smaller)
   - Fallback to JPEG/PNG for older browsers

2. **Responsive Images**
   - Multiple image sizes for different viewports
   - srcset and sizes attributes
   - Art direction with picture element

3. **Lazy Loading**
   - Native lazy loading (loading="lazy")
   - Intersection Observer for custom loading
   - Blur-up placeholder technique

4. **Compression**
   - Lossless compression for critical images
   - Lossy compression for non-critical images
   - Automated optimization in build pipeline

5. **CDN Delivery**
   - Global edge caching
   - Automatic format conversion
   - On-the-fly resizing

### Image Optimization Results
- 70% reduction in image file sizes
- 40% faster page load times
- Improved mobile performance

## Code Optimization

### JavaScript Optimization
1. **Bundle Size Reduction**
   - Tree shaking to remove unused code
   - Code splitting by route
   - Dynamic imports for heavy components
   - Analyze bundle with webpack-bundle-analyzer

2. **Minification & Compression**
   - Terser for JavaScript minification
   - Brotli compression (20% better than Gzip)
   - Remove console logs in production

3. **Execution Optimization**
   - Debounce and throttle event handlers
   - Use requestAnimationFrame for animations
   - Optimize loops and algorithms
   - Memoization for expensive calculations

### CSS Optimization
1. **Size Reduction**
   - PurgeCSS to remove unused styles
   - CSS minification
   - Critical CSS inlining

2. **Rendering Performance**
   - Avoid expensive CSS selectors
   - Use CSS containment
   - Optimize animations with transform and opacity
   - Reduce paint complexity

## Caching Strategies

### Browser Caching
1. **Static Assets**
   - Long cache duration (1 year)
   - Content-based hashing for cache busting
   - Immutable cache headers

2. **HTML Files**
   - Short cache duration or no-cache
   - ETag for validation
   - Stale-while-revalidate

3. **API Responses**
   - Cache-Control headers
   - Conditional requests (If-None-Match)
   - Client-side caching with React Query

### CDN Caching
- Edge caching for global distribution
- Automatic cache invalidation on deploy
- Cache warming for popular content
- Geographic routing for optimal performance

### Service Workers
- Offline functionality
- Background sync
- Push notifications
- Advanced caching strategies

## Database Optimization

### Query Optimization
1. **Indexing**
   - Index frequently queried columns
   - Composite indexes for multi-column queries
   - Partial indexes for filtered queries

2. **Query Performance**
   - Use EXPLAIN ANALYZE to identify bottlenecks
   - Avoid N+1 queries
   - Batch queries when possible
   - Use database views for complex queries

3. **Connection Management**
   - Connection pooling
   - Prepared statements
   - Query result caching

### Data Optimization
- Normalize database schema
- Denormalize for read-heavy operations
- Archive old data
- Implement pagination

## API Optimization

### Response Time
1. **Server-Side**
   - Optimize database queries
   - Implement caching layers
   - Use CDN for API responses
   - Compress responses (Gzip/Brotli)

2. **Client-Side**
   - Request deduplication
   - Optimistic updates
   - Background data fetching
   - Prefetching for predicted navigation

### Payload Size
- Return only necessary fields
- Implement pagination
- Use GraphQL for flexible queries
- Compress large responses

## Monitoring & Analytics

### Performance Monitoring
- Real User Monitoring (RUM)
- Synthetic monitoring
- Core Web Vitals tracking
- Custom performance metrics

### Tools We Use
- **Lighthouse**: Automated audits
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Performance profiling
- **Sentry**: Error and performance tracking
- **Vercel Analytics**: Real-time insights

### Performance Budgets
- JavaScript bundle: < 200KB
- CSS bundle: < 50KB
- Total page weight: < 1MB
- Time to Interactive: < 3 seconds
- Lighthouse score: > 90

## Mobile Optimization

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement
- Touch-friendly interfaces
- Optimized for slower networks

### Network Optimization
- Reduce payload sizes
- Implement adaptive loading
- Offline functionality
- Service worker caching

## Continuous Optimization

### Automated Testing
- Performance regression testing
- Lighthouse CI in deployment pipeline
- Bundle size monitoring
- Core Web Vitals tracking

### Regular Audits
- Monthly performance reviews
- Quarterly optimization sprints
- Continuous monitoring and alerts
- A/B testing for optimizations

## Performance Results

### Before Optimization
- Page load time: 4.5 seconds
- Lighthouse score: 65
- Bundle size: 800KB

### After Optimization
- Page load time: 1.2 seconds (73% improvement)
- Lighthouse score: 95 (46% improvement)
- Bundle size: 180KB (77% reduction)

### Business Impact
- 40% increase in conversion rates
- 25% reduction in bounce rates
- 60% improvement in mobile engagement
- Better SEO rankings
    `,
    keyPoints: [
      'Core Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)',
      '70% reduction in image sizes with modern formats',
      'Comprehensive caching strategies for optimal performance',
      'Real-time monitoring and performance budgets',
      'Mobile-first optimization approach',
      'Lighthouse scores consistently above 90'
    ],
    relatedResources: ['core-web-vitals', 'image-optimization', 'caching-strategies']
  }
];

/**
 * Get documentation by category
 */
export const getDocumentationByCategory = (category: TechnicalDocContent['category']) => {
  return technicalDocumentation.filter(doc => doc.category === category);
};

/**
 * Get documentation by ID
 */
export const getDocumentationById = (id: string) => {
  return technicalDocumentation.find(doc => doc.id === id);
};

/**
 * Search documentation
 */
export const searchDocumentation = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return technicalDocumentation.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.content.toLowerCase().includes(lowerQuery) ||
    doc.keyPoints.some(point => point.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get all categories
 */
export const getDocumentationCategories = () => {
  return [
    { id: 'process', name: 'Web Development Process', count: getDocumentationByCategory('process').length },
    { id: 'security', name: 'Security & Compliance', count: getDocumentationByCategory('security').length },
    { id: 'hosting', name: 'Hosting & Deployment', count: getDocumentationByCategory('hosting').length },
    { id: 'technology', name: 'Modern Web Technologies', count: getDocumentationByCategory('technology').length },
    { id: 'performance', name: 'Performance Optimization', count: getDocumentationByCategory('performance').length }
  ];
};
