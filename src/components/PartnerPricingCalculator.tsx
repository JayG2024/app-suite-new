import React, { useState, useEffect } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { 
  Calculator, 
  DollarSign, 
  Download, 
  Save, 
  Percent,
  Globe,
  Smartphone,
  ShoppingCart,
  Settings,
  Zap,
  Eye,
  Share2,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'
import QuoteTemplate from './QuoteTemplate'
import { createPriceQuote, getPartnerQuotes } from '@/lib/supabase'

interface ServiceSpecs {
  // Custom Website
  websiteComplexity?: 'simple' | 'business' | 'complex'
  pageCount?: number
  cmsRequired?: boolean
  ecommerceIntegration?: boolean
  customIntegrations?: string[]
  
  // Web Application
  userAuthentication?: boolean
  databaseComplexity?: 'simple' | 'moderate' | 'complex'
  apiIntegrations?: string[]
  customFunctionality?: string[]
  userBase?: 'small' | 'medium' | 'large'
  realTimeFeatures?: boolean
  
  // Mobile App
  platforms?: ('ios' | 'android' | 'cross-platform')[]
  mobileFeatures?: string[]
  backendRequired?: boolean
  appStoreDeployment?: boolean
  pushNotifications?: boolean
  offlineCapability?: boolean
  
  // AI Website
  aiWebsiteType?: 'standard' | 'premium'
  aiPageCount?: number
  
  // E-commerce
  productCatalogSize?: 'small' | 'medium' | 'large'
  paymentProcessing?: string[]
  inventoryManagement?: boolean
  thirdPartyIntegrations?: string[]
  multiCurrency?: boolean
  subscriptionSupport?: boolean
  
  // Maintenance
  hostingTier?: 'basic' | 'professional' | 'enterprise'
  securityUpdates?: boolean
  contentUpdates?: boolean
  technicalSupport?: 'basic' | 'priority' | '24/7'
  performanceMonitoring?: boolean
  backupFrequency?: 'daily' | 'weekly' | 'monthly'
}

interface PriceQuote {
  id?: string
  serviceType: string
  standardPrice: number
  partnerPrice: number
  discount: number
  specifications: ServiceSpecs
  notes?: string
  createdAt?: Date
  serviceName?: string
  clientName?: string
  clientEmail?: string
}

const serviceTypes = [
  {
    id: 'custom-website',
    name: 'Custom Website',
    icon: Globe,
    description: 'Custom-built responsive websites',
    basePrice: 5000
  },
  {
    id: 'web-application',
    name: 'Web Application',
    icon: Settings,
    description: 'Full-stack web applications',
    basePrice: 10000
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    icon: Smartphone,
    description: 'iOS, Android, or cross-platform apps',
    basePrice: 15000
  },
  {
    id: 'ai-website',
    name: 'AI Website',
    icon: Zap,
    description: 'AI-powered website development',
    basePrice: 2500
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Solution',
    icon: ShoppingCart,
    description: 'Online store and payment processing',
    basePrice: 8000
  },
  {
    id: 'maintenance',
    name: 'Maintenance Package',
    icon: Settings,
    description: 'Ongoing support and maintenance',
    basePrice: 500
  }
]

export default function PartnerPricingCalculator() {
  const { partnerProfile } = usePartnerAuth()
  const [selectedService, setSelectedService] = useState('')
  const [specs, setSpecs] = useState<ServiceSpecs>({})
  const [notes, setNotes] = useState('')
  const [currentQuote, setCurrentQuote] = useState<PriceQuote | null>(null)
  const [savedQuotes, setSavedQuotes] = useState<PriceQuote[]>([])
  const [showQuotePreview, setShowQuotePreview] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Load saved quotes on mount
  useEffect(() => {
    if (partnerProfile?.id) {
      loadSavedQuotes()
    }
  }, [partnerProfile?.id])

  const loadSavedQuotes = async () => {
    if (!partnerProfile?.id) return
    
    try {
      const { data, error } = await getPartnerQuotes(partnerProfile.id)
      if (error) throw error
      
      // Transform database quotes to component format
      const transformedQuotes = data?.map((q: any) => ({
        id: q.id,
        serviceType: q.service_type,
        standardPrice: Number(q.partner_cost) / (1 - Number(q.markup_percentage || 0) / 100),
        partnerPrice: Number(q.partner_cost),
        discount: partnerProfile.discount_tier ? 
          getDiscountForService(q.service_type, partnerProfile.discount_tier) : 0,
        specifications: q.specifications as ServiceSpecs,
        notes: (q.specifications as any)?.notes || '',
        createdAt: new Date(q.created_at),
        serviceName: serviceTypes.find(s => s.id === q.service_type)?.name
      })) || []
      
      setSavedQuotes(transformedQuotes)
    } catch (error) {
      console.error('Error loading quotes:', error)
      toast.error('Failed to load saved quotes')
    }
  }

  const getDiscountForService = (serviceType: string, discountTier: any): number => {
    switch (serviceType) {
      case 'custom-website': return discountTier.website_discount
      case 'web-application': return discountTier.webapp_discount
      case 'mobile-app': return discountTier.mobile_app_discount
      case 'ai-website': return discountTier.ai_website_base_discount
      case 'ecommerce': return discountTier.ecommerce_discount
      case 'maintenance': return discountTier.maintenance_discount
      default: return 0
    }
  }

  // Calculate pricing based on service type and specifications
  const calculatePrice = (serviceType: string, specifications: ServiceSpecs): { standard: number, partner: number, discount: number } => {
    const service = serviceTypes.find(s => s.id === serviceType)
    if (!service || !partnerProfile?.discount_tier) {
      return { standard: 0, partner: 0, discount: 0 }
    }

    let standardPrice = service.basePrice
    let discountPercentage = 0

    // Apply service-specific pricing logic
    switch (serviceType) {
      case 'custom-website':
        // Base price varies by complexity
        if (specifications.websiteComplexity === 'simple') standardPrice = 3000
        else if (specifications.websiteComplexity === 'business') standardPrice = 5000
        else if (specifications.websiteComplexity === 'complex') standardPrice = 8000
        
        // Add page count pricing
        if (specifications.pageCount) {
          standardPrice += Math.max(0, (specifications.pageCount - 5) * 200)
        }
        
        // Add feature pricing
        if (specifications.cmsRequired) standardPrice += 1000
        if (specifications.ecommerceIntegration) standardPrice += 2000
        if (specifications.customIntegrations?.length) {
          standardPrice += specifications.customIntegrations.length * 500
        }
        
        discountPercentage = partnerProfile.discount_tier.website_discount
        break

      case 'web-application':
        // Base price varies by complexity
        if (specifications.databaseComplexity === 'simple') standardPrice = 8000
        else if (specifications.databaseComplexity === 'moderate') standardPrice = 12000
        else if (specifications.databaseComplexity === 'complex') standardPrice = 18000
        
        // Add feature pricing
        if (specifications.userAuthentication) standardPrice += 1500
        if (specifications.realTimeFeatures) standardPrice += 3000
        if (specifications.apiIntegrations?.length) {
          standardPrice += specifications.apiIntegrations.length * 800
        }
        if (specifications.userBase === 'medium') standardPrice += 2000
        else if (specifications.userBase === 'large') standardPrice += 5000
        
        discountPercentage = partnerProfile.discount_tier.webapp_discount
        break

      case 'mobile-app':
        // Base price varies by platform
        const platformCount = specifications.platforms?.length || 1
        if (specifications.platforms?.includes('cross-platform')) {
          standardPrice = 12000
        } else {
          standardPrice = 8000 * platformCount
        }
        
        // Add feature pricing
        if (specifications.backendRequired) standardPrice += 5000
        if (specifications.appStoreDeployment) standardPrice += 1000
        if (specifications.pushNotifications) standardPrice += 1500
        if (specifications.offlineCapability) standardPrice += 2000
        
        discountPercentage = partnerProfile.discount_tier.mobile_app_discount
        break

      case 'ai-website':
        // AI website has fixed pricing structure
        if (specifications.aiWebsiteType === 'premium') {
          standardPrice = 3000
        } else {
          standardPrice = 2500
        }
        
        // Add per-page pricing
        if (specifications.aiPageCount) {
          standardPrice += Math.max(0, (specifications.aiPageCount - 1) * 100)
        }
        
        discountPercentage = partnerProfile.discount_tier.ai_website_base_discount
        break

      case 'ecommerce':
        // Base price varies by catalog size
        if (specifications.productCatalogSize === 'small') standardPrice = 6000
        else if (specifications.productCatalogSize === 'medium') standardPrice = 10000
        else if (specifications.productCatalogSize === 'large') standardPrice = 15000
        
        // Add feature pricing
        if (specifications.inventoryManagement) standardPrice += 2000
        if (specifications.multiCurrency) standardPrice += 1500
        if (specifications.subscriptionSupport) standardPrice += 3000
        if (specifications.thirdPartyIntegrations?.length) {
          standardPrice += specifications.thirdPartyIntegrations.length * 1000
        }
        
        discountPercentage = partnerProfile.discount_tier.ecommerce_discount
        break

      case 'maintenance':
        // Monthly maintenance pricing
        if (specifications.hostingTier === 'basic') standardPrice = 200
        else if (specifications.hostingTier === 'professional') standardPrice = 500
        else if (specifications.hostingTier === 'enterprise') standardPrice = 1000
        
        // Add feature pricing
        if (specifications.contentUpdates) standardPrice += 200
        if (specifications.technicalSupport === 'priority') standardPrice += 300
        else if (specifications.technicalSupport === '24/7') standardPrice += 500
        if (specifications.performanceMonitoring) standardPrice += 150
        
        discountPercentage = partnerProfile.discount_tier.maintenance_discount
        break
    }

    const partnerPrice = standardPrice * (1 - discountPercentage / 100)
    
    return {
      standard: Math.round(standardPrice),
      partner: Math.round(partnerPrice),
      discount: discountPercentage
    }
  }

  // Update quote when service or specs change
  useEffect(() => {
    if (selectedService) {
      const pricing = calculatePrice(selectedService, specs)
      setCurrentQuote({
        serviceType: selectedService,
        standardPrice: pricing.standard,
        partnerPrice: pricing.partner,
        discount: pricing.discount,
        specifications: specs,
        notes,
        createdAt: new Date()
      })
    }
  }, [selectedService, specs, notes, partnerProfile])

  const handleSaveQuote = async () => {
    if (!currentQuote || !partnerProfile?.id) {
      toast.error('Unable to save quote')
      return
    }

    setIsSaving(true)
    try {
      const quoteData = {
        partner_id: partnerProfile.id,
        service_type: selectedService,
        partner_cost: currentQuote.partnerPrice,
        suggested_retail_price: currentQuote.standardPrice,
        markup_percentage: 0, // Can be calculated based on partner's markup preferences
        specifications: {
          ...specs,
          notes,
          clientName,
          clientEmail
        },
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }

      const { data, error } = await createPriceQuote(quoteData)
      if (error) throw error

      toast.success('Quote saved successfully')
      await loadSavedQuotes() // Reload quotes
      
      // Reset client info
      setClientName('')
      setClientEmail('')
    } catch (error) {
      console.error('Error saving quote:', error)
      toast.error('Failed to save quote')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportQuote = async () => {
    if (!currentQuote) return

    setIsExporting(true)
    try {
      // Generate quote data for export
      const quoteData = {
        partner: {
          name: partnerProfile?.name,
          company: partnerProfile?.company_name,
          email: partnerProfile?.contact_email
        },
        client: {
          name: clientName,
          email: clientEmail
        },
        service: serviceTypes.find(s => s.id === selectedService)?.name,
        pricing: {
          standard: currentQuote.standardPrice,
          partner: currentQuote.partnerPrice,
          discount: currentQuote.discount,
          savings: currentQuote.standardPrice - currentQuote.partnerPrice
        },
        specifications: specs,
        notes: notes,
        generatedAt: new Date().toISOString()
      }

      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${selectedService}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Quote exported successfully')
    } catch (error) {
      console.error('Error exporting quote:', error)
      toast.error('Failed to export quote')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShareQuote = () => {
    if (!currentQuote) return
    setShowShareDialog(true)
  }

  const handleSendQuoteEmail = async () => {
    if (!clientEmail || !currentQuote) {
      toast.error('Please enter client email')
      return
    }

    try {
      // In a real implementation, this would call an API endpoint to send email
      const emailData = {
        to: clientEmail,
        subject: `Quote for ${serviceTypes.find(s => s.id === selectedService)?.name}`,
        partnerName: partnerProfile?.company_name,
        serviceName: serviceTypes.find(s => s.id === selectedService)?.name,
        price: currentQuote.partnerPrice,
        specifications: specs,
        notes
      }

      console.log('Email data:', emailData)
      toast.success('Quote sent via email (email functionality would be implemented here)')
      setShowShareDialog(false)
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send quote')
    }
  }

  const handleCopyShareLink = () => {
    if (!currentQuote?.id) {
      toast.error('Please save the quote first')
      return
    }

    // Generate a shareable link
    const shareUrl = `${window.location.origin}/partner/quotes/${currentQuote.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard')
  }

  const renderServiceSpecifications = () => {
    switch (selectedService) {
      case 'custom-website':
        return (
          <div className="space-y-4">
            <div>
              <Label>Website Complexity</Label>
              <Select value={specs.websiteComplexity} onValueChange={(value: any) => setSpecs({...specs, websiteComplexity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Brochure site)</SelectItem>
                  <SelectItem value="business">Business (Multi-page)</SelectItem>
                  <SelectItem value="complex">Complex (Advanced features)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Number of Pages</Label>
              <Input
                type="number"
                value={specs.pageCount || ''}
                onChange={(e) => setSpecs({...specs, pageCount: parseInt(e.target.value) || 0})}
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.cmsRequired}
                  onCheckedChange={(checked) => setSpecs({...specs, cmsRequired: !!checked})}
                />
                <Label>Content Management System (CMS)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.ecommerceIntegration}
                  onCheckedChange={(checked) => setSpecs({...specs, ecommerceIntegration: !!checked})}
                />
                <Label>E-commerce Integration</Label>
              </div>
            </div>
            
            <div>
              <Label>Custom Integrations</Label>
              <Textarea
                value={specs.customIntegrations?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, customIntegrations: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List any third-party integrations needed"
              />
            </div>
          </div>
        )

      case 'web-application':
        return (
          <div className="space-y-4">
            <div>
              <Label>Database Complexity</Label>
              <Select value={specs.databaseComplexity} onValueChange={(value: any) => setSpecs({...specs, databaseComplexity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Basic CRUD)</SelectItem>
                  <SelectItem value="moderate">Moderate (Multiple tables)</SelectItem>
                  <SelectItem value="complex">Complex (Advanced queries)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>User Base Size</Label>
              <Select value={specs.userBase} onValueChange={(value: any) => setSpecs({...specs, userBase: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;1,000 users)</SelectItem>
                  <SelectItem value="medium">Medium (1,000-10,000 users)</SelectItem>
                  <SelectItem value="large">Large (&gt;10,000 users)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.userAuthentication}
                  onCheckedChange={(checked) => setSpecs({...specs, userAuthentication: !!checked})}
                />
                <Label>User Authentication (+$1,500)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.realTimeFeatures}
                  onCheckedChange={(checked) => setSpecs({...specs, realTimeFeatures: !!checked})}
                />
                <Label>Real-time Features (+$3,000)</Label>
              </div>
            </div>
            
            <div>
              <Label>API Integrations</Label>
              <Textarea
                value={specs.apiIntegrations?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, apiIntegrations: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List API integrations (e.g., Stripe, SendGrid, Twilio)"
              />
              <p className="text-sm text-gray-500 mt-1">$800 per integration</p>
            </div>
            
            <div>
              <Label>Custom Functionality Requirements</Label>
              <Textarea
                value={specs.customFunctionality?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, customFunctionality: e.target.value.split(', ').filter(Boolean)})}
                placeholder="Describe any custom features needed"
                rows={3}
              />
            </div>
          </div>
        )

      case 'mobile-app':
        return (
          <div className="space-y-4">
            <div>
              <Label>Platform Selection</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={specs.platforms?.includes('ios')}
                    onCheckedChange={(checked) => {
                      const platforms = specs.platforms || []
                      if (checked) {
                        setSpecs({...specs, platforms: [...platforms.filter(p => p !== 'cross-platform'), 'ios']})
                      } else {
                        setSpecs({...specs, platforms: platforms.filter(p => p !== 'ios')})
                      }
                    }}
                  />
                  <Label>iOS ($8,000)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={specs.platforms?.includes('android')}
                    onCheckedChange={(checked) => {
                      const platforms = specs.platforms || []
                      if (checked) {
                        setSpecs({...specs, platforms: [...platforms.filter(p => p !== 'cross-platform'), 'android']})
                      } else {
                        setSpecs({...specs, platforms: platforms.filter(p => p !== 'android')})
                      }
                    }}
                  />
                  <Label>Android ($8,000)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={specs.platforms?.includes('cross-platform')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSpecs({...specs, platforms: ['cross-platform']})
                      } else {
                        setSpecs({...specs, platforms: []})
                      }
                    }}
                  />
                  <Label>Cross-Platform (React Native/Flutter) ($12,000)</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.backendRequired}
                  onCheckedChange={(checked) => setSpecs({...specs, backendRequired: !!checked})}
                />
                <Label>Backend/API Required (+$5,000)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.appStoreDeployment}
                  onCheckedChange={(checked) => setSpecs({...specs, appStoreDeployment: !!checked})}
                />
                <Label>App Store Deployment (+$1,000)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.pushNotifications}
                  onCheckedChange={(checked) => setSpecs({...specs, pushNotifications: !!checked})}
                />
                <Label>Push Notifications (+$1,500)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.offlineCapability}
                  onCheckedChange={(checked) => setSpecs({...specs, offlineCapability: !!checked})}
                />
                <Label>Offline Capability (+$2,000)</Label>
              </div>
            </div>
            
            <div>
              <Label>Mobile Features</Label>
              <Textarea
                value={specs.mobileFeatures?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, mobileFeatures: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List specific mobile features (e.g., camera, GPS, biometrics)"
                rows={3}
              />
            </div>
          </div>
        )

      case 'ecommerce':
        return (
          <div className="space-y-4">
            <div>
              <Label>Product Catalog Size</Label>
              <Select value={specs.productCatalogSize} onValueChange={(value: any) => setSpecs({...specs, productCatalogSize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select catalog size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;100 products)</SelectItem>
                  <SelectItem value="medium">Medium (100-1,000 products)</SelectItem>
                  <SelectItem value="large">Large (&gt;1,000 products)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.inventoryManagement}
                  onCheckedChange={(checked) => setSpecs({...specs, inventoryManagement: !!checked})}
                />
                <Label>Inventory Management (+$2,000)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.multiCurrency}
                  onCheckedChange={(checked) => setSpecs({...specs, multiCurrency: !!checked})}
                />
                <Label>Multi-Currency Support (+$1,500)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.subscriptionSupport}
                  onCheckedChange={(checked) => setSpecs({...specs, subscriptionSupport: !!checked})}
                />
                <Label>Subscription/Recurring Billing (+$3,000)</Label>
              </div>
            </div>
            
            <div>
              <Label>Payment Processing</Label>
              <Textarea
                value={specs.paymentProcessing?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, paymentProcessing: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List payment gateways (e.g., Stripe, PayPal, Square)"
              />
            </div>
            
            <div>
              <Label>Third-Party Integrations</Label>
              <Textarea
                value={specs.thirdPartyIntegrations?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, thirdPartyIntegrations: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List integrations (e.g., shipping, accounting, CRM)"
              />
              <p className="text-sm text-gray-500 mt-1">$1,000 per integration</p>
            </div>
          </div>
        )

      case 'ai-website':
        return (
          <div className="space-y-4">
            <div>
              <Label>AI Website Type</Label>
              <Select value={specs.aiWebsiteType} onValueChange={(value: any) => setSpecs({...specs, aiWebsiteType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard ($2,500 base)</SelectItem>
                  <SelectItem value="premium">Premium ($3,000 base)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Number of Pages</Label>
              <Input
                type="number"
                value={specs.aiPageCount || ''}
                onChange={(e) => setSpecs({...specs, aiPageCount: parseInt(e.target.value) || 0})}
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Standard: $100/page after first page, Partner: $50/page after first page
              </p>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className="space-y-4">
            <div>
              <Label>Hosting Tier</Label>
              <Select value={specs.hostingTier} onValueChange={(value: any) => setSpecs({...specs, hostingTier: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hosting tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ($200/month)</SelectItem>
                  <SelectItem value="professional">Professional ($500/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise ($1,000/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Technical Support Level</Label>
              <Select value={specs.technicalSupport} onValueChange={(value: any) => setSpecs({...specs, technicalSupport: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select support level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Business hours)</SelectItem>
                  <SelectItem value="priority">Priority (+$300/month)</SelectItem>
                  <SelectItem value="24/7">24/7 Support (+$500/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.securityUpdates}
                  onCheckedChange={(checked) => setSpecs({...specs, securityUpdates: !!checked})}
                />
                <Label>Security Updates (Included)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.contentUpdates}
                  onCheckedChange={(checked) => setSpecs({...specs, contentUpdates: !!checked})}
                />
                <Label>Content Updates (+$200/month)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.performanceMonitoring}
                  onCheckedChange={(checked) => setSpecs({...specs, performanceMonitoring: !!checked})}
                />
                <Label>Performance Monitoring (+$150/month)</Label>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a service type to configure specifications</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Partner Pricing Calculator</h1>
        <p className="text-gray-600">
          Calculate pricing with your {partnerProfile?.discount_tier?.name} tier discounts
        </p>
      </div>

      {/* Service Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Service Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedService === service.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardContent className="p-4 text-center">
                  <service.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <Badge variant="secondary">From ${service.basePrice.toLocaleString()}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Specifications */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            {renderServiceSpecifications()}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Client Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional requirements or notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary */}
      {currentQuote && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  ${currentQuote.standardPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Standard Price</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Percent className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {currentQuote.discount}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Partner Discount</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${currentQuote.partnerPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Your Partner Price</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                You save ${(currentQuote.standardPrice - currentQuote.partnerPrice).toLocaleString()}!
              </p>
              
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={handleSaveQuote} variant="outline" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Quote'}
                </Button>
                <Button onClick={() => setShowQuotePreview(true)} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleExportQuote} variant="outline" disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
                <Button onClick={handleShareQuote}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Quotes */}
      {savedQuotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedQuotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {serviceTypes.find(s => s.id === quote.serviceType)?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.createdAt?.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      ${quote.partnerPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      {quote.discount}% off
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Preview Modal */}
      {showQuotePreview && currentQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Quote Preview</h2>
              <Button
                variant="outline"
                onClick={() => setShowQuotePreview(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-6">
              <QuoteTemplate
                quote={{
                  ...currentQuote,
                  serviceName: serviceTypes.find(s => s.id === selectedService)?.name || selectedService
                }}
                showPartnerBranding={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {showShareDialog && currentQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-4">
              <h2 className="text-xl font-bold">Share Quote</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSendQuoteEmail} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
                <Button onClick={handleCopyShareLink} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}