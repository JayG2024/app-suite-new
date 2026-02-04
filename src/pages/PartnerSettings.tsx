/**
 * Partner Settings Page
 * 
 * Allows partners to manage their account settings, profile, and domain configurations.
 */

import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Globe, Bell, Shield } from 'lucide-react'
import PartnerDomainManager from '@/components/PartnerDomainManager'

export default function PartnerSettings() {
  const { partnerProfile } = usePartnerAuth()

  if (!partnerProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading partner profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">
          Manage your partner profile, domain configuration, and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Partner Profile</CardTitle>
              <CardDescription>
                View and manage your partner account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <p className="text-lg">{partnerProfile.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <p className="text-lg">{partnerProfile.contact_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Account Status</label>
                <p className="text-lg capitalize">{partnerProfile.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Discount Tier</label>
                <p className="text-lg">{partnerProfile.discount_tier?.name || 'Standard'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Branding Level</label>
                <p className="text-lg capitalize">{partnerProfile.branding_level.replace('-', ' ')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <PartnerDomainManager partnerId={partnerProfile.id} />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Notification settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Security settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
