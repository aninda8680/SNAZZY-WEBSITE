import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-[70] bg-white border-l border-[#1B3C34]/10 flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1B3C34]/10">
          <div className="flex items-center gap-3">
            <span className="font-inter text-xs tracking-[0.4em] uppercase text-[#1B3C34]">
              Your Bag
            </span>
            {count > 0 && (
              <span className="font-inter text-[10px] text-[#1B3C34]/50">
                ({count})
              </span>
            )}
          </div>
          <button onClick={closeCart} className="text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#1B3C34]/25">
              <ShoppingBag className="w-10 h-10" />
              <p className="font-inter text-xs tracking-[0.3em] uppercase">Your bag is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-5 border-b border-[#1B3C34]/10">
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-[#1B3C34] leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="font-inter text-xs text-[#1B3C34]/40 mt-1">
                    ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 border border-[#1B3C34]/20 flex items-center justify-center text-[#1B3C34]/50 hover:text-[#1B3C34] hover:border-[#1B3C34]/50 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-inter text-sm text-[#1B3C34] w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 border border-[#1B3C34]/20 flex items-center justify-center text-[#1B3C34]/50 hover:text-[#1B3C34] hover:border-[#1B3C34]/50 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-[#1B3C34]/20 hover:text-[#1B3C34]/60 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[#1B3C34]/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34]/40">Total</span>
              <span className="font-inter text-lg text-[#1B3C34]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-[#1B3C34] text-white font-inter text-[11px] tracking-[0.35em] uppercase flex items-center justify-center gap-2 hover:bg-[#0D2A23] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}

