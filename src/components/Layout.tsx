
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import FinancingCTA from "./FinancingCTA";
import { SidebarProvider } from "./ui/sidebar";

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

  return (
    <SidebarProvider>
      <SEO />
      <div className="flex min-h-screen w-full max-w-full">
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
      </div>
    </SidebarProvider>
  );
};

export default Layout;
