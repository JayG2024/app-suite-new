
import { useLocation } from "react-router-dom";
import { ReactNode, lazy, Suspense } from "react";
import ChatSidebar from "./ChatSidebar";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import FinancingCTA from "./FinancingCTA";
import { SidebarProvider } from "./ui/sidebar";

// Lazy load the AI Chatbot
const AIChatbot = lazy(() => import("./AIChatbot"));

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  // We'll continue to exclude the blog pages
  const isBlogPage = location.pathname === "/blog" || location.pathname.startsWith("/blog/");
  // Let's also exclude admin pages
  const isAdminPage = location.pathname.startsWith("/admin");
  // And auth pages
  const isAuthPage = location.pathname === "/auth";

  // Disable chat sidebar by default for security/privacy
  // Can be enabled later with proper authentication
  const shouldShowSidebar = false;

  return (
    <SidebarProvider>
      <SEO />
      <div className="flex min-h-screen w-full max-w-full">
        {shouldShowSidebar && <ChatSidebar />}
        <div className="flex-1 w-full overflow-x-hidden">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        {/* Show compact financing CTA on all pages except pricing calculator and payment terms */}
        {!location.pathname.includes('/price-calculator') && 
         !location.pathname.includes('/payment-terms') && 
         !location.pathname.includes('/contact') && (
          <FinancingCTA variant="compact" />
        )}
        
        {/* Show AI Chatbot on all public pages, but not on internal/admin pages */}
        {!location.pathname.includes('/command-center') &&
         !location.pathname.includes('/admin') &&
         !isAuthPage && (
          <Suspense fallback={null}>
            <AIChatbot />
          </Suspense>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
