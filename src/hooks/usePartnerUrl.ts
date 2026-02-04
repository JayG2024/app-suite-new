/**
 * Partner URL Hook
 * 
 * Provides domain-aware URL generation for partner portal navigation.
 * Automatically adjusts URLs based on whether the user is accessing via
 * standard path, subdomain, or custom domain.
 */

import { useCallback } from 'react'
import { useDomainConfig } from '@/contexts/DomainConfigContext'
import { useNavigate } from 'react-router-dom'

export function usePartnerUrl() {
  const { getUrl, config } = useDomainConfig()
  const navigate = useNavigate()

  /**
   * Generates a portal URL for the given path
   */
  const getPortalUrl = useCallback((path: string) => {
    return getUrl(path)
  }, [getUrl])

  /**
   * Navigates to a portal path using domain-aware routing
   */
  const navigateToPortal = useCallback((path: string) => {
    const url = getUrl(path)
    navigate(url)
  }, [getUrl, navigate])

  /**
   * Gets the base portal URL (dashboard)
   */
  const getDashboardUrl = useCallback(() => {
    return getUrl('')
  }, [getUrl])

  /**
   * Checks if a given path is the current location
   */
  const isCurrentPath = useCallback((path: string) => {
    const fullPath = getUrl(path)
    return window.location.pathname === fullPath
  }, [getUrl])

  return {
    getPortalUrl,
    navigateToPortal,
    getDashboardUrl,
    isCurrentPath,
    config
  }
}
