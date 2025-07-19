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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/bulk-upload" element={<BulkUploadFacilities />} />
          <Route path="/admin/add-facility" element={<AddFacility />} />
          <Route path="/admin/edit-facility/:id" element={<EditFacility />} />
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
