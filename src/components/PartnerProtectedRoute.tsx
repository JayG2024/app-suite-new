import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import LoadingSpinner from './LoadingSpinner'
import { Alert, AlertDescription } from './ui/alert'
import { AlertTriangle } from 'lucide-react'

interface PartnerProtectedRouteProps {
  children: React.ReactNode
  requireActive?: boolean
}

export default function PartnerProtectedRoute({ 
  children, 
  requireActive = true 
}: PartnerProtectedRouteProps) {
  const { user, partnerProfile, loading, isPartner, isActivePartner } = usePartnerAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen text="Checking partner access..." />
  }

  // Redirect to partner login if not authenticated
  if (!user) {
    return <Navigate to="/partners/login" state={{ from: location }} replace />
  }

  // Show error if user is not a partner
  if (!isPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access denied. This area is restricted to authorized partners only.
              Please contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Show error if partner account is not active (when required)
  if (requireActive && !isActivePartner) {
    const statusMessages = {
      pending: 'Your partner account is pending approval. You will receive an email once your account is activated.',
      inactive: 'Your partner account is currently inactive. Please contact support for assistance.',
      suspended: 'Your partner account has been suspended. Please contact support for more information.'
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {statusMessages[partnerProfile?.status as keyof typeof statusMessages] || 
               'Your partner account status prevents access to this area.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Render protected content
  return <>{children}</>
}