import { useEffect, useState } from 'react'
import { Package, ShoppingCart, Users, IndianRupee } from 'lucide-react'
import api from '../../api/client'

interface Stats {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/stats')
      .then((r) => setStats(r.data.stats))
      .finally(() => setLoading(false))
  }, [])

  const tiles = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: '#34d399' },
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#93C5FD' },
        { label: 'Customers', value: stats.totalUsers, icon: Users, color: '#86EFAC' },
        {
          label: 'Revenue (paid)',
          value: `₹${(stats.totalRevenue / 100).toLocaleString('en-IN')}`,
          icon: IndianRupee,
          color: '#F9A8D4',
        },
      ]
    : []

  return (
    <div className="p-8">
      <h1 className="font-bodoni font-black text-3xl text-white mb-8">Dashboard</h1>

      {loading ? (
        <div className="flex items-center gap-3 text-white/40">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-inter text-sm">Loading stats…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {tiles.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-inter text-xs tracking-[0.2em] uppercase text-white/40">{label}</p>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="font-bodoni font-bold text-3xl text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
