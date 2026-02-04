import React, { useState, useEffect } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { usePartnerUrl } from '@/hooks/usePartnerUrl'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Calendar,
  DollarSign,
  Filter,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

interface Quote {
  id: string
  serviceType: string
  serviceName: string
  standardPrice: number
  partnerPrice: number
  discount: number
  specifications: any
  notes?: string
  clientName?: string
  clientEmail?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  expiresAt?: Date
  lastModified: Date
}

// Mock quotes for demonstration
const mockQuotes: Quote[] = [
  {
    id: '1',
    serviceType: 'custom-website',
    serviceName: 'Custom Website',
    standardPrice: 8000,
    partnerPrice: 6400,
    discount: 20,
    specifications: {
      websiteComplexity: 'business',
      pageCount: 8,
      cmsRequired: true
    },
    notes: 'Client needs modern design with CMS',
    clientName: 'Acme Corp',
    clientEmail: 'contact@acme.com',
    status: 'sent',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    lastModified: new Date('2024-01-15')
  },
  {
    id: '2',
    serviceType: 'ai-website',
    serviceName: 'AI Website',
    standardPrice: 3400,
    partnerPrice: 2720,
    discount: 20,
    specifications: {
      aiWebsiteType: 'premium',
      aiPageCount: 5
    },
    notes: 'Fast turnaround needed',
    clientName: 'Tech Startup',
    clientEmail: 'hello@techstartup.com',
    status: 'draft',
    createdAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-20')
  },
  {
    id: '3',
    serviceType: 'ecommerce',
    serviceName: 'E-commerce Solution',
    standardPrice: 12000,
    partnerPrice: 9600,
    discount: 20,
    specifications: {
      productCatalogSize: 'medium',
      paymentProcessing: ['stripe', 'paypal'],
      inventoryManagement: true
    },
    clientName: 'Fashion Boutique',
    clientEmail: 'orders@fashionboutique.com',
    status: 'accepted',
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-02-10'),
    lastModified: new Date('2024-01-25')
  }
]

export default function QuoteManager() {
  const { partnerProfile } = usePartnerAuth()
  const { getPortalUrl } = usePartnerUrl()
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(mockQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  // Filter quotes based on search and status
  useEffect(() => {
    let filtered = quotes

    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportQuote = (quote: Quote) => {
    // In a real implementation, this would generate a PDF
    toast.success(`Quote ${quote.id} exported successfully`)
  }

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(prev => prev.filter(q => q.id !== quoteId))
    toast.success('Quote deleted successfully')
  }

  const handleDuplicateQuote = (quote: Quote) => {
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      status: 'draft',
      clientName: `${quote.clientName} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      expiresAt: undefined
    }
    setQuotes(prev => [newQuote, ...prev])
    toast.success('Quote duplicated successfully')
  }

  const handleUpdateStatus = (quoteId: string, newStatus: Quote['status']) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status: newStatus, lastModified: new Date() }
        : quote
    ))
    toast.success(`Quote status updated to ${newStatus}`)
  }

  const getTotalValue = () => {
    return filteredQuotes.reduce((sum, quote) => sum + quote.partnerPrice, 0)
  }

  const getStatusCounts = () => {
    return quotes.reduce((counts, quote) => {
      counts[quote.status] = (counts[quote.status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quote Management</h1>
          <p className="text-gray-600">Manage your client quotes and proposals</p>
        </div>
        <Button asChild>
          <Link to={getPortalUrl('pricing')}>
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold">{quotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${getTotalValue().toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.accepted || 0}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {Math.round(((statusCounts.accepted || 0) / quotes.length) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.sent || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quotes by client name, service, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({quotes.length})
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                size="sm"
              >
                Draft ({statusCounts.draft || 0})
              </Button>
              <Button
                variant={statusFilter === 'sent' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('sent')}
                size="sm"
              >
                Sent ({statusCounts.sent || 0})
              </Button>
              <Button
                variant={statusFilter === 'accepted' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('accepted')}
                size="sm"
              >
                Accepted ({statusCounts.accepted || 0})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first quote to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button asChild>
                  <Link to={getPortalUrl('pricing')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quote
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{quote.serviceName}</h3>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Client:</span> {quote.clientName || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {quote.createdAt.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Modified:</span> {quote.lastModified.toLocaleDateString()}
                      </div>
                    </div>
                    
                    {quote.notes && (
                      <p className="text-sm text-gray-600 mt-2">{quote.notes}</p>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ${quote.partnerPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.discount}% off ${quote.standardPrice.toLocaleString()}
                    </div>
                    {quote.expiresAt && (
                      <div className="text-xs text-orange-600 mt-1">
                        Expires: {quote.expiresAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuote(quote)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportQuote(quote)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateQuote(quote)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {quote.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(quote.id, 'sent')}
                      >
                        Send Quote
                      </Button>
                    )}
                    {quote.status === 'sent' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(quote.id, 'accepted')}
                        >
                          Mark Accepted
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(quote.id, 'rejected')}
                        >
                          Mark Rejected
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quote Detail Modal (simplified for now) */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Quote Details
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuote(null)}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedQuote.serviceName}</h3>
                  <p className="text-gray-600">Quote ID: {selectedQuote.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Client:</span> {selectedQuote.clientName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedQuote.clientEmail}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(selectedQuote.status)}`}>
                      {selectedQuote.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {selectedQuote.createdAt.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">${selectedQuote.standardPrice.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Standard Price</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{selectedQuote.discount}%</div>
                      <div className="text-sm text-gray-600">Partner Discount</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">${selectedQuote.partnerPrice.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Partner Price</div>
                    </div>
                  </div>
                </div>
                
                {selectedQuote.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-gray-600 mt-1">{selectedQuote.notes}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Specifications:</span>
                  <pre className="text-sm bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(selectedQuote.specifications, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}