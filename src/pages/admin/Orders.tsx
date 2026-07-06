import { useEffect, useState } from 'react'
import api from '../../api/client'

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending:    'text-yellow-400 bg-yellow-400/10',
  paid:       'text-green-400 bg-green-400/10',
  processing: 'text-blue-400 bg-blue-400/10',
  shipped:    'text-purple-400 bg-purple-400/10',
  delivered:  'text-emerald-400 bg-emerald-400/10',
  cancelled:  'text-red-400 bg-red-400/10',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/orders')
      .then((r) => setOrders(r.data.orders || []))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(orderId: string, status: string) {
    await api.put(`/api/admin/orders/${orderId}/status`, { status })
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
  }

  return (
    <div className="p-8">
      <h1 className="font-bodoni font-black text-3xl text-white mb-8">Orders</h1>

      {loading ? (
        <div className="flex items-center gap-3 text-white/40">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-inter text-sm">Loading…</span>
        </div>
      ) : orders.length === 0 ? (
        <p className="font-inter text-white/30 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-inter text-xs text-white/30 mb-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                  <p className="font-bodoni font-bold text-white text-lg">
                    ₹{(order.total_amount / 100).toLocaleString('en-IN')}
                  </p>
                  <p className="font-inter text-xs text-white/40 mt-1">
                    {order.users?.full_name || '—'} · {order.users?.email || '—'}
                  </p>
                  {order.addresses && (
                    <p className="font-inter text-xs text-white/30 mt-0.5">
                      {order.addresses.city}, {order.addresses.state}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(order.order_items || []).map((item: any, i: number) => (
                      <span key={i} className="font-inter text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded">
                        {item.products?.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`font-inter text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-[#111] border border-white/10 rounded-sm px-3 py-1.5 font-inter text-xs text-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <p className="font-inter text-[10px] text-white/20 max-w-[140px] text-right truncate">
                    {order.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
