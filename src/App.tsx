import { BrowserRouter, Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Main site
import MainLayout from './layouts/MainLayout'
import DropShell from './layouts/DropShell'
import { TransitionProvider } from './context/TransitionContext'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Shop pages
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import About from './pages/About'
import Collections from './pages/Collections'
import Account from './pages/Account'
import ProductPage from './pages/ProductPage'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TransitionProvider>
            <Routes>
              {/* Main storefront */}
              <Route path="/" element={<MainLayout />} />

              {/* Drop Experience */}
              <Route path="/drop/:id" element={<DropShell />} />

              {/* About and Collections */}
              <Route path="/about" element={<About />} />
              <Route path="/collections" element={<Collections />} />
              
              {/* Product Page */}
              <Route path="/product/:slug" element={<ProductPage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Checkout (requires login) */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            {/* Admin (requires admin role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            </Routes>
          </TransitionProvider>
          </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
