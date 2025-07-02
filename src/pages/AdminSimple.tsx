import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminSimple() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log('AdminSimple mounted, user:', user);
  }, [user]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Admin Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">User Info</h2>
          <p>Email: {user?.email || 'Not logged in'}</p>
          <p>Role: {user?.role || 'N/A'}</p>
          <p>ID: {user?.id || 'N/A'}</p>
          
          <div className="pt-4 space-x-4">
            <Button onClick={() => navigate('/admin/clients')}>
              Go to Clients
            </Button>
            <Button onClick={() => navigate('/admin/projects')}>
              Go to Projects
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
{JSON.stringify({
  user,
  pathname: window.location.pathname,
  authToken: !!localStorage.getItem('authToken'),
  userData: !!localStorage.getItem('userData')
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}