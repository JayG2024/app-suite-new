import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function AdminDebug() {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Debug Page</h1>
      <div className="space-y-2">
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
        <p>Auth Token: {localStorage.getItem('authToken') ? 'Present' : 'Not found'}</p>
      </div>
    </div>
  );
}