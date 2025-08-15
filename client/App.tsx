import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoading } from "@/components/LoadingStates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Performance monitoring disabled for production builds
// import {
//   usePerformanceMonitoring,
//   useBundlePerformance,
//   useMemoryMonitoring,
// } from "@/hooks/usePerformanceMonitoring";

// Use lazy loading for better performance
const Index = lazy(() => import("./pages/Index"));
const Locations = lazy(() => import("./pages/Locations"));
const AllLocations = lazy(() => import("./pages/AllLocations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const SuggestLocation = lazy(() => import("./pages/SuggestLocation"));
const Resources = lazy(() => import("./pages/Resources"));
const NotFound = lazy(() => import("./pages/NotFound"));

const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Learn = lazy(() => import("./pages/Learn"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const GuestPost = lazy(() => import("./pages/GuestPost"));
const LocalJunkRemoval = lazy(() => import("./pages/LocalJunkRemoval"));

const DigitalMarketing = lazy(() => import("./pages/DigitalMarketing"));
const LocalSEO = lazy(() => import("./pages/LocalSEO"));
const LeadGeneration = lazy(() => import("./pages/LeadGeneration"));
const DigitalMarketingJunkRemoval = lazy(() => import("./pages/DigitalMarketingJunkRemoval"));
const DigitalMarketingDumpsterRental = lazy(() => import("./pages/DigitalMarketingDumpsterRental"));
const LocalSEOJunkRemoval = lazy(() => import("./pages/LocalSEOJunkRemoval"));
const LocalSEODumpsterRental = lazy(() => import("./pages/LocalSEODumpsterRental"));
const LeadGenerationJunkRemoval = lazy(() => import("./pages/LeadGenerationJunkRemoval"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const XMLSitemap = lazy(() => import("./pages/XMLSitemap"));

// Admin pages - using direct imports for debugging
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AddLocation from "./pages/admin/AddLocation";
import LocationDataTable from "./pages/admin/LocationDataTable";
import AdminSettings from "./pages/admin/AdminSettings";
import ReviewsTable from "./pages/admin/ReviewsTable";
import SuggestionsTable from "./pages/admin/SuggestionsTable";
import PreviewLocation from "./pages/admin/PreviewLocation";
import Marketing from "./pages/admin/Marketing";
import BulkUploadFacilities from "./pages/admin/BulkUploadFacilities";
import RSSManager from "./pages/admin/RSSManager";
import ArticleManagement from "./pages/admin/ArticleManagement";
import AIContentSettings from "./pages/admin/AIContentSettings";
import ItemManagement from "./pages/admin/ItemManagement";
import DebrisTypeManagement from "./pages/admin/DebrisTypeManagement";
import DataSeeding from "./pages/admin/DataSeeding";

import AdminRoute from "./components/admin/AdminRoute";

const queryClient = new QueryClient();

// Monitoring provider component - disabled to prevent conflicts
const MonitoringProvider = ({ children }: { children: React.ReactNode }) => {
  // Disable all monitoring in production builds to prevent conflicts and hanging
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/locations" element={<Locations />} />
    <Route path="/all-locations" element={<AllLocations />} />
    <Route path="/suggest-location" element={<SuggestLocation />} />
    <Route path="/resources" element={<Resources />} />

    {/* Redirect routes for common URL variations and case mismatches */}
    <Route
      path="/SuggestLocation"
      element={<Navigate to="/suggest-location" replace />}
    />
    <Route
      path="/suggestlocation"
      element={<Navigate to="/suggest-location" replace />}
    />
    <Route
      path="/AllLocations"
      element={<Navigate to="/all-locations" replace />}
    />
    <Route
      path="/alllocations"
      element={<Navigate to="/all-locations" replace />}
    />
    {/* Removed routes - pricing calculator, debris calculator, contact */}
    <Route path="/Blog" element={<Navigate to="/blog" replace />} />
    <Route path="/BlogPost" element={<Navigate to="/blog" replace />} />
    <Route path="/blogpost" element={<Navigate to="/blog" replace />} />
    <Route
      path="/admin/RSSManager"
      element={<Navigate to="/admin/rss-manager" replace />}
    />
    <Route
      path="/admin/ArticleManagement"
      element={<Navigate to="/admin/articles" replace />}
    />
    <Route
      path="/admin/AIContentSettings"
      element={<Navigate to="/admin/ai-content-settings" replace />}
    />

    <Route path="/News" element={<Navigate to="/news" replace />} />
    <Route path="/location/:id" element={<LocationDetail />} />
    <Route
      path="/location/:state/:city/:locationName"
      element={<LocationDetail />}
    />

    <Route path="/blog" element={<Learn />} />
    <Route path="/learn" element={<Learn />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/news" element={<News />} />
    <Route path="/news/article/:id" element={<NewsArticle />} />
    <Route path="/guest-post" element={<GuestPost />} />
    <Route path="/local-junk-removal" element={<LocalJunkRemoval />} />

    <Route path="/digital-marketing" element={<DigitalMarketing />} />
    <Route path="/local-seo" element={<LocalSEO />} />
    <Route path="/lead-generation" element={<LeadGeneration />} />
    <Route
      path="/digital-marketing-junk-removal"
      element={<DigitalMarketingJunkRemoval />}
    />
    <Route
      path="/digital-marketing-dumpster-rental"
      element={<DigitalMarketingDumpsterRental />}
    />
    <Route path="/local-seo-junk-removal" element={<LocalSEOJunkRemoval />} />
    <Route
      path="/local-seo-dumpster-rental"
      element={<LocalSEODumpsterRental />}
    />
    <Route
      path="/lead-generation-junk-removal"
      element={<LeadGenerationJunkRemoval />}
    />
    <Route path="/sitemap" element={<Sitemap />} />
    <Route path="/sitemap.xml" element={<XMLSitemap />} />

    {/* Admin routes */}
    <Route path="/admin-login" element={<AdminLogin />} />

    <Route
      path="/admin"
      element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/add-location"
      element={
        <AdminRoute>
          <AddLocation />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/locations"
      element={
        <AdminRoute>
          <LocationDataTable />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/reviews"
      element={
        <AdminRoute>
          <ReviewsTable />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/suggestions"
      element={
        <AdminRoute>
          <SuggestionsTable />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/marketing"
      element={
        <AdminRoute>
          <Marketing />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/settings"
      element={
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/preview-location/:id"
      element={
        <AdminRoute>
          <PreviewLocation />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/bulk-upload"
      element={
        <AdminRoute>
          <BulkUploadFacilities />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/rss-manager"
      element={
        <AdminRoute>
          <RSSManager />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/articles"
      element={
        <AdminRoute>
          <ArticleManagement />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/ai-content-settings"
      element={
        <AdminRoute>
          <AIContentSettings />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/items"
      element={
        <AdminRoute>
          <ItemManagement />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/debris-types"
      element={
        <AdminRoute>
          <DebrisTypeManagement />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/data-seeding"
      element={
        <AdminRoute>
          <DataSeeding />
        </AdminRoute>
      }
    />

    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  // Use HashRouter to avoid browser history API issues
  return <HashRouter>{children}</HashRouter>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MonitoringProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <RouterWrapper>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main>
                    <AppRoutes />
                  </main>
                  <Footer />
                </div>
              </RouterWrapper>
            </TooltipProvider>
          </MonitoringProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
