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

// Import pages directly to debug lazy loading issues
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import AllLocations from "./pages/AllLocations";
import LocationDetail from "./pages/LocationDetail";
import SuggestLocation from "./pages/SuggestLocation";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Learn from "./pages/Learn";
import BlogPost from "./pages/BlogPost";

import GuestPost from "./pages/GuestPost";
import LocalJunkRemoval from "./pages/LocalJunkRemoval";

import DigitalMarketing from "./pages/DigitalMarketing";
import LocalSEO from "./pages/LocalSEO";
import LeadGeneration from "./pages/LeadGeneration";
import DigitalMarketingJunkRemoval from "./pages/DigitalMarketingJunkRemoval";
import DigitalMarketingDumpsterRental from "./pages/DigitalMarketingDumpsterRental";
import LocalSEOJunkRemoval from "./pages/LocalSEOJunkRemoval";
import LocalSEODumpsterRental from "./pages/LocalSEODumpsterRental";
import LeadGenerationJunkRemoval from "./pages/LeadGenerationJunkRemoval";
import Sitemap from "./pages/Sitemap";
import XMLSitemap from "./pages/XMLSitemap";

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

    {/* Admin routes with separate loading */}
    <Route
      path="/admin-login"
      element={
        <Suspense fallback={<PageLoading message="Loading admin login..." />}>
          <AdminLogin />
        </Suspense>
      }
    />

    <Route
      path="/admin"
      element={
        <Suspense fallback={<PageLoading message="Loading admin panel..." />}>
          <AdminRoute>
            <Admin />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/add-location"
      element={
        <Suspense fallback={<PageLoading message="Loading form..." />}>
          <AdminRoute>
            <AddLocation />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/locations"
      element={
        <Suspense fallback={<PageLoading message="Loading locations..." />}>
          <AdminRoute>
            <LocationDataTable />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/reviews"
      element={
        <Suspense fallback={<PageLoading message="Loading reviews..." />}>
          <AdminRoute>
            <ReviewsTable />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/suggestions"
      element={
        <Suspense fallback={<PageLoading message="Loading suggestions..." />}>
          <AdminRoute>
            <SuggestionsTable />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/marketing"
      element={
        <Suspense fallback={<PageLoading message="Loading marketing..." />}>
          <AdminRoute>
            <Marketing />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/settings"
      element={
        <Suspense fallback={<PageLoading message="Loading settings..." />}>
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/preview-location/:id"
      element={
        <Suspense fallback={<PageLoading message="Loading preview..." />}>
          <AdminRoute>
            <PreviewLocation />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/bulk-upload"
      element={
        <Suspense fallback={<PageLoading message="Loading bulk upload..." />}>
          <AdminRoute>
            <BulkUploadFacilities />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/rss-manager"
      element={
        <Suspense fallback={<PageLoading message="Loading RSS manager..." />}>
          <AdminRoute>
            <RSSManager />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/articles"
      element={
        <Suspense
          fallback={<PageLoading message="Loading article management..." />}
        >
          <AdminRoute>
            <ArticleManagement />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/ai-content-settings"
      element={
        <Suspense fallback={<PageLoading message="Loading AI settings..." />}>
          <AdminRoute>
            <AIContentSettings />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/items"
      element={
        <Suspense
          fallback={<PageLoading message="Loading item management..." />}
        >
          <AdminRoute>
            <ItemManagement />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/debris-types"
      element={
        <Suspense
          fallback={<PageLoading message="Loading debris type management..." />}
        >
          <AdminRoute>
            <DebrisTypeManagement />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/data-seeding"
      element={
        <Suspense fallback={<PageLoading message="Loading data seeding..." />}>
          <AdminRoute>
            <DataSeeding />
          </AdminRoute>
        </Suspense>
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
                <Suspense
                  fallback={<PageLoading message="Loading application..." />}
                >
                  <AppRoutes />
                </Suspense>
              </RouterWrapper>
            </TooltipProvider>
          </MonitoringProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
