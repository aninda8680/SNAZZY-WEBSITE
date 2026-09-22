import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock, Minus, Plus, RotateCcw, ShoppingBag, Trash2, Truck, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useSmoothScroll } from '../hooks'
import { Navbar, Cart as CartDrawer, Footer, TopographicBackground } from '../components'
import { useCart } from '../context/CartContext'
import { MAIN_PRODUCTS } from '../data/products'

const EMERALD = '#1B3C34'
const CREAM = '#FAF5E8'
const FREE_SHIP_AT = 1999
const SHIP_FLAT = 99

function inr(n: number) { return `₹${n.toLocaleString('en-IN')}` }
function sizeOf(id: string, fallback?: string) {
  if (fallback) return fallback
  const parts = id.split('-')
  return parts.length > 1 ? parts[parts.length - 1] : 'M'
}
function nameOf(name: string) { return name.split(' / ')[0] }
function PromoBar({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIP_AT - subtotal)
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_AT) * 100))
  return (
    <div className="border border-[#1B3C34]/12 bg-white/60 backdrop-blur-sm px-5 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1B3C34] text-[#FAF5E8] flex-shrink-0">
          <Truck className="w-4 h-4" />
        </span>
        <p className="font-inter text-[11px] md:text-xs tracking-wide text-[#1B3C34]/80 leading-relaxed">
          {left > 0 ? (<>Add <span className="font-semibold text-[#1B3C34]">{inr(left)}</span> more for <span className="font-semibold text-[#1B3C34]">FREE shipping</span></>) : (<><span className="font-semibold text-[#1B3C34]">FREE shipping unlocked</span> — nicely done.</>)}
        </p>
      </div>
      <div className="mt-3 h-[3px] bg-[#1B3C34]/10 overflow-hidden rounded-full">
        <motion.div className="h-full bg-[#1B3C34] rounded-full" initial={false} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>
    </div>
  )
}
export default function Cart() {
  useSmoothScroll()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const { items, updateQty, removeItem, clearCart, total, count } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponMsg, setCouponMsg] = useState<string | null>(null)
  const shipping = useMemo(() => {
    if (items.length === 0) return 0
    return total >= FREE_SHIP_AT ? 0 : SHIP_FLAT
  }, [items.length, total])
  const grand = total + shipping
  const youMayLike = useMemo(() => {
    const inCart = new Set(items.map((i) => String(i.slug ?? i.id.split('-')[0])))
    return MAIN_PRODUCTS.filter((p) => !inCart.has(String(p.id)) && !inCart.has(p.slug)).slice(0, 4)
  }, [items])
  function applyCoupon() {
    const code = coupon.trim().toUpperCase()
    if (!code) { setCouponMsg('Enter a code to apply.'); return }
    if (code === 'SNAZZY10') setCouponMsg('SNAZZY10 noted — 10% off will apply at checkout for supporters.')
    else if (code === 'FREESHIP') setCouponMsg('FREESHIP noted — shipping is already on us above ₹1,999.')
    else setCouponMsg(`"${code}" is not valid yet — new drops bring new codes.`)
  }
  const empty = items.length === 0
  return (
    <div className="relative bg-[#FAF5E8] text-[#1B3C34] overflow-x-clip min-h-screen">
      <TopographicBackground />
      <div className="relative z-10">
        <Navbar alwaysSolid theme="light" />
        <CartDrawer />
        <div className="pt-14 md:pt-16">
          <section className="w-full px-5 md:px-8 pt-10 md:pt-14 pb-6 md:pb-8" aria-label="Bag header">
            <div className="max-w-[1200px] mx-auto">
              <button onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34]/55 hover:text-[#1B3C34] transition-colors mb-6">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Continue shopping
              </button>
              <div className="flex items-end justify-between gap-4 border-b border-[#1B3C34]/10 pb-5 md:pb-7">
                <div>
                  <p className="font-inter text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-[#1B3C34]/55 mb-3">Snazzy &nbsp;/&nbsp; Your selection</p>
                  <h1 className="font-cormorant font-semibold uppercase tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(2.4rem, 8vw, 5rem)' }}>
                    Your Bag <span className="font-inter font-light text-sm md:text-base tracking-[0.2em] text-[#1B3C34]/45 align-middle">({count} {count === 1 ? 'item' : 'items'})</span>
                  </h1>
                </div>
                {!empty && (
                  <button onClick={() => setConfirmClear(true)} className="hidden sm:inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.25em] uppercase text-[#1B3C34]/45 hover:text-[#1B3C34] transition-colors pb-1">
                    <RotateCcw className="w-3.5 h-3.5" />Clear bag
                  </button>
                )}
              </div>
            </div>
          </section>
          {empty ? (
            <section className="px-5 md:px-8 pb-20 md:pb-28">
              <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8 items-stretch">
                <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="border border-[#1B3C34]/12 bg-white/50 px-8 py-12 md:p-14 text-center flex flex-col items-center justify-center">
                  <span className="w-16 h-16 rounded-full border border-[#1B3C34]/15 flex items-center justify-center mb-6 text-[#1B3C34]/50">
                    <ShoppingBag className="w-6 h-6" strokeWidth={1.25} />
                  </span>
                  <h2 className="font-cormorant text-3xl md:text-4xl mb-3">Your bag is empty</h2>
                  <p className="font-inter font-light text-sm leading-7 text-[#1B3C34]/55 max-w-[340px] mb-8">Every stitch is a story. Start yours with the new-season embroidered essentials.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to="/collections" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B3C34] text-[#FAF5E8] font-inter text-[11px] tracking-[0.35em] uppercase hover:bg-[#0D2A23] transition-colors">Shop the collection<ArrowRight className="w-4 h-4" /></Link>
                    <Link to="/" className="inline-flex items-center px-8 py-4 border border-[#1B3C34]/25 font-inter text-[11px] tracking-[0.35em] uppercase text-[#1B3C34]/80 hover:border-[#1B3C34] transition-colors">Home</Link>
                  </div>
                </motion.div>
                <div className="border border-[#1B3C34]/12 overflow-hidden relative min-h-[320px]">
                  <img src={MAIN_PRODUCTS[0]?.images?.[0]} alt="Snazzy signature tee" className="absolute inset-0 w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C34]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-white/60 mb-2">Bestseller</p>
                      <p className="font-cormorant text-2xl text-white leading-tight">{MAIN_PRODUCTS[0]?.name}</p>
                    </div>
                    <Link to={MAIN_PRODUCTS[0] ? `/product/${MAIN_PRODUCTS[0].slug}` : '/collections'} className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34] bg-[#FAF5E8] px-5 py-3 hover:bg-white transition-colors">View</Link>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="px-5 md:px-8 pb-20 md:pb-28">
              <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
                <div className="space-y-5">
                  <PromoBar subtotal={total} />
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const size = sizeOf(item.id, item.size)
                      const title = nameOf(item.name)
                      const line = item.priceNum * item.quantity
                      return (
                        <motion.article key={item.id} layout={!prefersReducedMotion} initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="group border border-[#1B3C34]/12 bg-white/55 backdrop-blur-sm hover:bg-white/80 transition-colors">
                          <div className="flex gap-4 md:gap-6 p-4 md:p-5">
                            <Link to={item.slug ? `/product/${item.slug}` : '/collections'} className="relative w-[104px] h-[132px] md:w-[132px] md:h-[168px] flex-shrink-0 overflow-hidden bg-[#1B3C34]/5" aria-label={`View ${title}`}>
                              {item.image ? (<img src={item.image} alt={title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')} />) : (<span className="w-full h-full flex items-center justify-center text-[#1B3C34]/25"><ShoppingBag className="w-6 h-6" /></span>)}
                              <span className="absolute top-2 left-2 font-inter text-[8px] tracking-[0.25em] uppercase bg-[#FAF5E8]/90 backdrop-blur px-2 py-1 text-[#1B3C34]/75">{item.category ?? 'Snazzy'}</span>
                            </Link>
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="font-inter text-[9px] tracking-[0.35em] uppercase text-[#1B3C34]/45 mb-1.5">Size — <span className="text-[#1B3C34] font-semibold">{size}</span></p>
                                  <Link to={item.slug ? `/product/${item.slug}` : '/collections'} className="font-cormorant text-xl md:text-2xl leading-tight hover:underline underline-offset-4 decoration-[#1B3C34]/20 block truncate">{title}</Link>
                                  <p className="font-inter text-[11px] text-[#1B3C34]/50 mt-1">220gsm embroidered cotton · ships in 5–7 days</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} aria-label={`Remove ${title}`} className="p-2 -m-1 text-[#1B3C34]/30 hover:text-[#1B3C34] hover:bg-[#1B3C34]/5 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                              </div>
                              <div className="mt-auto pt-4 flex items-center justify-between gap-3 flex-wrap">
                                <div className="inline-flex items-center border border-[#1B3C34]/20">
                                  <button onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease quantity" className="w-9 h-9 flex items-center justify-center text-[#1B3C34]/60 hover:bg-[#1B3C34] hover:text-[#FAF5E8] transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="w-8 text-center font-inter text-sm tabular-nums">{item.quantity}</span>
                                  <button onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase quantity" className="w-9 h-9 flex items-center justify-center text-[#1B3C34]/60 hover:bg-[#1B3C34] hover:text-[#FAF5E8] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="text-right">
                                  <p className="font-cormorant text-xl md:text-2xl leading-none">{inr(line)}</p>
                                  <p className="font-inter text-[10px] text-[#1B3C34]/45 mt-1 tracking-wide">{item.price} each</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      )
                    })}
                  </AnimatePresence>
                  <div className="flex items-center justify-between pt-1">
                    <button onClick={() => setConfirmClear(true)} className="sm:hidden inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.25em] uppercase text-[#1B3C34]/45"><RotateCcw className="w-3.5 h-3.5" /> Clear bag</button>
                    <Link to="/collections" className="inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.25em] uppercase text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors ml-auto"><ArrowLeft className="w-3.5 h-3.5" /> Keep shopping</Link>
                  </div>
                  <div className="border border-[#1B3C34]/12 bg-white/40 px-5 py-5">
                    <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34]/55 mb-3 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Have a code?</p>
                    <div className="flex gap-2">
                      <input value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponMsg(null) }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon() } }} placeholder="TRY SNAZZY10" className="flex-1 bg-transparent border border-[#1B3C34]/20 focus:border-[#1B3C34] outline-none px-4 py-3 font-inter text-xs tracking-[0.2em] uppercase placeholder:text-[#1B3C34]/30 transition-colors" />
                      <button onClick={applyCoupon} className="px-6 py-3 border border-[#1B3C34] font-inter text-[10px] tracking-[0.3em] uppercase hover:bg-[#1B3C34] hover:text-[#FAF5E8] transition-colors">Apply</button>
                    </div>
                    {couponMsg && (<p className="font-inter text-xs text-[#1B3C34]/60 mt-3 leading-relaxed">{couponMsg}</p>)}
                  </div>
                </div>
                <aside className="lg:sticky lg:top-24 border border-[#1B3C34]/12 bg-[#1B3C34] text-[#FAF5E8] overflow-hidden">
                  <div className="p-6 md:p-7">
                    <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#FAF5E8]/55 mb-5">Order summary</p>
                    <div className="space-y-3 font-inter text-[13px]">
                      <div className="flex justify-between text-[#FAF5E8]/75"><span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span><span className="tabular-nums text-[#FAF5E8]">{inr(total)}</span></div>
                      <div className="flex justify-between text-[#FAF5E8]/75"><span>Shipping</span><span className="tabular-nums text-[#FAF5E8]">{shipping === 0 ? 'FREE' : inr(shipping)}</span></div>
                      <div className="flex justify-between text-[#FAF5E8]/50 text-xs"><span>Duties and taxes</span><span>Calculated at checkout</span></div>
                    </div>
                    <div className="my-5 h-px bg-[#FAF5E8]/15" />
                    <div className="flex items-end justify-between mb-6">
                      <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#FAF5E8]/60">Total</span>
                      <span className="font-cormorant text-4xl leading-none">{inr(grand)}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="group w-full py-4 bg-[#FAF5E8] text-[#1B3C34] font-inter text-[11px] tracking-[0.35em] uppercase font-semibold flex items-center justify-center gap-2 hover:bg-white transition-colors">
                      <Lock className="w-3.5 h-3.5" />Secure checkout<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <Link to="/collections" className="mt-3 w-full py-3.5 border border-[#FAF5E8]/25 font-inter text-[10px] tracking-[0.35em] uppercase text-[#FAF5E8]/80 hover:bg-[#FAF5E8]/10 hover:text-[#FAF5E8] transition-colors flex items-center justify-center">Continue shopping</Link>
                    <div className="mt-6 space-y-3">
                      <p className="flex items-start gap-2.5 font-inter text-[11px] leading-5 text-[#FAF5E8]/55"><Truck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#FAF5E8]/70" />Free shipping over ₹1,999 · 5–7 day delivery</p>
                      <p className="flex items-start gap-2.5 font-inter text-[11px] leading-5 text-[#FAF5E8]/55"><ShieldCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#FAF5E8]/70" />Secure Razorpay checkout · 7-day returns</p>
                    </div>
                  </div>
                  <div className="px-6 md:px-7 py-4 bg-black/20 flex items-center justify-between">
                    <span className="font-inter text-[8px] tracking-[0.25em] uppercase text-[#FAF5E8]/40">Visa · MC · UPI · Razorpay</span>
                    <span className="font-inter text-[8px] tracking-[0.25em] uppercase text-[#FAF5E8]/40">256-bit secured</span>
                  </div>
                </aside>
              </div>
              {youMayLike.length > 0 && (
                <div className="max-w-[1200px] mx-auto mt-14 md:mt-20">
                  <div className="flex items-end justify-between border-b border-[#1B3C34]/10 pb-4 mb-6">
                    <h2 className="font-cormorant text-2xl md:text-3xl uppercase tracking-tight">Complete the fit</h2>
                    <Link to="/collections" className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34]/50 hover:text-[#1B3C34] transition-colors hidden sm:block">View all</Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {youMayLike.map((p) => (
                      <button key={p.id} onClick={() => navigate(`/product/${p.slug}`)} className="group text-left">
                        <span className="block relative aspect-[3/4] overflow-hidden bg-[#1B3C34]/5 mb-3">
                          <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')} />
                          {p.badge && (<span className="absolute top-2.5 left-2.5 font-inter text-[8px] tracking-[0.25em] uppercase bg-[#FAF5E8]/85 backdrop-blur px-2 py-1 text-[#1B3C34]/75">{p.badge}</span>)}
                        </span>
                        <span className="block font-inter text-[11px] tracking-[0.08em] uppercase leading-snug truncate">{p.name}</span>
                        <span className="block font-cormorant text-lg mt-0.5">{p.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
          <Footer transparent />
        </div>
      </div>
      <AnimatePresence>
        {confirmClear && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/45" onClick={() => setConfirmClear(false)} />
            <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="relative max-w-sm w-full p-7 text-center" style={{ background: CREAM, color: EMERALD }}>
              <button onClick={() => setConfirmClear(false)} aria-label="Close" className="absolute top-3 right-3 p-2 opacity-40 hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
              <p className="font-cormorant text-2xl mb-2">Clear your bag?</p>
              <p className="font-inter text-xs leading-6 opacity-60 mb-6">This removes all {count} {count === 1 ? 'item' : 'items'}. You can re-add them from the collection anytime.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmClear(false)} className="flex-1 py-3.5 border font-inter text-[10px] tracking-[0.3em] uppercase transition-colors" style={{ borderColor: `${EMERALD}30` }}>Keep items</button>
                <button onClick={() => { clearCart(); setConfirmClear(false) }} className="flex-1 py-3.5 font-inter text-[10px] tracking-[0.3em] uppercase text-white transition-colors hover:opacity-90" style={{ background: EMERALD }}>Clear all</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
