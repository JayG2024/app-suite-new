import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    // Redirect to dashboard which will show login form
    return <Navigate to="/dashboard" replace />;
  }

  // Only allow Jason and Almir
  const allowedEmails = ['jason@jaydus.ai', 'almir@jaydus.ai'];
  if (!allowedEmails.includes(user.email.toLowerCase())) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">This area is restricted to authorized administrators only.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}