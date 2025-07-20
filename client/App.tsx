import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import AllLocations from "./pages/AllLocations";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import BulkUploadFacilities from "./pages/admin/BulkUploadFacilities";
import AddFacility from "./pages/admin/AddFacility";
import EditFacility from "./pages/admin/EditFacility";
import LocationDataTable from "./pages/admin/LocationDataTable";
import AdminSettings from "./pages/admin/AdminSettings";
import ReviewsTable from "./pages/admin/ReviewsTable";
import SuggestionsTable from "./pages/admin/SuggestionsTable";
import PreviewLocation from "./pages/admin/PreviewLocation";
import AdminRoute from "./components/admin/AdminRoute";
import About from "./pages/About";
import LocationDetail from "./pages/LocationDetail";
import SuggestLocation from "./pages/SuggestLocation";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/all-locations" element={<AllLocations />} />
          <Route path="/suggest-location" element={<SuggestLocation />} />
          <Route path="/resources" element={<Resources />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin/bulk-upload"
            element={
              <AdminRoute>
                <BulkUploadFacilities />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-location"
            element={
              <AdminRoute>
                <AddFacility />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit-location/:id"
            element={
              <AdminRoute>
                <EditFacility />
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
            path="/admin/preview-location/:id"
            element={
              <AdminRoute>
                <PreviewLocation />
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
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Ensure root is only created once, even with HMR
const container = document.getElementById("root")!;
let root = (window as any).__react_root;

if (!root) {
  root = createRoot(container);
  (window as any).__react_root = root;
}

root.render(<App />);
