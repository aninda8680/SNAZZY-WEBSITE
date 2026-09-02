import { type ProductData } from '../data/products'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'

// ─── Data Contract ────────────────────────────────────────────────────────────



export interface ProductDetailTheme {
  bg: string
  text: string
  accent: string
  border: string
  subtleText: string    // muted version of text (e.g. text/40)
  font: 'dark' | 'light'
  hideShadow?: boolean
}

export interface ProductDetailProps {
  product: ProductData | null
  theme: ProductDetailTheme
  onClose: () => void
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn', delay: 0.2 } },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 },
  },
}

const leftColVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 },
  },
  exit: {
    opacity: 0,
    x: -18,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const rightColVariants = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 },
  },
  exit: {
    opacity: 0,
    x: 18,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
}

function ImageGallery({
  images,
  name,
  accent,
  hideShadow,
}: {
  images: string[]
  name: string
  accent: string
  hideShadow?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const isAnimating = useRef(false)
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const changeImage = useCallback((newIdx: number) => {
    if (newIdx === activeIndex || newIdx < 0 || newIdx >= images.length) return
    setDirection(newIdx > activeIndex ? 1 : -1)
    setActiveIndex(newIdx)
    isAnimating.current = true
  }, [activeIndex, images.length])

  const handleWheel = (e: React.WheelEvent) => {
    if (isAnimating.current) return
    
    // Require a decent delta to avoid triggering on microscopic trackpad movements
    if (Math.abs(e.deltaY) < 30) return

    if (e.deltaY > 0 && activeIndex < images.length - 1) {
      changeImage(activeIndex + 1)
    } else if (e.deltaY < 0 && activeIndex > 0) {
      changeImage(activeIndex - 1)
    }
  }

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || isAnimating.current) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current - touchEndY

    // Only treat as horizontal swipe if clearly more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 30) {
      if (deltaX > 0 && activeIndex < images.length - 1) {
        changeImage(activeIndex + 1) // swipe left -> next image
      } else if (deltaX < 0 && activeIndex > 0) {
        changeImage(activeIndex - 1) // swipe right -> prev image
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const imageSlideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? '100%' : '-100%',
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? '-100%' : '100%',
    }),
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden flex"
      style={{ touchAction: 'pan-y' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dot indicator */}
      {images.length > 1 && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating.current) changeImage(i)
              }}
              className="w-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                height: i === activeIndex ? '24px' : '6px',
                backgroundColor: i === activeIndex ? accent : `${accent}40`,
              }}
            />
          ))}
        </div>
      )}

      {/* Visible Images */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.img
          key={activeIndex}
          custom={direction}
          variants={imageSlideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} // smooth, non-bouncy spring-like ease
          onAnimationComplete={() => { isAnimating.current = false }}
          src={images[activeIndex]}
          alt={`${name} — view ${activeIndex + 1}`}
          className="absolute inset-0 w-full h-full object-contain object-center"
          style={{
            // Creates a sharp white line (1st shadow) and a soft aesthetic glow (2nd shadow) behind the exact shape of the image
            filter: hideShadow ? 'none' : 'drop-shadow(0 0 1px rgba(255, 255, 255, 1)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.25))'
          }}
        />
      </AnimatePresence>
    </div>
  )
}

// ─── Size Selector ────────────────────────────────────────────────────────────

function SizeSelector({
  sizes,
  theme,
}: {
  sizes: string[]
  theme: ProductDetailTheme
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isActive = selected === size
        return (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className="font-inter text-[11px] tracking-wider w-14 h-12 border transition-all duration-200 cursor-pointer"
            style={{
              borderColor: isActive ? theme.text : theme.border,
              color: isActive ? theme.bg : theme.text,
              backgroundColor: isActive ? theme.text : 'transparent',
            }}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProductDetail({ product, theme, onClose }: ProductDetailProps) {
  const prefersReducedMotion = useReducedMotion()

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])



  if (prefersReducedMotion) {
    if (!product) return null

    const isMissingData = !theme || !product.images || product.images.length === 0 || !product.name;
    if (isMissingData) {
      return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-[#FAF5E8]" onClick={onClose}>
          <div className="flex flex-col items-center gap-4">
            <p className="font-inter text-sm tracking-widest uppercase text-[#1B3C34]/60">
              Couldn't load product
            </p>
            <button
              onClick={onClose}
              className="font-inter text-[10px] tracking-widest uppercase border border-[#1B3C34]/20 px-6 py-2 text-[#1B3C34]"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        className="w-full h-[100dvh] flex items-stretch overflow-hidden"
        style={{ backgroundColor: theme.bg }}
      >
        <StaticLayout product={product} theme={theme} onClose={onClose} />
      </div>
    )
  }

  const isMissingData = product && (!theme || !product.images || product.images.length === 0 || !product.name);

  return (
    <AnimatePresence mode="wait">
      {isMissingData ? (
        <motion.div
          key="pd-fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#FAF5E8]"
          onClick={onClose}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="font-inter text-sm tracking-widest uppercase text-[#1B3C34]/60">
              Couldn't load product
            </p>
            <button
              onClick={onClose}
              className="font-inter text-[10px] tracking-widest uppercase border border-[#1B3C34]/20 px-6 py-2 text-[#1B3C34]"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      ) : product ? (
        <motion.div
        key={`pd-${product.id}`}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-[100dvh] flex items-stretch overflow-hidden"
        style={{ backgroundColor: theme.bg }}
        onClick={onClose}
      >
        {/* ── Inner panel — stops click propagation ── */}
        <div
          className="relative flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="fixed md:absolute top-4 right-4 md:top-6 md:right-8 z-50 cursor-pointer transition-opacity duration-200 p-2 md:p-0 rounded-full"
            style={{ 
              color: `${theme.text}60`,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = theme.text)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = `${theme.text}60`)}
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* ── Left Column ── */}
          <motion.div
            variants={leftColVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-center w-full md:w-[28%] md:max-w-sm px-6 pt-8 pb-4 md:px-10 lg:px-14 md:py-16 flex-shrink-0 md:overflow-y-auto order-2 md:order-1"
          >
            {/* Category */}
            <span
              className="font-inter text-[9px] tracking-[0.45em] uppercase block mb-3 md:mb-6"
              style={{ color: theme.subtleText }}
            >
              {product.category}
            </span>

            {/* Name */}
            <h2
              className="font-cormorant font-semibold text-3xl md:text-4xl lg:text-5xl uppercase leading-tight tracking-wide mb-4 md:mb-6"
              style={{ color: theme.text }}
            >
              {product.name}
            </h2>

            {/* Description */}
            <p
              className="font-inter font-medium text-[13px] md:text-sm leading-relaxed mb-6 md:mb-8"
              style={{ color: theme.subtleText }}
            >
              {product.description}
            </p>

            {/* Bullets */}
            <ul className="flex flex-col gap-3">
              {product.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-inter font-medium text-[11px] md:text-[12px] leading-relaxed"
                  style={{ color: `${theme.subtleText}` }}
                >
                  <span
                    className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: theme.accent, opacity: 0.5 }}
                  />
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Badge if any */}
            {product.badge && (
              <span
                className="mt-8 md:mt-10 self-start font-inter text-[8px] tracking-[0.35em] uppercase px-3 py-1.5 border"
                style={{ color: theme.accent, borderColor: `${theme.accent}30` }}
              >
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* ── Center Column — Image ── */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-[65vh] md:h-auto min-h-[400px] md:min-h-0 md:flex-1 relative overflow-hidden pt-12 px-0 md:px-12 md:pt-16 lg:pt-24 lg:px-32 pb-0 md:pb-12 flex-shrink-0 order-1 md:order-2"
          >
            <ImageGallery
              images={product.images}
              name={product.name}
              accent={theme.accent}
              hideShadow={theme.hideShadow}
            />
          </motion.div>

          {/* ── Right Column ── */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-start md:justify-center w-full md:w-[28%] md:max-w-sm px-6 pt-4 pb-16 md:px-10 lg:px-14 md:py-16 flex-shrink-0 order-3"
          >
            {/* Drop context */}
            <span
              className="font-inter text-[9px] tracking-[0.4em] uppercase block mb-3 md:mb-4"
              style={{ color: theme.subtleText }}
            >
              Drop 1 — Wild Instincts
            </span>

            {/* Price */}
            <p
              className="font-cormorant font-semibold text-3xl md:text-4xl lg:text-5xl tracking-wide mb-8 md:mb-10"
              style={{ color: theme.text }}
            >
              {product.price}
            </p>

            {/* Size */}
            <div className="mb-8 md:mb-10">
              <span
                className="font-inter font-semibold text-[9px] tracking-[0.35em] uppercase block mb-4"
                style={{ color: theme.subtleText }}
              >
                Select Size
              </span>
              <SizeSelector sizes={product.sizes} theme={theme} />
            </div>

            {/* Divider */}
            <div className="w-full mb-8 md:mb-10" style={{ height: '1px', backgroundColor: theme.border }} />

            {/* Add to Bag */}
            <button
              className="group relative w-full py-4 font-inter font-semibold text-[10px] tracking-[0.35em] uppercase overflow-hidden transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer"
              style={{
                border: `1px solid ${theme.text}`,
                color: theme.text,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = theme.text
                el.style.color = theme.bg
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = 'transparent'
                el.style.color = theme.text
              }}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span>Add to Bag</span>
            </button>

            {/* Size guide */}
            <button
              className="mt-4 font-inter text-[9px] tracking-[0.25em] uppercase text-center transition-opacity duration-200 hover:opacity-100 cursor-pointer"
              style={{ color: theme.subtleText, opacity: 0.6 }}
            >
              Size Guide
            </button>
          </motion.div>
        </div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

// ─── Reduced-motion fallback (no animations) ──────────────────────────────────

function StaticLayout({
  product,
  theme,
  onClose,
}: {
  product: ProductData
  theme: ProductDetailTheme
  onClose: () => void
}) {
  return (
    <div className="relative flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
      <button
        onClick={onClose}
        className="fixed md:absolute top-4 right-4 md:top-6 md:right-8 z-50 cursor-pointer p-2 md:p-0 rounded-full"
        style={{ 
          color: `${theme.text}60`,
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <X className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <div
        className="flex flex-col justify-center w-full md:w-[28%] px-6 pt-8 pb-4 md:px-10 lg:px-14 md:py-16 flex-shrink-0 md:overflow-y-auto order-2 md:order-1"
      >
        <span className="font-inter text-[9px] tracking-[0.45em] uppercase block mb-3 md:mb-6" style={{ color: theme.subtleText }}>
          {product.category}
        </span>
        <h2 className="font-cormorant font-semibold text-3xl md:text-4xl lg:text-5xl uppercase leading-tight tracking-wide mb-4 md:mb-6" style={{ color: theme.text }}>
          {product.name}
        </h2>
        <p className="font-inter font-medium text-[13px] md:text-sm leading-relaxed mb-6 md:mb-8" style={{ color: theme.subtleText }}>
          {product.description}
        </p>
        <ul className="flex flex-col gap-3">
          {product.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 font-inter font-medium text-[11px] md:text-[12px] leading-relaxed" style={{ color: theme.subtleText }}>
              <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.accent, opacity: 0.5 }} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full h-[65vh] md:h-auto min-h-[400px] md:min-h-0 md:flex-1 relative overflow-hidden flex-shrink-0 order-1 md:order-2">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
        />
      </div>

      <div
        className="flex flex-col justify-start md:justify-center w-full md:w-[28%] px-6 pt-4 pb-16 md:px-10 lg:px-14 md:py-16 flex-shrink-0 order-3"
      >
        <p className="font-cormorant font-semibold text-3xl md:text-4xl lg:text-5xl tracking-wide mb-8 md:mb-10" style={{ color: theme.text }}>{product.price}</p>
        <SizeSelector sizes={product.sizes} theme={theme} />
        <button 
          className="mt-10 w-full py-4 font-inter font-semibold text-[10px] tracking-[0.35em] uppercase flex items-center justify-center gap-3 cursor-pointer transition-colors duration-300" 
          style={{ border: `1px solid ${theme.text}`, color: theme.text, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.backgroundColor = theme.text
            el.style.color = theme.bg
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.backgroundColor = 'transparent'
            el.style.color = theme.text
          }}
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          Add to Bag
        </button>
      </div>
    </div>
  )
}
