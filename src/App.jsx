import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from './layouts/PublicLayout';
import { useAuth } from './contexts/AuthContext';
import Spinner from './components/ui/Spinner';
import NotFound from './pages/NotFound';

// صفحه‌های عمومی
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));

// پنل کاربری
const CustomerLayout = lazy(() => import('./layouts/CustomerLayout'));
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const CustomerOrders = lazy(() => import('./pages/customer/Orders'));
const CustomerOrderDetail = lazy(() => import('./pages/customer/OrderDetail'));
const CustomerWishlist = lazy(() => import('./pages/customer/Wishlist'));
const CustomerAddresses = lazy(() => import('./pages/customer/Addresses'));
const CustomerInvoices = lazy(() => import('./pages/customer/Invoices'));
const CustomerTickets = lazy(() => import('./pages/customer/Tickets'));
const CustomerNotifications = lazy(() => import('./pages/customer/Notifications'));
const CustomerProfile = lazy(() => import('./pages/customer/Profile'));
const CustomerSecurity = lazy(() => import('./pages/customer/Security'));
const CustomerSettings = lazy(() => import('./pages/customer/Settings'));
const CustomerTrackOrder = lazy(() => import('./pages/customer/TrackOrder'));

// پنل مدیریت
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/OrderDetail'));
const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminRoles = lazy(() => import('./pages/admin/Roles'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));
const AdminActivity = lazy(() => import('./pages/admin/Activity'));
const AdminLogs = lazy(() => import('./pages/admin/Logs'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={40} />
    </div>
  );
}


function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/panel" replace />;
  }
  return children;
}

export default function App() {
  useEffect(()=>{
  console.log(`%c
┌───────────────────────────────────────────────────┐
│                                                   │
│    ██╗   ██╗ ██████╗ ███████╗██╗   ██╗███████╗    │
│    ╚██╗ ██╔╝██╔═══██╗██╔════╝██║   ██║██╔════╝    │
│     ╚████╔╝ ██║   ██║███████╗██║   ██║█████╗      │
│      ╚██╔╝  ██║   ██║╚════██║██║   ██║██╔══╝      │
│       ██║   ╚██████╔╝███████║╚██████╔╝██║         │
│       ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝         │
│                                                   │
└───────────────────────────────────────────────────┘
`, `
color: #FF3B30;
font-weight: bold;
font-family:Consolas, monospace;
`);

console.log(`%c build pix by pix by yosufSalehZadeh❤️`,`color: #fff200;`);

},[])

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ---------- عمومی ---------- */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Route>

        {/* ---------- پنل کاربری ---------- */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:id" element={<CustomerOrderDetail />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="addresses" element={<CustomerAddresses />} />
          <Route path="invoices" element={<CustomerInvoices />} />
          <Route path="tickets" element={<CustomerTickets />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="security" element={<CustomerSecurity />} />
          <Route path="settings" element={<CustomerSettings />} />
          <Route path="track" element={<CustomerTrackOrder />} />
        </Route>

        {/* ---------- پنل مدیریت ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
