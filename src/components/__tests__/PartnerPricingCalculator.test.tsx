import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PartnerPricingCalculator from '@/components/PartnerPricingCalculator'
import { mockPartnerProfiles } from '@/lib/mockPartnerData'

// Mock the partner auth context
const mockUsePartnerAuth = vi.fn()

vi.mock('@/contexts/PartnerAuthContext', () => ({
  usePartnerAuth: () => mockUsePartnerAuth()
}))

function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Partner Pricing Calculator Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * Property 3: Pricing Calculation with Discount Application
   * For any service type and partner discount tier, the pricing calculator should 
   * apply discounts consistently and show both standard and partner pricing accurately
   * Validates: Requirements 2.2, 2.3
   */
  describe('Property 3: Pricing Calculation with Discount Application', () => {
    it('should apply Bronze tier discounts correctly across all service types', async () => {
      // Arrange: Bronze tier partner
      const bronzePartner = mockPartnerProfiles[0] // Bronze tier with 10% website discount
      mockUsePartnerAuth.mockReturnValue({
        user: { id: bronzePartner.id, email: bronzePartner.email },
        partnerProfile: bronzePartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render pricing calculator
      renderWithRouter(<PartnerPricingCalculator />)

      // Assert: Check that Bronze tier is displayed
      expect(screen.getByText(/Bronze tier discounts/)).toBeInTheDocument()

      // Test Custom Website pricing
      const websiteCard = screen.getByText('Custom Website').closest('.cursor-pointer')
      fireEvent.click(websiteCard!)

      await waitFor(() => {
        expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
      })

      // Configure simple website
      const complexitySelect = screen.getByRole('combobox')
      fireEvent.click(complexitySelect)
      fireEvent.click(screen.getByText('Simple (Brochure site)'))

      // Check pricing calculation
      await waitFor(() => {
        // Standard price for simple website should be $3,000
        expect(screen.getByText('$3,000')).toBeInTheDocument()
        // Bronze discount should be 10%
        expect(screen.getByText('10%')).toBeInTheDocument()
        // Partner price should be $2,700 (10% off $3,000)
        expect(screen.getByText('$2,700')).toBeInTheDocument()
      })
    })

    it('should apply Gold tier discounts correctly with higher discount percentages', async () => {
      // Arrange: Gold tier partner
      const goldPartner = {
        ...mockPartnerProfiles[1],
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
      
      mockUsePartnerAuth.mockReturnValue({
        user: { id: goldPartner.id, email: goldPartner.email },
        partnerProfile: goldPartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render pricing calculator
      renderWithRouter(<PartnerPricingCalculator />)

      // Test AI Website pricing (should have higher discount)
      const aiWebsiteCard = screen.getByText('AI Website').closest('.cursor-pointer')
      fireEvent.click(aiWebsiteCard!)

      await waitFor(() => {
        expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
      })

      // Configure standard AI website
      const typeSelect = screen.getByRole('combobox')
      fireEvent.click(typeSelect)
      fireEvent.click(screen.getByText('Standard ($2,500 base)'))

      // Check pricing calculation
      await waitFor(() => {
        // Standard price should be $2,500
        expect(screen.getByText('$2,500')).toBeInTheDocument()
        // Gold AI website discount should be 30%
        expect(screen.getByText('30%')).toBeInTheDocument()
        // Partner price should be $1,750 (30% off $2,500)
        expect(screen.getByText('$1,750')).toBeInTheDocument()
      })
    })

    it('should calculate pricing consistently for complex specifications', async () => {
      // Arrange: Silver tier partner
      const silverPartner = {
        id: 'partner-silver',
        email: 'silver@partner.com',
        name: 'Silver Partner',
        role: 'user',
        company_name: 'Silver Solutions',
        contact_email: 'silver@partner.com',
        discount_tier_id: 'tier-silver',
        status: 'active' as const,
        white_label_settings: {},
        markup_preferences: {},
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
      
      mockUsePartnerAuth.mockReturnValue({
        user: { id: silverPartner.id, email: silverPartner.email },
        partnerProfile: silverPartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render pricing calculator
      renderWithRouter(<PartnerPricingCalculator />)

      // Test complex website with multiple features
      const websiteCard = screen.getByText('Custom Website').closest('.cursor-pointer')
      fireEvent.click(websiteCard!)

      await waitFor(() => {
        expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
      })

      // Configure complex website
      const complexitySelect = screen.getByRole('combobox')
      fireEvent.click(complexitySelect)
      fireEvent.click(screen.getByText('Complex (Advanced features)'))

      // Add page count
      const pageCountInput = screen.getByPlaceholderText('5')
      fireEvent.change(pageCountInput, { target: { value: '10' } })

      // Add CMS
      const cmsCheckbox = screen.getByLabelText('Content Management System (CMS)')
      fireEvent.click(cmsCheckbox)

      // Add e-commerce integration
      const ecommerceCheckbox = screen.getByLabelText('E-commerce Integration')
      fireEvent.click(ecommerceCheckbox)

      // Check pricing calculation
      await waitFor(() => {
        // Complex website base: $8,000
        // Additional pages (10-5=5): 5 * $200 = $1,000
        // CMS: $1,000
        // E-commerce: $2,000
        // Total standard: $12,000
        expect(screen.getByText('$12,000')).toBeInTheDocument()
        
        // Silver discount: 15%
        expect(screen.getByText('15%')).toBeInTheDocument()
        
        // Partner price: $10,200 (15% off $12,000)
        expect(screen.getByText('$10,200')).toBeInTheDocument()
        
        // Savings: $1,800
        expect(screen.getByText('You save $1,800!')).toBeInTheDocument()
      })
    })

    it('should handle AI website per-page pricing with partner discounts', async () => {
      // Arrange: Bronze partner
      const bronzePartner = mockPartnerProfiles[0]
      mockUsePartnerAuth.mockReturnValue({
        user: { id: bronzePartner.id, email: bronzePartner.email },
        partnerProfile: bronzePartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render pricing calculator
      renderWithRouter(<PartnerPricingCalculator />)

      // Test AI website with multiple pages
      const aiWebsiteCard = screen.getByText('AI Website').closest('.cursor-pointer')
      fireEvent.click(aiWebsiteCard!)

      await waitFor(() => {
        expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
      })

      // Configure premium AI website with 5 pages
      const typeSelect = screen.getByRole('combobox')
      fireEvent.click(typeSelect)
      fireEvent.click(screen.getByText('Premium ($3,000 base)'))

      const pageCountInput = screen.getByPlaceholderText('1')
      fireEvent.change(pageCountInput, { target: { value: '5' } })

      // Check pricing calculation
      await waitFor(() => {
        // Premium base: $3,000
        // Additional pages (5-1=4): 4 * $100 = $400
        // Total standard: $3,400
        expect(screen.getByText('$3,400')).toBeInTheDocument()
        
        // Bronze AI website discount: 20%
        expect(screen.getByText('20%')).toBeInTheDocument()
        
        // Partner price: $2,720 (20% off $3,400)
        expect(screen.getByText('$2,720')).toBeInTheDocument()
      })
    })

    it('should apply discounts consistently across different service types for the same partner', async () => {
      // Arrange: Gold partner
      const goldPartner = {
        id: 'partner-gold',
        email: 'gold@partner.com',
        name: 'Gold Partner',
        role: 'user',
        company_name: 'Gold Enterprise',
        contact_email: 'gold@partner.com',
        discount_tier_id: 'tier-gold',
        status: 'active' as const,
        white_label_settings: {},
        markup_preferences: {},
        custom_domain: null,
        branding_level: 'co-branded' as const,
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
      
      mockUsePartnerAuth.mockReturnValue({
        user: { id: goldPartner.id, email: goldPartner.email },
        partnerProfile: goldPartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      const testCases = [
        {
          serviceName: 'Custom Website',
          expectedDiscount: 20,
          basePrice: 3000, // Simple website
          expectedPartnerPrice: 2400
        },
        {
          serviceName: 'E-commerce Solution',
          expectedDiscount: 20,
          basePrice: 6000, // Small catalog
          expectedPartnerPrice: 4800
        },
        {
          serviceName: 'Maintenance Package',
          expectedDiscount: 25,
          basePrice: 200, // Basic hosting
          expectedPartnerPrice: 150
        }
      ]

      for (const testCase of testCases) {
        // Act: Render pricing calculator
        const { unmount } = renderWithRouter(<PartnerPricingCalculator />)

        // Select service
        const serviceCard = screen.getByText(testCase.serviceName).closest('.cursor-pointer')
        fireEvent.click(serviceCard!)

        await waitFor(() => {
          expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
        })

        // Configure basic options for each service
        if (testCase.serviceName === 'Custom Website') {
          const complexitySelect = screen.getByRole('combobox')
          fireEvent.click(complexitySelect)
          fireEvent.click(screen.getByText('Simple (Brochure site)'))
        } else if (testCase.serviceName === 'E-commerce Solution') {
          const catalogSelect = screen.getByRole('combobox')
          fireEvent.click(catalogSelect)
          fireEvent.click(screen.getByText('Small'))
        } else if (testCase.serviceName === 'Maintenance Package') {
          const hostingSelect = screen.getByRole('combobox')
          fireEvent.click(hostingSelect)
          fireEvent.click(screen.getByText('Basic ($200/month)'))
        }

        // Assert: Check consistent discount application
        await waitFor(() => {
          expect(screen.getByText(`${testCase.expectedDiscount}%`)).toBeInTheDocument()
          expect(screen.getByText(`$${testCase.expectedPartnerPrice.toLocaleString()}`)).toBeInTheDocument()
        })

        unmount()
      }
    })

    it('should handle edge cases and maintain pricing consistency', async () => {
      // Arrange: Partner with zero discount (edge case)
      const noDiscountPartner = {
        id: 'partner-no-discount',
        email: 'nodiscount@partner.com',
        name: 'No Discount Partner',
        role: 'user',
        company_name: 'No Discount Company',
        contact_email: 'nodiscount@partner.com',
        discount_tier_id: 'tier-none',
        status: 'active' as const,
        white_label_settings: {},
        markup_preferences: {},
        custom_domain: null,
        branding_level: 'co-branded' as const,
        discount_tier: {
          name: 'None',
          website_discount: 0,
          webapp_discount: 0,
          mobile_app_discount: 0,
          ai_website_base_discount: 0,
          ecommerce_discount: 0,
          maintenance_discount: 0,
          per_page_discount: 0
        }
      }
      
      mockUsePartnerAuth.mockReturnValue({
        user: { id: noDiscountPartner.id, email: noDiscountPartner.email },
        partnerProfile: noDiscountPartner,
        loading: false,
        isPartner: true,
        isActivePartner: true
      })

      // Act: Render pricing calculator
      renderWithRouter(<PartnerPricingCalculator />)

      // Test website with zero discount
      const websiteCard = screen.getByText('Custom Website').closest('.cursor-pointer')
      fireEvent.click(websiteCard!)

      await waitFor(() => {
        expect(screen.getByText('Configure Specifications')).toBeInTheDocument()
      })

      const complexitySelect = screen.getByRole('combobox')
      fireEvent.click(complexitySelect)
      fireEvent.click(screen.getByText('Simple (Brochure site)'))

      // Assert: Standard and partner prices should be the same
      await waitFor(() => {
        expect(screen.getByText('$3,000')).toBeInTheDocument() // Standard price
        expect(screen.getByText('0%')).toBeInTheDocument() // No discount
        expect(screen.getByText('$3,000')).toBeInTheDocument() // Same partner price
        expect(screen.getByText('You save $0!')).toBeInTheDocument()
      })
    })
  })
})