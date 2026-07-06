import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('order')

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: CREAM }}
    >
      <CheckCircle className="w-16 h-16 mb-6" style={{ color: EMERALD }} />
      <h1 className="font-bodoni font-black text-4xl mb-3" style={{ color: EMERALD }}>Order Placed!</h1>
      <p className="font-inter text-sm mb-2" style={{ color: `${EMERALD}60` }}>
        Thank you for shopping with SNAZZY.
      </p>
      {orderId && (
        <p className="font-inter text-xs mb-8" style={{ color: `${EMERALD}40` }}>
          Order ID: {orderId}
        </p>
      )}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="font-inter font-bold text-[11px] tracking-[0.3em] uppercase px-8 py-4 transition-all"
          style={{ background: EMERALD, color: CREAM }}
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="font-inter text-[11px] tracking-[0.3em] uppercase px-8 py-4 border transition-all"
          style={{ borderColor: `${EMERALD}30`, color: EMERALD }}
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}
