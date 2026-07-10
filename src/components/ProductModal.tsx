import { useState, useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

export interface ProductDetail {
  id: number
  name: string
  tagline: string
  category: string
  price: string
  priceNum: number
  image: string
  hoverImage?: string
  badge?: string
  description: string
  sizes: string[]
  material: string
  care: string
}

interface Props {
  product: ProductDetail | null
  onClose: () => void
}

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-[#1B3C34]/10">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34]/50">
          {title}
        </span>
        {open
          ? <ChevronUp   className="w-3 h-3 flex-shrink-0 text-[#1B3C34]/35" />
          : <ChevronDown className="w-3 h-3 flex-shrink-0 text-[#1B3C34]/35" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-inter font-light text-sm leading-7 text-[#1B3C34]/50">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductModal({ product, onClose }: Props) {
  const [imgIndex,     setImgIndex]     = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError,    setSizeError]    = useState(false)
  const [added,        setAdded]        = useState(false)
  const [isMobile,     setIsMobile]     = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const { addItem } = useCart()
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollYRef    = useRef(0)

  const images = product
    ? [product.image, ...(product.hoverImage ? [product.hoverImage] : [])]
    : []

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => () => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
  }, [])

  useEffect(() => {
    setImgIndex(0)
    setSelectedSize(null)
    setSizeError(false)
    setAdded(false)
  }, [product?.id])

  useEffect(() => {
    if (product) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top      = `-${scrollYRef.current}px`
      document.body.style.width    = '100%'
      window.dispatchEvent(new Event('lenis-pause'))
    } else {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      window.scrollTo(0, scrollYRef.current)
      window.dispatchEvent(new Event('lenis-resume'))
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      window.dispatchEvent(new Event('lenis-resume'))
    }
  }, [product])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight')  setImgIndex((i) => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft')   setImgIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, images.length])

  function handleAddToBag() {
    if (!selectedSize) {
      setSizeError(true)
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
      errorTimerRef.current = setTimeout(() => setSizeError(false), 2000)
      return
    }
    if (!product) return
    addItem({
      id:       `${product.id}-${selectedSize}`,
      name:     `${product.name} / ${selectedSize}`,
      price:    product.price,
      priceNum: product.priceNum,
      accent:   EMERALD,
    })
    setAdded(true)
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    addedTimerRef.current = setTimeout(() => setAdded(false), 2200)
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Panel — full-screen on mobile (slides up), right sidebar on desktop (slides in) */}
          <motion.div
            className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[92vw] lg:w-[82vw] max-w-5xl flex flex-col md:flex-row"
            style={{ background: CREAM }}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* ══════════════════════════════════════
                MOBILE LAYOUT — full-screen, stacked
                ══════════════════════════════════════ */}
            <div className="md:hidden flex flex-col h-full">

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">

                {/* Full-bleed image — true 100vw, no padding */}
                <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imgIndex}
                      src={images[imgIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                    />
                  </AnimatePresence>

                  {/* Cream image bg placeholder */}
                  <div className="absolute inset-0 -z-10" style={{ background: `${EMERALD}0a` }} />

                  {/* Close — top right */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center"
                    style={{ background: `${CREAM}e0` }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" style={{ color: EMERALD }} />
                  </button>

                  {/* Image navigation */}
                  {imgIndex > 0 && (
                    <button
                      onClick={() => setImgIndex((i) => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
                      style={{ background: `${CREAM}cc` }}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" style={{ color: EMERALD }} />
                    </button>
                  )}
                  {imgIndex < images.length - 1 && (
                    <button
                      onClick={() => setImgIndex((i) => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
                      style={{ background: `${CREAM}cc` }}
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" style={{ color: EMERALD }} />
                    </button>
                  )}

                  {/* Dot indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className="w-1.5 h-1.5 transition-all duration-200"
                          style={{ background: i === imgIndex ? EMERALD : `${EMERALD}40` }}
                          aria-label={`Photo ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product details — cream bg, emerald text */}
                <div className="px-5 pt-6 pb-6" style={{ background: CREAM }}>

                  <p className="font-inter text-[10px] tracking-[0.45em] uppercase mb-2" style={{ color: `${EMERALD}60` }}>
                    {product.category}
                  </p>

                  {/* Bodoni Moda serif heading — Zara-style editorial */}
                  <h2 className="font-bodoni text-[1.6rem] uppercase tracking-[0.04em] leading-tight mb-4" style={{ color: EMERALD }}>
                    {product.name}
                  </h2>

                  <p className="font-inter font-light text-2xl mb-0.5" style={{ color: EMERALD }}>
                    {product.price}
                  </p>
                  <p className="font-inter text-[9px] tracking-[0.3em] uppercase mb-7" style={{ color: `${EMERALD}40` }}>
                    Incl. of all taxes
                  </p>

                  <div className="border-t border-[#1B3C34]/10 mb-6" />

                  <p className="font-inter font-light text-sm leading-[1.85]  mb-8" style={{ color: `${EMERALD}65` }}>
                    {product.description}
                  </p>

                  {/* SIZE — vertical stacked list with 1px dividers */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-inter text-[10px] tracking-[0.4em] uppercase" style={{ color: `${EMERALD}50` }}>
                        Select Size
                      </p>
                      {sizeError && (
                        <span className="font-inter text-[10px] tracking-wide text-red-600">
                          Please select a size
                        </span>
                      )}
                    </div>

                    {/* Vertical size rows — 1px hairline separators */}
                    <div className="border-t border-[#1B3C34]/10">
                      {product.sizes.map((size) => {
                        const sel = selectedSize === size
                        return (
                          <button
                            key={size}
                            onClick={() => { setSelectedSize(size); setSizeError(false) }}
                            className="w-full flex items-center justify-between py-4 border-b border-[#1B3C34]/10 transition-colors duration-150"
                            style={{ background: sel ? `${EMERALD}0a` : 'transparent' }}
                          >
                            <span
                              className="font-inter text-sm tracking-[0.25em] uppercase"
                              style={{ color: sel ? EMERALD : `${EMERALD}60` }}
                            >
                              {size}
                            </span>
                            {sel && (
                              <span className="w-1.5 h-1.5" style={{ background: EMERALD }} />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Accordions */}
                  <Accordion title="Material & Fabric">{product.material}</Accordion>
                  <Accordion title="Care Instructions">{product.care}</Accordion>
                  <Accordion title="Shipping & Returns">
                    Free shipping on orders above ₹1,999. Standard delivery in 5–7 business days.
                    Returns accepted within 7 days of delivery — unworn, tags intact.
                  </Accordion>

                </div>
              </div>

              {/* ── Sticky "ADD TO BAG" footer ── */}
              <div
                className="flex-shrink-0 px-5 py-4 border-t border-[#1B3C34]/10"
                style={{ background: CREAM }}
              >
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 font-inter text-[11px] tracking-[0.5em] uppercase flex items-center justify-center gap-3 transition-all duration-200"
                  style={
                    added
                      ? { background: `${EMERALD}b0`, color: CREAM }
                      : { background: EMERALD, color: CREAM }
                  }
                >
                  <ShoppingBag className="w-4 h-4" />
                  {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
                </button>
              </div>

            </div>

            {/* ══════════════════════════════════════
                DESKTOP LAYOUT — left image / right detail
                ══════════════════════════════════════ */}
            <div className="hidden md:flex flex-row w-full h-full">

              {/* Left: image viewer */}
              <div className="relative flex-shrink-0 w-[58%] h-full bg-[#F2F2F0] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIndex}
                    src={images[imgIndex]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                  />
                </AnimatePresence>

                {imgIndex > 0 && (
                  <button
                    onClick={() => setImgIndex((i) => i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#1B3C34]/70" />
                  </button>
                )}
                {imgIndex < images.length - 1 && (
                  <button
                    onClick={() => setImgIndex((i) => i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5 text-[#1B3C34]/70" />
                  </button>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                        style={{ background: i === imgIndex ? EMERALD : `${EMERALD}40` }}
                        aria-label={`Photo ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 right-5">
                    <span className="font-inter text-[9px] tracking-[0.35em] uppercase text-[#1B3C34]/30">
                      {imgIndex === 0 ? 'Front' : 'Back'} · {imgIndex + 1}/{images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: product details */}
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto bg-[#FAF5E8]">

                <div className="flex items-center justify-between px-7 pt-6 pb-3 flex-shrink-0">
                  <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-[#1B3C34]/35">
                    {product.category}
                  </p>
                  <button
                    onClick={onClose}
                    className="p-2.5 -m-1 text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-7 pb-10 flex flex-col">

                  <h2 className="font-bodoni text-2xl uppercase tracking-wide text-[#1B3C34] leading-tight mt-1 mb-3">
                    {product.name}
                  </h2>

                  <p className="font-inter text-xl text-[#1B3C34] mb-0.5">{product.price}</p>
                  <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#1B3C34]/35 mb-5">
                    MRP Incl. of all taxes
                  </p>

                  <div className="border-t border-[#1B3C34]/10 mb-6" />

                  <p className="font-inter font-light text-sm leading-7 text-[#1B3C34]/55 mb-6">
                    {product.description}
                  </p>

                  {/* Desktop: horizontal size bubbles */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34]/50">Size</p>
                      {sizeError && (
                        <span className="font-inter text-[10px] text-red-500 tracking-wide animate-pulse">
                          Please select a size
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const sel = selectedSize === size
                        return (
                          <button
                            key={size}
                            onClick={() => { setSelectedSize(size); setSizeError(false) }}
                            className="h-11 px-4 min-w-[44px] font-inter text-xs tracking-wider uppercase transition-all duration-150 border"
                            style={{
                              borderColor: sel ? EMERALD : `${EMERALD}25`,
                              background:  sel ? EMERALD : 'transparent',
                              color:       sel ? CREAM   : `${EMERALD}80`,
                            }}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddToBag}
                    className="w-full py-4 font-inter text-[11px] tracking-[0.45em] uppercase flex items-center justify-center gap-2.5 border transition-all duration-200 mb-6"
                    style={
                      added
                        ? { background: EMERALD, borderColor: EMERALD, color: CREAM }
                        : { background: 'transparent', borderColor: EMERALD, color: EMERALD }
                    }
                    onMouseEnter={(e) => {
                      if (!added) {
                        e.currentTarget.style.background = EMERALD
                        e.currentTarget.style.color      = CREAM
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!added) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color      = EMERALD
                      }
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {added ? 'Added to Bag ✓' : 'Add to Bag'}
                  </button>

                  <Accordion title="Material & Fabric">{product.material}</Accordion>
                  <Accordion title="Care Instructions">{product.care}</Accordion>
                  <Accordion title="Shipping & Returns">
                    Free shipping on orders above ₹1,999. Standard delivery in 5–7 business days.
                    Returns accepted within 7 days of delivery — unworn, tags intact.
                  </Accordion>

                </div>
              </div>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
