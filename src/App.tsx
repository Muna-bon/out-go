import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Category from "./pages/Category";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityConfirmed from "./pages/ActivityConfirmed";
import Events from "./pages/Events";
import Vendors from "./pages/Vendors";
import VendorSignup from "./pages/VendorSignup";
import VendorDashboard from "./pages/VendorDashboard";
import CreateActivity from "./pages/CreateActivity";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import FindPartner from "./pages/FindPartner";
import PartnerDetail from "./pages/PartnerDetail";
import VendorDetail from "./pages/VendorDetail";
import MyPairings from "./pages/MyPairings";
import MyActivities from "./pages/MyActivities";
import MyCreatedEvents from "./pages/MyCreatedEvents";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/activity/:id/confirmed" element={<ActivityConfirmed />} />
            <Route path="/events" element={<Events />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendor-signup" element={<VendorSignup />} />
            <Route path="/vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateActivity /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/find-partner" element={<FindPartner />} />
            <Route path="/partner/:id" element={<PartnerDetail />} />
            <Route path="/vendor/:id" element={<VendorDetail />} />
            <Route path="/my-pairings" element={<ProtectedRoute><MyPairings /></ProtectedRoute>} />
            <Route path="/my-activities" element={<ProtectedRoute><MyActivities /></ProtectedRoute>} />
            <Route path="/my-created-events" element={<ProtectedRoute><MyCreatedEvents /></ProtectedRoute>} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/vendors" element={<AdminRoute><AdminVendors /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
