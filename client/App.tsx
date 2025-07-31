import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoading } from "@/components/LoadingStates";
import { initSentry } from "@/lib/monitoring";
import { initSessionRecording } from "@/lib/sessionRecording";
import { initializeSampleArticles } from "@/lib/sampleArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  usePerformanceMonitoring,
  useBundlePerformance,
  useMemoryMonitoring,
} from "@/hooks/usePerformanceMonitoring";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Locations = lazy(() => import("./pages/Locations"));
const AllLocations = lazy(() => import("./pages/AllLocations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const SuggestLocation = lazy(() => import("./pages/SuggestLocation"));
const Resources = lazy(() => import("./pages/Resources"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));

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
const BlogAdmin = lazy(() => import("./pages/admin/BlogAdmin"));
const BulkUploadFacilities = lazy(
  () => import("./pages/admin/BulkUploadFacilities"),
);
const RSSManager = lazy(() => import("./pages/admin/RSSManager"));
const ArticleManagement = lazy(() => import("./pages/admin/ArticleManagement"));
const AIContentSettings = lazy(() => import("./pages/admin/AIContentSettings"));
const ItemManagement = lazy(() => import("./pages/admin/ItemManagement"));
const DebrisTypeManagement = lazy(() => import("./pages/admin/DebrisTypeManagement"));
const PricingCalculator = lazy(() => import("./pages/PricingCalculator"));
const DebrisWeightCalculator = lazy(
  () => import("./pages/DebrisWeightCalculator"),
);

import AdminRoute from "./components/admin/AdminRoute";

const queryClient = new QueryClient();

// Monitoring services disabled to prevent router conflicts
// initSentry();
// initSessionRecording();

// Initialize sample articles for demonstration
initializeSampleArticles();

// Monitoring provider component - disabled to prevent conflicts
const MonitoringProvider = ({ children }: { children: React.ReactNode }) => {
  // Disable monitoring to prevent router conflicts
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/locations" element={<Locations />} />
    <Route path="/all-locations" element={<AllLocations />} />
    <Route path="/suggest-location" element={<SuggestLocation />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/location/:id" element={<LocationDetail />} />
    <Route path="/location/:state/:city/:locationName" element={<LocationDetail />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/news" element={<News />} />
    <Route path="/news/article/:id" element={<NewsArticle />} />
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
      path="/admin/blog"
      element={
        <Suspense fallback={<PageLoading message="Loading blog admin..." />}>
          <AdminRoute>
            <BlogAdmin />
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
        <Suspense fallback={<PageLoading message="Loading article management..." />}>
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
        <Suspense fallback={<PageLoading message="Loading item management..." />}>
          <AdminRoute>
            <ItemManagement />
          </AdminRoute>
        </Suspense>
      }
    />

    <Route
      path="/admin/debris-types"
      element={
        <Suspense fallback={<PageLoading message="Loading debris type management..." />}>
          <AdminRoute>
            <DebrisTypeManagement />
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

const App = () => (
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

// Ensure root is only created once, even with HMR
const container = document.getElementById("root")!;
let root = (window as any).__react_root;

if (!root) {
  root = createRoot(container);
  (window as any).__react_root = root;
}

// Handle HMR updates
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Simple cleanup for HashRouter
    console.log("HMR: Cleaning up router");
  });
}

root.render(<App />);
