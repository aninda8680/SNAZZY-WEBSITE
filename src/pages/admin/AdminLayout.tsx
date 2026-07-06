import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0f0f0f] border-r border-white/[0.07] flex flex-col">
        <div className="px-6 py-6 border-b border-white/[0.07]">
          <p className="font-bodoni font-black text-white text-lg tracking-wide">SNAZZY</p>
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-emerald-500 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm font-inter text-xs tracking-[0.15em] uppercase transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="px-3 py-3 border-t border-white/[0.07] mb-3">
            <p className="font-inter text-xs text-white/50 truncate">{user?.full_name}</p>
            <p className="font-inter text-[10px] text-white/25 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-sm font-inter text-xs tracking-[0.15em] uppercase text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
