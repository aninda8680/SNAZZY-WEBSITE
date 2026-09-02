import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useMotionValue, animate, useTransform, MotionValue } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MAIN_PRODUCTS, type ProductData as ShowcaseProduct } from '../data/products'

// =============================================================================
// MOBILE BENTO GRID — Tap-to-Expand, All-Visible
// Native CSS Grid with Framer Motion shared layout transitions.
// =============================================================================

function MobileBentoGrid({
  products,
  eyebrow,
  onProductClick,
}: {
  products: ShowcaseProduct[]
  eyebrow: string
  onProductClick?: (p: ShowcaseProduct) => void
}) {
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const navigate = useNavigate()
  const prefersRM = useReducedMotion()

  return (
    <div className="relative min-h-[72vh] flex flex-col pt-10 pb-6 px-5 select-none overflow-hidden">
      {/* Ambient Orb */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div style={{
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(27,60,52,0.08) 0%, transparent 68%)',
          filter: 'blur(20px)',
          transform: focusedIdx !== null ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>

      {/* Header — fades out when a card is focused */}
      <AnimatePresence>
        {focusedIdx === null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex justify-between items-center mb-5 z-10"
          >
            <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-[#1B3C34]/40">
              {eyebrow}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full flex-1 flex flex-col justify-center z-10">
        <AnimatePresence mode="wait">
          {focusedIdx === null ? (
            // COLLAPSED: Asymmetric Bento Grid
            <motion.div
              key="grid"
              className="grid gap-2 w-full h-full"
              style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                minHeight: '60vh',
                maxHeight: '68vh',
              }}
            >
              {products.map((product, idx) => (
                <BentoCell
                  key={product.id}
                  product={product}
                  index={idx}
                  onClick={() => setFocusedIdx(idx)}
                  prefersRM={!!prefersRM}
                />
              ))}
            </motion.div>
          ) : (
            // EXPANDED: Focused Card + Thumbnails
            <motion.div
              key="expanded"
              className="flex flex-col w-full h-full"
              style={{ minHeight: '60vh', maxHeight: '68vh' }}
            >
              <ExpandedCard
                product={products[focusedIdx]}
                index={focusedIdx}
                onClose={() => setFocusedIdx(null)}
                onNavigate={() => onProductClick ? onProductClick(products[focusedIdx]) : navigate(`/product/${products[focusedIdx].slug}`)}
                prefersRM={!!prefersRM}
              />

              {/* Thumbnails Strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-2 w-full mt-4 justify-center items-end flex-shrink-0"
                style={{ height: 50 }}
              >
                {products.map((p, idx) => {
                  const isFocus = idx === focusedIdx
                  return (
                    <motion.div
                      key={p.id}
                      layoutId={isFocus || prefersRM ? undefined : `bento-card-${p.id}`}
                      onClick={() => setFocusedIdx(idx)}
                      whileTap={isFocus ? {} : { scale: 0.94 }}
                      className={`relative rounded overflow-hidden flex-shrink-0 cursor-pointer transition-opacity duration-300 ${isFocus ? 'opacity-100' : 'opacity-70'}`}
                      style={{ width: isFocus ? 50 : 44, height: isFocus ? 50 : 44 }}
                    >
                      <img
                        src={p.images?.[0] ?? ''}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      {isFocus && (
                        <motion.div
                          layoutId={prefersRM ? undefined : "active-thumb-indicator"}
                          className="absolute bottom-0 inset-x-0 h-[3px] bg-[#1B3C34]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function BentoCell({ product, index, onClick, prefersRM }: any) {
  // Asymmetric spans for a 3x4 grid accommodating 6 items perfectly
  const getGridStyles = (idx: number) => {
    switch(idx) {
      case 0: return { gridColumn: 'span 2', gridRow: 'span 2' }
      case 1: return { gridColumn: 'span 1', gridRow: 'span 1' }
      case 2: return { gridColumn: 'span 1', gridRow: 'span 1' }
      case 3: return { gridColumn: 'span 1', gridRow: 'span 2' }
      case 4: return { gridColumn: 'span 2', gridRow: 'span 1' }
      case 5: return { gridColumn: 'span 2', gridRow: 'span 1' }
      default: return { gridColumn: 'span 1', gridRow: 'span 1' }
    }
  }

  return (
    <motion.div
      layoutId={prefersRM ? undefined : `bento-card-${product.id}`}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="relative rounded-[4px] overflow-hidden cursor-pointer"
      style={{
        background: '#FAF5E8',
        WebkitTapHighlightColor: 'transparent',
        ...getGridStyles(index),
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <img src={product.images?.[0] ?? ''} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C34]/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Ghost index */}
      <span className="absolute top-1.5 left-2 font-cormorant font-light text-white/40 text-[14px] leading-none pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </span>
      
      {/* Category label */}
      <span className="absolute bottom-2 left-2 right-2 text-center font-inter text-[8px] tracking-[0.25em] uppercase text-white/90 truncate pointer-events-none">
        {product.category}
      </span>
    </motion.div>
  )
}

function ExpandedCard({ product, index, onClose, onNavigate, prefersRM }: any) {
  return (
    <motion.div
      layoutId={prefersRM ? undefined : `bento-card-${product.id}`}
      className="relative w-full flex-1 rounded-[6px] shadow-[0_12px_40px_rgba(27,60,52,0.15)] overflow-hidden cursor-pointer"
      onClick={onClose}
      style={{ background: '#FAF5E8', WebkitTapHighlightColor: 'transparent' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <img src={product.images?.[0] ?? ''} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C34]/80 via-[#1B3C34]/20 to-transparent pointer-events-none" />

      {/* Close cross */}
      <button 
        className="absolute top-3 right-3 text-white/60 p-2 active:scale-90 transition-transform active:text-white"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Animated Info Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 p-5 flex flex-col"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <span className="font-inter text-[8px] tracking-[0.25em] uppercase text-white/70 mb-1">
          {product.category}
        </span>
        <h3 className="font-cormorant font-semibold text-[22px] uppercase tracking-wide text-white leading-tight mb-1">
          {product.name}
        </h3>
        <p className="font-cormorant text-[16px] text-white/80 mb-4">
          {product.price}
        </p>
        
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate() }}
          className="flex items-center gap-2.5 font-inter text-[9px] tracking-[0.3em] uppercase text-white active:text-white/60 group transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 transition-transform duration-150 group-active:translate-x-1" />
        </button>
      </motion.div>
    </motion.div>
  )
}

// =============================================================================
// END MOBILE BENTO GRID
// =============================================================================


const BREAKPOINT_CONFIG = {
  // Mobile: tightened fan — side cards peek from edges (scale 0.70->0.50, opacity 0.50->0.15)
  mobile:  { height: 360, width: 200, scales: [1.00, 0.70, 0.50], offsets: [0, 75, 130], sideOpacities: [1, 0.50, 0.15] },
  tablet:  { height: 460, width: 300, scales: [1.00, 0.68, 0.46], offsets: [0, 155, 265], sideOpacities: [1, 0.65, 0.22] },
  desktop: { height: 520, width: 360, scales: [1.00, 0.65, 0.44], offsets: [0, 200, 340], sideOpacities: [1, 0.65, 0.22] },
}
const ENTER_EXIT_OVERSHOOT = { mobile: 240, tablet: 460, desktop: 640 }

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
    const xMag = config.offsets[a] ?? (config.offsets[2] + 80)
    const scale = config.scales[a] ?? 0.28
    const opacity = config.sideOpacities?.[a] ?? (a === 0 ? 1 : a === 1 ? 0.65 : a === 2 ? 0.22 : 0)
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
  isCenterHovered,
  activeScaleBounce,
}: { 
  product: ShowcaseProduct, 
  index: number, 
  progress: MotionValue<number>, 
  total: number, 
  config: any, 
  overshoot: number,
  isCenterHovered: boolean,
  activeScaleBounce: MotionValue<number>,
}) => {
  const dist = useTransform(progress, (val) => {
    let d = (index - val) % total
    d = (d + total) % total
    if (d > total / 2) d -= total
    return d
  })

  const slot = useTransform(dist, (d) => getSlotContinuous(d, config, overshoot))
  
  const x = useTransform(slot, (s) => s.x)
  const baseScale = useTransform(slot, (s) => s.scale)
  const opacity = useTransform(slot, (s) => s.opacity)
  const zIndex = useTransform(slot, (s) => s.zIndex)
  const filter = useTransform(slot, (s) => `brightness(${s.brightness})`)

  // Apply settle bounce only to the center card — derive after baseScale is computed
  const scale = useTransform(
    [baseScale, activeScaleBounce] as const,
    (latest: number[]) => {
      const s = latest[0]
      const bounce = latest[1]
      // Only apply bounce when card is (approximately) the center card
      const dVal = dist.get()
      return Math.abs(dVal) < 0.15 ? s * bounce : s
    }
  )
  
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
  products = MAIN_PRODUCTS,
  autoplay = true,
  autoplayInterval = 3500,
  eyebrow = 'THE COLLECTION',
  initialIndex = 2,
  onProductClick,
}: ProductShowcaseProps) {
  const total = products.length
  
  const progress = useMotionValue(initialIndex)
  // Settle bounce for the center card on swipe complete
  const activeScaleBounce = useMotionValue(1)
  
  const [activeIndex, setActiveIndex] = useState(
    total > 0 ? Math.min(Math.max(initialIndex, 0), total - 1) : 0
  )
  
  const navigate = useNavigate()

  const isDraggingRef = useRef(false)
  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const progressOnDragStart = useRef(initialIndex)
  const dragAxis = useRef<'h' | 'v' | null>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)

  const [isCenterHovered, setIsCenterHovered] = useState(false)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  // Debounced resize
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(timer); timer = setTimeout(() => setWindowWidth(window.innerWidth), 100) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer) }
  }, [])

  const bp = windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop'
  const config = BREAKPOINT_CONFIG[bp]
  const overshoot = ENTER_EXIT_OVERSHOOT[bp]
  const isMobile = bp === 'mobile'

  const prefersReducedMotion = useReducedMotion()
  const ANIM_DURATION = prefersReducedMotion ? 0 : 0.5
  const transition = { duration: ANIM_DURATION, ease: EASE }

  // Subtle scale-bounce settle on swipe complete (mobile only, respects reduced motion)
  const triggerBounce = useCallback(() => {
    if (prefersReducedMotion || !isMobile) return
    animate(activeScaleBounce, [1, 1.025, 1], { duration: 0.45, ease: 'easeOut', times: [0, 0.4, 1] })
  }, [activeScaleBounce, isMobile, prefersReducedMotion])

  const next = useCallback(() => {
    if (total <= 1) return
    const nextTarget = Math.round(progress.get()) + 1
    animate(progress, nextTarget, transition)
    setActiveIndex(((nextTarget % total) + total) % total)
    triggerBounce()
  }, [progress, total, transition, triggerBounce])

  const prev = useCallback(() => {
    if (total <= 1) return
    const prevTarget = Math.round(progress.get()) - 1
    animate(progress, prevTarget, transition)
    setActiveIndex(((prevTarget % total) + total) % total)
    triggerBounce()
  }, [progress, total, transition, triggerBounce])

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
    triggerBounce()
  }, [progress, total, transition, activeIndex, triggerBounce])

  const nextRef = useRef(next)
  useEffect(() => { nextRef.current = next }, [next])

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || total <= 1 ) return
    const t = setInterval(() => nextRef.current(), autoplayInterval)
    return () => clearInterval(t)
  }, [autoplay, prefersReducedMotion, total, autoplayInterval])

  // Scoped keyboard listener — only fires when section element is focused
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [next, prev])

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
      const target = Math.round(progress.get())
      animate(progress, target, transition)
      setActiveIndex(((target % total) + total) % total)
      return
    }
    
    let target = Math.round(progress.get())
    if (dx < -40) target = Math.round(progressOnDragStart.current) + 1
    else if (dx > 40) target = Math.round(progressOnDragStart.current) - 1
    
    animate(progress, target, transition)
    setActiveIndex(((target % total) + total) % total)
    triggerBounce()
  }, [progress, transition, total, triggerBounce])

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
    else onProductClick ? onProductClick(activeProduct) : navigate(`/product/${activeProduct.slug}`)
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
          activeScaleBounce={activeScaleBounce}
        />
      ))}
    </div>
  )

  // Shared dash pagination — used by both desktop (right panel) and mobile (top strip)
  const DashPagination = ({ align = 'end' }: { align?: 'center' | 'end' }) => (
    <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-end'}`} role="tablist">
      {products.map((p, idx) => {
        const isActive = idx === activeIndex
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to ${p.name}`}
            onClick={() => jump(idx)}
            // 44x44 minimum tap target, visuals stay thin
            className="py-[22px] px-[11px] -m-[11px] cursor-pointer focus-visible:outline-none"
          >
            <motion.div
              animate={{
                width: isActive ? (isMobile ? 20 : 30) : (isMobile ? 6 : 10),
                backgroundColor: isActive ? '#1B3C34' : 'rgba(27,60,52,0.22)',
              }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ height: 1.5 }}
            />
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        id="collection"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product Showcase"
        tabIndex={0}
        className="relative bg-[#FAF5E8] select-none outline-none focus-visible:outline-none"
        style={{ paddingTop: isMobile ? '2.5rem' : '5rem', overflowX: 'clip' }}
      >

        {/* Ambient orb — static on mobile (no per-swipe re-render) with reduced blur for GPU */}
        {isMobile ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              width: 500, height: 500, borderRadius: '50%',
              top: -100, left: '50%', transform: 'translateX(-50%)',
              background: 'radial-gradient(circle, rgba(27,60,52,0.07) 0%, transparent 68%)',
              filter: 'blur(30px)', // 50px → 30px: lighter on mobile GPUs
            }}
          />
        ) : (
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
                width: 800, height: 800, borderRadius: '50%',
                top: -200, left: '50%', transform: 'translateX(-50%)',
                background: 'radial-gradient(circle, rgba(27,60,52,0.07) 0%, transparent 68%)',
                filter: 'blur(50px)',
              }}
            />
          </AnimatePresence>
        )}

        {/* ─── DESKTOP ─── */}
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
                    onClick={() => onProductClick ? onProductClick(activeProduct) : navigate(`/product/${activeProduct.slug}`)}
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
              <span className="font-cormorant font-light text-sm tracking-[0.3em] text-[#1B3C34]/45 tabular-nums text-center">
                {idxStr} / {totalStr}
              </span>

              <DashPagination align="end" />
            </div>
          </div>
        )}

        {/* Thin separator below desktop stage */}
        {!isMobile && (
          <div className="pb-16 md:pb-20" />
        )}

        {/* ─── MOBILE — Tap-to-Expand Bento Grid ─── */}
        {isMobile && (
          <MobileBentoGrid
            products={products}
            eyebrow={eyebrow}
            onProductClick={onProductClick}
          />
        )}
      </section>
    </>
  )
}

