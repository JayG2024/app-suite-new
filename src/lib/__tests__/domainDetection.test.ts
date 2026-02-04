/**
 * Domain Detection Tests
 * 
 * Tests for URL structure and domain configuration detection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { detectDomainConfig, getBaseUrl, getPortalUrl, isWhiteLabelAccess, getBrandingLevel } from '../domainDetection'

describe('Domain Detection', () => {
  let originalLocation: Location

  beforeEach(() => {
    originalLocation = window.location
  })

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    })
  })

  const mockLocation = (hostname: string, pathname: string = '/') => {
    delete (window as any).location
    window.location = {
      hostname,
      pathname,
      href: `https://${hostname}${pathname}`,
      protocol: 'https:',
      host: hostname,
      port: '',
      search: '',
      hash: '',
      origin: `https://${hostname}`,
      ancestorOrigins: {} as DOMStringList,
      assign: () => {},
      reload: () => {},
      replace: () => {},
      toString: () => `https://${hostname}${pathname}`
    } as Location
  }

  describe('detectDomainConfig', () => {
    it('should detect main site access', () => {
      mockLocation('app-suite.io', '/')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('main-site')
      expect(config.isWhiteLabel).toBe(false)
    })

    it('should detect partner path access', () => {
      mockLocation('app-suite.io', '/partners/portal')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('partner-path')
      expect(config.isWhiteLabel).toBe(false)
    })

    it('should detect partner subdomain access', () => {
      mockLocation('acme.app-suite.io', '/')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('partner-subdomain')
      expect(config.isWhiteLabel).toBe(true)
      expect(config.brandingLevel).toBe('partner-primary')
      expect(config.partnerDomain).toBe('acme')
    })

    it('should detect custom domain access', () => {
      mockLocation('portal.acmecorp.com', '/')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('partner-custom-domain')
      expect(config.isWhiteLabel).toBe(true)
      expect(config.brandingLevel).toBe('full-white-label')
      expect(config.partnerDomain).toBe('portal.acmecorp.com')
    })

    it('should handle localhost correctly', () => {
      mockLocation('localhost', '/partners/portal')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('partner-path')
      expect(config.isWhiteLabel).toBe(false)
    })

    it('should not treat www subdomain as partner subdomain', () => {
      mockLocation('www.app-suite.io', '/')
      const config = detectDomainConfig()
      
      expect(config.type).toBe('main-site')
      expect(config.isWhiteLabel).toBe(false)
    })
  })

  describe('getBaseUrl', () => {
    it('should return /partners/portal for partner-path type', () => {
      const config = { type: 'partner-path' as const, isWhiteLabel: false }
      expect(getBaseUrl(config)).toBe('/partners/portal')
    })

    it('should return empty string for partner-subdomain type', () => {
      const config = { 
        type: 'partner-subdomain' as const, 
        isWhiteLabel: true,
        brandingLevel: 'partner-primary' as const
      }
      expect(getBaseUrl(config)).toBe('')
    })

    it('should return empty string for partner-custom-domain type', () => {
      const config = { 
        type: 'partner-custom-domain' as const, 
        isWhiteLabel: true,
        brandingLevel: 'full-white-label' as const
      }
      expect(getBaseUrl(config)).toBe('')
    })
  })

  describe('getPortalUrl', () => {
    it('should prepend /partners/portal for standard path access', () => {
      mockLocation('app-suite.io', '/partners/portal')
      
      expect(getPortalUrl('pricing')).toBe('/partners/portal/pricing')
      expect(getPortalUrl('resources')).toBe('/partners/portal/resources')
      expect(getPortalUrl('')).toBe('/partners/portal/')
    })

    it('should use root path for subdomain access', () => {
      mockLocation('acme.app-suite.io', '/')
      
      expect(getPortalUrl('pricing')).toBe('/pricing')
      expect(getPortalUrl('resources')).toBe('/resources')
      expect(getPortalUrl('')).toBe('/')
    })

    it('should use root path for custom domain access', () => {
      mockLocation('portal.acmecorp.com', '/')
      
      expect(getPortalUrl('pricing')).toBe('/pricing')
      expect(getPortalUrl('resources')).toBe('/resources')
      expect(getPortalUrl('')).toBe('/')
    })

    it('should handle paths with leading slashes', () => {
      mockLocation('app-suite.io', '/partners/portal')
      
      expect(getPortalUrl('/pricing')).toBe('/partners/portal/pricing')
    })
  })

  describe('isWhiteLabelAccess', () => {
    it('should return false for main site', () => {
      mockLocation('app-suite.io', '/')
      expect(isWhiteLabelAccess()).toBe(false)
    })

    it('should return false for partner path', () => {
      mockLocation('app-suite.io', '/partners/portal')
      expect(isWhiteLabelAccess()).toBe(false)
    })

    it('should return true for subdomain', () => {
      mockLocation('acme.app-suite.io', '/')
      expect(isWhiteLabelAccess()).toBe(true)
    })

    it('should return true for custom domain', () => {
      mockLocation('portal.acmecorp.com', '/')
      expect(isWhiteLabelAccess()).toBe(true)
    })
  })

  describe('getBrandingLevel', () => {
    it('should return null for main site', () => {
      mockLocation('app-suite.io', '/')
      expect(getBrandingLevel()).toBe(null)
    })

    it('should return null for partner path', () => {
      mockLocation('app-suite.io', '/partners/portal')
      expect(getBrandingLevel()).toBe(null)
    })

    it('should return partner-primary for subdomain', () => {
      mockLocation('acme.app-suite.io', '/')
      expect(getBrandingLevel()).toBe('partner-primary')
    })

    it('should return full-white-label for custom domain', () => {
      mockLocation('portal.acmecorp.com', '/')
      expect(getBrandingLevel()).toBe('full-white-label')
    })
  })

  describe('Consistent functionality across access methods', () => {
    const testPaths = ['', 'pricing', 'resources', 'quotes', 'settings']

    testPaths.forEach(path => {
      it(`should generate valid URLs for path "${path}" across all access methods`, () => {
        // Standard path
        mockLocation('app-suite.io', '/partners/portal')
        const standardUrl = getPortalUrl(path)
        expect(standardUrl).toMatch(/^\/partners\/portal/)

        // Subdomain
        mockLocation('acme.app-suite.io', '/')
        const subdomainUrl = getPortalUrl(path)
        expect(subdomainUrl).not.toMatch(/partners\/portal/)
        expect(subdomainUrl).toMatch(/^\//)

        // Custom domain
        mockLocation('portal.acmecorp.com', '/')
        const customUrl = getPortalUrl(path)
        expect(customUrl).not.toMatch(/partners\/portal/)
        expect(customUrl).toMatch(/^\//)
      })
    })
  })
})
