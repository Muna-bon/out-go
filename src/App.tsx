import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Profile from "./pages/Profile";
import FindPartner from "./pages/FindPartner";
import MyPairings from "./pages/MyPairings";
import MyActivities from "./pages/MyActivities";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LocationProvider } from "@/context/LocationContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LocationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/activity/:id/confirmed" element={<ActivityConfirmed />} />
              <Route path="/events" element={<Events />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/create" element={<CreateActivity />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/find-partner" element={<FindPartner />} />
              <Route path="/my-pairings" element={<MyPairings />} />
              <Route path="/my-activities" element={<MyActivities />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/notifications" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
