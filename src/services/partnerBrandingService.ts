/**
 * Partner Branding Service
 * 
 * Manages partner branding configuration including logos, colors, and white-label settings.
 * Handles branding asset uploads and configuration persistence.
 */

import { supabase } from '@/lib/supabase'
import { USE_MOCK_DATA } from '@/lib/mockPartnerData'

export type BrandingLevel = 'co-branded' | 'partner-primary' | 'full-white-label'

export interface BrandingConfig {
  companyName: string
  logo: string | null
  favicon: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  contactEmail: string
  contactPhone: string
  website: string
  address: string
  socialMedia: {
    linkedin: string
    twitter: string
    facebook: string
  }
  brandingLevel: BrandingLevel
}

export interface BrandingAssets {
  logo?: string
  favicon?: string
  customCSS?: string
}

/**
 * Gets the branding configuration for a partner
 */
export async function getBrandingConfig(partnerId: string): Promise<BrandingConfig | null> {
  if (USE_MOCK_DATA) {
    // Return mock branding config
    return {
      companyName: 'Test Partner Company',
      logo: null,
      favicon: null,
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      fontFamily: 'Inter',
      contactEmail: 'test@partner.com',
      contactPhone: '+1 (555) 123-4567',
      website: 'https://testpartner.com',
      address: '123 Main St, City, State, ZIP',
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: ''
      },
      brandingLevel: 'co-branded'
    }
  }

  const { data, error } = await supabase
    .from('partner_profiles')
    .select('white_label_settings, company_name, contact_email, branding_level')
    .eq('id', partnerId)
    .single()

  if (error) {
    console.error('Error fetching branding config:', error)
    throw error
  }

  if (!data) {
    return null
  }

  // Parse white_label_settings JSONB field
  const settings = data.white_label_settings || {}

  return {
    companyName: data.company_name || '',
    logo: settings.logo || null,
    favicon: settings.favicon || null,
    primaryColor: settings.primaryColor || '#1e40af',
    secondaryColor: settings.secondaryColor || '#3b82f6',
    accentColor: settings.accentColor || '#60a5fa',
    fontFamily: settings.fontFamily || 'Inter',
    contactEmail: data.contact_email || '',
    contactPhone: settings.contactPhone || '',
    website: settings.website || '',
    address: settings.address || '',
    socialMedia: settings.socialMedia || {
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    brandingLevel: data.branding_level || 'co-branded'
  }
}

/**
 * Updates the branding configuration for a partner
 */
export async function updateBrandingConfig(
  partnerId: string,
  config: BrandingConfig
): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log('Mock: Updating branding config', config)
    return
  }

  // Prepare white_label_settings object
  const whiteLabelSettings = {
    logo: config.logo,
    favicon: config.favicon,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    accentColor: config.accentColor,
    fontFamily: config.fontFamily,
    contactPhone: config.contactPhone,
    website: config.website,
    address: config.address,
    socialMedia: config.socialMedia
  }

  const { error } = await supabase
    .from('partner_profiles')
    .update({
      company_name: config.companyName,
      contact_email: config.contactEmail,
      white_label_settings: whiteLabelSettings,
      branding_level: config.brandingLevel,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId)

  if (error) {
    console.error('Error updating branding config:', error)
    throw error
  }
}

/**
 * Uploads a logo or favicon file to storage
 */
export async function uploadLogo(
  partnerId: string,
  file: File,
  type: 'logo' | 'favicon'
): Promise<string> {
  if (USE_MOCK_DATA) {
    // Return a mock URL
    return `https://via.placeholder.com/200x50?text=${type}`
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${partnerId}/${type}-${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('partner-branding')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('partner-branding')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

/**
 * Deletes a branding asset from storage
 */
export async function deleteBrandingAsset(
  partnerId: string,
  assetUrl: string
): Promise<void> {
  if (USE_MOCK_DATA) {
    return
  }

  // Extract file path from URL
  const urlParts = assetUrl.split('/partner-branding/')
  if (urlParts.length < 2) {
    return
  }

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('partner-branding')
    .remove([filePath])

  if (error) {
    console.error('Error deleting branding asset:', error)
    throw error
  }
}

/**
 * Generates custom CSS based on branding configuration
 */
export function generateCustomCSS(config: BrandingConfig): string {
  return `
    :root {
      --brand-primary: ${config.primaryColor};
      --brand-secondary: ${config.secondaryColor};
      --brand-accent: ${config.accentColor};
      --brand-font: ${config.fontFamily}, sans-serif;
    }

    .brand-primary {
      color: var(--brand-primary);
    }

    .brand-bg-primary {
      background-color: var(--brand-primary);
    }

    .brand-secondary {
      color: var(--brand-secondary);
    }

    .brand-bg-secondary {
      background-color: var(--brand-secondary);
    }

    .brand-accent {
      color: var(--brand-accent);
    }

    .brand-bg-accent {
      background-color: var(--brand-accent);
    }

    .brand-font {
      font-family: var(--brand-font);
    }

    /* Button styles */
    .btn-brand-primary {
      background-color: var(--brand-primary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-brand-primary:hover {
      opacity: 0.9;
    }

    .btn-brand-secondary {
      background-color: var(--brand-secondary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-brand-secondary:hover {
      opacity: 0.9;
    }

    /* Link styles */
    a.brand-link {
      color: var(--brand-primary);
      text-decoration: none;
    }

    a.brand-link:hover {
      color: var(--brand-secondary);
      text-decoration: underline;
    }

    /* Header styles */
    .brand-header {
      background-color: var(--brand-primary);
      color: white;
    }

    /* Card styles */
    .brand-card-header {
      border-bottom: 2px solid var(--brand-primary);
    }
  `.trim()
}

/**
 * Applies branding to the document
 */
export function applyBrandingToDocument(config: BrandingConfig): void {
  // Update document title
  if (config.companyName) {
    document.title = `${config.companyName} Partner Portal`
  }

  // Update favicon
  if (config.favicon) {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = config.favicon
  }

  // Inject custom CSS
  const customCSS = generateCustomCSS(config)
  let styleElement = document.getElementById('partner-branding-styles') as HTMLStyleElement
  
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'partner-branding-styles'
    document.head.appendChild(styleElement)
  }
  
  styleElement.textContent = customCSS
}

/**
 * Removes branding from the document
 */
export function removeBrandingFromDocument(): void {
  const styleElement = document.getElementById('partner-branding-styles')
  if (styleElement) {
    styleElement.remove()
  }

  // Reset favicon to default
  const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (link) {
    link.href = '/favicon.ico'
  }

  // Reset title
  document.title = 'App Suite Partner Portal'
}

/**
 * Gets branding assets for a partner
 */
export async function getBrandingAssets(partnerId: string): Promise<BrandingAssets> {
  const config = await getBrandingConfig(partnerId)
  
  if (!config) {
    return {}
  }

  return {
    logo: config.logo || undefined,
    favicon: config.favicon || undefined,
    customCSS: generateCustomCSS(config)
  }
}

/**
 * Validates branding configuration
 */
export function validateBrandingConfig(config: Partial<BrandingConfig>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (config.companyName !== undefined && !config.companyName.trim()) {
    errors.push('Company name is required')
  }

  if (config.contactEmail !== undefined && !config.contactEmail.trim()) {
    errors.push('Contact email is required')
  }

  if (config.contactEmail !== undefined && config.contactEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(config.contactEmail)) {
      errors.push('Invalid email format')
    }
  }

  if (config.primaryColor !== undefined) {
    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(config.primaryColor)) {
      errors.push('Invalid primary color format (use hex color like #1e40af)')
    }
  }

  if (config.secondaryColor !== undefined) {
    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(config.secondaryColor)) {
      errors.push('Invalid secondary color format (use hex color like #3b82f6)')
    }
  }

  if (config.accentColor !== undefined) {
    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(config.accentColor)) {
      errors.push('Invalid accent color format (use hex color like #60a5fa)')
    }
  }

  if (config.website !== undefined && config.website.trim()) {
    try {
      new URL(config.website)
    } catch {
      errors.push('Invalid website URL format')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
