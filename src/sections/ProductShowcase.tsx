import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from 'lucide-react'
import ProductDetail, { type ProductDetailData } from '../components/ProductDetail'

// ─── Types & Defaults ─────────────────────────────────────────────────────────

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
    id: 1,
    name: 'Snazzy Tee — T1',
    category: "Men's T-Shirts",
    description: 'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest.',
    bullets: ['Material: 100% combed ring-spun cotton, 220gsm', 'Care: Machine wash cold (30°C), inside out.'],
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Snazzy Tee — T2',
    category: "Men's T-Shirts",
    description: 'From the latest streetwear drop — bold embroidered branding on a relaxed-fit silhouette.',
    bullets: ['Material: 100% combed cotton, 220gsm. Boxy oversized fit.'],
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'New',
  },
  {
    id: 3,
    name: 'Snazzy Tee — T3',
    category: "Men's T-Shirts",
    description: 'Statement embroidery meets everyday comfort.',
    bullets: ['Material: 100% combed cotton, 220gsm. Regular fit.'],
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'Snazzy Tee — T4',
    category: "Men's T-Shirts",
    description: "Part of our limited seasonal run — once it's gone, it's gone.",
    bullets: ['Material: 100% combed cotton, 220gsm. Slim regular fit.'],
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Limited',
  },
  {
    id: 5,
    name: 'Snazzy Tee — T5',
    category: "Men's T-Shirts",
    description: 'Our heaviest tee — 260gsm fabric with a structured boxy silhouette.',
    bullets: ['Material: 100% combed cotton, 260gsm. Oversized boxy fit.'],
    images: ['/images/nobg/t5-front-nobg.png', '/images/nobg/t5-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bold',
  },
  {
    id: 6,
    name: "Women's Tee — G1",
    category: "Women's T-Shirts",
    description: 'A relaxed-fit tee in our softest cotton fabric, with delicate embroidery that elevates without overpowering.',
    bullets: ['Material: 100% combed cotton, 180gsm. Relaxed cropped fit.'],
    images: ['/images/nobg/grl-t1-front-nobg.png', '/images/nobg/grl-t1-back-nobg.png'],
    price: '₹1,399',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'New',
  },
  {
    id: 7,
    name: "Women's Tee — G2",
    category: "Women's T-Shirts",
    description: 'The dropped shoulder gives an effortless off-duty feel while the embroidered detail keeps it distinctly Snazzy.',
    bullets: ['Material: 100% combed cotton, 180gsm. Drop-shoulder construction.'],
    images: ['/images/nobg/grl-t2-front-nobg.png', '/images/nobg/grl-t2-back-nobg.png'],
    price: '₹1,399',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Popular',
  },
  {
    id: 8,
    name: 'Snazzy Hoodie',
    category: 'Hoodies',
    description: '380gsm fleece-lined fabric with precision chest embroidery, an adjustable drawstring hood.',
    bullets: ['Material: 80% cotton, 20% polyester, 380gsm. Fleece-lined interior.'],
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    price: '₹2,499',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bestseller',
  },
  {
    id: 9,
    name: 'Snazzy Sweatshirt',
    category: 'Sweatshirts',
    description: 'French terry construction meets artisan embroidery. The crewneck silhouette is clean and versatile.',
    bullets: ['Material: 80% cotton, 20% polyester, 320gsm. French terry loopback.'],
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    price: '₹1,999',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Artisan',
  },
]


const DETAIL_THEME = {
  bg: '#FAF5E8', text: '#1B3C34', accent: '#1B3C34',
  border: 'rgba(27,60,52,0.12)', subtleText: 'rgba(27,60,52,0.55)',
  font: 'light' as const, hideShadow: true,
}

// ─── Responsive Configuration ──────────────────────────────────────────────────
// All sizing/offset magic numbers are centralized here for easy tuning.
const BREAKPOINT_CONFIG = {
  mobile:  { height: 320, width: 220, scales: [1.0,  0.58, 0.38], offsets: [0,  84,  152] },
  tablet:  { height: 420, width: 300, scales: [1.05, 0.60, 0.40], offsets: [0, 160,  290] },
  desktop: { height: 490, width: 360, scales: [1.10, 0.62, 0.42], offsets: [0, 230,  420] },
}

// How far off-stage (in px) newly entering products start from, and exiting ones end at.
// Should be larger than the outermost offset to ensure they're fully hidden off-screen.
const ENTER_EXIT_OVERSHOOT = {
  mobile: 240, tablet: 430, desktop: 600,
}

// ─── Premium easing — smooth deceleration, reads fluid not mechanical ──────────
// [0.65, 0, 0.35, 1] = strong ease-in-out; feels intentional, not glitchy.
const PREMIUM_EASE = [0.65, 0, 0.35, 1] as const

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductShowcaseProps {
  products?: ShowcaseProduct[]
  autoplay?: boolean
  autoplayInterval?: number
  eyebrow?: string
  initialIndex?: number
  onProductClick?: (product: ShowcaseProduct) => void
  showFooter?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductShowcase({
  products = DEFAULT_SHOWCASE_PRODUCTS,
  autoplay = true,
  autoplayInterval = 3000,
  eyebrow = 'THE COLLECTION',
  initialIndex = 2,
  onProductClick,
  showFooter = true,
}: ProductShowcaseProps) {
  const total = products.length

  const [activeIndex, setActiveIndex] = useState(
    total > 0 ? Math.min(Math.max(initialIndex, 0), total - 1) : 0
  )
  // direction: +1 = forward (next), -1 = backward (prev)
  const [direction, setDirection] = useState<1 | -1>(1)

  const [selectedProduct, setSelectedProduct] = useState<ShowcaseProduct | null>(null)

  // Debounce guard — prevents overlapping animations
  const isAnimating = useRef(false)
  // Drag guard — set during a drag so dragEnd doesn't double-navigate
  const isDraggingRef = useRef(false)

  // ─── Responsive breakpoint ───────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpoint = windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop'
  const config = BREAKPOINT_CONFIG[breakpoint]
  const overshoot = ENTER_EXIT_OVERSHOOT[breakpoint]

  // ─── Reduced motion ──────────────────────────────────────────────────────────
  const prefersReducedMotion = useReducedMotion()
  const ANIM_DURATION = prefersReducedMotion ? 0 : autoplayInterval / 1000
  const transition = { duration: ANIM_DURATION, ease: PREMIUM_EASE }

  // ─── Single navigation function ──────────────────────────────────────────────
  // ALL navigation (autoplay, chevrons, dots, side-image clicks, drag) funnels here.
  const goToIndex = useCallback(
    (newIndex: number, dir: 1 | -1) => {
      if (total <= 1 || isAnimating.current) return
      const wrapped = ((newIndex % total) + total) % total
      isAnimating.current = true
      setDirection(dir)
      setActiveIndex(wrapped)
      // Allow user interaction to interrupt sooner than the full continuous duration
      setTimeout(() => { isAnimating.current = false }, 300)
    },
    [total]
  )

  const next = useCallback(() => goToIndex(activeIndex + 1,  1), [goToIndex, activeIndex])
  const prev = useCallback(() => goToIndex(activeIndex - 1, -1), [goToIndex, activeIndex])
  const jump = useCallback(
    (idx: number) => {
      if (idx === activeIndex) return
      const dir: 1 | -1 = idx > activeIndex ? 1 : -1
      goToIndex(idx, dir)
    },
    [goToIndex, activeIndex]
  )

  // Stable ref so the autoplay interval always calls the latest `next`
  // without the interval itself needing to restart on every index change.
  const nextRef = useRef(next)
  useEffect(() => { nextRef.current = next }, [next])

  // ─── Autoplay — runs continuously; only pauses when the detail modal is open ──
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || total <= 1 || selectedProduct !== null) return
    const timer = setInterval(() => nextRef.current(), autoplayInterval)
    return () => clearInterval(timer)
  }, [autoplay, prefersReducedMotion, total, selectedProduct, autoplayInterval])

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedProduct !== null) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, selectedProduct])

  // ─── Drag physics ────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDraggingRef.current = false
      // Combine displacement + momentum for a natural flick feel
      const swipe = info.offset.x + info.velocity.x * 0.4
      if (swipe < -50) next()
      else if (swipe > 50) prev()
    },
    [next, prev]
  )

  // ─── Image preloading ────────────────────────────────────────────────────────
  useEffect(() => {
    if (total === 0) return
    for (const off of [-2, -1, 1, 2]) {
      const idx = (activeIndex + off + total) % total
      const url = products[idx]?.images?.[0]
      if (url) { const img = new Image(); img.src = url }
    }
  }, [activeIndex, products, total])

  // ─── Slot style helpers ──────────────────────────────────────────────────────
  // Given a product's distance from center (signed), compute its target visual state.
  const getSlotTarget = useCallback(
    (distFromCenter: number, productId: number | string) => {
      const abs = Math.abs(distFromCenter)

      if (abs > 2) {
        // Off-stage: slide out in the correct direction + become invisible
        const x = Math.sign(distFromCenter) * overshoot
        return { x, scale: 0.28, opacity: 0, zIndex: 0 }
      }

      const scale  = config.scales[abs] ?? 0.28
      const xMag   = config.offsets[abs] ?? 0
      const x      = distFromCenter < 0 ? -xMag : xMag
      // [§3] Steeper opacity falloff — items are nearly invisible at abs=2 (no hard crop)
      const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.22
      const zIndex  = abs === 0 ? 30 : abs === 1 ? 20 : 10

      return { x, scale, opacity, zIndex }
    },
    [config, overshoot]
  )

  // Compute the initial (entering) position for a product that was just outside the ±2 window
  const getEnterInitial = useCallback(
    (distFromCenter: number, productId: number | string) => {
      // Enter from the far edge in the direction of travel
      const side = Math.sign(distFromCenter)
      return {
        x: side * overshoot,
        scale: 0.28,
        opacity: 0,
        zIndex: 0,
      }
    },
    [overshoot]
  )

  // ─── Visible product window ───────────────────────────────────────────────────
  // We render products in the range [activeIndex - 2, activeIndex + 2] (wrapping).
  // CRITICAL: We track them by a stable window to avoid unnecessary remounting.
  // The window expands by 1 on each side to allow enter/exit animations.
  const visibleOffsets = total > 1 ? [-3, -2, -1, 0, 1, 2, 3] : [0]

  // Build the list of visible products with their current distances from center
  const visibleProducts = visibleOffsets.map((off) => {
    const idx = ((activeIndex + off) % total + total) % total
    return { product: products[idx], distFromCenter: off }
  })

  // Early return for empty array
  if (total === 0) return null
  const activeProduct = products[activeIndex]

  // [§5] Map badge → editorial eyebrow label
  const eyebrowLabel =
    activeProduct.badge === 'New' || activeProduct.badge === 'Limited'
      ? 'New Arrival'
      : activeProduct.category ?? ''

  return (
    <>
      {/* [§6] Generous vertical breathing room — matches the reference's negative-space feel */}
      <section
        id="collection"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product Showcase"
        className="relative bg-[#FAF5E8] text-[#1B3C34] pt-20 md:pt-28 pb-0 overflow-hidden select-none"
      >
        {/* [§4] Atmospheric radial vignette — darkens toward frame edges, ~4% opacity */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 50% 55%, transparent 40%, rgba(27,60,52,0.04) 100%)',
          }}
        />

        {/*
          ── Header: Eyebrow → compact inline counter-with-arrows ──────────────────
          [§5] Structure per client reference:
            THE COLLECTION          ← eyebrow, centered
            ‹   03 / 09   ›         ← prev-arrow · counter · next-arrow, one inline unit
          Arrows are bare icon buttons — no border, no background, low opacity.
          The entire block is a tight centered column with generous mb before the stage.
        */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4 md:gap-5">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="font-inter text-[10px] md:text-[11px] font-medium tracking-[0.55em] uppercase text-[#1B3C34]/45">
              {eyebrow}
            </p>
          )}

          {/* Counter-with-arrows — single compact inline unit */}
          <div className="flex items-center gap-7 md:gap-9">
            {/* Prev arrow — bare, no background */}
            <button
              onClick={prev}
              aria-label="Previous product"
              className="group text-[#1B3C34]/35 hover:text-[#1B3C34]/80 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3C34] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5E8] rounded-sm"
            >
              <ChevronLeft
                className="w-4 h-4 md:w-[18px] md:h-[18px] transition-transform duration-200 group-hover:-translate-x-0.5"
                strokeWidth={1.0}
              />
            </button>

            {/* Counter — hairline Cormorant, wide tracking */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="font-cormorant font-light text-lg md:text-xl tracking-[0.5em] text-[#1B3C34]/60 tabular-nums select-none min-w-[90px] text-center"
            >
              {String(activeIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
            </div>

            {/* Next arrow — bare, no background */}
            <button
              onClick={next}
              aria-label="Next product"
              className="group text-[#1B3C34]/35 hover:text-[#1B3C34]/80 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3C34] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5E8] rounded-sm"
            >
              <ChevronRight
                className="w-4 h-4 md:w-[18px] md:h-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.0}
              />
            </button>
          </div>
        </div>

        {/* ── Carousel Stage ── */}
        {/* [§6] Generous gap from header to product row */}
        <div
          className="relative z-10 w-full max-w-6xl mx-auto flex items-end justify-center mt-14 md:mt-20 cursor-grab active:cursor-grabbing"
          style={{ height: config.height }}
        >




          {/* ── Drag Capture Layer (sits on top, captures all swipe gestures) ── */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => { isDraggingRef.current = true }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 z-50 w-full h-full"
            style={{ touchAction: 'pan-y', background: 'transparent' }}
          />

          {/* ── Side-click navigation zones (below drag layer so drag takes priority) ── */}
          {total > 1 && (
            <div className="absolute inset-0 z-40 flex pointer-events-none">
              <div
                className="w-1/3 h-full pointer-events-auto cursor-pointer"
                onClick={prev}
                role="button"
                aria-label="Previous product"
                tabIndex={-1}
              />
              <div className="w-1/3 h-full pointer-events-none" />
              <div
                className="w-1/3 h-full pointer-events-auto cursor-pointer"
                onClick={next}
                role="button"
                aria-label="Next product"
                tabIndex={-1}
              />
            </div>
          )}

          {/*
            ── Product Cards — keyed by product.id for true sliding animation ──
            THE KEY FIX: key={product.id} — NOT key={slotIndex} or key={`id-offset`}.
            Because the key is stable across renders, Framer Motion keeps the SAME
            DOM node and interpolates x/scale/opacity between old and new `animate`
            values, producing genuine left→right / right→left sliding.

            [§1] Baseline fix: `origin-bottom` + `absolute bottom-0` means every item
            anchors its bottom edge to the same baseline. Scale only grows upward.
            The ground shadow sits below the image, outside the clip.
          */}
          <AnimatePresence initial={false}>
            {visibleProducts.map(({ product, distFromCenter }) => {
              const isVisible = Math.abs(distFromCenter) <= 2
              const isCenter  = distFromCenter === 0
              const abs       = Math.abs(distFromCenter)
              const target    = getSlotTarget(distFromCenter, product.id)
              const initial   = getEnterInitial(distFromCenter, product.id)

              // [§2] Ground shadow — depth-scaled elliptical contact shadow.
              // Center item gets the strongest shadow; peripheral items get progressively fainter.
              const shadowOpacity = isCenter ? 0.13 : abs === 1 ? 0.07 : 0.03
              const shadowWidth   = isCenter ? '70%' : abs === 1 ? '55%' : '40%'

              return (
                <motion.div
                  key={product.id}
                  initial={initial}
                  animate={{
                    x: target.x,
                    scale: target.scale,
                    opacity: target.opacity,
                    zIndex: target.zIndex,
                  }}
                  exit={{
                    x: (distFromCenter < 0 ? -1 : 1) * overshoot * direction,
                    scale: 0.28,
                    opacity: 0,
                    zIndex: 0,
                    transition,
                  }}
                  transition={transition}
                  // [§1] origin-bottom + absolute bottom-0 establishes a shared baseline.
                  // Every garment's base edge lands at the same y — only scale varies.
                  className="absolute bottom-0 flex flex-col items-center justify-end origin-bottom group"
                  style={{
                    width: config.width,
                    height: '100%',
                    // Only let the center card receive pointer events from above
                    // the drag layer (Quick View button). Side clicks are handled
                    // by the click zones. This prevents z-index fighting.
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >


                  <div className="relative w-full h-full flex items-end justify-center pb-2">
                    <img
                      src={product.images?.[0] ?? ''}
                      alt={isCenter ? `View details for ${product.name}` : product.name}
                      draggable={false}
                      className={`w-full h-full object-contain object-bottom ${
                        isCenter ? 'group-hover:brightness-[1.03] transition-[filter] duration-500' : ''
                      }`}
                    />

                    {/* Quick View — only renders on the active center card */}
                    {isCenter && isVisible && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 0, y: 0 }}  // starts hidden; CSS group-hover reveals it
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onProductClick ? onProductClick(product) : setSelectedProduct(product)
                        }}
                        aria-label={`Quick view ${product.name}`}
                        className="absolute bottom-6 bg-[#1B3C34] text-[#FAF5E8] px-5 py-2.5 text-[10px] font-inter tracking-[0.3em] uppercase flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-300 cursor-pointer pointer-events-auto outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B3C34] focus-visible:ring-offset-[#FAF5E8]"
                      >
                        <Eye className="w-3 h-3" />
                        Quick View
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── Dot/Dash Pagination ── */}
        {/* [§6] Comfortable gap between stage bottom and pagination row */}
        <div className="flex items-center justify-center gap-2.5 md:gap-3.5 mt-12 md:mt-14" role="tablist">
          {products.map((p, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${p.name}`}
                onClick={() => jump(idx)}
                className="py-2 px-0.5 cursor-pointer group focus-visible:outline-none"
              >
                {/* [§7] Hairline dashes — 1px height, generous width for active */}
                <div
                  className={`transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-[#1B3C34] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#FAF5E8] ${
                    isActive
                      ? 'w-8 md:w-10 h-px bg-[#1B3C34]'
                      : 'w-3 md:w-4 h-px bg-[#1B3C34]/20 group-hover:bg-[#1B3C34]/40'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* ── Product name / price block ── */}
        {/* [§7] Generous gap from pagination dashes to title so they don't feel glued */}
        <div className="flex flex-col items-center justify-center mt-10 md:mt-12 pb-16 md:pb-20 text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: PREMIUM_EASE }}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => onProductClick ? onProductClick(activeProduct) : setSelectedProduct(activeProduct)}
            >
              {/* Eyebrow — category or editorial tag */}
              {eyebrowLabel && (
                <p className="font-inter text-[9px] md:text-[10px] font-medium tracking-[0.5em] uppercase text-[#1B3C34]/40 mb-1">
                  {eyebrowLabel}
                </p>
              )}
              {/* Product name — dominant, all-caps serif */}
              <h3 className="font-cormorant font-bold text-2xl md:text-3xl lg:text-[34px] tracking-[0.2em] uppercase text-[#1B3C34] leading-none">
                {activeProduct.name}
              </h3>
              {/* Price — lighter weight, smaller, clearly secondary */}
              <p className="font-cormorant font-light text-base md:text-lg tracking-[0.12em] text-[#1B3C34]/55 mt-0.5">
                {activeProduct.price}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer Action Bar ── */}
        {showFooter && (
          <div className="border-t border-[#1B3C34]/10">
            <a
              href="#contact"
              className="group max-w-6xl mx-auto px-6 py-5 md:py-6 flex items-center justify-between text-[#1B3C34] hover:text-[#1B3C34]/70 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3C34] focus-visible:ring-inset"
            >
              <span className="font-inter text-[11px] md:text-[12px] font-medium tracking-[0.45em] uppercase">
                GET IN TOUCH
              </span>
              <ArrowRight className="w-4 h-4 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.25} />
            </a>
          </div>
        )}
      </section>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct as ProductDetailData}
          theme={DETAIL_THEME}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
