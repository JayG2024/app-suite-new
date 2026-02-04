/**
 * Partner Domain Service
 * 
 * Manages partner domain configurations including custom domains and subdomains.
 * Handles domain validation, DNS configuration checks, and SSL certificate management.
 */

import { supabase } from '@/lib/supabase'
import { USE_MOCK_DATA } from '@/lib/mockPartnerData'

export interface PartnerDomain {
  id: string
  partner_id: string
  domain_type: 'subdomain' | 'custom-domain' | 'partner-path'
  domain_name: string | null
  ssl_certificate_id: string | null
  dns_configured: boolean
  status: 'pending' | 'configuring' | 'active' | 'failed'
  created_at: string
  updated_at: string
}

export interface DomainValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  dnsRecords?: {
    type: string
    name: string
    value: string
    configured: boolean
  }[]
}

export interface DomainSetupInstructions {
  domain: string
  domainType: 'subdomain' | 'custom-domain'
  steps: {
    step: number
    title: string
    description: string
    dnsRecords?: {
      type: string
      name: string
      value: string
    }[]
  }[]
  estimatedTime: string
}

/**
 * Fetches all domains for a partner
 */
export async function getPartnerDomains(partnerId: string): Promise<PartnerDomain[]> {
  if (USE_MOCK_DATA) {
    // Return mock data for development
    return [
      {
        id: 'domain-1',
        partner_id: partnerId,
        domain_type: 'partner-path',
        domain_name: null,
        ssl_certificate_id: null,
        dns_configured: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  const { data, error } = await supabase
    .from('partner_domains')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching partner domains:', error)
    throw error
  }

  return data || []
}

/**
 * Finds a partner by their custom domain or subdomain
 */
export async function findPartnerByDomain(domain: string): Promise<string | null> {
  if (USE_MOCK_DATA) {
    // Mock domain mapping
    const mockDomains: Record<string, string> = {
      'premium.app-suite.io': 'partner-2',
      'portal.premiumsolutions.com': 'partner-2'
    }
    return mockDomains[domain] || null
  }

  const { data, error } = await supabase
    .from('partner_domains')
    .select('partner_id')
    .eq('domain_name', domain)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return null
  }

  return data.partner_id
}

/**
 * Creates a new domain configuration for a partner
 */
export async function createPartnerDomain(
  partnerId: string,
  domainType: 'subdomain' | 'custom-domain',
  domainName: string
): Promise<PartnerDomain> {
  if (USE_MOCK_DATA) {
    return {
      id: `domain-${Date.now()}`,
      partner_id: partnerId,
      domain_type: domainType,
      domain_name: domainName,
      ssl_certificate_id: null,
      dns_configured: false,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('partner_domains')
    .insert({
      partner_id: partnerId,
      domain_type: domainType,
      domain_name: domainName,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating partner domain:', error)
    throw error
  }

  return data
}

/**
 * Updates a domain configuration
 */
export async function updatePartnerDomain(
  domainId: string,
  updates: Partial<Pick<PartnerDomain, 'dns_configured' | 'status' | 'ssl_certificate_id'>>
): Promise<PartnerDomain> {
  if (USE_MOCK_DATA) {
    return {
      id: domainId,
      partner_id: 'partner-1',
      domain_type: 'custom-domain',
      domain_name: 'example.com',
      ssl_certificate_id: updates.ssl_certificate_id || null,
      dns_configured: updates.dns_configured || false,
      status: updates.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('partner_domains')
    .update(updates)
    .eq('id', domainId)
    .select()
    .single()

  if (error) {
    console.error('Error updating partner domain:', error)
    throw error
  }

  return data
}

/**
 * Validates a domain name format and availability
 */
export async function validateDomain(domain: string): Promise<DomainValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic format validation
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
  if (!domainRegex.test(domain)) {
    errors.push('Invalid domain format. Please enter a valid domain name (e.g., portal.example.com)')
  }

  // Check if domain is already in use
  if (!USE_MOCK_DATA) {
    const { data } = await supabase
      .from('partner_domains')
      .select('id')
      .eq('domain_name', domain)
      .eq('status', 'active')
      .single()

    if (data) {
      errors.push('This domain is already configured for another partner')
    }
  }

  // Check for reserved subdomains
  const reservedSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'localhost']
  const subdomain = domain.split('.')[0]
  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    warnings.push('This subdomain is commonly reserved. Consider using a different subdomain.')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Gets setup instructions for a domain configuration
 */
export function getDomainSetupInstructions(
  domain: string,
  domainType: 'subdomain' | 'custom-domain'
): DomainSetupInstructions {
  if (domainType === 'subdomain') {
    return {
      domain,
      domainType,
      estimatedTime: '5-10 minutes',
      steps: [
        {
          step: 1,
          title: 'Request Subdomain',
          description: 'Contact support to request your subdomain configuration. We will set up the subdomain on our end.'
        },
        {
          step: 2,
          title: 'Wait for Activation',
          description: 'Our team will configure the subdomain and SSL certificate. This typically takes 5-10 minutes.'
        },
        {
          step: 3,
          title: 'Test Access',
          description: `Once activated, you can access your portal at https://${domain}`
        }
      ]
    }
  }

  // Custom domain instructions
  const rootDomain = domain.split('.').slice(-2).join('.')
  
  return {
    domain,
    domainType,
    estimatedTime: '24-48 hours',
    steps: [
      {
        step: 1,
        title: 'Add DNS Records',
        description: 'Log in to your domain registrar (GoDaddy, Namecheap, etc.) and add the following DNS records:',
        dnsRecords: [
          {
            type: 'CNAME',
            name: domain.replace(`.${rootDomain}`, ''),
            value: 'app-suite.io'
          },
          {
            type: 'TXT',
            name: '_acme-challenge',
            value: 'verification-token-will-be-provided'
          }
        ]
      },
      {
        step: 2,
        title: 'Wait for DNS Propagation',
        description: 'DNS changes can take 24-48 hours to propagate globally. You can check the status using DNS lookup tools.'
      },
      {
        step: 3,
        title: 'SSL Certificate Generation',
        description: 'Once DNS is configured, we will automatically generate and install an SSL certificate for your domain.'
      },
      {
        step: 4,
        title: 'Verify and Test',
        description: `After setup is complete, access your portal at https://${domain} and verify all features work correctly.`
      }
    ]
  }
}

/**
 * Checks DNS configuration for a domain
 */
export async function checkDnsConfiguration(domain: string): Promise<DomainValidationResult> {
  // In a real implementation, this would make API calls to check DNS records
  // For now, we'll return a mock response
  
  if (USE_MOCK_DATA) {
    return {
      valid: true,
      errors: [],
      warnings: [],
      dnsRecords: [
        {
          type: 'CNAME',
          name: domain,
          value: 'app-suite.io',
          configured: true
        }
      ]
    }
  }

  // This would typically call a backend API endpoint that performs DNS lookups
  // For now, return a placeholder
  return {
    valid: false,
    errors: ['DNS check not yet implemented'],
    warnings: []
  }
}

/**
 * Deletes a domain configuration
 */
export async function deletePartnerDomain(domainId: string): Promise<void> {
  if (USE_MOCK_DATA) {
    return
  }

  const { error } = await supabase
    .from('partner_domains')
    .delete()
    .eq('id', domainId)

  if (error) {
    console.error('Error deleting partner domain:', error)
    throw error
  }
}
