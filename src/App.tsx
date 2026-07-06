import { BrowserRouter, Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Main site
import MainLayout from './layouts/MainLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Shop pages
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Main storefront */}
            <Route path="/" element={<MainLayout />} />

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
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
