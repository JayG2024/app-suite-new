/**
 * Document Customization Utilities
 * 
 * Handles the application of partner branding to resource documents.
 * Supports three branding levels: co-branded, partner-primary, and full-white-label.
 */

export interface BrandingConfig {
  logo?: string;
  companyName: string;
  tagline?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  whiteLabelLevel: 'co-branded' | 'partner-primary' | 'full-white-label';
}

export interface DocumentTemplate {
  id: string;
  title: string;
  contentType: string;
  templatePath?: string;
  customizable: boolean;
  whiteLabelable: boolean;
}

/**
 * Validates that all required branding fields are present
 */
export function validateBrandingConfig(branding: BrandingConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!branding.companyName || branding.companyName.trim() === '') {
    errors.push('Company name is required');
  }

  if (!branding.contactEmail || branding.contactEmail.trim() === '') {
    errors.push('Contact email is required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (branding.contactEmail && !emailRegex.test(branding.contactEmail)) {
    errors.push('Contact email must be a valid email address');
  }

  // Validate color formats if provided
  const colorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (branding.primaryColor && !colorRegex.test(branding.primaryColor)) {
    errors.push('Primary color must be a valid hex color (e.g., #3b82f6)');
  }
  if (branding.secondaryColor && !colorRegex.test(branding.secondaryColor)) {
    errors.push('Secondary color must be a valid hex color');
  }
  if (branding.accentColor && !colorRegex.test(branding.accentColor)) {
    errors.push('Accent color must be a valid hex color');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates a branding configuration object for document generation
 */
export function prepareBrandingForDocument(
  branding: BrandingConfig,
  template: DocumentTemplate
): BrandingConfig {
  // If template is not white-labelable, force co-branded or partner-primary
  if (!template.whiteLabelable && branding.whiteLabelLevel === 'full-white-label') {
    return {
      ...branding,
      whiteLabelLevel: 'partner-primary'
    };
  }

  return branding;
}

/**
 * Determines what branding elements should be applied based on the white-label level
 */
export function getBrandingElements(whiteLabelLevel: BrandingConfig['whiteLabelLevel']): {
  replaceLogo: boolean;
  replaceCompanyName: boolean;
  replaceContactInfo: boolean;
  replaceColors: boolean;
  showOriginalBranding: boolean;
  originalBrandingProminence: 'none' | 'minimal' | 'equal';
} {
  switch (whiteLabelLevel) {
    case 'co-branded':
      return {
        replaceLogo: true,
        replaceCompanyName: true,
        replaceContactInfo: true,
        replaceColors: false, // Keep original colors
        showOriginalBranding: true,
        originalBrandingProminence: 'equal'
      };
    
    case 'partner-primary':
      return {
        replaceLogo: true,
        replaceCompanyName: true,
        replaceContactInfo: true,
        replaceColors: true,
        showOriginalBranding: true,
        originalBrandingProminence: 'minimal'
      };
    
    case 'full-white-label':
      return {
        replaceLogo: true,
        replaceCompanyName: true,
        replaceContactInfo: true,
        replaceColors: true,
        showOriginalBranding: false,
        originalBrandingProminence: 'none'
      };
  }
}

/**
 * Formats address information for document insertion
 */
export function formatAddress(branding: BrandingConfig): string {
  const parts: string[] = [];

  if (branding.address) parts.push(branding.address);
  
  const cityStateZip: string[] = [];
  if (branding.city) cityStateZip.push(branding.city);
  if (branding.state) cityStateZip.push(branding.state);
  if (branding.zipCode) cityStateZip.push(branding.zipCode);
  
  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '));
  }
  
  if (branding.country) parts.push(branding.country);

  return parts.join('\n');
}

/**
 * Formats contact information for document insertion
 */
export function formatContactInfo(branding: BrandingConfig): {
  email: string;
  phone?: string;
  website?: string;
  address?: string;
} {
  return {
    email: branding.contactEmail,
    phone: branding.contactPhone,
    website: branding.website,
    address: formatAddress(branding)
  };
}

/**
 * Generates CSS variables for brand colors
 */
export function generateBrandColorCSS(branding: BrandingConfig): string {
  return `
    --brand-primary: ${branding.primaryColor || '#3b82f6'};
    --brand-secondary: ${branding.secondaryColor || '#64748b'};
    --brand-accent: ${branding.accentColor || '#10b981'};
  `.trim();
}

/**
 * Generates a document metadata object for tracking
 */
export function generateDocumentMetadata(
  template: DocumentTemplate,
  branding: BrandingConfig,
  partnerId: string
): {
  templateId: string;
  templateTitle: string;
  partnerCompany: string;
  whiteLabelLevel: string;
  generatedAt: string;
  partnerId: string;
} {
  return {
    templateId: template.id,
    templateTitle: template.title,
    partnerCompany: branding.companyName,
    whiteLabelLevel: branding.whiteLabelLevel,
    generatedAt: new Date().toISOString(),
    partnerId
  };
}

/**
 * Simulates document generation (placeholder for actual implementation)
 * In production, this would integrate with a document generation service
 */
export async function generateCustomizedDocument(
  template: DocumentTemplate,
  branding: BrandingConfig,
  partnerId: string
): Promise<{
  success: boolean;
  documentUrl?: string;
  error?: string;
}> {
  // Validate branding configuration
  const validation = validateBrandingConfig(branding);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  // Prepare branding for document
  const preparedBranding = prepareBrandingForDocument(branding, template);

  // Get branding elements to apply
  const elements = getBrandingElements(preparedBranding.whiteLabelLevel);

  // Generate document metadata
  const metadata = generateDocumentMetadata(template, preparedBranding, partnerId);

  // In a real implementation, this would:
  // 1. Load the document template
  // 2. Apply branding replacements based on elements configuration
  // 3. Generate the final document (PDF, DOCX, etc.)
  // 4. Upload to storage
  // 5. Return the document URL

  // For now, simulate the process
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    documentUrl: `/documents/customized/${partnerId}/${template.id}.pdf`
  };
}

/**
 * Applies logo replacement to document
 * This would be called by the document generation service
 */
export function applyLogoReplacement(
  documentContent: any,
  logoUrl: string | undefined,
  whiteLabelLevel: BrandingConfig['whiteLabelLevel']
): any {
  // Implementation would depend on document format (PDF, DOCX, etc.)
  // This is a placeholder for the actual implementation
  return documentContent;
}

/**
 * Applies company information updates to document
 */
export function applyCompanyInformation(
  documentContent: any,
  branding: BrandingConfig,
  whiteLabelLevel: BrandingConfig['whiteLabelLevel']
): any {
  // Implementation would depend on document format
  // This is a placeholder for the actual implementation
  return documentContent;
}

/**
 * Applies contact detail insertion to document
 */
export function applyContactDetails(
  documentContent: any,
  branding: BrandingConfig
): any {
  // Implementation would depend on document format
  // This is a placeholder for the actual implementation
  return documentContent;
}

/**
 * Applies brand colors to document styling
 */
export function applyBrandColors(
  documentContent: any,
  branding: BrandingConfig
): any {
  // Implementation would depend on document format
  // This is a placeholder for the actual implementation
  return documentContent;
}
