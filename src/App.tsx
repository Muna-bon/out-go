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
import CreateActivity from "./pages/CreateActivity";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import FindPartner from "./pages/FindPartner";
import MyPairings from "./pages/MyPairings";
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
          <Route path="/discover" element={<Discover />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/activity/:id/confirmed" element={<ActivityConfirmed />} />
          <Route path="/events" element={<Events />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/find-partner" element={<FindPartner />} />
          <Route path="/my-pairings" element={<MyPairings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
