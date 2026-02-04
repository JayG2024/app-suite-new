# Project Structure

## Root Level Organization

```
├── .kiro/                    # Kiro configuration and specs
├── api/                      # Vercel serverless API routes
├── public/                   # Static assets and content
├── scripts/                  # Build and utility scripts
├── src/                      # Main application source
├── supabase/                 # Database migrations
└── [config files]           # Build and tool configurations
```

## Source Code Structure (`/src`)

### Core Application
- `App.tsx` - Main application with routing and providers
- `main.tsx` - Application entry point with error handling
- `index.css` - Global styles and Tailwind imports

### Components (`/src/components`)
- **UI Components** (`/ui`) - shadcn/ui components (buttons, forms, etc.)
- **Feature Components** - Business logic components (AdminLayout, ProjectTracker, etc.)
- **Layout Components** - Header, Footer, Layout wrappers

### Pages (`/src/pages`)
- **Public Pages** - Marketing and content pages
- **Admin Pages** - Protected dashboard pages
- **Documentation** (`/documentation`) - Help and guide pages
- **Blog** (`/blog`) - Blog post components
- **Whitepapers** (`/whitepapers`) - Long-form content

### Supporting Directories
- **`/contexts`** - React contexts (Auth, Socket)
- **`/hooks`** - Custom React hooks
- **`/lib`** - Utilities and configurations (Supabase, database types)
- **`/utils`** - Helper functions and utilities
- **`/data`** - Static data and mock data
- **`/types`** - TypeScript type definitions
- **`/config`** - Application configuration

## API Structure (`/api`)

Vercel serverless functions organized by feature:
- `/auth` - Authentication endpoints
- `/dashboard` - Admin dashboard APIs
- `/leads` - Lead management
- `/projects` - Project management
- `/tasks` - Task management

## Public Assets (`/public`)

- `/images` - Static images and media
- `/documents` - PDF and document files
- `/content` - Markdown content files
- `/logos` - Brand and partner logos
- `/podcasts` - Audio content

## Naming Conventions

- **Components**: PascalCase (e.g., `AdminDashboard.tsx`)
- **Pages**: PascalCase matching route names
- **Utilities**: camelCase (e.g., `clearCache.ts`)
- **Types**: PascalCase interfaces/types
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: Tailwind utility classes

## Import Patterns

- Use `@/` alias for src imports: `import { Button } from "@/components/ui/button"`
- Relative imports for same-directory files
- Group imports: React, third-party, local components, utilities

## File Organization Rules

- One main component per file
- Co-locate related components in feature directories
- Separate UI components from business logic components
- Keep utility functions in `/utils` with clear naming
- Use index files sparingly, prefer explicit imports