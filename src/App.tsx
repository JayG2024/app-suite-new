
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "./version"; // Import version for cache debugging
import "./utils/clearCache"; // Cache clearing utility
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import RedirectHandler from "./components/RedirectHandler";
import { SocketProvider } from "./contexts/SocketContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Apps from "./pages/Apps";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CookiePolicy from "./pages/CookiePolicy";
import CustomerManagement from "./pages/CustomerManagement";
import Extensions from "./pages/Extensions";
import FinanceApps from "./pages/FinanceApps";
import HelpCenter from "./pages/HelpCenter";
import MarketingSolutions from "./pages/MarketingSolutions";
import OperationsTools from "./pages/OperationsTools";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Sales from "./pages/Sales";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import RoiCalculator from "./pages/RoiCalculator";
import AiDevelopmentProcess from "./pages/AiDevelopmentProcess";
import BlogPost from "./pages/BlogPost";
import ImageGenerator from "./pages/ImageGenerator";
import GetStarted from "./pages/GetStarted";
import PaymentTerms from "./pages/PaymentTerms";
import PriceCalculator from "./pages/PriceCalculator";
import FinancingCalculator from "./pages/FinancingCalculator";
import TechnologyPartners from "./pages/TechnologyPartners";
import NewsletterPage from "./pages/NewsletterPage";
// Lazy load heavy pages for code splitting
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const SystemStatus = React.lazy(() => import("./pages/SystemStatus"));
const IconTest = React.lazy(() => import("./components/IconTest"));
const Industries = React.lazy(() => import("./pages/Industries"));
const CommandCenterV2 = React.lazy(() => import("./pages/CommandCenterV2"));
const TestProjectForm = React.lazy(() => import('./components/TestProjectForm'));
const Examples = React.lazy(() => import("./pages/Examples"));
const SolutionsWeveBuilt = React.lazy(() => import("./pages/SolutionsWeveBuilt"));
const WebAuditDashboard = React.lazy(() => import("./pages/portfolio/WebAuditDashboard"));
import Proposal from "./pages/Proposal";
import Sitemap from "./pages/Sitemap";

// Documentation pages
import Documentation from "./pages/Documentation";
import QuickStart from "./pages/documentation/QuickStart";
import Installation from "./pages/documentation/Installation";
import Configuration from "./pages/documentation/Configuration";
import Customization from "./pages/documentation/Customization";
import Integrations from "./pages/documentation/Integrations";
import AiCapabilities from "./pages/documentation/AiCapabilities";
import Security from "./pages/documentation/Security";
import ClientOnboarding from "./pages/documentation/ClientOnboarding";
import Process from "./pages/documentation/Process";
import Delivery from "./pages/documentation/Delivery";

// Whitepapers
import HiddenCostGeoBlocking from "./pages/whitepapers/HiddenCostGeoBlocking";

// Resources
import Resources from "./pages/Resources";
import GeoBlockingImpact from "./pages/infographics/GeoBlockingImpact";
import Podcast from "./pages/Podcast";

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Admin route component that shows login form or dashboard
function AdminRoute() {
  const { user } = useAuth();
  return user ? (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ) : (
    <LoginForm />
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AuthProvider>
          <RedirectHandler />
          <ScrollToTop />
          <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="apps" element={<Apps />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="careers" element={<Careers />} />
          <Route path="cookie-policy" element={<CookiePolicy />} />
          <Route path="customer-management" element={<CustomerManagement />} />
          <Route path="extensions" element={<Extensions />} />
          <Route path="finance-apps" element={<FinanceApps />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="marketing-solutions" element={<MarketingSolutions />} />
          <Route path="operations-tools" element={<OperationsTools />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="sales" element={<Sales />} />
          <Route path="support" element={<Support />} />
          <Route path="terms" element={<Terms />} />
          <Route path="roi-calculator" element={<RoiCalculator />} />
          <Route path="ai-development-process" element={<AiDevelopmentProcess />} />
          <Route path="image-generator" element={<ImageGenerator />} />
          <Route path="get-started" element={<GetStarted />} />
          <Route path="payment-terms" element={<PaymentTerms />} />
          <Route path="price-calculator" element={<PriceCalculator />} />
          <Route path="financing-calculator" element={<FinancingCalculator />} />
          <Route path="technology-partners" element={<TechnologyPartners />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="icon-test" element={<Suspense fallback={<PageLoader />}><IconTest /></Suspense>} />
          <Route path="system-status" element={<Suspense fallback={<PageLoader />}><SystemStatus /></Suspense>} />
          <Route path="industries" element={<Suspense fallback={<PageLoader />}><Industries /></Suspense>} />
          <Route path="examples" element={<Suspense fallback={<PageLoader />}><Examples /></Suspense>} />
          <Route path="solutions-weve-built" element={<Suspense fallback={<PageLoader />}><SolutionsWeveBuilt /></Suspense>} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="portfolio/webaudit-dashboard" element={<Suspense fallback={<PageLoader />}><WebAuditDashboard /></Suspense>} />
          <Route path="proposal/:proposalId" element={<Proposal />} />
          <Route path="ai-brain" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminPage /></Suspense></ProtectedRoute>} />
          <Route path="test-form" element={<Suspense fallback={<PageLoader />}><TestProjectForm /></Suspense>} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="documentation/quick-start" element={<QuickStart />} />
          <Route path="documentation/installation" element={<Installation />} />
          <Route path="documentation/configuration" element={<Configuration />} />
          <Route path="documentation/customization" element={<Customization />} />
          <Route path="documentation/integrations" element={<Integrations />} />
          <Route path="documentation/ai-capabilities" element={<AiCapabilities />} />
          <Route path="documentation/security" element={<Security />} />
          <Route path="documentation/client-onboarding" element={<ClientOnboarding />} />
          <Route path="documentation/process" element={<Process />} />
          <Route path="documentation/delivery" element={<Delivery />} />
          
          {/* Resources & Content */}
          <Route path="resources" element={<Resources />} />
          <Route path="whitepapers/geo-blocking-ai-search" element={<HiddenCostGeoBlocking />} />
          <Route path="infographics/geo-blocking-impact" element={<GeoBlockingImpact />} />
          <Route path="podcast" element={<Podcast />} />
          
          {/* Legacy redirects */}
          <Route path="examples" element={<Navigate to="/solutions-weve-built" replace />} />
          <Route path="portfolio" element={<Navigate to="/solutions-weve-built" replace />} />
          <Route path="command-center" element={<Navigate to="/admin" replace />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="manage" element={<Navigate to="/admin" replace />} />
          <Route path="blog/the-hidden-cost-of-geo-blocking-and-ai-search-visibility" element={<Navigate to="/whitepapers/geo-blocking-ai-search" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Admin routes with authentication */}
        <Route path="admin" element={<AdminRoute />}>
          <Route index element={<CommandCenterV2 />} />
          <Route path="overview" element={<CommandCenterV2 initialSection="overview" />} />
          <Route path="gmail" element={<CommandCenterV2 initialSection="gmail" />} />
          <Route path="clients" element={<CommandCenterV2 initialSection="clients" />} />
          <Route path="projects" element={<CommandCenterV2 initialSection="projects" />} />
          <Route path="tasks" element={<CommandCenterV2 initialSection="tasks" />} />
          <Route path="sales" element={<CommandCenterV2 initialSection="sales" />} />
          <Route path="marketing" element={<CommandCenterV2 initialSection="marketing" />} />
          <Route path="finance" element={<CommandCenterV2 initialSection="finance" />} />
          <Route path="analytics" element={<CommandCenterV2 initialSection="analytics" />} />
          <Route path="team" element={<CommandCenterV2 initialSection="team" />} />
          <Route path="deployments" element={<CommandCenterV2 initialSection="deployments" />} />
          <Route path="asc-ai" element={<CommandCenterV2 initialSection="cloud-dev" />} />
          <Route path="templates" element={<CommandCenterV2 initialSection="templates" />} />
          <Route path="call-analyzer" element={<CommandCenterV2 initialSection="call-analyzer" />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </SocketProvider>
  );
}

export default App;
