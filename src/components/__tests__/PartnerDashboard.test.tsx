import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PartnerAuthProvider } from '@/contexts/PartnerAuthContext'
import PartnerDashboard from '@/components/PartnerDashboard'
import { USE_MOCK_DATA, mockPartnerProfiles } from '@/lib/mockPartnerData'
import * as fc from 'fast-check'

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

// Mock the partner auth context
const mockUsePartnerAuth = vi.fn()

vi.mock('@/contexts/PartnerAuthContext', () => ({
  usePartnerAuth: () => mockUsePartnerAuth(),
  PartnerAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock the partner URL hook
vi.mock('@/hooks/usePartnerUrl', () => ({
  usePartnerUrl: () => ({
    getPortalUrl: (path: string) => `/partners/portal/${path}`,
    isCustomDomain: false,
    partnerDomain: null
  })
}))

// Test component wrapper
function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      {component}
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
    // Arbitraries for property-based testing
    const partnerStatusArbitrary = fc.constantFrom('active', 'pending', 'inactive', 'suspended')
    const brandingLevelArbitrary = fc.constantFrom('co-branded', 'partner-primary', 'full-white-label')
    const discountTierNameArbitrary = fc.constantFrom('Bronze', 'Silver', 'Gold', 'Platinum')
    
    const discountTierArbitrary = fc.record({
      name: discountTierNameArbitrary,
      website_discount: fc.integer({ min: 0, max: 30 }),
      webapp_discount: fc.integer({ min: 0, max: 30 }),
      mobile_app_discount: fc.integer({ min: 0, max: 30 }),
      ai_website_base_discount: fc.integer({ min: 0, max: 40 }),
      ecommerce_discount: fc.integer({ min: 0, max: 30 }),
      maintenance_discount: fc.integer({ min: 0, max: 30 }),
      per_page_discount: fc.integer({ min: 0, max: 100 })
    })

    const partnerProfileArbitrary = fc.record({
      id: fc.uuid(),
      email: fc.emailAddress(),
      name: fc.string({ minLength: 3, maxLength: 50 }),
      role: fc.constant('user'),
      company_name: fc.string({ minLength: 3, maxLength: 100 }),
      contact_email: fc.emailAddress(),
      discount_tier_id: fc.uuid(),
      status: partnerStatusArbitrary,
      white_label_settings: fc.record({}),
      markup_preferences: fc.record({
        defaultMarkupPercentage: fc.integer({ min: 10, max: 50 })
      }),
      custom_domain: fc.option(fc.domain(), { nil: null }),
      branding_level: brandingLevelArbitrary,
      discount_tier: discountTierArbitrary
    })

    it('should display personalized content consistently for any partner profile (Property-Based Test)', () => {
      fc.assert(
        fc.property(partnerProfileArbitrary, (partnerProfile) => {
          // Arrange: Mock the partner auth context with generated profile
          mockUsePartnerAuth.mockReturnValue({
            user: { id: partnerProfile.id, email: partnerProfile.email },
            partnerProfile: partnerProfile,
            loading: false,
            signIn: vi.fn(),
            signOut: vi.fn(),
            isPartner: true,
            isActivePartner: partnerProfile.status === 'active'
          })

          // Act: Render dashboard
          const { unmount } = renderWithRouter(<PartnerDashboard />)

          // Assert: Verify personalized content is displayed
          // 1. Welcome message should include partner name (Requirement 1.5)
          expect(screen.getByText(`Welcome back, ${partnerProfile.name}!`)).toBeInTheDocument()

          // 2. Company information should be displayed (Requirement 5.1)
          expect(screen.getByText(partnerProfile.company_name)).toBeInTheDocument()
          expect(screen.getByText(partnerProfile.contact_email)).toBeInTheDocument()

          // 3. Account status should be shown (Requirement 5.3)
          const statusElements = screen.getAllByText(partnerProfile.status, { exact: false })
          expect(statusElements.length).toBeGreaterThan(0)

          // 4. Discount tier information should be displayed (Requirement 4.4, 5.5)
          expect(screen.getByText(partnerProfile.discount_tier.name)).toBeInTheDocument()
          expect(screen.getByText(`${partnerProfile.discount_tier.website_discount}% website discount`)).toBeInTheDocument()

          // Property verification: All personalized content should be consistent
          // The dashboard should show the same information in multiple places
          const companyNameElements = screen.getAllByText(partnerProfile.company_name)
          expect(companyNameElements.length).toBeGreaterThan(0)

          // Cleanup
          unmount()
          vi.clearAllMocks()
        }),
        { numRuns: 100 } // Run 100 iterations as per design document requirement
      )
    })

    it('should display correct status styling for any partner status (Property-Based Test)', () => {
      fc.assert(
        fc.property(partnerProfileArbitrary, (partnerProfile) => {
          // Arrange
          mockUsePartnerAuth.mockReturnValue({
            user: { id: partnerProfile.id, email: partnerProfile.email },
            partnerProfile: partnerProfile,
            loading: false,
            signIn: vi.fn(),
            signOut: vi.fn(),
            isPartner: true,
            isActivePartner: partnerProfile.status === 'active'
          })

          // Act
          const { unmount } = renderWithRouter(<PartnerDashboard />)

          // Assert: Status should be displayed with appropriate styling
          const statusElements = screen.getAllByText(partnerProfile.status, { exact: false })
          expect(statusElements.length).toBeGreaterThan(0)

          // Verify status badge exists
          const statusBadge = statusElements.find(el => 
            el.classList.contains('bg-green-100') ||
            el.classList.contains('bg-yellow-100') ||
            el.classList.contains('bg-gray-100') ||
            el.classList.contains('bg-red-100')
          )
          
          // Property: Status should always have appropriate color coding
          if (partnerProfile.status === 'active') {
            expect(statusBadge?.classList.contains('bg-green-100')).toBeTruthy()
          } else if (partnerProfile.status === 'pending') {
            expect(statusBadge?.classList.contains('bg-yellow-100')).toBeTruthy()
          } else if (partnerProfile.status === 'inactive') {
            expect(statusBadge?.classList.contains('bg-gray-100')).toBeTruthy()
          } else if (partnerProfile.status === 'suspended') {
            expect(statusBadge?.classList.contains('bg-red-100')).toBeTruthy()
          }

          // Cleanup
          unmount()
          vi.clearAllMocks()
        }),
        { numRuns: 100 }
      )
    })

    it('should display discount tier information consistently for any discount tier (Property-Based Test)', () => {
      fc.assert(
        fc.property(partnerProfileArbitrary, (partnerProfile) => {
          // Arrange
          mockUsePartnerAuth.mockReturnValue({
            user: { id: partnerProfile.id, email: partnerProfile.email },
            partnerProfile: partnerProfile,
            loading: false,
            signIn: vi.fn(),
            signOut: vi.fn(),
            isPartner: true,
            isActivePartner: partnerProfile.status === 'active'
          })

          // Act
          const { unmount } = renderWithRouter(<PartnerDashboard />)

          // Assert: Discount tier should be displayed correctly
          // 1. Tier name should be visible (Requirement 4.4)
          expect(screen.getByText(partnerProfile.discount_tier.name)).toBeInTheDocument()

          // 2. Website discount percentage should be shown (Requirement 5.5)
          const discountText = `${partnerProfile.discount_tier.website_discount}% website discount`
          expect(screen.getByText(discountText)).toBeInTheDocument()

          // Property: Discount information should be accurate and consistent
          const tierNameElements = screen.getAllByText(partnerProfile.discount_tier.name)
          expect(tierNameElements.length).toBeGreaterThan(0)

          // Cleanup
          unmount()
          vi.clearAllMocks()
        }),
        { numRuns: 100 }
      )
    })

    it('should maintain consistent personalization across dashboard sections (Property-Based Test)', () => {
      fc.assert(
        fc.property(partnerProfileArbitrary, (partnerProfile) => {
          // Arrange
          mockUsePartnerAuth.mockReturnValue({
            user: { id: partnerProfile.id, email: partnerProfile.email },
            partnerProfile: partnerProfile,
            loading: false,
            signIn: vi.fn(),
            signOut: vi.fn(),
            isPartner: true,
            isActivePartner: partnerProfile.status === 'active'
          })

          // Act
          const { unmount } = renderWithRouter(<PartnerDashboard />)

          // Assert: All sections should show consistent information
          // 1. Partner info cards section
          expect(screen.getByText(partnerProfile.company_name)).toBeInTheDocument()
          expect(screen.getByText(partnerProfile.contact_email)).toBeInTheDocument()
          
          // 2. Status information
          const statusElements = screen.getAllByText(partnerProfile.status, { exact: false })
          expect(statusElements.length).toBeGreaterThan(0)
          
          // 3. Discount tier information
          expect(screen.getByText(partnerProfile.discount_tier.name)).toBeInTheDocument()

          // Property: Information should be consistent across all dashboard sections
          // The same data should appear in multiple places without discrepancies
          const allCompanyReferences = screen.getAllByText(partnerProfile.company_name)
          expect(allCompanyReferences.length).toBeGreaterThan(0)
          
          // All references should show the same company name
          allCompanyReferences.forEach(element => {
            expect(element.textContent).toBe(partnerProfile.company_name)
          })

          // Cleanup
          unmount()
          vi.clearAllMocks()
        }),
        { numRuns: 100 }
      )
    })

    // Unit test examples for specific scenarios
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