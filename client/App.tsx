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

// Lazy load pages for code splitting
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

const Contact = lazy(() => import("./pages/Contact"));
const GuestPost = lazy(() => import("./pages/GuestPost"));
const LocalJunkRemoval = lazy(() => import("./pages/LocalJunkRemoval"));

const DigitalMarketing = lazy(() => import("./pages/DigitalMarketing"));
const LocalSEO = lazy(() => import("./pages/LocalSEO"));
const LeadGeneration = lazy(() => import("./pages/LeadGeneration"));
const DigitalMarketingJunkRemoval = lazy(
  () => import("./pages/DigitalMarketingJunkRemoval"),
);
const DigitalMarketingDumpsterRental = lazy(
  () => import("./pages/DigitalMarketingDumpsterRental"),
);
const LocalSEOJunkRemoval = lazy(() => import("./pages/LocalSEOJunkRemoval"));
const LocalSEODumpsterRental = lazy(
  () => import("./pages/LocalSEODumpsterRental"),
);
const LeadGenerationJunkRemoval = lazy(
  () => import("./pages/LeadGenerationJunkRemoval"),
);
const Sitemap = lazy(() => import("./pages/Sitemap"));
const XMLSitemap = lazy(() => import("./pages/XMLSitemap"));

// Admin pages - separate chunk
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AddLocation = lazy(() => import("./pages/admin/AddLocation"));
const LocationDataTable = lazy(() => import("./pages/admin/LocationDataTable"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const ReviewsTable = lazy(() => import("./pages/admin/ReviewsTable"));
const SuggestionsTable = lazy(() => import("./pages/admin/SuggestionsTable"));
const PreviewLocation = lazy(() => import("./pages/admin/PreviewLocation"));
const Marketing = lazy(() => import("./pages/admin/Marketing"));

const BulkUploadFacilities = lazy(
  () => import("./pages/admin/BulkUploadFacilities"),
);
const RSSManager = lazy(() => import("./pages/admin/RSSManager"));
const ArticleManagement = lazy(() => import("./pages/admin/ArticleManagement"));
const AIContentSettings = lazy(() => import("./pages/admin/AIContentSettings"));
const ItemManagement = lazy(() => import("./pages/admin/ItemManagement"));
const DebrisTypeManagement = lazy(
  () => import("./pages/admin/DebrisTypeManagement"),
);
const DataSeeding = lazy(() => import("./pages/admin/DataSeeding"));
const PricingCalculator = lazy(() => import("./pages/PricingCalculator"));
const DebrisWeightCalculator = lazy(
  () => import("./pages/DebrisWeightCalculator"),
);

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
    <Route
      path="/PricingCalculator"
      element={<Navigate to="/pricing-calculator" replace />}
    />
    <Route
      path="/pricingcalculator"
      element={<Navigate to="/pricing-calculator" replace />}
    />
    <Route
      path="/DebrisWeightCalculator"
      element={<Navigate to="/debris-weight-calculator" replace />}
    />
    <Route
      path="/debrisweightcalculator"
      element={<Navigate to="/debris-weight-calculator" replace />}
    />
    <Route path="/Contact" element={<Navigate to="/contact" replace />} />
    <Route path="/admin/RSSManager" element={<Navigate to="/admin/rss-manager" replace />} />
    <Route path="/admin/ArticleManagement" element={<Navigate to="/admin/articles" replace />} />
    <Route path="/admin/AIContentSettings" element={<Navigate to="/admin/ai-content-settings" replace />} />

    <Route path="/News" element={<Navigate to="/news" replace />} />
    <Route path="/location/:id" element={<LocationDetail />} />
    <Route
      path="/location/:state/:city/:locationName"
      element={<LocationDetail />}
    />


    <Route path="/blog" element={<Learn />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/news" element={<News />} />
    <Route path="/news/article/:id" element={<NewsArticle />} />
    <Route path="/contact" element={<Contact />} />
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
    <Route path="/pricing-calculator" element={<PricingCalculator />} />
    <Route
      path="/debris-weight-calculator"
      element={<DebrisWeightCalculator />}
    />

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
