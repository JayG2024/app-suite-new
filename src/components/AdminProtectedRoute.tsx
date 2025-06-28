import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "./SEO";

/**
 * AdminProtectedRoute adds security headers and SEO protection for all admin routes
 * - Forces authentication
 * - Adds noindex meta tags
 * - Prevents search engine crawling
 */
const AdminProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {/* Security meta tags for all admin pages */}
      <SEO 
        title="Admin Dashboard - App Suite" 
        description="Private administrative area"
        noindex={true}
        nofollow={true}
      />
      
      {/* Render child routes */}
      <Outlet />
    </>
  );
};

export default AdminProtectedRoute;