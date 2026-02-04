/**
 * Domain Detection and White-Label Configuration
 * 
 * This module handles detection of custom domains and subdomains for partner white-label access.
 * It determines which partner is accessing the portal based on the domain/subdomain and applies
 * appropriate branding and configuration.
 */

export interface DomainConfig {
  type: 'main-site' | 'partner-path' | 'partner-subdomain' | 'partner-custom-domain'
  partnerId?: string
  partnerDomain?: string
  isWhiteLabel: boolean
  brandingLevel?: 'co-branded' | 'partner-primary' | 'full-white-label'
}

/**
 * Detects the current domain configuration and determines if this is a white-label access
 */
export function detectDomainConfig(): DomainConfig {
  const hostname = window.location.hostname
  const pathname = window.location.pathname
  
  // Main site access via /partners/portal path
  if (isMainSiteDomain(hostname) && pathname.startsWith('/partners/portal')) {
    return {
      type: 'partner-path',
      isWhiteLabel: false
    }
  }
  
  // Check for partner subdomain (e.g., partner.app-suite.io)
  const subdomainMatch = hostname.match(/^([^.]+)\.app-suite\.io$/)
  if (subdomainMatch && subdomainMatch[1] !== 'www') {
    const subdomain = subdomainMatch[1]
    return {
      type: 'partner-subdomain',
      partnerDomain: subdomain,
      isWhiteLabel: true,
      brandingLevel: 'partner-primary'
    }
  }
  
  // Check for custom domain (not main site domain)
  if (!isMainSiteDomain(hostname)) {
    return {
      type: 'partner-custom-domain',
      partnerDomain: hostname,
      isWhiteLabel: true,
      brandingLevel: 'full-white-label'
    }
  }
  
  // Default: main site
  return {
    type: 'main-site',
    isWhiteLabel: false
  }
}

/**
 * Checks if the hostname is the main site domain
 */
function isMainSiteDomain(hostname: string): boolean {
  const mainDomains = [
    'localhost',
    '127.0.0.1',
    'app-suite.io',
    'www.app-suite.io',
    'app-suite.vercel.app',
    'app-suite-preview.vercel.app'
  ]
  
  return mainDomains.some(domain => 
    hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

/**
 * Gets the base URL for the current domain configuration
 */
export function getBaseUrl(config: DomainConfig): string {
  if (config.type === 'partner-path') {
    return '/partners/portal'
  }
  
  // For white-label domains, root is the portal
  return ''
}

/**
 * Constructs a portal URL based on the current domain configuration
 */
export function getPortalUrl(path: string, config?: DomainConfig): string {
  const domainConfig = config || detectDomainConfig()
  const baseUrl = getBaseUrl(domainConfig)
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  if (baseUrl) {
    return `${baseUrl}/${cleanPath}`
  }
  
  return `/${cleanPath}`
}

/**
 * Checks if the current access is via white-label domain
 */
export function isWhiteLabelAccess(): boolean {
  const config = detectDomainConfig()
  return config.isWhiteLabel
}

/**
 * Gets the branding level for the current domain
 */
export function getBrandingLevel(): 'co-branded' | 'partner-primary' | 'full-white-label' | null {
  const config = detectDomainConfig()
  return config.brandingLevel || null
}
