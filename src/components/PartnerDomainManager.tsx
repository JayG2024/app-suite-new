/**
 * Partner Domain Manager Component
 * 
 * Allows partners to configure custom domains and subdomains for white-label access.
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Plus, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import {
  getPartnerDomains,
  createPartnerDomain,
  deletePartnerDomain,
  validateDomain,
  getDomainSetupInstructions,
  checkDnsConfiguration,
  type PartnerDomain
} from '@/services/partnerDomainService'

interface PartnerDomainManagerProps {
  partnerId: string
}

export default function PartnerDomainManager({ partnerId }: PartnerDomainManagerProps) {
  const [domains, setDomains] = useState<PartnerDomain[]>([])
  const [loading, setLoading] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [domainType, setDomainType] = useState<'subdomain' | 'custom-domain'>('subdomain')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    loadDomains()
  }, [partnerId])

  const loadDomains = async () => {
    try {
      setLoading(true)
      const data = await getPartnerDomains(partnerId)
      setDomains(data)
    } catch (error) {
      console.error('Error loading domains:', error)
      toast.error('Failed to load domain configurations')
    } finally {
      setLoading(false)
    }
  }

  const handleValidateDomain = async () => {
    if (!newDomain.trim()) {
      setValidationErrors(['Please enter a domain name'])
      return