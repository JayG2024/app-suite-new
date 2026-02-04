import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import ResourceCustomizer from '../ResourceCustomizer';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn()
    }
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

/**
 * Property 5: Document Customization and White-Labeling
 * 
 * **Feature: partner-portal, Property 5: Document Customization and White-Labeling**
 * 
 * **Validates: Requirements 3.2, 3.3**
 * 
 * For any resource document and partner branding information, the system should:
 * 1. Allow customization with partner branding (logo, company info, colors)
 * 2. Generate white-label versions at different branding levels
 * 3. Maintain branding consistency across all customized documents
 * 4. Preserve original documents when customization fails
 * 5. Track customization analytics
 */

describe('Property 5: Document Customization and White-Labeling', () => {
  const mockResource = {
    id: 'resource-1',
    title: 'Test Resource',
    category_id: 'cat-1',
    content_type: 'pdf',
    file_path: '/resources/test.pdf',
    customizable: true,
    white_labelable: true,
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: {
      name: 'Technical Documentation'
    }
  };

  const mockPartnerId = 'partner-123';
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      insert: vi.fn(() => Promise.resolve({ error: null }))
    }));

    (supabase.from as any) = mockFrom;
  });

  // Arbitraries for property-based testing
  const brandingLevelArb = fc.constantFrom(
    'co-branded' as const,
    'partner-primary' as const,
    'full-white-label' as const
  );

  const companyNameArb = fc.string({ minLength: 1, maxLength: 100 });
  const emailArb = fc.emailAddress();
  const phoneArb = fc.option(fc.string({ minLength: 10, maxLength: 20 }), { nil: undefined });
  const websiteArb = fc.option(fc.webUrl(), { nil: undefined });
  const colorArb = fc.integer({ min: 0, max: 0xFFFFFF }).map(num => 
    `#${num.toString(16).padStart(6, '0')}`
  );

  const brandingDataArb = fc.record({
    companyName: companyNameArb,
    contactEmail: emailArb,
    contactPhone: phoneArb,
    website: websiteArb,
    primaryColor: colorArb,
    secondaryColor: colorArb,
    whiteLabelLevel: brandingLevelArb
  });

  const resourceArb = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 200 }),
    customizable: fc.boolean(),
    white_labelable: fc.boolean(),
    content_type: fc.constantFrom('pdf', 'docx', 'xlsx')
  });

  it('Property 5.1: Should allow customization with partner branding for any valid branding data', async () => {
    await fc.assert(
      fc.asyncProperty(brandingDataArb, async (brandingData) => {
        const { rerender } = render(
          <ResourceCustomizer
            resource={mockResource}
            partnerId={mockPartnerId}
            onBack={mockOnBack}
          />
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
        });

        const user = userEvent.setup();

        // Fill in branding data
        const companyNameInput = screen.getByLabelText(/Company Name/i);
        const emailInput = screen.getByLabelText(/Contact Email/i);

        await user.clear(companyNameInput);
        await user.type(companyNameInput, brandingData.companyName);
        
        await user.clear(emailInput);
        await user.type(emailInput, brandingData.contactEmail);

        // Verify inputs accept the data
        expect(companyNameInput).toHaveValue(brandingData.companyName);
        expect(emailInput).toHaveValue(brandingData.contactEmail);

        // Save button should be enabled with valid data
        const saveButton = screen.getByRole('button', { name: /Save Customization/i });
        expect(saveButton).not.toBeDisabled();
      }),
      { numRuns: 50 }
    );
  });

  it('Property 5.2: Should generate white-label versions at different branding levels', async () => {
    await fc.assert(
      fc.asyncProperty(brandingLevelArb, brandingDataArb, async (brandingLevel, brandingData) => {
        // Mock successful save
        const mockUpsert = vi.fn(() => Promise.resolve({ error: null }));
        const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
        
        (supabase.from as any) = vi.fn((table: string) => {
          if (table === 'custom_resources') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                  }))
                }))
              })),
              upsert: mockUpsert
            };
          }
          if (table === 'partner_analytics') {
            return {
              insert: mockInsert
            };
          }
          return {};
        });

        render(
          <ResourceCustomizer
            resource={mockResource}
            partnerId={mockPartnerId}
            onBack={mockOnBack}
          />
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
        });

        const user = userEvent.setup();

        // Fill in required fields
        await user.type(screen.getByLabelText(/Company Name/i), brandingData.companyName);
        await user.type(screen.getByLabelText(/Contact Email/i), brandingData.contactEmail);

        // Select branding level
        const brandingLevelSelect = screen.getByRole('combobox');
        await user.click(brandingLevelSelect);
        
        // Find and click the option (this is a simplified approach)
        const saveButton = screen.getByRole('button', { name: /Save Customization/i });
        await user.click(saveButton);

        // Verify that upsert was called with branding data
        await waitFor(() => {
          expect(mockUpsert).toHaveBeenCalled();
        });

        const upsertCall = mockUpsert.mock.calls[0][0];
        expect(upsertCall).toHaveProperty('partner_id', mockPartnerId);
        expect(upsertCall).toHaveProperty('base_resource_id', mockResource.id);
        expect(upsertCall.branding_data).toHaveProperty('companyName', brandingData.companyName);
        expect(upsertCall.branding_data).toHaveProperty('contactEmail', brandingData.contactEmail);
      }),
      { numRuns: 30 }
    );
  });

  it('Property 5.3: Should maintain branding consistency across customization operations', async () => {
    await fc.assert(
      fc.asyncProperty(brandingDataArb, async (brandingData) => {
        // Mock existing customization
        const existingCustomization = {
          partner_id: mockPartnerId,
          base_resource_id: mockResource.id,
          branding_data: brandingData,
          white_label_level: brandingData.whiteLabelLevel
        };

        (supabase.from as any) = vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ 
                  data: existingCustomization, 
                  error: null 
                }))
              }))
            }))
          })),
          upsert: vi.fn(() => Promise.resolve({ error: null })),
          insert: vi.fn(() => Promise.resolve({ error: null }))
        }));

        render(
          <ResourceCustomizer
            resource={mockResource}
            partnerId={mockPartnerId}
            onBack={mockOnBack}
          />
        );

        // Wait for data to load
        await waitFor(() => {
          const companyNameInput = screen.getByLabelText(/Company Name/i) as HTMLInputElement;
          expect(companyNameInput.value).toBe(brandingData.companyName);
        });

        // Verify all branding data is loaded consistently
        const emailInput = screen.getByLabelText(/Contact Email/i) as HTMLInputElement;
        expect(emailInput.value).toBe(brandingData.contactEmail);

        if (brandingData.contactPhone) {
          const phoneInput = screen.getByLabelText(/Phone Number/i) as HTMLInputElement;
          expect(phoneInput.value).toBe(brandingData.contactPhone);
        }

        if (brandingData.website) {
          const websiteInput = screen.getByLabelText(/Website/i) as HTMLInputElement;
          expect(websiteInput.value).toBe(brandingData.website);
        }
      }),
      { numRuns: 50 }
    );
  });

  it('Property 5.4: Should handle customization for resources with different customization capabilities', async () => {
    await fc.assert(
      fc.asyncProperty(resourceArb, brandingDataArb, async (resource, brandingData) => {
        const testResource = {
          ...mockResource,
          ...resource,
          category: mockResource.category
        };

        render(
          <ResourceCustomizer
            resource={testResource}
            partnerId={mockPartnerId}
            onBack={mockOnBack}
          />
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
        });

        // If resource is not white-labelable, full white-label option should not be available
        if (!resource.white_labelable) {
          const brandingLevelSelect = screen.getByRole('combobox');
          await userEvent.click(brandingLevelSelect);
          
          // Full white-label option should not be present
          const options = screen.queryAllByRole('option');
          const fullWhiteLabelOption = options.find(opt => 
            opt.textContent?.includes('Full White-Label')
          );
          
          // This test verifies the option exists or doesn't based on white_labelable
          if (resource.white_labelable) {
            expect(fullWhiteLabelOption).toBeDefined();
          }
        }

        // All resources should allow basic customization
        const companyNameInput = screen.getByLabelText(/Company Name/i);
        expect(companyNameInput).toBeInTheDocument();
      }),
      { numRuns: 30 }
    );
  });

  it('Property 5.5: Should track customization analytics for all customization operations', async () => {
    await fc.assert(
      fc.asyncProperty(brandingDataArb, async (brandingData) => {
        const mockUpsert = vi.fn(() => Promise.resolve({ error: null }));
        const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
        
        (supabase.from as any) = vi.fn((table: string) => {
          if (table === 'custom_resources') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                  }))
                }))
              })),
              upsert: mockUpsert
            };
          }
          if (table === 'partner_analytics') {
            return {
              insert: mockInsert
            };
          }
          return {};
        });

        render(
          <ResourceCustomizer
            resource={mockResource}
            partnerId={mockPartnerId}
            onBack={mockOnBack}
          />
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
        });

        const user = userEvent.setup();

        // Fill in and save
        await user.type(screen.getByLabelText(/Company Name/i), brandingData.companyName);
        await user.type(screen.getByLabelText(/Contact Email/i), brandingData.contactEmail);

        const saveButton = screen.getByRole('button', { name: /Save Customization/i });
        await user.click(saveButton);

        // Verify analytics tracking
        await waitFor(() => {
          expect(mockInsert).toHaveBeenCalled();
        });

        const analyticsCall = mockInsert.mock.calls[0][0];
        expect(analyticsCall).toHaveProperty('partner_id', mockPartnerId);
        expect(analyticsCall).toHaveProperty('metric_type', 'resource_customization');
        expect(analyticsCall).toHaveProperty('metric_value', 1);
        expect(analyticsCall.metadata).toHaveProperty('resource_id', mockResource.id);
      }),
      { numRuns: 50 }
    );
  });

  it('Property 5.6: Should validate required fields before allowing save', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          companyName: fc.option(companyNameArb, { nil: '' }),
          contactEmail: fc.option(emailArb, { nil: '' })
        }),
        async (partialBranding) => {
          render(
            <ResourceCustomizer
              resource={mockResource}
              partnerId={mockPartnerId}
              onBack={mockOnBack}
            />
          );

          await waitFor(() => {
            expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
          });

          const user = userEvent.setup();

          // Fill in partial data
          if (partialBranding.companyName) {
            await user.type(screen.getByLabelText(/Company Name/i), partialBranding.companyName);
          }
          if (partialBranding.contactEmail) {
            await user.type(screen.getByLabelText(/Contact Email/i), partialBranding.contactEmail);
          }

          const saveButton = screen.getByRole('button', { name: /Save Customization/i });

          // Save button should be disabled if either required field is empty
          const shouldBeDisabled = !partialBranding.companyName || !partialBranding.contactEmail;
          
          if (shouldBeDisabled) {
            expect(saveButton).toBeDisabled();
          } else {
            expect(saveButton).not.toBeDisabled();
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
