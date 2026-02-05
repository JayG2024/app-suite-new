import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PartnerLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = usePartnerAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/partners/portal'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
        toast.error('Login failed', {
          description: error.message
        })
      } else {
        toast.success('Welcome back!', {
          description: 'Successfully logged into partner portal'
        })
        navigate(from, { replace: true })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error('Login failed', {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">App Suite</h1>
          </Link>
          <p className="mt-2 text-sm text-gray-600">Partner Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Login</CardTitle>
            <CardDescription>
              Sign in to access your partner dashboard, pricing tools, and resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@company.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Demo Credentials</p>
                <p className="text-xs text-blue-700">
                  Email: <code className="bg-blue-100 px-1 rounded">test@partner.com</code> or <code className="bg-blue-100 px-1 rounded">premium@partner.com</code>
                </p>
                <p className="text-xs text-blue-700">
                  Password: <code className="bg-blue-100 px-1 rounded">any password</code>
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Need a partner account?{' '}
                <Link 
                  to="/contact" 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Contact us
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link 
                  to="/" 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to main site
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}