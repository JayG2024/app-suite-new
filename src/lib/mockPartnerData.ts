// Mock data for local development of partner portal
// This allows us to test the partner portal without a live database

export const mockDiscountTiers = [
  {
    id: 'tier-bronze',
    name: 'Bronze',
    website_discount: 10.00,
    webapp_discount: 10.00,
    mobile_app_discount: 10.00,
    ai_website_base_discount: 20.00,
    ecommerce_discount: 10.00,
    maintenance_discount: 15.00,
    per_page_discount: 50.00
  },
  {
    id: 'tier-silver',
    name: 'Silver',
    website_discount: 15.00,
    webapp_discount: 15.00,
    mobile_app_discount: 15.00,
    ai_website_base_discount: 25.00,
    ecommerce_discount: 15.00,
    maintenance_discount: 20.00,
    per_page_discount: 50.00
  },
  {
    id: 'tier-gold',
    name: 'Gold',
    website_discount: 20.00,
    webapp_discount: 20.00,
    mobile_app_discount: 20.00,
    ai_website_base_discount: 30.00,
    ecommerce_discount: 20.00,
    maintenance_discount: 25.00,
    per_page_discount: 50.00
  }
]

export const mockPartnerProfiles = [
  {
    id: 'partner-1',
    email: 'test@partner.com',
    name: 'Test Partner',
    role: 'user',
    company_name: 'Test Partner Company',
    contact_email: 'test@partner.com',
    discount_tier_id: 'tier-bronze',
    status: 'active' as const,
    white_label_settings: {},
    markup_preferences: {
      defaultMarkupPercentage: 30,
      competitivePositioning: 'value'
    },
    custom_domain: null,
    branding_level: 'co-branded' as const,
    discount_tier: mockDiscountTiers[0]
  },
  {
    id: 'partner-2',
    email: 'premium@partner.com',
    name: 'Premium Partner',
    role: 'user',
    company_name: 'Premium Solutions Inc',
    contact_email: 'premium@partner.com',
    discount_tier_id: 'tier-gold',
    status: 'active' as const,
    white_label_settings: {
      logo: '/logos/premium-partner.png',
      primaryColor: '#1e40af'
    },
    markup_preferences: {
      defaultMarkupPercentage: 25,
      competitivePositioning: 'premium'
    },
    custom_domain: 'portal.premiumsolutions.com',
    branding_level: 'full-white-label' as const,
    discount_tier: mockDiscountTiers[2]
  }
]

export const mockUsers = [
  {
    id: 'partner-1',
    email: 'test@partner.com',
    created_at: '2024-01-01T00:00:00Z',
    user_metadata: {
      name: 'Test Partner'
    }
  },
  {
    id: 'partner-2',
    email: 'premium@partner.com',
    created_at: '2024-01-01T00:00:00Z',
    user_metadata: {
      name: 'Premium Partner'
    }
  }
]

export const mockProfiles = [
  {
    id: 'partner-1',
    email: 'test@partner.com',
    name: 'Test Partner',
    role: 'user',
    avatar_url: null
  },
  {
    id: 'partner-2',
    email: 'premium@partner.com',
    name: 'Premium Partner',
    role: 'user',
    avatar_url: null
  }
]

export const mockResourceCategories = [
  {
    id: 'cat-1',
    name: 'Technical Documentation',
    description: 'Technical specifications and implementation guides'
  },
  {
    id: 'cat-2',
    name: 'Sales Materials',
    description: 'Sales presentations, case studies, and competitive analysis'
  },
  {
    id: 'cat-3',
    name: 'Client Resources',
    description: 'Templates and materials for client presentations'
  },
  {
    id: 'cat-4',
    name: 'Training Materials',
    description: 'Partner onboarding and training resources'
  }
]

export const mockResources = [
  // Web Development Process Documentation
  {
    id: 'res-1',
    title: 'Web Development Process Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-1a',
    title: 'Agile Development Methodology Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-1b',
    title: 'Project Lifecycle & Milestones',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-1c',
    title: 'Testing & Quality Assurance Standards',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  
  // Security and Compliance Information
  {
    id: 'res-2',
    title: 'Security & Compliance Overview',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2a',
    title: 'Web Application Security Best Practices',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2b',
    title: 'OWASP Top 10 Security Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2c',
    title: 'Data Protection & Privacy Compliance (GDPR)',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2d',
    title: 'Authentication & Authorization Standards',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  
  // Hosting and Deployment Guides
  {
    id: 'res-2e',
    title: 'Cloud Hosting Architecture Overview',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2f',
    title: 'Vercel Deployment Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2g',
    title: 'Custom Domain Setup & DNS Configuration',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2h',
    title: 'CDN Configuration & Optimization',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  
  // Modern Web Technology Explanations
  {
    id: 'res-2i',
    title: 'React 18 Fundamentals & Best Practices',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2j',
    title: 'TypeScript for Web Development',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2k',
    title: 'Supabase Backend Architecture',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2l',
    title: 'Component-Based Architecture',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2m',
    title: 'Tailwind CSS Framework Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  
  // Performance Optimization Details
  {
    id: 'res-2n',
    title: 'Web Performance Optimization Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2o',
    title: 'Core Web Vitals & SEO Performance',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2p',
    title: 'Image Optimization Techniques',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2q',
    title: 'Caching Strategies & Service Workers',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[0]
  },
  
  // Sales Materials
  {
    id: 'res-3',
    title: 'Service Comparison Chart',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3a',
    title: 'Comprehensive Service Comparison Guide',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3b',
    title: 'Competitive Analysis: Traditional Agencies',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3c',
    title: 'Case Study: E-commerce Fashion Brand',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3d',
    title: 'Case Study: SaaS Productivity App',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3e',
    title: 'Case Study: Healthcare Patient Portal',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-3f',
    title: 'Pricing Justification Guide for Clients',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-4',
    title: 'ROI Calculator Template',
    category_id: 'cat-2',
    content_type: 'excel',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-4a',
    title: 'Website Rebuild ROI Calculator',
    category_id: 'cat-2',
    content_type: 'excel',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-4b',
    title: 'E-commerce Platform ROI Calculator',
    category_id: 'cat-2',
    content_type: 'excel',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  {
    id: 'res-4c',
    title: 'Maintenance Cost Comparison Calculator',
    category_id: 'cat-2',
    content_type: 'excel',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[1]
  },
  
  // Client-Ready Materials (Task 8.3)
  {
    id: 'res-5a',
    title: 'Website Development Proposal Template',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5b',
    title: 'Web Application Proposal Template',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5c',
    title: 'Website Development Statement of Work',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5d',
    title: 'Website Maintenance Agreement',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5e',
    title: 'Website Requirements Gathering Form',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5f',
    title: 'Web Application Requirements Form',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  },
  {
    id: 'res-5g',
    title: 'Website Development Project Timeline',
    category_id: 'cat-3',
    content_type: 'docx',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: mockResourceCategories[2]
  }
]

// Mock authentication functions for local development
export const mockAuth = {
  currentUser: null as any,
  
  signIn: async (email: string, password: string) => {
    // Simple mock authentication
    const user = mockUsers.find(u => u.email === email)
    if (user && password === 'testpartner123') {
      mockAuth.currentUser = user
      return { data: { user }, error: null }
    }
    return { data: null, error: new Error('Invalid credentials') }
  },
  
  signOut: async () => {
    mockAuth.currentUser = null
    return { error: null }
  },
  
  getSession: async () => {
    return {
      data: { session: mockAuth.currentUser ? { user: mockAuth.currentUser } : null },
      error: null
    }
  }
}

// Helper function to get mock partner profile
export const getMockPartnerProfile = (userId: string) => {
  const profile = mockProfiles.find(p => p.id === userId)
  const partnerProfile = mockPartnerProfiles.find(p => p.id === userId)
  
  if (!profile || !partnerProfile) {
    return null
  }
  
  return {
    ...profile,
    ...partnerProfile
  }
}

// Environment flag to enable mock data
export const USE_MOCK_DATA = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_USE_MOCK_DATA === 'true'