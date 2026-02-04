import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { usePartnerUrl } from '@/hooks/usePartnerUrl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Calculator, 
  FileText, 
  Settings, 
  BarChart3, 
  Users, 
  Globe,
  Building2,
  Mail,
  Crown
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PartnerDashboard() {
  const { partnerProfile } = usePartnerAuth()
  const { getPortalUrl } = usePartnerUrl()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const quickActions = [
    {
      title: 'Pricing Calculator',
      description: 'Calculate pricing with partner discounts',
      icon: Calculator,
      path: 'pricing',
      color: 'bg-blue-500'
    },
    {
      title: 'Resource Library',
      description: 'Access sales materials and documentation',
      icon: FileText,
      path: 'resources',
      color: 'bg-green-500'
    },
    {
      title: 'Quote Management',
      description: 'View and manage your quotes',
      icon: BarChart3,
      path: 'quotes',
      color: 'bg-purple-500'
    },
    {
      title: 'Client Management',
      description: 'Manage your client relationships',
      icon: Users,
      path: 'clients',
      color: 'bg-orange-500'
    },
    {
      title: 'Website Scanner',
      description: 'Analyze websites for rebuild pricing',
      icon: Globe,
      path: 'scanner',
      color: 'bg-indigo-500'
    },
    {
      title: 'Account Settings',
      description: 'Manage your partner profile',
      icon: Settings,
      path: 'settings',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {partnerProfile?.name}!
        </h1>
        <p className="text-gray-600">
          Access your partner tools and resources to grow your business.
        </p>
      </div>

        {/* Partner Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Company</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerProfile?.company_name}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Mail className="h-3 w-3 mr-1" />
                {partnerProfile?.contact_email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Badge className={getStatusColor(partnerProfile?.status || '')}>
                {partnerProfile?.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {partnerProfile?.status}
              </div>
              <p className="text-xs text-muted-foreground">
                Partner account status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discount Tier</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partnerProfile?.discount_tier?.name || 'Standard'}
              </div>
              <p className="text-xs text-muted-foreground">
                {partnerProfile?.discount_tier?.website_discount || 0}% website discount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link to={getPortalUrl(action.path)}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent quotes, downloads, and portal activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm">Start using the portal tools to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }