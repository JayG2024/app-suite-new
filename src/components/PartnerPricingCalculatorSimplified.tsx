import React, { useState } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { 
  Download, 
  Globe,
  Smartphone,
  Settings,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

type ServiceType = 'crm' | 'invoice' | 'ecommerce' | 'saas'

interface ServiceOption {
  id: ServiceType
  name: string
  icon: any
  description: string
  tiers: {
    id: string
    name: string
    price: number
    features: string[]
  }[]
}

const services: ServiceOption[] = [
  {
    id: 'crm',
    name: 'CRM System',
    icon: Settings,
    description: 'Customer relationship management',
    tiers: [
      {
        id: 'internal',
        name: 'Internal Use',
        price: 5000,
        features: ['User authentication', 'Database', 'Customer tracking', 'Contact management', 'Activity logging']
      },
      {
        id: 'saas',
        name: 'SaaS Product',
        price: 10000,
        features: ['Multi-tenant architecture', 'Customer billing', 'Advanced security', 'API access', 'White-label ready']
      }
    ]
  },
  {
    id: 'invoice',
    name: 'Invoice & Billing',
    icon: Settings,
    description: 'Billing and payment processing',
    tiers: [
      {
        id: 'internal',
        name: 'Internal Use',
        price: 5000,
        features: ['Invoice generation', 'Payment tracking', 'Client management', 'Reporting', 'Email notifications']
      },
      {
        id: 'saas',
        name: 'SaaS Product',
        price: 10000,
        features: ['Multi-tenant billing', 'Payment gateway integration', 'Subscription management', 'Advanced reporting', 'API access']
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: Globe,
    description: 'Online store platform',
    tiers: [
      {
        id: 'internal',
        name: 'Internal Use',
        price: 7500,
        features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order management', 'Inventory tracking']
      },
      {
        id: 'saas',
        name: 'SaaS Product',
        price: 12500,
        features: ['Multi-store support', 'Advanced analytics', 'Marketing tools', 'API integrations', 'White-label ready']
      }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    icon: Zap,
    description: 'Multi-tenant application',
    tiers: [
      {
        id: 'internal',
        name: 'Internal Use',
        price: 10000,
        features: ['Custom workflows', 'User management', 'Data analytics', 'Integrations', 'Admin dashboard']
      },
      {
        id: 'saas',
        name: 'SaaS Product',
        price: 15000,
        features: ['Multi-tenant architecture', 'Subscription billing', 'Advanced security', 'API platform', 'Scalable infrastructure']
      }
    ]
  }
]

export default function PartnerPricingCalculatorSimplified() {
  const { partnerProfile } = usePartnerAuth()
  const [step, setStep] = useState<'service' | 'tier' | 'details' | 'quote'>('service')
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')

  const currentService = services.find(s => s.id === selectedService)
  const currentTier = currentService?.tiers.find(t => t.id === selectedTier)

  const getDiscount = () => {
    if (!partnerProfile?.discount_tier) return 0
    
    // All web apps get the webapp_discount
    return partnerProfile.discount_tier.webapp_discount
  }

  const calculatePricing = () => {
    if (!currentTier) return { standard: 0, partner: 0, discount: 0, savings: 0 }
    
    const standard = currentTier.price
    const discountPercent = getDiscount()
    const partner = standard * (1 - discountPercent / 100)
    const savings = standard - partner
    
    return { standard, partner, discount: discountPercent, savings }
  }

  const pricing = calculatePricing()

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId)
    setSelectedTier(null)
    setStep('tier')
  }

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId)
    setStep('details')
  }

  const handleGenerateQuote = () => {
    if (!clientName || !clientEmail) {
      toast.error('Please enter client name and email')
      return
    }
    setStep('quote')
    toast.success('Quote generated successfully!')
  }

  const handleDownloadQuote = () => {
    toast.success('Quote downloaded as PDF')
  }

  const handleStartOver = () => {
    setStep('service')
    setSelectedService(null)
    setSelectedTier(null)
    setClientName('')
    setClientEmail('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Calculator</h1>
          <p className="text-muted-foreground">Generate quotes with your partner discount</p>
        </div>
        {partnerProfile && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {partnerProfile.discount_tier?.name} Partner
          </Badge>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {['Service', 'Tier', 'Details', 'Quote'].map((label, index) => {
          const stepMap = ['service', 'tier', 'details', 'quote']
          const currentIndex = stepMap.indexOf(step)
          const isActive = index === currentIndex
          const isComplete = index < currentIndex
          
          return (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'border-primary bg-primary text-white' : 
                  isComplete ? 'border-green-600 bg-green-600 text-white' : 
                  'border-gray-300'
                }`}>
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{label}</span>
              </div>
              {index < 3 && <ArrowRight className="h-4 w-4 text-gray-300" />}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step 1: Select Service */}
      {step === 'service' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card 
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.tiers.length} tier{service.tiers.length > 1 ? 's' : ''} available
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Step 2: Select Tier */}
      {step === 'tier' && currentService && (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setStep('service')}>
            ← Back to Services
          </Button>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentService.tiers.map((tier) => {
              const discount = getDiscount()
              const partnerPrice = tier.price * (1 - discount / 100)
              
              return (
                <Card 
                  key={tier.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
                  onClick={() => handleTierSelect(tier.id)}
                >
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">${partnerPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${tier.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {discount}% Partner Discount
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: Client Details */}
      {step === 'details' && currentTier && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => setStep('tier')}>
            ← Back to Tiers
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Enter details for the quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{currentService?.name} - {currentTier.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Standard Price:</span>
                <span className="line-through">${pricing.standard.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Partner Discount:</span>
                <span className="text-green-600">-{pricing.discount}%</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Your Price:</span>
                <span className="text-2xl font-bold text-primary">${pricing.partner.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">You save:</span>
                <span className="text-green-600 font-medium">${pricing.savings.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerateQuote}
            className="w-full"
            size="lg"
          >
            Generate Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 4: Quote Generated */}
      {step === 'quote' && currentTier && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-full">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Quote Generated Successfully!</h3>
                  <p className="text-sm text-green-700">Your quote is ready to download or share</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{clientName}</p>
                  <p className="text-sm text-muted-foreground">{clientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{currentService?.name}</p>
                  <p className="text-sm text-muted-foreground">{currentTier.name} Tier</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Standard Price:</span>
                  <span className="line-through">${pricing.standard.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Partner Discount ({pricing.discount}%):</span>
                  <span className="text-green-600">-${pricing.savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-primary">${pricing.partner.toLocaleString()}</span>
                </div>
              </div>

              {notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-2">Included Features:</p>
                <ul className="grid grid-cols-2 gap-2">
                  {currentTier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleDownloadQuote} className="flex-1" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={handleStartOver} variant="outline" className="flex-1" size="lg">
              Create Another Quote
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
