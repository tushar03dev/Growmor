import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewArrivals from "./pages/NewArrivals";
import Contact from "./pages/Contact";
import ShopPlant from "./pages/ShopPlant";
import UserAccount from "./pages/UserAccount";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AuthModal from '@/components/ui/AuthModal';
import GoogleCallback from './pages/GoogleCallback';
import AccountSettings from './pages/AccountSettings';
import OrderHistory from './pages/OrderHistory';
import BestSellers from './pages/BestSellers';
import { useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  if (!token || !user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { showAuthModal, setShowAuthModal } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shopPlant" element={<ShopPlant />} />
            <Route path="/best-sellers" element={<BestSellers />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/account/orders" element={<OrderHistory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
