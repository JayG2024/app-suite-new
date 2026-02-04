import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import WebsiteAnalyzer from '@/components/WebsiteAnalyzer'
import * as PartnerAuthContext from '@/contexts/PartnerAuthContext'

// Mock partner profile data
const mockPartnerProfile = {
  id: 'test-partner-id',
  email: 'test@example.com',
  name: 'Test Partner',
  role: 'partner',
  company_name: 'Test Company',
  contact_email: 'test@example.com',
  discount_tier_id: 'gold-tier',
  status: 'active' as const,
  white_label_settings: {},
  markup_preferences: {},
  branding_level: 'co-branded' as const,
  discount_tier: {
    name: 'Gold',
    website_discount: 20,
    webapp_discount: 15,
    mobile_app_discount: 15,
    ai_website_base_discount: 20,
    ecommerce_discount: 15,
    maintenance_discount: 10,
    per_page_discount: 50
  }
}

// Mock the usePartnerAuth hook
const mockUsePartnerAuth = vi.fn()

// Helper to render with router and mocked auth
function renderWithProviders(component: React.ReactElement, partnerProfile = mockPartnerProfile) {
  mockUsePartnerAuth.mockReturnValue({
    user: partnerProfile ? { id: partnerProfile.id, email: partnerProfile.email } : null,
    partnerProfile,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    isPartner: !!partnerProfile,
    isActivePartner: partnerProfile?.status === 'active'
  })

  vi.spyOn(PartnerAuthContext, 'usePartnerAuth').mockImplementation(mockUsePartnerAuth)

  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

// Helper to render with router (no auth)
function renderWithRouter(component: React.ReactElement) {
  mockUsePartnerAuth.mockReturnValue({
    user: null,
    partnerProfile: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    isPartner: false,
    isActivePartner: false
  })

  vi.spyOn(PartnerAuthContext, 'usePartnerAuth').mockImplementation(mockUsePartnerAuth)

  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('WebsiteAnalyzer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('URL Input and Validation', () => {
    it('should render the URL input form', () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      expect(screen.getByText('Website Analyzer')).toBeInTheDocument()
      expect(screen.getByLabelText('Website URL')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument()
    })

    it('should accept valid URL with protocol', () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      expect(input.value).toBe('https://example.com')
    })

    it('should accept valid URL without protocol and add https', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      // The component should add https:// protocol
      await waitFor(() => {
        expect(input.value).toBe('https://example.com')
      })
    })
  })

  describe('Website Analysis', () => {
    it('should show loading state during analysis', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /analyzing/i })).toBeInTheDocument()
        expect(screen.getByText(/crawling website and analyzing content/i)).toBeInTheDocument()
      })
    })

    it('should display analysis results after successful analysis', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      // Wait for analysis to complete (mock data)
      await waitFor(() => {
        expect(screen.getByText(/analysis complete/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show results sections
      expect(screen.getByText('Website Overview')).toBeInTheDocument()
      expect(screen.getByText('Content Assessment')).toBeInTheDocument()
      expect(screen.getByText('Next Steps')).toBeInTheDocument()
    })

    it('should display page count in results', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/analysis complete/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show page count
      expect(screen.getByText('Total Pages')).toBeInTheDocument()
    })

    it('should display content types in results', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Content Assessment')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show content types - use getAllByText for duplicate labels
      expect(screen.getAllByText('Text Content').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Images').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Forms').length).toBeGreaterThan(0)
    })

    it('should show SEO analysis when available', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('SEO & Technical Assessment')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show SEO metrics
      expect(screen.getByText('Meta Tags')).toBeInTheDocument()
      expect(screen.getByText('Structured Data')).toBeInTheDocument()
      expect(screen.getByText('Mobile Responsive')).toBeInTheDocument()
    })

    it('should provide next steps buttons after analysis', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Next Steps')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show action buttons
      expect(screen.getByRole('button', { name: /generate rebuild quote/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save analysis/i })).toBeInTheDocument()
    })
  })

  describe('Keyboard Interaction', () => {
    it('should trigger analysis on Enter key press', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      // Press Enter using keyDown event
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      
      // Should start analysis
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /analyzing/i })).toBeInTheDocument()
      })
    })
  })

  describe('Button States', () => {
    it('should disable analyze button when URL is empty', () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).toBeDisabled()
    })

    it('should enable analyze button when URL is entered', () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).not.toBeDisabled()
    })

    it('should disable input and button during analysis', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      // Should be disabled during analysis
      await waitFor(() => {
        expect(input).toBeDisabled()
        expect(screen.getByRole('button', { name: /analyzing/i })).toBeDisabled()
      })
    })
  })

  describe('Rebuild Pricing Suggestions', () => {
    it('should display rebuild recommendations after analysis', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Rebuild Recommendations')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show recommendation details
      expect(screen.getByText('Recommended Approach')).toBeInTheDocument()
      expect(screen.getByText('Complexity Level')).toBeInTheDocument()
      expect(screen.getByText('Timeline Estimate')).toBeInTheDocument()
    })

    it('should display suggested features based on analysis', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Suggested Features')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should display best practices recommendations', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Best Practices & Improvements')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show at least one best practice - use getAllByText since text appears in multiple places
      const modernArchTexts = screen.getAllByText(/Modern React-based architecture/i)
      expect(modernArchTexts.length).toBeGreaterThan(0)
    })

    it('should calculate and display rebuild pricing', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Rebuild Pricing Estimate')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show pricing details
      expect(screen.getByText('Standard Price')).toBeInTheDocument()
      expect(screen.getByText('Partner Discount')).toBeInTheDocument()
      expect(screen.getByText('Your Partner Price')).toBeInTheDocument()
    })

    it('should apply partner discount to rebuild pricing', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/you save/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show discount percentage (20% for Gold tier)
      expect(screen.getByText(/20%/)).toBeInTheDocument()
    })

    it('should show pricing includes list', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/pricing includes:/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show included features - use getAllByText since text appears in multiple places
      expect(screen.getAllByText(/Content Management System/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/SEO optimization/i).length).toBeGreaterThan(0)
    })

    it('should enable generate quote button after analysis', async () => {
      renderWithProviders(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        const quoteButton = screen.getByRole('button', { name: /generate rebuild quote/i })
        expect(quoteButton).not.toBeDisabled()
      }, { timeout: 3000 })
    })

    it('should work without partner profile (no discount)', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Rebuild Recommendations')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show standard price but not partner discount
      expect(screen.getByText('Standard Price')).toBeInTheDocument()
      expect(screen.queryByText('Partner Discount')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Analyses', () => {
    it('should allow analyzing different URLs sequentially', async () => {
      renderWithRouter(<WebsiteAnalyzer />)
      
      // First analysis
      const input = screen.getByLabelText('Website URL')
      fireEvent.change(input, { target: { value: 'https://example1.com' } })
      
      let analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/analysis complete/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Second analysis
      fireEvent.change(input, { target: { value: 'https://example2.com' } })
      analyzeButton = screen.getByRole('button', { name: /analyze/i })
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /analyzing/i })).toBeInTheDocument()
      })
    })
  })
})
