
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
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
import AdminPage from "./pages/AdminPage";
import SystemStatus from "./pages/SystemStatus";
import IconTest from "./components/IconTest";
import Industries from "./pages/Industries";
import CommandCenterV2 from "./pages/CommandCenterV2";
import Examples from "./pages/Examples";
import SolutionsWeveBuilt from "./pages/SolutionsWeveBuilt";
import WebAuditDashboard from "./pages/portfolio/WebAuditDashboard";
import Proposal from "./pages/Proposal";

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

// Admin route component that shows login form or dashboard
function AdminRoute() {
  const { user } = useAuth();
  return user ? <CommandCenterV2 /> : <LoginForm />;
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AuthProvider>
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
          <Route path="icon-test" element={<IconTest />} />
          <Route path="system-status" element={<SystemStatus />} />
          <Route path="industries" element={<Industries />} />
          <Route path="examples" element={<Examples />} />
          <Route path="solutions-weve-built" element={<SolutionsWeveBuilt />} />
          <Route path="portfolio/webaudit-dashboard" element={<WebAuditDashboard />} />
          <Route path="proposal/:proposalId" element={<Proposal />} />
          <Route path="ai-brain" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
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
          <Route path="command-center" element={<Navigate to="/dashboard" replace />} />
          <Route path="admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="blog/the-hidden-cost-of-geo-blocking-and-ai-search-visibility" element={<Navigate to="/whitepapers/geo-blocking-ai-search" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="dashboard" element={<AdminRoute />} />
        <Route path="manage" element={<AdminRoute />} />
      </Routes>
      <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </SocketProvider>
  );
}

export default App;
