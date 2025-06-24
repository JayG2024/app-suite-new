# CLAUDE.md - Coding Assistant Guidelines

## Build/Test/Lint Commands
- Build: `npm run build` or `yarn build`
- Lint: `npm run lint` or `yarn lint`
- Test (all): `npm test` or `yarn test`
- Test (single): `npm test -- -t "test name"` or `jest path/to/test.js`
- Start dev server: `npm run dev` or `yarn dev`

## Quick Commands
- Navigate to this project: `cd ~/Desktop/appsuitenew`
- Start dev server: `yarn dev`
- Build for production: `yarn build`
- Preview production build: `yarn preview`

## Netlify Deployment Info
- **Framework**: Vite + React
- **Node Version**: 20.x (specified in netlify.toml)
- **Build Command**: `yarn build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`

### Netlify Commands
- Deploy via CLI: `netlify deploy`
- Deploy to production: `netlify deploy --prod`
- Open Netlify admin: `netlify open`
- Check deployment status: `netlify status`

### Best Practices for Netlify + Claude Code
1. **Environment Variables:**
   - Set in Netlify Dashboard → Site Settings → Environment Variables
   - Use `VITE_` prefix for client-side variables
   - Server-side variables don't need prefix

2. **Deployment Workflow:**
   - [ ] Test build locally with `yarn build`
   - [ ] Check for build errors
   - [ ] Push to GitHub (auto-deploys if connected)
   - [ ] Or use CLI: `netlify deploy` for preview
   - [ ] Then `netlify deploy --prod` for production

3. **Serverless Functions:**
   - Place in `/netlify/functions/` directory
   - Export as `exports.handler` (not default export)
   - Access via `/.netlify/functions/function-name`

## SEO Setup Complete ✅

### What's Been Implemented:
- ✅ SEO component on all 26+ pages
- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph & Twitter Card tags
- ✅ Structured data (JSON-LD schema)
- ✅ Updated sitemap.xml with all routes
- ✅ Proper robots.txt file
- ✅ Google Search Console verification prepared

### To Complete Google Search Console Setup:
1. Go to https://search.google.com/search-console
2. Add property: `https://app-suite.io`
3. Choose verification method:
   - **Meta Tag**: Replace `google-verification-code-here` in index.html with your code
   - **HTML File**: Replace `google123456789abcdef.html` with your verification file
4. Submit sitemap: `https://app-suite.io/sitemap.xml`
5. Request indexing for key pages

### Key SEO Features:
- All pages have unique titles and descriptions
- Proper canonical URLs
- Rich snippets with structured data
- Mobile-friendly meta viewport
- Social media sharing optimized

## Code Style Guidelines
- **Formatting**: Follow existing file formatting for indentation and spacing
- **Imports**: Group imports by external libraries first, then internal modules
- **Types**: Use TypeScript types/interfaces when available
- **Naming**: 
  - camelCase for variables and functions
  - PascalCase for classes, interfaces, and components
  - UPPER_SNAKE_CASE for constants
- **Error Handling**: Use try/catch for async operations, provide meaningful error messages
- **Comments**: Document complex logic, avoid obvious comments
- **Functions**: Keep functions small, single-purpose, with descriptive names

## Brand Voice & Messaging Guidelines

### Core Value Proposition
**App Suite builds truly custom business applications from scratch at transparent, flat-rate pricing.**

### Key Messaging Pillars

#### 1. **Custom-Built (Never Templates)**
- ✅ "Custom-built from scratch specifically for your business needs"
- ✅ "Every application is uniquely designed for your exact requirements"
- ✅ "Built specifically for [Company Name]"
- ❌ Never mention "templates", "pre-built", or "customizing existing solutions"

#### 2. **Transparent Pricing**
- ✅ "Flat-rate pricing: $5,000 standard, $7,500 AI-enhanced, $10,000 enterprise"
- ✅ "No hourly billing, no hidden costs, no surprises"
- ✅ "Transparent pricing with everything included"
- ❌ Avoid vague pricing or "starting from" language

#### 3. **Ownership vs. Rental**
- ✅ "You own the code, you own the data, you own the application"
- ✅ "Stop paying monthly subscriptions for software that doesn't fit"
- ✅ "Build equity in your business with software you actually own"
- ❌ Don't bash other providers directly, focus on ownership benefits

#### 4. **AI-Powered Speed**
- ✅ "Built 10x faster with AI-powered development"
- ✅ "From concept to launch in 30 days"
- ✅ "Enterprise-grade applications delivered in weeks, not months"

### Approved Taglines
1. **Primary**: "Custom Business Applications at a Flat Rate"
2. **Alternative**: "STOP Renting Software When You Can Finally Build Your Own"
3. **Ownership Focus**: "Own Your Software, Don't Rent It"

### Standard Subtexts
- "No hourly billing, no hidden costs. Custom-built from scratch specifically for your business needs."
- "Enterprise-grade solutions built 10x faster with AI. Own your code, own your data, own your future."
- "Stop paying endless subscription fees. Get your custom business application built once, use it forever."

### Tone & Voice
- **Confident** but not arrogant
- **Transparent** about pricing and process
- **Problem-focused** (subscription fatigue, vendor lock-in)
- **Solution-oriented** (ownership, customization, speed)
- **Professional** but approachable

### What We DON'T Do
- Templates or pre-built solutions
- Hourly billing
- Ongoing subscription fees
- Vendor lock-in
- Generic, one-size-fits-all software

### What We DO
- 100% custom applications built from scratch
- Flat-rate, transparent pricing
- Complete code ownership
- AI-powered rapid development
- Enterprise-grade solutions for SMBs

## Repository Notes
This file contains the complete brand guidelines for App Suite. Always reference this section when writing copy, proposals, or any customer-facing content to ensure consistency.