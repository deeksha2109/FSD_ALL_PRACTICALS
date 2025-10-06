import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Layouts
import Layout from './layouts/Layout.js';

// Pages - Customer Portal
import HomePage from './pages/customer/HomePage.js';
import ProductsPage from './pages/customer/ProductsPage.js';
import ProductDetailPage from './pages/customer/ProductDetailPage.js';
import CartPage from './pages/customer/CartPage.js';
import WishlistPage from './pages/customer/WishlistPage.js';
import OffersPage from './pages/customer/OffersPage.js';
import ContactPage from './pages/customer/ContactPage.js';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage.js';
import SignupPage from './pages/auth/SignupPage.js';

// Pages - Admin Portal
import AdminLoginPage from './pages/admin/AdminLoginPage.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import ProductManagement from './pages/admin/ProductManagement.js';
import OrderManagement from './pages/admin/OrderManagement.js';
import UsersManagementPage from './pages/admin/UsersManagementPage.js';
import AnalyticsPage from './pages/admin/AnalyticsPage.js';

// Pages - Business Portal
import BusinessLoginPage from './pages/business/BusinessLoginPage.js';
import BusinessDashboard from './pages/business/BusinessDashboard.js';
import InventoryPage from './pages/business/InventoryPage.js';
import ReportsPage from './pages/business/ReportsPage.js';

// Components
import ProtectedRoute from './components/common/ProtectedRoute.js';
import NotFoundPage from './pages/NotFoundPage.js';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Customer Portal Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="contact" element={<ContactPage />} />
            
            {/* Protected Customer Routes */}
            <Route path="cart" element={
              <ProtectedRoute userType="customer">
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="wishlist" element={
              <ProtectedRoute userType="customer">
                <WishlistPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute userType="admin">
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute userType="admin">
              <OrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute userType="admin">
              <UsersManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute userType="admin">
              <AnalyticsPage />
            </ProtectedRoute>
          } />

          {/* Business Portal Routes */}
          <Route path="/business/login" element={<BusinessLoginPage />} />
          <Route path="/business/dashboard" element={
            <ProtectedRoute userType="business">
              <BusinessDashboard />
            </ProtectedRoute>
          } />
          <Route path="/business/inventory" element={
            <ProtectedRoute userType="business">
              <InventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/business/reports" element={
            <ProtectedRoute userType="business">
              <ReportsPage />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;