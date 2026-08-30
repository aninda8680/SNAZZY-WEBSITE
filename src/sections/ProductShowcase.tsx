import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useMotionValue, animate, useTransform, MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from 'lucide-react'
import ProductDetail, { type ProductDetailData } from '../components/ProductDetail'

// --- Types & Defaults ---------------------------------------------------------

export interface ShowcaseProduct extends Omit<Partial<ProductDetailData>, 'id'> {
  id: number | string
  name: string
  price: string
  images: string[]
  category?: string
  description?: string
  bullets?: string[]
  sizes?: string[]
  badge?: string
}

export const DEFAULT_SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 1, name: 'Snazzy Tee — T1', category: "Men's T-Shirts",
    description: 'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest.',
    bullets: ['Material: 100% combed ring-spun cotton, 220gsm', 'Care: Machine wash cold (30°C), inside out.'],
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    price: '₹1,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Bestseller',
  },
  {
    id: 2, name: 'Snazzy Tee — T2', category: "Men's T-Shirts",
    description: 'From the latest streetwear drop — bold embroidered branding on a relaxed-fit silhouette.',
    bullets: ['Material: 100% combed cotton, 220gsm. Boxy oversized fit.'],
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    price: '₹1,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'New',
  },
  {
    id: 3, name: 'Snazzy Tee — T3', category: "Men's T-Shirts",
    description: 'Statement embroidery meets everyday comfort.',
    bullets: ['Material: 100% combed cotton, 220gsm. Regular fit.'],
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    price: '₹1,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Popular',
  },
  {
    id: 4, name: 'Snazzy Tee — T4', category: "Men's T-Shirts",
    description: "Part of our limited seasonal run — once it's gone, it's gone.",
    bullets: ['Material: 100% combed cotton, 220gsm. Slim regular fit.'],
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    price: '₹1,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Limited',
  },
  {
    id: 5, name: 'Snazzy Tee — T5', category: "Men's T-Shirts",
    description: 'Our heaviest tee — 260gsm fabric with a structured boxy silhouette.',
    bullets: ['Material: 100% combed cotton, 260gsm. Oversized boxy fit.'],
    images: ['/images/nobg/t5-front-nobg.png', '/images/nobg/t5-back-nobg.png'],
    price: '₹1,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Bold',
  },
  {
    id: 6, name: "Women's Tee — G1", category: "Women's T-Shirts",
    description: 'A relaxed-fit tee in our softest cotton fabric, with delicate embroidery that elevates without overpowering.',
    bullets: ['Material: 100% combed cotton, 180gsm. Relaxed cropped fit.'],
    images: ['/images/nobg/grl-t1-front-nobg.png', '/images/nobg/grl-t1-back-nobg.png'],
    price: '₹1,399', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'New',
  },
  {
    id: 7, name: "Women's Tee — G2", category: "Women's T-Shirts",
    description: 'The dropped shoulder gives an effortless off-duty feel while the embroidered detail keeps it distinctly Snazzy.',
    bullets: ['Material: 100% combed cotton, 180gsm. Drop-shoulder construction.'],
    images: ['/images/nobg/grl-t2-front-nobg.png', '/images/nobg/grl-t2-back-nobg.png'],
    price: '₹1,399', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Popular',
  },
  {
    id: 8, name: 'Snazzy Hoodie', category: 'Hoodies',
    description: 'A heavyweight French terry hoodie built for year-round comfort with a clean, minimal Snazzy aesthetic.',
    bullets: ['Material: 100% combed cotton, 320gsm French terry. Relaxed fit.'],
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    price: '₹2,499', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Fan Favourite',
  },
  {
    id: 9, name: 'Snazzy Sweatshirt', category: 'Sweatshirts',
    description: 'Structured premium fabric meets relaxed Snazzy tailoring. A versatile piece that transitions effortlessly.',
    bullets: ['Material: 100% combed cotton, 300gsm. Regular fit.'],
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    price: '₹1,799', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], badge: 'Classic',
  },
]

const DETAIL_THEME = {
  bg: '#FAF5E8', text: '#1B3C34', accent: '#1B3C34',
  border: 'rgba(27,60,52,0.12)', subtleText: 'rgba(27,60,52,0.55)',
  font: 'light' as const, hideShadow: true,
}

const BREAKPOINT_CONFIG = {
  mobile:  { height: 390, width: 190, scales: [1.00, 0.72, 0.50], offsets: [0, 95, 160] },
  tablet:  { height: 460, width: 300, scales: [1.00, 0.68, 0.46], offsets: [0, 155, 265] },
  desktop: { height: 520, width: 360, scales: [1.00, 0.65, 0.44], offsets: [0, 200, 340] },
}
const ENTER_EXIT_OVERSHOOT = { mobile: 280, tablet: 460, desktop: 640 }

const EASE = [0.76, 0, 0.24, 1] as const

// --- Continuous Math ---------------------------------------------------------

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const getSlotContinuous = (dist: number, config: any, overshoot: number) => {
  const abs = Math.abs(dist)
  if (abs >= 3) return { x: Math.sign(dist) * overshoot, scale: 0.28, opacity: 0, zIndex: 0, brightness: 0.88 }
  
  const floor = Math.floor(abs)
  const ceil = Math.ceil(abs)
  const frac = abs - floor
  
  const getVals = (a: number) => {
    if (a >= 3) return { xMag: overshoot, scale: 0.28, opacity: 0, zIndex: 0, brightness: 0.88 }
    const xMag = config.offsets[a] ?? (config.offsets[2] + 100)
    const scale = config.scales[a] ?? 0.28
    const opacity = a === 0 ? 1 : a === 1 ? 0.65 : a === 2 ? 0.22 : 0
    const zIndex = a === 0 ? 30 : a === 1 ? 20 : 10
    const brightness = a === 0 ? 1 : a === 1 ? 0.94 : 0.88
    return { xMag, scale, opacity, zIndex, brightness }
  }
  
  const v1 = getVals(floor)
  const v2 = getVals(ceil)
  
  const xMag = lerp(v1.xMag, v2.xMag, frac)
  const x = dist < 0 ? -xMag : xMag
  
  return {
    x,
    scale: lerp(v1.scale, v2.scale, frac),
    opacity: lerp(v1.opacity, v2.opacity, frac),
    zIndex: frac < 0.5 ? v1.zIndex : v2.zIndex,
    brightness: lerp(v1.brightness, v2.brightness, frac)
  }
}

const ContinuousCard = ({ 
  product, 
  index, 
  progress, 
  total, 
  config, 
  overshoot,
  isCenterHovered
}: { 
  product: ShowcaseProduct, 
  index: number, 
  progress: MotionValue<number>, 
  total: number, 
  config: any, 
  overshoot: number,
  isCenterHovered: boolean
}) => {
  const dist = useTransform(progress, (val) => {
    let d = (index - val) % total
    d = (d + total) % total
    if (d > total / 2) d -= total
    return d
  })

  const slot = useTransform(dist, (d) => getSlotContinuous(d, config, overshoot))
  
  const x = useTransform(slot, (s) => s.x)
  const scale = useTransform(slot, (s) => s.scale)
  const opacity = useTransform(slot, (s) => s.opacity)
  const zIndex = useTransform(slot, (s) => s.zIndex)
  const filter = useTransform(slot, (s) => `brightness(${s.brightness})`)
  
  const quickViewOpacity = useTransform(dist, (d) => Math.abs(d) < 0.2 && isCenterHovered ? 1 : 0)
  const quickViewY = useTransform(dist, (d) => Math.abs(d) < 0.2 && isCenterHovered ? 0 : 8)

  return (
    <motion.div
      style={{ x, scale, opacity, zIndex, width: config.width, height: '100%', position: 'absolute', bottom: 0 }}
      className="origin-bottom flex flex-col items-center justify-end group pointer-events-none"
    >
      <div className="relative w-full h-full flex items-end justify-center pb-2 pointer-events-none">
        <motion.img
          src={product.images?.[0] ?? ''}
          alt={product.name}
          draggable={false}
          className="w-full h-full object-contain object-bottom"
          style={{ filter }}
        />
        <motion.div
          style={{ opacity: quickViewOpacity, y: quickViewY }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-6 bg-[#1B3C34] text-[#FAF5E8] px-5 py-2.5 text-[10px] font-inter tracking-[0.3em] uppercase flex items-center gap-2 shadow-lg transition-all duration-300 pointer-events-none"
        >
          <Eye className="w-3 h-3" />
          Quick View
        </motion.div>
      </div>
    </motion.div>
  )
}

export interface ProductShowcaseProps {
  products?: ShowcaseProduct[]
  autoplay?: boolean
  autoplayInterval?: number
  eyebrow?: string
  initialIndex?: number
  onProductClick?: (product: ShowcaseProduct) => void
}

export default function ProductShowcase({
  products = DEFAULT_SHOWCASE_PRODUCTS,
  autoplay = true,
  autoplayInterval = 3500,
  eyebrow = 'THE COLLECTION',
  initialIndex = 2,
  onProductClick,
}: ProductShowcaseProps) {
  const total = products.length
  
  // The absolute track position
  const progress = useMotionValue(initialIndex)
  
  // Derived active state for text and dots
  const [activeIndex, setActiveIndex] = useState(
    total > 0 ? Math.min(Math.max(initialIndex, 0), total - 1) : 0
  )
  
  const [selectedProduct, setSelectedProduct] = useState<ShowcaseProduct | null>(null)

  const isDraggingRef = useRef(false)
  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const progressOnDragStart = useRef(initialIndex)
  const dragAxis = useRef<'h' | 'v' | null>(null)
  // Touch handlers for mobile (no overlay div — keeps native scroll intact)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const [isCenterHovered, setIsCenterHovered] = useState(false)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const bp = windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop'
  const config = BREAKPOINT_CONFIG[bp]
  const overshoot = ENTER_EXIT_OVERSHOOT[bp]
  const isMobile = bp === 'mobile'

  const prefersReducedMotion = useReducedMotion()
  const ANIM_DURATION = prefersReducedMotion ? 0 : 0.5
  const transition = { duration: ANIM_DURATION, ease: EASE }

  const next = useCallback(() => {
    if (total <= 1) return
    const nextTarget = Math.round(progress.get()) + 1
    animate(progress, nextTarget, transition)
    setActiveIndex(((nextTarget % total) + total) % total)
  }, [progress, total, transition])

  const prev = useCallback(() => {
    if (total <= 1) return
    const prevTarget = Math.round(progress.get()) - 1
    animate(progress, prevTarget, transition)
    setActiveIndex(((prevTarget % total) + total) % total)
  }, [progress, total, transition])

  const jump = useCallback((idx: number) => {
    if (idx === activeIndex) return
    const current = progress.get()
    const currentMod = ((Math.round(current) % total) + total) % total
    let diff = (idx - currentMod) % total
    diff = (diff + total) % total
    if (diff > total / 2) diff -= total
    const target = Math.round(current) + diff
    
    animate(progress, target, transition)
    setActiveIndex(((target % total) + total) % total)
  }, [progress, total, transition, activeIndex])

  const nextRef = useRef(next)
  useEffect(() => { nextRef.current = next }, [next])

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || total <= 1 || selectedProduct) return
    const t = setInterval(() => nextRef.current(), autoplayInterval)
    return () => clearInterval(t)
  }, [autoplay, prefersReducedMotion, total, selectedProduct, autoplayInterval])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedProduct) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, selectedProduct])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false
    pointerStartX.current = e.clientX
    pointerStartY.current = e.clientY
    progressOnDragStart.current = progress.get()
    dragAxis.current = null
    // NOTE: Do NOT setPointerCapture here — doing so immediately blocks native
    // vertical scroll. We capture only once we confirm a horizontal drag below.
  }, [progress])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const dx = e.clientX - pointerStartX.current
    const dy = e.clientY - pointerStartY.current
    const el = e.currentTarget as HTMLElement

    // Axis not yet determined — wait until movement is clear enough
    if (!dragAxis.current) {
      if (Math.abs(dx) > Math.abs(dy) + 4) {
        dragAxis.current = 'h'
        // Only capture pointer once we're sure it's a horizontal swipe
        el.setPointerCapture(e.pointerId)
      } else if (Math.abs(dy) > Math.abs(dx) + 4) {
        dragAxis.current = 'v'
        // Vertical — release capture so the browser can scroll natively
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      }
      return
    }

    if (dragAxis.current === 'v') return
    if (!el.hasPointerCapture(e.pointerId)) return

    if (Math.abs(dx) > 5) isDraggingRef.current = true
    e.preventDefault()

    // Scale drag distance: dragging 1 item width = 1 progress unit
    const dragScale = dx / (config.width * 0.8)
    progress.set(progressOnDragStart.current - dragScale)
  }, [progress, config.width])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const dx = e.clientX - pointerStartX.current
    dragAxis.current = null
    setTimeout(() => { isDraggingRef.current = false }, 50)
    
    if (Math.abs(dx) < 8) {
      // It was a tap, snap back to nearest
      const target = Math.round(progress.get())
      animate(progress, target, transition)
      setActiveIndex(((target % total) + total) % total)
      return
    }
    
    // It was a drag, use swipe thresholds
    let target = Math.round(progress.get())
    if (dx < -40) target = Math.round(progressOnDragStart.current) + 1
    else if (dx > 40) target = Math.round(progressOnDragStart.current) - 1
    
    animate(progress, target, transition)
    setActiveIndex(((target % total) + total) % total)
  }, [progress, transition, total])

  useEffect(() => {
    if (total === 0) return
    products.forEach(p => {
      const url = p.images?.[0]
      if (url) { const img = new Image(); img.src = url }
    })
  }, [products, total])

  if (total === 0) return null
  const activeProduct = products[activeIndex]

  const handleDragLayerClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const w = rect.width
    if (x < w / 3) prev()
    else if (x > (w * 2) / 3) next()
    else onProductClick ? onProductClick(activeProduct) : setSelectedProduct(activeProduct)
  }

  const idxStr   = String(activeIndex + 1).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  const DragLayer = (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleDragLayerClick}
      onMouseEnter={() => setIsCenterHovered(true)}
      onMouseLeave={() => setIsCenterHovered(false)}
      className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
    />
  )

  const Cards = (
    <div className="absolute inset-0 flex justify-center pointer-events-none">
      {products.map((product, idx) => (
        <ContinuousCard
          key={product.id}
          product={product}
          index={idx}
          progress={progress}
          total={total}
          config={config}
          overshoot={overshoot}
          isCenterHovered={isCenterHovered}
        />
      ))}
    </div>
  )

  return (
    <>
      <ProductDetail
        product={selectedProduct as ProductDetailData | null}
        onClose={() => setSelectedProduct(null)}
        theme={DETAIL_THEME}
      />

      <section
        id="collection"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product Showcase"
        className="relative bg-[#FAF5E8] select-none"
        style={{ paddingTop: isMobile ? '3.5rem' : '5rem', overflowX: 'clip' }}
      >

        {/* Ambient orb */}
        <AnimatePresence>
          <motion.div
            key={`orb-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              width: isMobile ? 500 : 800,
              height: isMobile ? 500 : 800,
              borderRadius: '50%',
              top: isMobile ? -120 : -200,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(circle, rgba(27,60,52,0.07) 0%, transparent 68%)',
              filter: 'blur(50px)',
            }}
          />
        </AnimatePresence>

        {/* --- DESKTOP --- */}
        {!isMobile && (
          <div
            className="relative z-10 w-full max-w-[1440px] mx-auto flex items-stretch"
            style={{ minHeight: config.height + 100 }}
          >
            {/* Left: editorial text */}
            <div
              className="flex flex-col justify-center pl-14 lg:pl-24 pr-8 flex-shrink-0"
              style={{ width: 280 }}
            >
              <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-[#1B3C34]/38 mb-10">
                {eyebrow}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.36, ease: EASE }}
                >
                  {/* Ghost index */}
                  <p
                    className="font-cormorant font-light leading-none tracking-tight text-[#1B3C34] select-none mb-3"
                    style={{ fontSize: 96, opacity: 0.06 }}
                  >
                    {idxStr}
                  </p>
                  <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#1B3C34]/32 mb-4">
                    {activeProduct.category}
                  </p>
                  <h2 className="font-cormorant font-semibold text-[26px] lg:text-[30px] uppercase leading-snug tracking-wide text-[#1B3C34] mb-2">
                    {activeProduct.name}
                  </h2>
                  <p className="font-cormorant text-[22px] text-[#1B3C34]/55 mb-7">
                    {activeProduct.price}
                  </p>
                  {activeProduct.badge && (
                    <span className="inline-block font-inter text-[8px] tracking-[0.4em] uppercase px-3 py-1.5 border border-[#1B3C34]/18 text-[#1B3C34]/45 mb-7">
                      {activeProduct.badge}
                    </span>
                  )}
                  <button
                    onClick={() => onProductClick ? onProductClick(activeProduct) : setSelectedProduct(activeProduct)}
                    className="group flex items-center gap-2.5 font-inter text-[9px] tracking-[0.35em] uppercase text-[#1B3C34]/45 hover:text-[#1B3C34] transition-colors duration-300 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center: fan stage */}
            <div
              className="flex-1 relative flex items-end justify-center"
              style={{ height: config.height + 100 }}
            >
              {DragLayer}
              {Cards}
            </div>

            {/* Right: counter + vertical nav */}
            <div
              className="flex flex-col justify-center items-end pr-14 lg:pr-24 pl-8 flex-shrink-0 gap-10"
              style={{ width: 220 }}
            >
              {/* Square arrow buttons + counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-8 h-8 flex items-center justify-center border border-[#1B3C34]/15 text-[#1B3C34]/38 hover:border-[#1B3C34]/45 hover:text-[#1B3C34]/75 transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.2} />
                </button>
                <span className="font-cormorant font-light text-sm tracking-[0.3em] text-[#1B3C34]/45 tabular-nums min-w-[48px] text-center">
                  {idxStr} / {totalStr}
                </span>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-8 h-8 flex items-center justify-center border border-[#1B3C34]/15 text-[#1B3C34]/38 hover:border-[#1B3C34]/45 hover:text-[#1B3C34]/75 transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.2} />
                </button>
              </div>

              {/* Vertical dashes */}
              <div className="flex flex-col items-end gap-2.5" role="tablist">
                {products.map((p, idx) => {
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to ${p.name}`}
                      onClick={() => jump(idx)}
                      className="cursor-pointer py-1 px-0.5 focus-visible:outline-none"
                    >
                      <motion.div
                        animate={{ width: isActive ? 30 : 10, backgroundColor: isActive ? '#1B3C34' : 'rgba(27,60,52,0.2)' }}
                        transition={{ duration: 0.4, ease: EASE }}
                        style={{ height: 1 }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Thin separator below desktop stage */}
        {!isMobile && (
          <div className="pb-16 md:pb-20" />
        )}

        {/* --- MOBILE --- */}
        {isMobile && (
          <div className="relative z-10 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3 mb-5 px-4">
              <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-[#1B3C34]/38">
                {eyebrow}
              </p>
              <div className="flex items-center gap-5">
                <button onClick={prev} aria-label="Previous"
                  className="text-[#1B3C34]/32 hover:text-[#1B3C34]/65 transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.2} />
                </button>
                <span className="font-cormorant font-light text-base tracking-[0.4em] text-[#1B3C34]/50 tabular-nums min-w-[56px] text-center">
                  {idxStr} / {totalStr}
                </span>
                <button onClick={next} aria-label="Next"
                  className="text-[#1B3C34]/32 hover:text-[#1B3C34]/65 transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4" strokeWidth={1.2} />
                </button>
              </div>
            </div>

            {/* Fan Stage — touch handled directly on container, no overlay */}
            <div
              className="relative w-full flex items-end justify-center"
              style={{ height: config.height, touchAction: 'pan-y' }}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX
                touchStartY.current = e.touches[0].clientY
                progressOnDragStart.current = progress.get()
                isDraggingRef.current = false
              }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchStartX.current
                const dy = e.changedTouches[0].clientY - touchStartY.current
                // Only treat as horizontal swipe if clearly more horizontal than vertical
                if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 30) {
                  isDraggingRef.current = true
                  let target = Math.round(progressOnDragStart.current)
                  if (dx < 0) target = Math.round(progressOnDragStart.current) + 1
                  else target = Math.round(progressOnDragStart.current) - 1
                  animate(progress, target, transition)
                  setActiveIndex(((target % total) + total) % total)
                  setTimeout(() => { isDraggingRef.current = false }, 300)
                }
              }}
              onClick={(e) => {
                if (isDraggingRef.current) return
                onProductClick ? onProductClick(activeProduct) : setSelectedProduct(activeProduct)
              }}
            >
              {Cards}
            </div>

            {/* Dash pagination */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {products.map((p, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button key={p.id} onClick={() => jump(idx)} aria-label={`Go to ${p.name}`}
                    className="py-2 px-0.5 cursor-pointer focus-visible:outline-none">
                    <motion.div
                      animate={{ width: isActive ? 26 : 9, backgroundColor: isActive ? '#1B3C34' : 'rgba(27,60,52,0.2)' }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{ height: 1 }}
                    />
                  </button>
                )
              })}
            </div>

            {/* Product info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col items-center text-center px-6 pt-5 pb-14 gap-1"
              >
                {activeProduct.badge && (
                  <span className="font-inter text-[8px] tracking-[0.45em] uppercase text-[#1B3C34]/38 mb-0.5">
                    {activeProduct.badge}
                  </span>
                )}
                <h2 className="font-cormorant font-semibold text-[22px] uppercase tracking-wide text-[#1B3C34]">
                  {activeProduct.name}
                </h2>
                <p className="font-cormorant text-[18px] text-[#1B3C34]/52 mb-4">
                  {activeProduct.price}
                </p>
                <button
                  onClick={() => onProductClick ? onProductClick(activeProduct) : setSelectedProduct(activeProduct)}
                  className="flex items-center gap-2 font-inter text-[9px] tracking-[0.35em] uppercase text-[#1B3C34]/45 hover:text-[#1B3C34] transition-colors duration-200 cursor-pointer group"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  )
}
