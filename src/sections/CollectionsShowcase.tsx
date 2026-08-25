import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

const SIZES_TEE    = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_HOODIE = ['S', 'M', 'L', 'XL', 'XXL']

interface Collection {
  number: string
  name: string
  tagline: string
  description: string
  specs: { label: string; value: string }[]
  image: string
  productId: number
  price: string
  priceNum: number
  sizes: string[]
}

const collections: Collection[] = [
  {
    number: '01',
    name: 'PURE LUXE',
    tagline: 'Gold Thread',
    description: 'Our flagship collection on 100% Pima cotton, featuring hand-placed gold metallic embroidery. Produced in limited runs of 50.',
    specs: [
      { label: 'Fabric',    value: '100% Pima Cotton' },
      { label: 'Thread',    value: 'Gold Metallic' },
      { label: 'Technique', value: 'Multi-Head Digital' },
      { label: 'Care',      value: 'Cold Wash Only' },
    ],
    image: '/images/nobg/t1-front-nobg.png',
    productId: 1,
    price: '₹1,499',
    priceNum: 1499,
    sizes: SIZES_TEE,
  },
  {
    number: '02',
    name: 'BLOOM SERIES',
    tagline: 'Botanical Thread Art',
    description: 'Japanese botanical illustration translated into dense satin-stitch embroidery on super-soft jersey blend.',
    specs: [
      { label: 'Fabric',    value: '220gsm Jersey' },
      { label: 'Thread',    value: 'Silk-Finish Poly' },
      { label: 'Technique', value: 'Satin & Stem Stitch' },
      { label: 'Care',      value: 'Gentle Cycle 30°C' },
    ],
    image: '/images/nobg/t3-front-nobg.png',
    productId: 3,
    price: '₹1,599',
    priceNum: 1599,
    sizes: SIZES_TEE,
  },
  {
    number: '03',
    name: 'MIDNIGHT EDGE',
    tagline: 'Geometric Precision',
    description: 'High-contrast geometric embroidery on 280gsm heavyweight cotton — angular, sharp, unforgettable.',
    specs: [
      { label: 'Fabric',    value: '280gsm Cotton' },
      { label: 'Thread',    value: 'High-Sheen Rayon' },
      { label: 'Technique', value: 'Fill & Run Stitch' },
      { label: 'Care',      value: 'Machine Wash Cold' },
    ],
    image: '/images/t5-front.png',
    productId: 5,
    price: '₹1,699',
    priceNum: 1699,
    sizes: SIZES_TEE,
  },
  {
    number: '04',
    name: 'EARTH ROOTS',
    tagline: 'Heritage Reimagined',
    description: 'Drawing from centuries of South Asian artisan traditions — kantha, zardozi, kutch — on contemporary silhouettes.',
    specs: [
      { label: 'Fabric',    value: 'Organic Cotton' },
      { label: 'Thread',    value: 'Natural Fibre' },
      { label: 'Technique', value: 'Chain & Kantha Stitch' },
      { label: 'Care',      value: 'Hand Wash Preferred' },
    ],
    image: '/images/nobg/grl-t1-front-nobg.png',
    productId: 6,
    price: '₹1,499',
    priceNum: 1499,
    sizes: SIZES_HOODIE,
  },
]

// ── Size Picker (shared mobile + desktop) ─────────────────────────────
function SizePicker({
  sizes,
  onPick,
  onCancel,
  added,
}: {
  sizes: string[]
  onPick: (s: string) => void
  onCancel: () => void
  added: string | null
}) {
  if (added) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 font-inter text-[11px] tracking-[0.35em] uppercase"
        style={{ color: EMERALD }}>
        <Check className="w-4 h-4" />
        Size {added} added
      </div>
    )
  }
  return (
    <div>
      <p className="font-inter text-[9px] tracking-[0.4em] uppercase mb-3 text-center"
        style={{ color: `${EMERALD}45` }}>
        Select your size
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
        {sizes.map(s => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="w-11 h-11 border font-inter text-[12px] transition-all duration-150 hover:bg-[#1B3C34] hover:text-[#FAF5E8] hover:border-[#1B3C34]"
            style={{ borderColor: `${EMERALD}25`, color: EMERALD }}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="w-full font-inter text-[9px] tracking-[0.3em] uppercase py-1.5 text-center hover:opacity-70 transition-opacity"
        style={{ color: `${EMERALD}35` }}
      >
        Cancel
      </button>
    </div>
  )
}

export default function CollectionsShowcase() {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [picking, setPicking]           = useState(false)
  const [addedSize, setAddedSize]       = useState<string | null>(null)
  const activeIndexRef  = useRef(0)
  const containerRef    = useRef<HTMLDivElement>(null)
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null)
  const pickingRef      = useRef(false)
  const { addItem } = useCart()

  const col = collections[activeIndex]

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (pickingRef.current) return  // don't auto-advance while size picker is open
      const n = (activeIndexRef.current + 1) % collections.length
      activeIndexRef.current = n
      setActiveIndex(n)
    }, 3500)
  }

  function goTo(idx: number) {
    const next = ((idx % collections.length) + collections.length) % collections.length
    setActiveIndex(next)
    activeIndexRef.current = next
    setPicking(false)
    setAddedSize(null)
    pickingRef.current = false
    startTimer()
  }

  function openPicker() {
    setPicking(true)
    pickingRef.current = true
  }

  function closePicker() {
    setPicking(false)
    setAddedSize(null)
    pickingRef.current = false
  }

  function handlePickSize(size: string) {
    addItem({
      id:       `${col.productId}-${size}`,
      name:     `${col.name} / ${size}`,
      price:    col.price,
      priceNum: col.priceNum,
      accent:   EMERALD,
    })
    setAddedSize(size)
    setTimeout(() => { closePicker() }, 1400)
  }

  // Mobile auto-advance
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px)', () => {
      startTimer()
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    })
    return () => mm.revert()
  }, [])

  // Desktop scroll-pin
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const newIndex = Math.min(Math.floor(self.progress * 4), 3)
          if (newIndex !== activeIndexRef.current) {
            activeIndexRef.current = newIndex
            setActiveIndex(newIndex)
            setPicking(false)
            setAddedSize(null)
            pickingRef.current = false
          }
        },
      })
      return () => trigger.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <div id="collections">

      {/* ══════════════════════════════════
          MOBILE  (< md)
          ══════════════════════════════════ */}
      <section className="md:hidden" style={{ background: CREAM }}>

        {/* Dark header */}
        <div className="px-6 pt-10 pb-7" style={{ background: EMERALD }}>
          <p className="font-inter text-[10px] tracking-[0.45em] uppercase mb-2" style={{ color: `${CREAM}60` }}>
            Our Collections
          </p>
          <h2 className="font-bodoni text-[2rem] uppercase leading-tight" style={{ color: CREAM }}>
            New Drops
          </h2>
        </div>

        {/* Animated card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: '100vw', background: CREAM }}>
              {/* Faint watermark */}
              <p className="absolute inset-0 flex items-center justify-center font-inter font-black leading-none tracking-tighter select-none pointer-events-none"
                style={{ fontSize: '26vw', color: `${EMERALD}07` }}>
                {col.number}
              </p>
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-contain relative z-10"
              />
              {/* Collection number badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="font-inter text-[9px] tracking-[0.4em] uppercase px-2.5 py-1.5"
                  style={{ background: `${EMERALD}12`, color: `${EMERALD}70` }}>
                  {col.number}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="px-5 pt-5 pb-4" style={{ background: CREAM }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bodoni text-[1.4rem] uppercase leading-tight" style={{ color: EMERALD }}>
                    {col.name}
                  </h3>
                  <p className="font-inter text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: `${EMERALD}50` }}>
                    {col.tagline}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-inter font-medium text-[1.05rem]" style={{ color: EMERALD }}>
                    {col.price}
                  </p>
                  <p className="font-inter text-[9px] uppercase tracking-wider mt-0.5" style={{ color: `${EMERALD}35` }}>
                    incl. GST
                  </p>
                </div>
              </div>

              <p className="font-inter font-light text-[13px] leading-relaxed mb-5" style={{ color: `${EMERALD}60` }}>
                {col.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-2">
                {col.specs.map(spec => (
                  <div key={spec.label} className="border-l-2 pl-3" style={{ borderColor: `${EMERALD}18` }}>
                    <p className="font-inter text-[9px] tracking-[0.3em] uppercase mb-0.5" style={{ color: `${EMERALD}35` }}>
                      {spec.label}
                    </p>
                    <p className="font-inter text-[12px] font-medium" style={{ color: EMERALD }}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA — outside animation */}
        <div className="px-5 pb-5" style={{ background: CREAM }}>
          {!picking ? (
            <button
              onClick={openPicker}
              className="w-full py-[17px] font-inter text-[11px] tracking-[0.4em] uppercase flex items-center justify-center gap-2 active:opacity-75 transition-opacity"
              style={{ background: EMERALD, color: CREAM }}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
          ) : (
            <div className="border px-4 pt-4 pb-3" style={{ borderColor: `${EMERALD}20` }}>
              <SizePicker
                sizes={col.sizes}
                onPick={handlePickSize}
                onCancel={closePicker}
                added={addedSize}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 pb-8 pt-2 border-t" style={{ background: CREAM, borderColor: `${EMERALD}10` }}>
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="w-11 h-11 flex items-center justify-center border transition-colors active:opacity-50"
            style={{ borderColor: `${EMERALD}20`, color: EMERALD }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            {collections.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="p-1">
                <span
                  className="block h-px transition-all duration-300"
                  style={{
                    width: i === activeIndex ? '24px' : '8px',
                    background: i === activeIndex ? EMERALD : `${EMERALD}25`,
                  }}
                />
              </button>
            ))}
            <span className="font-inter text-[10px] tracking-widest ml-1" style={{ color: `${EMERALD}35` }}>
              {activeIndex + 1}/{collections.length}
            </span>
          </div>

          <button
            onClick={() => goTo(activeIndex + 1)}
            className="w-11 h-11 flex items-center justify-center border transition-colors active:opacity-50"
            style={{ borderColor: `${EMERALD}20`, color: EMERALD }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════
          DESKTOP (≥ md) — scroll-pin
          ══════════════════════════════════ */}
      <section
        ref={containerRef}
        className="hidden md:flex relative h-screen w-full overflow-hidden"
        style={{ background: CREAM }}
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex + '-wm'}
              className="font-inter font-black leading-none tracking-tighter whitespace-nowrap"
              style={{ fontSize: '20vw', color: `${EMERALD}05` }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55 }}
            >
              {col.name}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Left — info panel */}
        <div className="relative z-10 flex flex-col justify-between w-[40%] border-r px-12 pt-28 pb-10"
          style={{ borderColor: `${EMERALD}12` }}>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + '-info'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-inter text-[10px] tracking-[0.5em] uppercase" style={{ color: `${EMERALD}45` }}>
                  Collection
                </span>
                <span className="font-inter font-light text-5xl leading-none" style={{ color: `${EMERALD}15` }}>
                  {col.number}
                </span>
              </div>

              <h2 className="font-inter font-light text-5xl leading-tight tracking-tight mb-2" style={{ color: EMERALD }}>
                {col.name}
              </h2>
              <p className="font-inter text-xs tracking-[0.3em] uppercase mb-8" style={{ color: `${EMERALD}55` }}>
                {col.tagline}
              </p>

              <p className="font-inter font-light text-sm leading-7 max-w-xs mb-10" style={{ color: `${EMERALD}60` }}>
                {col.description}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {col.specs.map(spec => (
                  <div key={spec.label} className="border-l pl-3" style={{ borderColor: `${EMERALD}22` }}>
                    <p className="font-inter text-[9px] tracking-[0.3em] uppercase mb-0.5" style={{ color: `${EMERALD}35` }}>
                      {spec.label}
                    </p>
                    <p className="font-inter text-sm" style={{ color: `${EMERALD}75` }}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Price + CTA */}
          <div>
            <div className="border-t pt-6 mb-6" style={{ borderColor: `${EMERALD}10` }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-inter text-[9px] tracking-[0.4em] uppercase mb-0.5" style={{ color: `${EMERALD}35` }}>
                    From
                  </p>
                  <p className="font-inter font-light text-2xl" style={{ color: EMERALD }}>
                    {col.price}
                  </p>
                </div>
                {!picking && (
                  <button
                    onClick={openPicker}
                    className="flex items-center gap-2 font-inter text-[11px] tracking-[0.3em] uppercase px-6 py-3 transition-all"
                    style={{ background: EMERALD, color: CREAM }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#0D2A23')}
                    onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </button>
                )}
              </div>

              {picking && (
                <SizePicker
                  sizes={col.sizes}
                  onPick={handlePickSize}
                  onCancel={closePicker}
                  added={addedSize}
                />
              )}
            </div>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {collections.map((_, i) => (
                <div
                  key={i}
                  className="h-px transition-all duration-500"
                  style={{
                    width: i === activeIndex ? '28px' : '10px',
                    background: i === activeIndex ? EMERALD : `${EMERALD}22`,
                  }}
                />
              ))}
              <span className="ml-2 font-inter text-[10px] tracking-widest" style={{ color: `${EMERALD}35` }}>
                {activeIndex + 1} / {collections.length}
              </span>
            </div>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative z-10 flex-1 flex items-end justify-center overflow-hidden"
          style={{ background: `${EMERALD}06` }}>

          <div className="absolute top-8 right-8 z-20">
            <a
              href="#shop"
              className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.3em] uppercase hover:opacity-60 transition-opacity"
              style={{ color: `${EMERALD}50` }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex + '-img'}
              src={col.image}
              alt={col.name}
              className="h-[88vh] w-auto object-contain object-bottom"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>

          <div className="absolute bottom-8 left-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex + '-tag'}
                className="font-inter font-light text-xs tracking-[0.35em] uppercase"
                style={{ color: `${EMERALD}40` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {col.tagline} — Limited Season Drop
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[1.5px]" style={{ background: `${EMERALD}10` }}>
          <motion.div
            className="h-full"
            style={{ background: EMERALD }}
            animate={{ width: `${((activeIndex + 1) / collections.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </section>

    </div>
  )
}
