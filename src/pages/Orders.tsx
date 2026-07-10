import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import api from '../api/client'

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

const STATUS_LABEL: Record<string, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

const STATUS_COLOR: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:  'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
}

interface OrderItem {
  quantity: number
  unit_price: number
  products: { id: number; name: string; image_url: string }
}

interface Address {
  full_name: string
  line1: string
  city: string
  state: string
  pincode: string
}

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  razorpay_order_id: string
  addresses: Address
  order_items: OrderItem[]
}

export default function Orders() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.get('/api/orders')
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: `${EMERALD}12` }}>
        <div className="max-w-2xl mx-auto px-5 py-5 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 -ml-2 transition-opacity active:opacity-50"
            style={{ color: `${EMERALD}60` }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bodoni text-[1.4rem] tracking-tight uppercase" style={{ color: EMERALD }}>
              My Orders
            </h1>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase mt-0.5" style={{ color: `${EMERALD}40` }}>
              Order History
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${EMERALD}30`, borderTopColor: 'transparent' }}
            />
            <p className="font-inter text-[11px] tracking-[0.3em] uppercase" style={{ color: `${EMERALD}40` }}>
              Loading orders…
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="font-inter text-sm" style={{ color: `${EMERALD}60` }}>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-5 text-center">
            <Package className="w-10 h-10" style={{ color: `${EMERALD}25` }} />
            <div>
              <p className="font-inter text-sm font-medium" style={{ color: `${EMERALD}70` }}>
                No orders yet
              </p>
              <p className="font-inter text-xs mt-1" style={{ color: `${EMERALD}40` }}>
                Your order history will appear here
              </p>
            </div>
            <Link
              to="/#shop"
              className="font-inter text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 transition-colors"
              style={{ background: EMERALD, color: CREAM }}
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* Order list */}
        {!loading && orders.length > 0 && (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => {
              const open = expanded === order.id
              const status = order.status || 'pending'
              return (
                <li key={order.id} className="border overflow-hidden" style={{ borderColor: `${EMERALD}12` }}>

                  {/* Order summary row */}
                  <button
                    className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
                    onClick={() => setExpanded(open ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`font-inter text-[9px] tracking-[0.25em] uppercase border px-2 py-0.5 ${STATUS_COLOR[status] || STATUS_COLOR.pending}`}
                        >
                          {STATUS_LABEL[status] || status}
                        </span>
                        <span className="font-inter text-[10px]" style={{ color: `${EMERALD}35` }}>
                          {fmt(order.created_at)}
                        </span>
                      </div>
                      <p className="font-inter text-[11px] truncate" style={{ color: `${EMERALD}45` }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="font-inter font-medium text-[15px] mt-1" style={{ color: EMERALD }}>
                        ₹{order.total_amount?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                      <div className="flex -space-x-2">
                        {order.order_items?.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 border-2 overflow-hidden flex-shrink-0"
                            style={{ borderColor: CREAM, background: `${EMERALD}10` }}
                          >
                            {item.products?.image_url && (
                              <img
                                src={item.products.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                              />
                            )}
                          </div>
                        ))}
                        {(order.order_items?.length ?? 0) > 3 && (
                          <div
                            className="w-8 h-8 border-2 flex items-center justify-center"
                            style={{ borderColor: CREAM, background: `${EMERALD}10` }}
                          >
                            <span className="font-inter text-[8px]" style={{ color: EMERALD }}>
                              +{order.order_items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      {open
                        ? <ChevronUp  className="w-4 h-4" style={{ color: `${EMERALD}40` }} />
                        : <ChevronDown className="w-4 h-4" style={{ color: `${EMERALD}40` }} />
                      }
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {open && (
                    <div className="border-t px-4 py-4" style={{ borderColor: `${EMERALD}10`, background: `${EMERALD}04` }}>

                      {/* Items */}
                      <p className="font-inter text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: `${EMERALD}40` }}>
                        Items
                      </p>
                      <ul className="flex flex-col gap-3 mb-5">
                        {order.order_items?.map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 flex-shrink-0 overflow-hidden"
                              style={{ background: `${EMERALD}10` }}
                            >
                              {item.products?.image_url && (
                                <img
                                  src={item.products.image_url}
                                  alt={item.products.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-inter text-[12px] truncate" style={{ color: EMERALD }}>
                                {item.products?.name}
                              </p>
                              <p className="font-inter text-[10px] mt-0.5" style={{ color: `${EMERALD}50` }}>
                                Qty {item.quantity} · ₹{item.unit_price?.toLocaleString('en-IN')} each
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Delivery address */}
                      {order.addresses && (
                        <>
                          <p className="font-inter text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: `${EMERALD}40` }}>
                            Delivery To
                          </p>
                          <p className="font-inter text-[12px] leading-[1.7]" style={{ color: `${EMERALD}65` }}>
                            {order.addresses.full_name}<br />
                            {order.addresses.line1}, {order.addresses.city}<br />
                            {order.addresses.state} — {order.addresses.pincode}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
