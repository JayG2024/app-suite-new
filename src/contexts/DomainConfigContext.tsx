/**
 * Domain Configuration Context
 * 
 * Provides domain configuration information throughout the application.
 * Detects white-label access and applies appropriate branding.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { detectDomainConfig, DomainConfig, getPortalUrl } from '@/lib/domainDetection'
import { findPartnerByDomain } from '@/services/partnerDomainService'

interface DomainConfigContextType {
  config: DomainConfig
  partnerId: string | null
  loading: boolean
  getUrl: (path: string) => string
  isWhiteLabel: boolean
  brandingLevel: 'co-branded' | 'partner-primary' | 'full-white-label' | null
}

const DomainConfigContext = createContext<DomainConfigContextType | undefined>(undefined)

export function DomainConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DomainConfig>(() => detectDomainConfig())
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initDomainConfig = async () => {
      const detectedConfig = detectDomainConfig()
      setConfig(detectedConfig)

      // If this is a white-label domain, look up the partner
      if (detectedConfig.isWhiteLabel && detectedConfig.partnerDomain) {
        try {
          const foundPartnerId = await findPartnerByDomain(detectedConfig.partnerDomain)
          setPartnerId(foundPartnerId)
          
          if (foundPartnerId) {
            setConfig({
              ...detectedConfig,
              partnerId: foundPartnerId
            })
          }
        } catch (error) {
          console.error('Error finding partner by domain:', error)
        }
      }

      setLoading(false)
    }

    initDomainConfig()
  }, [])

  const getUrl = (path: string) => getPortalUrl(path, config)

  const value: DomainConfigContextType = {
    config,
    partnerId,
    loading,
    getUrl,
    isWhiteLabel: config.isWhiteLabel,
    brandingLevel: config.brandingLevel || null
  }

  return (
    <DomainConfigContext.Provider value={value}>
      {children}
    </DomainConfigContext.Provider>
  )
}

export function useDomainConfig() {
  const context = useContext(DomainConfigContext)
  if (context === undefined) {
    throw new Error('useDomainConfig must be used within a DomainConfigProvider')
  }
  return context
}
