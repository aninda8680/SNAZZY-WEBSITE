import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const FREE_SHIP_AT = 1999

function inr(n: number) { return `₹${n.toLocaleString('en-IN')}` }
function sizeOf(id: string, fallback?: string) {
  if (fallback) return fallback
  const parts = id.split('-')
  return parts.length > 1 ? parts[parts.length - 1] : undefined
}
function nameOf(name: string) { return name.split(' / ')[0] }

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    closeCart()
    navigate('/checkout')
  }

  function handleViewBag() {
    closeCart()
    navigate('/cart')
  }

  const left = Math.max(0, FREE_SHIP_AT - total)
  const pct = Math.min(100, Math.round((total / FREE_SHIP_AT) * 100))

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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#1B3C34]/25 py-10">
              <ShoppingBag className="w-10 h-10" />
              <p className="font-inter text-xs tracking-[0.3em] uppercase">Your bag is empty</p>
              <button onClick={handleViewBag} className="font-inter text-[10px] tracking-[0.3em] uppercase underline underline-offset-4 text-[#1B3C34]/60">
                Explore the collection
              </button>
            </div>
          ) : (
            <>
              <div className="border border-[#1B3C34]/10 bg-[#FAF5E8] px-4 py-3 mb-2">
                <p className="flex items-center gap-2 font-inter text-[10px] text-[#1B3C34]/70">
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  {left > 0 ? (<span>Add <b>{inr(left)}</b> for FREE shipping</span>) : (<b>FREE shipping unlocked</b>)}
                </p>
                <div className="mt-2 h-[2px] bg-[#1B3C34]/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#1B3C34]" initial={false} animate={{ width: `${pct}%` }} />
                </div>
              </div>
              <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }} className="flex items-center gap-4 py-5 border-b border-[#1B3C34]/10">
                  <button onClick={handleViewBag} className="w-16 h-20 flex-shrink-0 overflow-hidden bg-[#1B3C34]/5" aria-label="View item">
                    {item.image ? (<img src={item.image} alt={nameOf(item.name)} className="w-full h-full object-cover object-top" />) : (<span className="w-full h-full flex items-center justify-center text-[#1B3C34]/25"><ShoppingBag className="w-5 h-5" /></span>)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm text-[#1B3C34] leading-tight truncate">{nameOf(item.name)}</p>
                    <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#1B3C34]/45 mt-1">
                      {sizeOf(item.id, item.size) ? `Size ${sizeOf(item.id, item.size)} · ` : ''}{inr(item.priceNum)} each
                    </p>
                    <p className="font-inter text-xs text-[#1B3C34] mt-1 font-medium">{inr(item.priceNum * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease" className="w-7 h-7 border border-[#1B3C34]/20 flex items-center justify-center text-[#1B3C34]/50 hover:text-[#1B3C34] transition-all"><Minus className="w-3 h-3" /></button>
                    <span className="font-inter text-sm text-[#1B3C34] w-4 text-center tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase" className="w-7 h-7 border border-[#1B3C34]/20 flex items-center justify-center text-[#1B3C34]/50 hover:text-[#1B3C34] transition-all"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => removeItem(item.id)} aria-label="Remove" className="ml-2 text-[#1B3C34]/20 hover:text-[#1B3C34]/60 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[#1B3C34]/10 space-y-3 bg-[#FAF5E8]">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34]/40">Subtotal</span>
              <span className="font-cormorant text-2xl text-[#1B3C34]">{inr(total)}</span>
            </div>
            <p className="font-inter text-[10px] text-[#1B3C34]/45">Shipping + taxes at checkout · free over ₹1,999</p>
            <button onClick={handleCheckout} className="w-full py-4 bg-[#1B3C34] text-white font-inter text-[11px] tracking-[0.35em] uppercase flex items-center justify-center gap-2 hover:bg-[#0D2A23] transition-colors">
              <ShoppingBag className="w-4 h-4" />Proceed to Checkout
            </button>
            <button onClick={handleViewBag} className="w-full py-3.5 border border-[#1B3C34]/25 font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34] flex items-center justify-center gap-2 hover:border-[#1B3C34] transition-colors">
              View Bag<ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

