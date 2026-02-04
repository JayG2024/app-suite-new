import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PartnerAuthProvider } from '@/contexts/PartnerAuthContext'
import PartnerDashboard from '@/components/PartnerDashboard'
import { USE_MOCK_DATA, mockPartnerProfiles } from '@/lib/mockPartnerData'

// Mock the environment to use mock data
vi.mock('@/lib/mockPartnerData', () => ({
  USE_MOCK_DATA: true,
  mockAuth: {
    currentUser: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn()
  },
  getMockPartnerProfile: vi.fn(),
  mockPartnerProfiles: [
    {
      id: 'partner-1',
      email: 'test@partner.com',
      name: 'Test Partner',
      role: 'user',
      company_name: 'Test Partner Company',
      contact_email: 'test@partner.com',
      discount_tier_id: 'tier-bronze',
      status: 'active',
      white_label_settings: {},
      markup_preferences: { defaultMarkupPercentage: 30 },
      custom_domain: null,
      branding_level: 'co-branded',
      discount_tier: {
        name: 'Bronze',
        website_discount: 10,
        webapp_discount: 10,
        mobile_app_discount: 10,
        ai_website_base_discount: 20,
        ecommerce_discount: 10,
        maintenance_discount: 15,
        per_page_discount: 50
      }
    },
    {
      id: 'partner-2',
      email: 'premium@partner.com',
      name: 'Premium Partner',
      role: 'user',
      company_name: 'Premium Solutions Inc',
      contact_email: 'premium@partner.com',
      discount_tier_id: 'tier-gold',
      status: 'pending',
      white_label_settings: { logo: '/logos/premium.png' },
      markup_preferences: { defaultMarkupPercentage: 25 },
      custom_domain: 'portal.premium.com',
      branding_level: 'full-white-label',
      discount_tier: {
        name: 'Gold',
        website_discount: 20,
        webapp_discount: 20,
        mobile_app_discount: 20,
        ai_website_base_discount: 30,
        ecommerce_discount: 20,
        maintenance_discount: 25,
        per_page_discount: 50
      }
    }
  ]
}))

// Test component wrapper
function TestWrapper({ children, mockProfile }: { children: React.ReactNode, mockProfile?: any }) {
  // Mock the usePartnerAuth hook
  const mockUsePartnerAuth = () => ({
    user: mockProfile ? { id: mockProfile.id, email: mockProfile.email } : null,
    partnerProfile: mockProfile || null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    isPartner: !!mockProfile,
    isActivePartner: mockProfile?.status === 'active'
  })

  // Replace the context provider with our mock
  vi.doMock('@/contexts/PartnerAuthContext', () => ({
    usePartnerAuth: mockUsePartnerAuth,
    PartnerAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }))

  return (
    <BrowserRouter>
      <PartnerAuthProvider>
        {children}
      </PartnerAuthProvider>
    </BrowserRouter>
  )
}

describe('Partner Dashboard Content Personalization Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * Property 2: Partner-Specific Content Personalization
   * For any partner with specific discount tiers, account status, and profile information, 
   * the portal should display personalized content including dashboard summaries, 
   * discount tier information, contact details, and agreement terms consistently 
   * across all portal sections
   * Validates: Requirements 1.5, 4.4, 5.1, 5.3, 5.5
   */
  describe('Property 2: Partner-Specific Content Personalization', () => {
    it('should display personalized content for active Bronze tier partner', async () => {
      // Arrange: Bronze tier active partner
      const bronzePartner = {
        id: 'partner-1',
        email: 'bronze@partner.com',
        name: 'Bronze Partner',
        role: 'user',
        company_name: 'Bronze Solutions LLC',
        contact_email: 'bronze@partner.com',
        discount_tier_id: 'tier-bronze',
        status: 'active' as const,
        white_label_settings: {},
        markup_preferences: { defaultMarkupPercentage: 30 },
        custom_domain: null,
        branding_level: 'co-branded' as const,
        discount_tier: {
          name: 'Bronze',
          website_discount: 10,
          webapp_discount: 10,
          mobile_app_discount: 10,
          ai_website_base_discount: 20,
          ecommerce_discount: 10,
          maintenance_discount: 15,
          per_page_discount: 50
        }
      }

      // Mock the usePartnerAuth hook for this test
      mockUsePartnerAuth.mockReturnValue({
        user: { id: bronzePartner.id, email: bronzePartner.email },
        partnerProfile: bronzePartner,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render dashboard
      renderWithRouter(<PartnerDashboard />)

      // Assert: Check personalized content properties
      await waitFor(() => {
        // Welcome message should be personalized
        expect(screen.getByText('Welcome back, Bronze Partner!')).toBeInTheDocument()
        
        // Company information should be displayed
        expect(screen.getByText('Bronze Solutions LLC')).toBeInTheDocument()
        expect(screen.getByText('bronze@partner.com')).toBeInTheDocument()
        
        // Account status should be shown
        expect(screen.getByText('Active')).toBeInTheDocument()
        
        // Discount tier information should be displayed
        expect(screen.getByText('Bronze')).toBeInTheDocument()
        expect(screen.getByText('10% website discount')).toBeInTheDocument()
      })
    })

    it('should display different content for Gold tier partner with different status', async () => {
      // Arrange: Gold tier pending partner
      const goldPartner = {
        id: 'partner-2',
        email: 'gold@partner.com',
        name: 'Gold Partner',
        role: 'user',
        company_name: 'Gold Enterprise Corp',
        contact_email: 'gold@partner.com',
        discount_tier_id: 'tier-gold',
        status: 'pending' as const,
        white_label_settings: { logo: '/logos/gold.png' },
        markup_preferences: { defaultMarkupPercentage: 25 },
        custom_domain: 'portal.goldenterprise.com',
        branding_level: 'full-white-label' as const,
        discount_tier: {
          name: 'Gold',
          website_discount: 20,
          webapp_discount: 20,
          mobile_app_discount: 20,
          ai_website_base_discount: 30,
          ecommerce_discount: 20,
          maintenance_discount: 25,
          per_page_discount: 50
        }
      }

      // Mock the usePartnerAuth hook for this test
      mockUsePartnerAuth.mockReturnValue({
        user: { id: goldPartner.id, email: goldPartner.email },
        partnerProfile: goldPartner,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        isPartner: true,
        isActivePartner: false // pending status
      })

      // Act: Render dashboard
      renderWithRouter(<PartnerDashboard />)

      // Assert: Check personalized content for different tier and status
      await waitFor(() => {
        // Welcome message should be personalized
        expect(screen.getByText('Welcome back, Gold Partner!')).toBeInTheDocument()
        
        // Company information should be different
        expect(screen.getByText('Gold Enterprise Corp')).toBeInTheDocument()
        expect(screen.getByText('gold@partner.com')).toBeInTheDocument()
        
        // Account status should show pending
        expect(screen.getByText('Pending')).toBeInTheDocument()
        
        // Discount tier should show Gold with higher discount
        expect(screen.getByText('Gold')).toBeInTheDocument()
        expect(screen.getByText('20% website discount')).toBeInTheDocument()
      })
    })

    it('should handle various partner status combinations consistently', async () => {
      const testCases = [
        {
          status: 'active' as const,
          expectedStatusText: 'Active',
          expectedStatusClass: 'bg-green-100 text-green-800'
        },
        {
          status: 'pending' as const,
          expectedStatusText: 'Pending',
          expectedStatusClass: 'bg-yellow-100 text-yellow-800'
        },
        {
          status: 'inactive' as const,
          expectedStatusText: 'Inactive',
          expectedStatusClass: 'bg-gray-100 text-gray-800'
        },
        {
          status: 'suspended' as const,
          expectedStatusText: 'Suspended',
          expectedStatusClass: 'bg-red-100 text-red-800'
        }
      ]

      for (const testCase of testCases) {
        // Arrange: Partner with specific status
        const testPartner = {
          id: `partner-${testCase.status}`,
          email: `${testCase.status}@partner.com`,
          name: `${testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)} Partner`,
          role: 'user',
          company_name: `${testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)} Company`,
          contact_email: `${testCase.status}@partner.com`,
          discount_tier_id: 'tier-silver',
          status: testCase.status,
          white_label_settings: {},
          markup_preferences: { defaultMarkupPercentage: 30 },
          custom_domain: null,
          branding_level: 'co-branded' as const,
          discount_tier: {
            name: 'Silver',
            website_discount: 15,
            webapp_discount: 15,
            mobile_app_discount: 15,
            ai_website_base_discount: 25,
            ecommerce_discount: 15,
            maintenance_discount: 20,
            per_page_discount: 50
          }
        }

        // Mock the usePartnerAuth hook
        mockUsePartnerAuth.mockReturnValue({
          user: { id: testPartner.id, email: testPartner.email },
          partnerProfile: testPartner,
          loading: false,
          signIn: vi.fn(),
          signOut: vi.fn(),
          isPartner: true,
          isActivePartner: testCase.status === 'active'
        })

        // Act: Render dashboard
        const { unmount } = renderWithRouter(<PartnerDashboard />)

        // Assert: Check status-specific content
        await waitFor(() => {
          expect(screen.getByText(testCase.expectedStatusText)).toBeInTheDocument()
        })

        // Property verification: Status should be consistently displayed
        const statusElements = screen.getAllByText(testCase.expectedStatusText)
        expect(statusElements.length).toBeGreaterThan(0)

        unmount()
        vi.clearAllMocks()
      }
    })

    it('should display discount tier information consistently across different tiers', async () => {
      const discountTiers = [
        {
          name: 'Bronze',
          website_discount: 10,
          expectedText: '10% website discount'
        },
        {
          name: 'Silver', 
          website_discount: 15,
          expectedText: '15% website discount'
        },
        {
          name: 'Gold',
          website_discount: 20,
          expectedText: '20% website discount'
        },
        {
          name: 'Platinum',
          website_discount: 25,
          expectedText: '25% website discount'
        }
      ]

      for (const tier of discountTiers) {
        // Arrange: Partner with specific discount tier
        const testPartner = {
          id: `partner-${tier.name.toLowerCase()}`,
          email: `${tier.name.toLowerCase()}@partner.com`,
          name: `${tier.name} Partner`,
          role: 'user',
          company_name: `${tier.name} Solutions`,
          contact_email: `${tier.name.toLowerCase()}@partner.com`,
          discount_tier_id: `tier-${tier.name.toLowerCase()}`,
          status: 'active' as const,
          white_label_settings: {},
          markup_preferences: { defaultMarkupPercentage: 30 },
          custom_domain: null,
          branding_level: 'co-branded' as const,
          discount_tier: {
            name: tier.name,
            website_discount: tier.website_discount,
            webapp_discount: tier.website_discount,
            mobile_app_discount: tier.website_discount,
            ai_website_base_discount: tier.website_discount + 10,
            ecommerce_discount: tier.website_discount,
            maintenance_discount: tier.website_discount + 5,
            per_page_discount: 50
          }
        }

        // Mock the usePartnerAuth hook
        mockUsePartnerAuth.mockReturnValue({
          user: { id: testPartner.id, email: testPartner.email },
          partnerProfile: testPartner,
          loading: false,
          signIn: vi.fn(),
          signOut: vi.fn(),
          isPartner: true,
          isActivePartner: true
        })

        // Act: Render dashboard
        const { unmount } = renderWithRouter(<PartnerDashboard />)

        // Assert: Check tier-specific discount information
        await waitFor(() => {
          expect(screen.getByText(tier.name)).toBeInTheDocument()
          expect(screen.getByText(tier.expectedText)).toBeInTheDocument()
        })

        // Property verification: Discount information should be accurate
        expect(screen.getByText(tier.name)).toBeInTheDocument()

        unmount()
        vi.clearAllMocks()
      }
    })
  })
})