# Technology Stack

## Core Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel with static generation

## Key Libraries

- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Integration**: Anthropic SDK, OpenAI
- **Notifications**: Sonner (toast notifications)
- **Error Tracking**: Sentry (production only)

## Development Tools

- **TypeScript**: Strict configuration with path aliases
- **ESLint**: TypeScript ESLint with React hooks plugin
- **PostCSS**: Autoprefixer and Tailwind processing

## Common Commands

```bash
# Development
npm run dev                    # Start dev server with static file generation
npm run generate-static        # Generate static files only

# Building
npm run build                  # Full production build with SEO page generation
npm run preview               # Preview production build

# The build process includes:
# 1. Pre-build: Generate static files
# 2. Vite build: Bundle application
# 3. Post-build: Generate SEO pages
```

## Environment Configuration

- Multiple environment files for different deployment stages
- Supabase configuration for database and auth
- OpenAI/Anthropic API keys for AI features
- Sentry DSN for error tracking (production)

## Architecture Patterns

- **Component-based**: Reusable UI components in `/src/components`
- **Page-based routing**: Route components in `/src/pages`
- **Context providers**: Authentication and socket contexts
- **Lazy loading**: Heavy admin pages are code-split
- **Error boundaries**: Comprehensive error handling
- **Protected routes**: Authentication-gated admin areas