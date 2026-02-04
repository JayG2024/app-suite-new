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
  {
    id: 'res-1',
    title: 'Web Development Process Guide',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    category: mockResourceCategories[0]
  },
  {
    id: 'res-2',
    title: 'Security & Compliance Overview',
    category_id: 'cat-1',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    category: mockResourceCategories[0]
  },
  {
    id: 'res-3',
    title: 'Service Comparison Chart',
    category_id: 'cat-2',
    content_type: 'pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
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
    category: mockResourceCategories[1]
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