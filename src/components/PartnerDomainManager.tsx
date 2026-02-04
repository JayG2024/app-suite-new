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
    }

    setIsValidating(true)
    setValidationErrors([])
    setValidationWarnings([])

    try {
      const result = await validateDomain(newDomain.trim())
      setValidationErrors(result.errors)
      setValidationWarnings(result.warnings)

      if (result.valid) {
        toast.success('Domain is valid and available')
      }
    } catch (error) {
      console.error('Error validating domain:', error)
      toast.error('Failed to validate domain')
    } finally {
      setIsValidating(false)
    }
  }

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    if (validationErrors.length > 0) {
      toast.error('Please fix validation errors before adding domain')
      return
    }

    try {
      const domain = await createPartnerDomain(partnerId, domainType, newDomain.trim())
      setDomains([domain, ...domains])
      setNewDomain('')
      setValidationErrors([])
      setValidationWarnings([])
      setShowInstructions(true)
      toast.success('Domain configuration created')
    } catch (error) {
      console.error('Error adding domain:', error)
      toast.error('Failed to add domain configuration')
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to remove this domain configuration?')) {
      return
    }

    try {
      await deletePartnerDomain(domainId)
      setDomains(domains.filter(d => d.id !== domainId))
      toast.success('Domain configuration removed')
    } catch (error) {
      console.error('Error deleting domain:', error)
      toast.error('Failed to remove domain configuration')
    }
  }

  const handleCheckDns = async (domain: PartnerDomain) => {
    if (!domain.domain_name) return

    try {
      const result = await checkDnsConfiguration(domain.domain_name)
      
      if (result.valid) {
        toast.success('DNS is configured correctly')
      } else {
        toast.error('DNS configuration issues detected')
      }
    } catch (error) {
      console.error('Error checking DNS:', error)
      toast.error('Failed to check DNS configuration')
    }
  }

  const getStatusBadge = (status: PartnerDomain['status']) => {
    const variants = {
      active: { icon: CheckCircle, color: 'bg-green-500', text: 'Active' },
      pending: { icon: Clock, color: 'bg-yellow-500', text: 'Pending' },
      configuring: { icon: Clock, color: 'bg-blue-500', text: 'Configuring' },
      failed: { icon: XCircle, color: 'bg-red-500', text: 'Failed' }
    }

    const variant = variants[status]
    const Icon = variant.icon

    return (
      <Badge className={`${variant.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.text}
      </Badge>
    )
  }

  const getDomainTypeLabel = (type: PartnerDomain['domain_type']) => {
    const labels = {
      'partner-path': 'Standard Path',
      'subdomain': 'Subdomain',
      'custom-domain': 'Custom Domain'
    }
    return labels[type]
  }

  const instructions = newDomain ? getDomainSetupInstructions(newDomain, domainType) : null

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading domain configurations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Configuration
          </CardTitle>
          <CardDescription>
            Configure custom domains and subdomains for white-label portal access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={domainType} onValueChange={(v) => setDomainType(v as typeof domainType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
              <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
            </TabsList>

            <TabsContent value="subdomain" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Request a subdomain like <strong>yourcompany.app-suite.io</strong> for co-branded access.
                  Setup is quick and managed by our team.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Input
                  placeholder="yourcompany.app-suite.io"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onBlur={handleValidateDomain}
                />
                <Button onClick={handleAddDomain} disabled={isValidating || validationErrors.length > 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Request
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom-domain" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Use your own domain like <strong>portal.yourcompany.com</strong> for full white-label access.
                  Requires DNS configuration on your end.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Input
                  placeholder="portal.yourcompany.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onBlur={handleValidateDomain}
                />
                <Button onClick={handleAddDomain} disabled={isValidating || validationErrors.length > 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationWarnings.length > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationWarnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {showInstructions && instructions && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to complete your domain configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Estimated time: {instructions.estimatedTime}
            </div>

            {instructions.steps.map((step) => (
              <div key={step.step} className="border-l-2 border-primary pl-4 py-2">
                <div className="font-semibold">
                  Step {step.step}: {step.title}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </div>
                {step.dnsRecords && (
                  <div className="mt-2 space-y-2">
                    {step.dnsRecords.map((record, i) => (
                      <div key={i} className="bg-muted p-2 rounded text-xs font-mono">
                        <div><strong>Type:</strong> {record.type}</div>
                        <div><strong>Name:</strong> {record.name}</div>
                        <div><strong>Value:</strong> {record.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configured Domains</CardTitle>
          <CardDescription>
            Manage your existing domain configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No domains configured yet. Add one above to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {domain.domain_name || 'Standard Portal Access'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getDomainTypeLabel(domain.domain_type)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(domain.status)}
                    
                    {domain.domain_name && domain.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${domain.domain_name}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}

                    {domain.domain_name && domain.status !== 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckDns(domain)}
                      >
                        Check DNS
                      </Button>
                    )}

                    {domain.domain_type !== 'partner-path' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDomain(domain.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
