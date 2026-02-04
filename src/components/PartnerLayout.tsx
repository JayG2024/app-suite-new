import React from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { usePartnerUrl } from '@/hooks/usePartnerUrl'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Calculator, 
  FileText, 
  Settings, 
  BarChart3, 
  Users, 
  Globe,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface NavItem {
  title: string
  path: string // Changed from href to path (relative path without /partners/portal prefix)
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    title: 'Pricing Calculator',
    path: 'pricing',
    icon: Calculator,
    description: 'Calculate pricing with partner discounts'
  },
  {
    title: 'Resource Library',
    path: 'resources',
    icon: FileText,
    description: 'Sales materials and documentation'
  },
  {
    title: 'Quote Management',
    path: 'quotes',
    icon: BarChart3,
    description: 'View and manage your quotes'
  },
  {
    title: 'Client Management',
    path: 'clients',
    icon: Users,
    description: 'Manage your client relationships'
  },
  {
    title: 'Website Scanner',
    path: 'scanner',
    icon: Globe,
    description: 'Analyze websites for rebuild pricing'
  },
  {
    title: 'Account Settings',
    path: 'settings',
    icon: Settings,
    description: 'Manage your partner profile'
  }
]

export default function PartnerLayout({ children }: { children?: React.ReactNode }) {
  const { partnerProfile, signOut } = usePartnerAuth()
  const { getPortalUrl, isCurrentPath } = usePartnerUrl()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                App Suite
              </Link>
              <Badge variant="secondary">Partner Portal</Badge>
              {partnerProfile && (
                <Badge className={getStatusColor(partnerProfile.status)}>
                  {partnerProfile.status}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {partnerProfile && (
                <div className="hidden md:block text-sm text-gray-600">
                  {partnerProfile.company_name}
                </div>
              )}
              
              {/* Mobile menu button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              
              {/* Desktop sign out */}
              <Button variant="outline" onClick={handleSignOut} className="hidden md:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const itemUrl = getPortalUrl(item.path)
                const isActive = location.pathname === itemUrl
                return (
                  <Link
                    key={item.path}
                    to={itemUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
              
              {/* Mobile sign out */}
              <Button 
                variant="outline" 
                onClick={handleSignOut} 
                className="w-full lg:hidden mt-4"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  )
}