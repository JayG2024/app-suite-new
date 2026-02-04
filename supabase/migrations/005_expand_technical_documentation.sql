-- Migration: Expand Technical Documentation Resources
-- Task 8.1: Add comprehensive technical documentation including web development process,
-- security and compliance, hosting and deployment, modern web technologies, and performance optimization

-- Insert expanded technical documentation resources
INSERT INTO resources (title, category_id, content_type, customizable, white_labelable) VALUES
  -- Web Development Process Documentation
  ('Agile Development Methodology Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Project Lifecycle & Milestones', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Requirements Gathering Best Practices', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Design & Prototyping Process', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Development Workflow & Git Strategy', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Testing & Quality Assurance Standards', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Deployment & Launch Checklist', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  
  -- Security and Compliance Information
  ('Web Application Security Best Practices', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('OWASP Top 10 Security Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Data Protection & Privacy Compliance (GDPR)', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Authentication & Authorization Standards', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('SSL/TLS Certificate Management', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Security Audit & Penetration Testing', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Secure Coding Guidelines', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  
  -- Hosting and Deployment Guides
  ('Cloud Hosting Architecture Overview', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Vercel Deployment Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Netlify Deployment Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('AWS Hosting Configuration', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Custom Domain Setup & DNS Configuration', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('CDN Configuration & Optimization', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Continuous Integration & Deployment (CI/CD)', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Environment Variables & Configuration Management', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Backup & Disaster Recovery Strategies', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  
  -- Modern Web Technology Explanations
  ('React 18 Fundamentals & Best Practices', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('TypeScript for Web Development', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Supabase Backend Architecture', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('PostgreSQL Database Design Patterns', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('RESTful API Design & Implementation', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('GraphQL vs REST: Choosing the Right API', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Modern JavaScript (ES6+) Features', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Component-Based Architecture', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('State Management Strategies (Context, Redux, Zustand)', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Server-Side Rendering vs Static Generation', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Responsive Design & Mobile-First Development', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Tailwind CSS Framework Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  
  -- Performance Optimization Details
  ('Web Performance Optimization Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Core Web Vitals & SEO Performance', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Image Optimization Techniques', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Code Splitting & Lazy Loading', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Caching Strategies & Service Workers', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Database Query Optimization', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Frontend Bundle Size Optimization', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('API Response Time Optimization', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Monitoring & Performance Analytics', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Progressive Web App (PWA) Implementation', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true);

-- Add metadata to track resource content areas for better organization
COMMENT ON TABLE resources IS 'Partner portal resource library containing technical documentation, sales materials, client resources, and training materials';

-- Create index for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_customizable ON resources(customizable) WHERE customizable = true;
CREATE INDEX IF NOT EXISTS idx_resources_white_labelable ON resources(white_labelable) WHERE white_labelable = true;
