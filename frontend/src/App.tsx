import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuard from "@/components/auth/RoleGuard";

import HomePage from "@/pages/HomePage";
import VendorListPage from "@/pages/VendorListPage";
import VendorMenuPage from "@/pages/VendorMenuPage";
import FoodDetailPage from "@/pages/FoodDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";

import StudentDashboard from "@/pages/dashboards/StudentDashboard";
import VendorDashboard from "@/pages/dashboards/VendorDashboard";
import VendorMenuManagement from "@/pages/dashboards/VendorMenuManagement";
import VendorOrdersPage from "@/pages/dashboards/VendorOrdersPage";
import VendorReviewsPage from "@/pages/dashboards/VendorReviewsPage";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import AdminVendorManagement from "@/pages/dashboards/AdminVendorManagement";
import AdminUserManagement from "@/pages/dashboards/AdminUserManagement";
import AdminOrderMonitoring from "@/pages/dashboards/AdminOrderMonitoring";
import AdminReportsPage from "@/pages/dashboards/AdminReportsPage";
import AdminApplicationReview from "@/pages/dashboards/AdminApplicationReview";

import VendorApplicationPage from "@/pages/VendorApplicationPage";
import SimulatePaymentPage from "@/pages/SimulatePaymentPage";
import NotFound from "@/pages/NotFound";

import { NotificationProvider } from "@/context/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Auth pages (no layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/simulate-payment" element={<SimulatePaymentPage />} />

            {/* Main layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/vendors" element={<VendorListPage />} />
              <Route path="/vendors/:id" element={<VendorMenuPage />} />
              <Route path="/food/:foodId" element={<FoodDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:orderId/tracking" element={<OrderTrackingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard/apply-vendor" element={<VendorApplicationPage />} />
            </Route>

            {/* Dashboard layout with Role Guards */}
            <Route element={<DashboardLayout />}>
              {/* Student access only */}
              <Route 
                path="/dashboard" 
                element={
                  <RoleGuard allowedRoles={["student"]}>
                    <StudentDashboard />
                  </RoleGuard>
                } 
              />
              
              {/* Vendor access only */}
              <Route 
                path="/dashboard/vendor" 
                element={
                  <RoleGuard allowedRoles={["vendor"]}>
                    <VendorDashboard />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/vendor/menu" 
                element={
                  <RoleGuard allowedRoles={["vendor"]}>
                    <VendorMenuManagement />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/vendor/orders" 
                element={
                  <RoleGuard allowedRoles={["vendor"]}>
                    <VendorOrdersPage />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/vendor/reviews" 
                element={
                  <RoleGuard allowedRoles={["vendor"]}>
                    <VendorReviewsPage />
                  </RoleGuard>
                } 
              />

              {/* Admin access only */}
              <Route 
                path="/dashboard/admin" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminDashboard />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/admin/vendors" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminVendorManagement />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/admin/users" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminUserManagement />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/admin/orders" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminOrderMonitoring />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/admin/applications" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminApplicationReview />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/dashboard/admin/reports" 
                element={
                  <RoleGuard allowedRoles={["super_admin", "auditor", "support"]}>
                    <AdminReportsPage />
                  </RoleGuard>
                } 
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
