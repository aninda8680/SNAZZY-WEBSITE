import { useRef, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductDetail, { type ProductDetailData } from '../components/ProductDetail'

// ─── Product Data ─────────────────────────────────────────────────────────────

const SHOWCASE_PRODUCTS: ProductDetailData[] = [
  {
    id: 1,
    name: 'Snazzy Tee — T1',
    category: "Men's T-Shirts",
    description:
      'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest. Designed for those who believe clothing should say something.',
    bullets: [
      'Material: 100% combed ring-spun cotton, 220gsm',
      'Care: Machine wash cold (30°C), inside out. Do not tumble dry.',
    ],
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Snazzy Tee — T2',
    category: "Men's T-Shirts",
    description:
      'From the latest streetwear drop — bold embroidered branding on a relaxed-fit silhouette. The dropped shoulder and boxy cut make this an instant wardrobe anchor.',
    bullets: [
      'Material: 100% combed cotton, 220gsm. Boxy oversized fit.',
      'Care: Machine wash cold. Turn inside out before washing. Hang to dry.',
    ],
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'New',
  },
  {
    id: 3,
    name: 'Snazzy Tee — T3',
    category: "Men's T-Shirts",
    description:
      'Statement embroidery meets everyday comfort. The T3 features a bold graphic design rendered in high-density thread on 220gsm cotton.',
    bullets: [
      'Material: 100% combed cotton, 220gsm. Regular fit.',
      'Care: Cold machine wash. Turn inside out. Hang dry.',
    ],
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'Snazzy Tee — T4',
    category: "Men's T-Shirts",
    description:
      'Part of our limited seasonal run — once it\'s gone, it\'s gone. The T4 features exclusive embroidery artwork produced in a single run of 100 units.',
    bullets: [
      'Material: 100% combed cotton, 220gsm. Slim regular fit.',
      'Care: Hand wash or gentle cycle cold. Lay flat to dry.',
    ],
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Limited',
  },
  {
    id: 5,
    name: 'Snazzy Tee — T5',
    category: "Men's T-Shirts",
    description:
      'Our heaviest tee — 260gsm fabric with a structured boxy silhouette. Embroidery on chest and sleeve for full coverage brand expression.',
    bullets: [
      'Material: 100% combed cotton, 260gsm. Oversized boxy fit.',
      'Care: Machine wash 30°C. Turn inside out. Do not tumble dry.',
    ],
    images: ['/images/t5-front.png', '/images/t5-back.png'],
    price: '₹1,499',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bold',
  },
  {
    id: 6,
    name: "Women's Tee — G1",
    category: "Women's T-Shirts",
    description:
      'A relaxed-fit tee in our softest cotton fabric, with delicate embroidery that elevates without overpowering. Slightly cropped with a curved hem.',
    bullets: [
      'Material: 100% combed cotton, 180gsm. Relaxed cropped fit.',
      'Care: Machine wash cold, gentle cycle. Reshape while damp.',
    ],
    images: ['/images/nobg/grl-t1-front-nobg.png', '/images/nobg/grl-t1-back-nobg.png'],
    price: '₹1,399',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'New',
  },
  {
    id: 7,
    name: "Women's Tee — G2",
    category: "Women's T-Shirts",
    description:
      'The dropped shoulder gives an effortless off-duty feel while the embroidered detail keeps it distinctly Snazzy. Pairs with everything.',
    bullets: [
      'Material: 100% combed cotton, 180gsm. Drop-shoulder construction.',
      'Care: Machine wash cold. Hang to dry. Iron on low on the back.',
    ],
    images: ['/images/nobg/grl-t2-front-nobg.png', '/images/nobg/grl-t2-back-nobg.png'],
    price: '₹1,399',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Popular',
  },
  {
    id: 8,
    name: 'Snazzy Hoodie',
    category: 'Hoodies',
    description:
      '380gsm fleece-lined fabric with precision chest embroidery, an adjustable drawstring hood, and a kangaroo pocket finished with a woven brand label inside.',
    bullets: [
      'Material: 80% cotton, 20% polyester, 380gsm. Fleece-lined interior.',
      'Care: Machine wash 30°C. Turn inside out. Do not tumble dry on high heat.',
    ],
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    price: '₹2,499',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bestseller',
  },
  {
    id: 9,
    name: 'Snazzy Sweatshirt',
    category: 'Sweatshirts',
    description:
      'French terry construction meets artisan embroidery. The crewneck silhouette is clean and versatile — dress it up or down.',
    bullets: [
      'Material: 80% cotton, 20% polyester, 320gsm. French terry loopback.',
      'Care: Machine wash cold, inside out. Reshape while damp.',
    ],
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    price: '₹1,999',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Artisan',
  },
]

// Per-product scale overrides (thumbScale = ring thumbnails, heroScale = center hero)
// Adjust these to balance different image crops/aspect ratios
const PRODUCT_SCALE: Record<number, { thumb: number; hero: number }> = {
  1:  { thumb: 1.00, hero: 1.20 }, // T1
  2:  { thumb: 1.00, hero: 1.20 }, // T2
  3:  { thumb: 0.80, hero: 0.75 }, // T3 — crops large
  4:  { thumb: 1.00, hero: 0.78 }, // T4 — too big in center
  5:  { thumb: 1.00, hero: 1.00 }, // T5
  6:  { thumb: 0.82, hero: 0.75 }, // G1 — women's crop, too big in center
  7:  { thumb: 0.82, hero: 0.75 }, // G2 — women's crop, too big in center
  8:  { thumb: 1.00, hero: 1.20 }, // Hoodie
  9:  { thumb: 1.00, hero: 1.20 }, // Sweatshirt
}

const N = SHOWCASE_PRODUCTS.length

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalise any angle into [0, 2π) */
function normalise(rad: number): number {
  const TWO_PI = Math.PI * 2
  return ((rad % TWO_PI) + TWO_PI) % TWO_PI
}

/** Index of the thumbnail closest to the 12 o'clock position given current ring rotation (radians) */
function computeActiveIndex(ringRotRad: number): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < N; i++) {
    const naturalAngle = (Math.PI * 2 * i) / N
    // effective angle of item i in world space (ring rotation applied)
    const effective = normalise(naturalAngle + ringRotRad)
    // distance from Math.PI/2 (3 o'clock), wrapping
    let dist = Math.abs(effective - Math.PI / 2)
    dist = Math.min(dist, Math.PI * 2 - dist)
    if (dist < bestDist) { bestDist = dist; best = i }
  }
  return best
}

/** Easing: ease-in-out cubic */
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAIN_THEME = {
  bg: '#FAF5E8',
  text: '#1B3C34',
  accent: '#1B3C34',
  border: 'rgba(27,60,52,0.1)',
  subtleText: 'rgba(27,60,52,0.55)',
  font: 'light' as const,
  hideShadow: true,
}

export default function ProductShowcase() {
  const prefersReducedMotion = useReducedMotion()

  return prefersReducedMotion
    ? <ReducedMotionShowcase />
    : <AnimatedShowcase />
}

// ─── Full animated version ────────────────────────────────────────────────────

function AnimatedShowcase() {
  // Ring rotation in RADIANS (accumulates, never reset)
  const rotRef = useRef(0)
  // Render-triggering mirror of rotation (degrees, for inline style)
  const [rotDeg, setRotDeg] = useState(0)

  const [activeIndex, setActiveIndex] = useState(0)

  // RAF + jump state
  const rafRef = useRef<number>(0)
  const isJumpingRef = useRef(false)

  // Wheel velocity for smooth wheel-driven rotation
  const wheelVelRef = useRef(0) // radians/frame

  // Responsive ring radius & thumb size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const RING_R     = isMobile ? 135 : 290
  const THUMB_SIZE  = isMobile ? 120 : 180

  // ── RAF loop ──────────────────────────────────────────────────────────────
  const DEG_PER_FRAME = 0.04 // ~2.4°/s at 60fps → full rotation ≈ 2.5 min

  // Stable ref to the ambient loop function so it can be restarted after jumps
  const ambientLoopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const loop = () => {
      if (!isJumpingRef.current) {
        // Ambient rotation — always running
        rotRef.current += (DEG_PER_FRAME * Math.PI) / 180
        // Bleed off any wheel velocity
        if (Math.abs(wheelVelRef.current) > 0.00005) {
          rotRef.current += wheelVelRef.current
          wheelVelRef.current *= 0.92 // damping
        } else {
          wheelVelRef.current = 0
        }
      } else if (Math.abs(wheelVelRef.current) > 0.00005) {
        // Allow wheel inertia during jumps too
        rotRef.current += wheelVelRef.current
        wheelVelRef.current *= 0.92
      }

      const newActive = computeActiveIndex(rotRef.current)
      setActiveIndex(prev => (prev !== newActive ? newActive : prev))
      setRotDeg((rotRef.current * 180) / Math.PI)

      rafRef.current = requestAnimationFrame(loop)
    }
    ambientLoopRef.current = loop
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, []) // intentionally empty — we read refs, not state

  // ── Jump to index ─────────────────────────────────────────────────────────
  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isJumpingRef.current) return
    isJumpingRef.current = true
    wheelVelRef.current = 0
    cancelAnimationFrame(rafRef.current) // pause ambient loop

    // Angle of the target item in the ring's local frame
    const naturalAngle = (Math.PI * 2 * targetIdx) / N
    // Current effective angle of this item in world space
    const effective = normalise(naturalAngle + rotRef.current)
    // How much we need to add to rotRef so item is at Math.PI/2 (right)
    // Prefer the shortest arc
    let delta = (Math.PI / 2) - effective
    if (delta < -Math.PI) delta += Math.PI * 2
    if (delta > Math.PI) delta -= Math.PI * 2

    const startRot = rotRef.current
    const startTime = performance.now()
    const DURATION = 750

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / DURATION, 1)
      rotRef.current = startRot + delta * easeInOut(t)
      setRotDeg((rotRef.current * 180) / Math.PI)
      setActiveIndex(computeActiveIndex(rotRef.current))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        isJumpingRef.current = false
        // Restart the ambient loop
        if (ambientLoopRef.current) {
          rafRef.current = requestAnimationFrame(ambientLoopRef.current)
        }
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  // ── Step prev/next (arrow buttons) ───────────────────────────────────────
  const stepNext = useCallback(() => {
    const next = (computeActiveIndex(rotRef.current) + 1) % N
    jumpToIndex(next)
  }, [jumpToIndex])

  const stepPrev = useCallback(() => {
    const cur = computeActiveIndex(rotRef.current)
    const prev = (cur - 1 + N) % N
    jumpToIndex(prev)
  }, [jumpToIndex])

  // ── Wheel handler (inside circle area) ───────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    // deltaY positive = scroll down = rotate ring clockwise
    const impulse = (e.deltaY * 0.00018)
    wheelVelRef.current += impulse
    // Clamp velocity
    const MAX_VEL = 0.025
    wheelVelRef.current = Math.max(-MAX_VEL, Math.min(MAX_VEL, wheelVelRef.current))
  }, [])
  return (
    <>
      <section
        id="showcase"
        className="relative bg-[#FAF5E8] overflow-hidden"
        style={{
          paddingTop:    isMobile ? '48px'  : '100px',
          paddingBottom: isMobile ? '48px'  : '140px',
        }}
      >
        {/* ── Mobile layout: flex-col stack ── */}
        {isMobile ? (
          <div className="flex flex-col items-center gap-0">
            {/* Top: The Collection + counter */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <p className="font-inter font-semibold text-[13px] tracking-[0.4em] uppercase text-[#1B3C34]/80">
                The Collection
              </p>
              <CounterStrip
                active={activeIndex}
                total={N}
                onPrev={stepPrev}
                onNext={stepNext}
              />
            </div>

            {/* Middle: Ring */}
            <Stage
              rotDeg={rotDeg}
              activeIndex={activeIndex}
              ringR={RING_R}
              thumbSize={THUMB_SIZE}
              isMobile={isMobile}
              onThumbClick={jumpToIndex}
              onWheel={handleWheel}
            />

            {/* Bottom: Name + price */}
            <div className="mt-6 z-20">
              <ProductLabel activeIndex={activeIndex} isMobile={isMobile} />
            </div>
          </div>
        ) : (
          /* ── Desktop layout: circle center, left/right absolute panels ── */
          <div className="flex items-center justify-center">
            {/* Left */}
            <div className="absolute left-12 xl:left-24 top-1/2 -translate-y-1/2 z-20 flex flex-col items-start">
              <div className="flex justify-start mb-4 pointer-events-none">
                <p className="font-inter font-semibold text-[13px] tracking-[0.4em] uppercase text-[#1B3C34]/80">
                  The Collection
                </p>
              </div>
              <CounterStrip
                active={activeIndex}
                total={N}
                onPrev={stepPrev}
                onNext={stepNext}
              />
            </div>

            {/* Stage */}
            <Stage
              rotDeg={rotDeg}
              activeIndex={activeIndex}
              ringR={RING_R}
              thumbSize={THUMB_SIZE}
              isMobile={isMobile}
              onThumbClick={jumpToIndex}
              onWheel={handleWheel}
            />

            {/* Right */}
            <div className="absolute right-12 xl:right-24 top-1/2 -translate-y-1/2 z-20">
              <ProductLabel activeIndex={activeIndex} isMobile={isMobile} />
            </div>
          </div>
        )}
      </section>
    </>
  )
}

// ─── Counter strip ────────────────────────────────────────────────────────────

function CounterStrip({
  active, total, onPrev, onNext,
}: {
  active: number; total: number; onPrev: () => void; onNext: () => void
}) {
  return (
    <div className="flex items-center gap-5">
      <button
        onClick={onPrev}
        aria-label="Previous product"
        className="w-9 h-9 flex items-center justify-center text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors duration-200 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="relative overflow-hidden h-[30px] flex items-center" style={{ minWidth: '80px' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="font-inter font-bold text-[18px] tracking-[0.3em] text-[#1B3C34] tabular-nums text-center block w-full"
          >
            {String(active + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={onNext}
        aria-label="Next product"
        className="w-9 h-9 flex items-center justify-center text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors duration-200 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  )
}

// ─── Stage (ring + center) ────────────────────────────────────────────────────

function Stage({
  rotDeg, activeIndex, ringR, thumbSize, isMobile,
  onThumbClick, onWheel,
}: {
  rotDeg: number
  activeIndex: number
  ringR: number
  thumbSize: number
  isMobile: boolean
  onThumbClick: (i: number) => void
  onWheel: (e: WheelEvent) => void
}) {
  const HERO_SIZE = isMobile ? 220 : 380
  const stageH    = isMobile ? 420 : 760

  const stageRef = useRef<HTMLDivElement>(null)
  const isHovering = useRef(false)

  // Attach a document-level non-passive wheel listener.
  // Only intercept when mouse is inside the stage.
  useEffect(() => {
    const docWheel = (e: WheelEvent) => {
      if (!isHovering.current) return
      e.preventDefault()
      onWheel(e)
    }
    document.addEventListener('wheel', docWheel, { passive: false })
    return () => document.removeEventListener('wheel', docWheel)
  }, [onWheel])

  return (
    <div
      ref={stageRef}
      className="relative w-full flex items-center justify-center mt-12 lg:mt-20"
      style={{ height: stageH, touchAction: 'pan-y' }}
      onMouseEnter={() => { isHovering.current = true }}
      onMouseLeave={() => { isHovering.current = false }}
    >
      {/* Ring container — rotates */}
      <div
        className="absolute z-20"
        style={{
          width: ringR * 2 + thumbSize,
          height: ringR * 2 + thumbSize,
          transform: `rotate(${rotDeg}deg)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {SHOWCASE_PRODUCTS.map((product, i) => {
          const angle = (Math.PI * 2 * i) / N
          // Position within ring div (center of ring div = center of stage)
          const halfRingBox = ringR + thumbSize / 2
          const px = halfRingBox + ringR * Math.sin(angle) - thumbSize / 2
          const py = halfRingBox - ringR * Math.cos(angle) - thumbSize / 2

          // Angular distance from top (0) for glow/scale logic
          // We compute effective angle relative to current rotation to find proximity
          // But since the whole ring rotates, each thumb is always at its fixed local angle;
          // proximity is determined by activeIndex == i
          const isActive = i === activeIndex
          // Angular proximity: 0 = exactly at top, 1 = opposite side
          // Use distance in ring positions
          const dist = Math.min(
            Math.abs(i - activeIndex),
            N - Math.abs(i - activeIndex)
          )
          const proximity = 1 - dist / (N / 2) // 1 = top, 0 = bottom

          const thumbScale = (PRODUCT_SCALE[product.id] ?? { thumb: 1 }).thumb
          const opacity = 0.8 + proximity * 0.2

          return (
            <button
              key={product.id}
              onClick={() => onThumbClick(i)}
              aria-label={`Select ${product.name}`}
              className="absolute cursor-pointer rounded-sm overflow-hidden"
              style={{
                left: px,
                top: py,
                width: thumbSize,
                height: thumbSize,
                // Counter-rotate so image stays upright
                transform: `rotate(${-rotDeg}deg) scale(${thumbScale.toFixed(3)})`,
                transformOrigin: 'center center',
                opacity,
                willChange: 'transform, opacity',
              }}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain object-center"
                draggable={false}
              />
            </button>
          )
        })}
      </div>

      {/* Center hero image — sits above ring, not rotating */}
      <div
        className="relative z-10 flex-shrink-0 pointer-events-none"
        style={{ width: HERO_SIZE, height: HERO_SIZE * 1.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`hero-${activeIndex}`}
            src={SHOWCASE_PRODUCTS[activeIndex].images[0]}
            alt={SHOWCASE_PRODUCTS[activeIndex].name}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: (PRODUCT_SCALE[SHOWCASE_PRODUCTS[activeIndex].id] ?? { hero: 1 }).hero }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full object-contain object-center select-none"
            draggable={false}
            style={{
              filter: 'drop-shadow(0 8px 40px rgba(27,60,52,0.14)) drop-shadow(0 2px 8px rgba(27,60,52,0.08))',
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Product label (name + price) ─────────────────────────────────────────────

function ProductLabel({ activeIndex, isMobile }: { activeIndex: number; isMobile: boolean }) {
  const product = SHOWCASE_PRODUCTS[activeIndex]
  return (
    <div className="relative z-10 flex flex-col items-center lg:items-end gap-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${activeIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center lg:items-end gap-[6px]"
        >
          <h3
            className="font-cormorant font-bold text-[#1B3C34] uppercase tracking-wide text-center lg:text-right leading-none"
            style={{ fontSize: isMobile ? '1.15rem' : '1.6rem' }}
          >
            {product.name}
          </h3>
          <p
            className="font-cormorant font-bold text-[#1B3C34]/70 tracking-wide text-center lg:text-right"
            style={{ fontSize: isMobile ? '1.05rem' : '1.35rem' }}
          >
            {product.price}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

function ReducedMotionShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Auto-advance every 4 s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % N)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const HERO_SIZE = isMobile ? 200 : 300
  const THUMB = isMobile ? 65 : 90
  const DOT_GAP = isMobile ? 10 : 14

  return (
    <>
      <section id="showcase" className="relative bg-[#FAF5E8] py-16 overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Eyebrow & Counter */}
          <div className="flex flex-col items-center gap-3">
            <p className="font-inter font-semibold text-[13px] tracking-[0.4em] uppercase text-[#1B3C34]/80">
              The Collection
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveIndex(i => (i - 1 + N) % N)}
                className="w-7 h-7 flex items-center justify-center text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <span className="font-inter font-bold text-[18px] tracking-[0.3em] text-[#1B3C34]">
                {String(activeIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(N).padStart(2, '0')}
              </span>
              <button
              onClick={() => setActiveIndex(i => (i + 1) % N)}
              className="w-7 h-7 flex items-center justify-center text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          </div>

          {/* Hero */}
          <div
            style={{ width: HERO_SIZE, height: HERO_SIZE * 1.2 }}
          >
            <img
              src={SHOWCASE_PRODUCTS[activeIndex].images[0]}
              alt={SHOWCASE_PRODUCTS[activeIndex].name}
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${(PRODUCT_SCALE[SHOWCASE_PRODUCTS[activeIndex].id] ?? { hero: 1 }).hero})`
              }}
            />
          </div>

          {/* Dot ring */}
          <div className="flex gap-2 flex-wrap justify-center max-w-xs">
            {SHOWCASE_PRODUCTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === activeIndex ? 20 : 6,
                  height: 6,
                  backgroundColor: i === activeIndex ? '#1B3C34' : 'rgba(27,60,52,0.25)',
                }}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 max-w-full px-6">
            {SHOWCASE_PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(i)}
                className="flex-shrink-0 rounded-sm overflow-hidden cursor-pointer transition-opacity"
                style={{
                  width: THUMB,
                  height: THUMB,
                  opacity: i === activeIndex ? 1 : 0.4,
                }}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-contain"
                  style={{
                    transform: p.images[0].includes('grl-t1') || p.images[0].includes('grl-t2') ? 'scale(0.82)' : 'none'
                  }}
                />
              </button>
            ))}
          </div>

          {/* Name + price */}
          <div className="text-center mt-2">
            <h3 className="font-cormorant font-bold text-[#1B3C34] uppercase tracking-wide text-base md:text-xl leading-none">
              {SHOWCASE_PRODUCTS[activeIndex].name}
            </h3>
            <p className="font-cormorant font-bold text-[#1B3C34]/70 tracking-wide text-lg md:text-xl mt-2">
              {SHOWCASE_PRODUCTS[activeIndex].price}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
