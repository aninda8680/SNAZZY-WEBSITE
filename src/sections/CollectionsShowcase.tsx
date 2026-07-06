import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

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
}

const collections: Collection[] = [
  {
    number: '01',
    name: 'PURE LUXE',
    tagline: 'Gold Thread',
    description:
      "Our flagship collection on 100% Pima cotton, featuring hand-placed gold metallic embroidery. Produced in limited runs of 50.",
    specs: [
      { label: 'Fabric', value: '100% Pima Cotton' },
      { label: 'Thread', value: 'Gold Metallic' },
      { label: 'Technique', value: 'Multi-Head Digital' },
      { label: 'Care', value: 'Cold Wash Only' },
    ],
    image: '/images/tshirt-luxe.png',
    productId: 1,
    price: '₹1,499',
    priceNum: 1499,
  },
  {
    number: '02',
    name: 'BLOOM SERIES',
    tagline: 'Botanical Thread Art',
    description:
      'Japanese botanical illustration translated into dense satin-stitch embroidery on super-soft jersey blend.',
    specs: [
      { label: 'Fabric', value: '220gsm Jersey' },
      { label: 'Thread', value: 'Silk-Finish Poly' },
      { label: 'Technique', value: 'Satin & Stem Stitch' },
      { label: 'Care', value: 'Gentle Cycle 30°C' },
    ],
    image: '/images/tshirt-bloom.png',
    productId: 3,
    price: '₹1,599',
    priceNum: 1599,
  },
  {
    number: '03',
    name: 'MIDNIGHT EDGE',
    tagline: 'Geometric Precision',
    description:
      'High-contrast geometric embroidery on 280gsm heavyweight cotton — angular, sharp, unforgettable.',
    specs: [
      { label: 'Fabric', value: '280gsm Cotton' },
      { label: 'Thread', value: 'High-Sheen Rayon' },
      { label: 'Technique', value: 'Fill & Run Stitch' },
      { label: 'Care', value: 'Machine Wash Cold' },
    ],
    image: '/images/tshirt-midnight.png',
    productId: 5,
    price: '₹1,699',
    priceNum: 1699,
  },
  {
    number: '04',
    name: 'EARTH ROOTS',
    tagline: 'Heritage Reimagined',
    description:
      'Drawing from centuries of South Asian artisan traditions — kantha, zardozi, kutch — on contemporary silhouettes.',
    specs: [
      { label: 'Fabric', value: 'Organic Cotton' },
      { label: 'Thread', value: 'Natural Fibre' },
      { label: 'Technique', value: 'Chain & Kantha Stitch' },
      { label: 'Care', value: 'Hand Wash Preferred' },
    ],
    image: '/images/tshirt-earth.png',
    productId: 6,
    price: '₹1,499',
    priceNum: 1499,
  },
]

export default function CollectionsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const containerRef   = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  const col = collections[activeIndex]

  const handleAdd = (c: Collection) =>
    addItem({ id: String(c.productId), name: c.name, price: c.price, priceNum: c.priceNum, accent: EMERALD })

  // Desktop-only scroll trigger (GSAP matchMedia prevents it running on mobile)
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
          MOBILE  — arrow carousel (< md)
          ══════════════════════════════════ */}
      <section className="md:hidden overflow-hidden" style={{ background: CREAM }}>

        {/* Section header — dark editorial block */}
        <div className="px-6 pt-12 pb-8 bg-[#111]">
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase mb-2 text-[#FAF5E8]/60">
            Our Collections
          </p>
          <h2 className="font-bodoni text-[1.6rem] tracking-tight uppercase text-[#FAF5E8]">
            New Drops
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex + '-mob'}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Product image — full-bleed cream stage */}
            <div
              className="relative h-[65vw] flex items-end justify-center overflow-hidden"
              style={{ background: CREAM }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <p
                  className="font-inter font-black leading-none tracking-tighter whitespace-nowrap select-none"
                  style={{ fontSize: '22vw', color: '#11111108' }}
                >
                  {col.name}
                </p>
              </div>
              <img
                src={col.image}
                alt={col.name}
                className="h-full w-auto object-contain relative z-10"
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
              />
            </div>

            {/* Details */}
            <div className="px-6 pt-5 pb-6 bg-[#FAF5E8]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-inter text-[9px] tracking-[0.4em] uppercase mb-1 text-[#999]">
                    Collection {col.number}
                  </p>
                  <h3 className="font-bodoni text-[1.4rem] tracking-tight leading-tight uppercase" style={{ color: '#1B3C34' }}>
                    {col.name}
                  </h3>
                  <p className="font-inter text-xs tracking-[0.25em] uppercase mt-1 text-[#555]">
                    {col.tagline}
                  </p>
                </div>
                <p className="font-inter font-light text-xl flex-shrink-0 mt-6 text-[#111]">
                  {col.price}
                </p>
              </div>

              <p className="font-inter font-light text-sm leading-[1.8] mb-6 text-[#555]">
                {col.description}
              </p>

              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {col.specs.map((spec) => (
                  <div key={spec.label} className="border-l-2 border-[#111]/10 pl-3">
                    <p className="font-inter text-[9px] tracking-[0.3em] uppercase mb-0.5 text-[#999]">
                      {spec.label}
                    </p>
                    <p className="font-inter text-sm font-medium text-[#111]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Add to Bag — outside animation so it doesn't slide on every change */}
        <div className="px-6 pb-5 pt-2 bg-[#FAF5E8]">
          <button
            onClick={() => handleAdd(col)}
            className="w-full py-4 font-inter text-[11px] tracking-[0.4em] uppercase flex items-center justify-center gap-2 transition-colors active:opacity-80 bg-[#111] text-[#FAF5E8]"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag
          </button>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between px-6 pb-8 border-t border-[#111]/10 pt-4 bg-[#FAF5E8]">
          <button
            onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="w-12 h-12 flex items-center justify-center border border-[#111]/20 text-[#111] transition-colors disabled:opacity-25"
            aria-label="Previous collection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {collections.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to collection ${i + 1}`}
                className="h-11 min-w-[20px] px-1 flex items-center justify-center"
              >
                <span
                  className="block h-px transition-all duration-400"
                  style={{
                    width: i === activeIndex ? '28px' : '10px',
                    background: i === activeIndex ? '#111111' : 'rgba(17,17,17,0.25)',
                  }}
                />
              </button>
            ))}
            <span className="ml-1 font-inter text-[10px] tracking-widest text-[#999]">
              {activeIndex + 1} / {collections.length}
            </span>
          </div>

          <button
            onClick={() => setActiveIndex(i => Math.min(collections.length - 1, i + 1))}
            disabled={activeIndex === collections.length - 1}
            className="w-12 h-12 flex items-center justify-center border border-[#111]/20 text-[#111] transition-colors disabled:opacity-25"
            aria-label="Next collection"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════
          DESKTOP — GSAP scroll-pin (≥ md)
          ══════════════════════════════════ */}
      <section
        ref={containerRef}
        className="hidden md:block relative h-screen w-full overflow-hidden"
        style={{ background: CREAM }}
      >
        {/* Oversized watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex + '-wm'}
              className="font-inter font-black text-[18vw] leading-none tracking-tighter whitespace-nowrap"
              style={{ color: `${EMERALD}06` }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6 }}
            >
              {col.name}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Main layout */}
        <div className="relative z-10 h-full flex flex-col md:flex-row">

          {/* Left panel */}
          <div
            className="flex flex-col justify-between px-12 pt-28 pb-10 w-[38%] border-r"
            style={{ borderColor: `${EMERALD}12` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex + '-left'}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-inter text-[10px] tracking-[0.5em] uppercase" style={{ color: `${EMERALD}45` }}>
                    Collection
                  </span>
                  <span className="font-inter font-light text-5xl leading-none" style={{ color: `${EMERALD}18` }}>
                    {col.number}
                  </span>
                </div>

                <h2
                  className="font-inter font-light text-4xl md:text-5xl leading-tight tracking-tight mb-2"
                  style={{ color: EMERALD }}
                >
                  {col.name}
                </h2>
                <p className="font-inter text-xs tracking-[0.3em] uppercase mb-8" style={{ color: `${EMERALD}55` }}>
                  {col.tagline}
                </p>

                <p className="font-inter font-light text-sm leading-7 max-w-xs mb-10" style={{ color: `${EMERALD}60` }}>
                  {col.description}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-10">
                  {col.specs.map((spec) => (
                    <div key={spec.label} className="border-l pl-3" style={{ borderColor: `${EMERALD}25` }}>
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

            {/* Price + CTA + dots */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex + '-cta'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <div
                  className="flex items-center justify-between mb-6 pb-5 border-b"
                  style={{ borderColor: `${EMERALD}10` }}
                >
                  <div>
                    <p className="font-inter text-[9px] tracking-[0.4em] uppercase mb-0.5" style={{ color: `${EMERALD}35` }}>
                      From
                    </p>
                    <p className="font-inter font-light text-2xl" style={{ color: EMERALD }}>
                      {col.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(col)}
                    className="flex items-center gap-2 font-inter text-[11px] tracking-[0.3em] uppercase px-6 py-3 transition-all duration-200"
                    style={{ background: EMERALD, color: CREAM }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#0D2A23')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = EMERALD)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {collections.map((_, i) => (
                    <div
                      key={i}
                      className="h-px transition-all duration-500"
                      style={{
                        width: i === activeIndex ? '28px' : '10px',
                        background: i === activeIndex ? EMERALD : `${EMERALD}25`,
                      }}
                    />
                  ))}
                  <span className="ml-2 font-inter text-[10px] tracking-widest" style={{ color: `${EMERALD}35` }}>
                    {activeIndex + 1} / {collections.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel — image */}
          <div
            className="relative flex-1 flex items-end justify-center overflow-hidden"
            style={{ background: `${EMERALD}08` }}
          >
            <div className="absolute top-8 right-8 z-10">
              <a
                href="#shop"
                className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
                style={{ color: `${EMERALD}50` }}
              >
                View all <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex + '-img'}
                className="h-[85vh] flex items-end"
                initial={{ opacity: 0, y: '6%' }}
                animate={{ opacity: 1, y: '0%' }}
                exit={{ opacity: 0, y: '-4%' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                    const fb = img.nextSibling as HTMLElement
                    if (fb) fb.style.display = 'flex'
                  }}
                />
                <div
                  className="hidden h-full w-72 items-center justify-center border"
                  style={{ borderColor: `${EMERALD}15` }}
                >
                  <p
                    className="font-inter text-sm tracking-widest text-center px-4 uppercase"
                    style={{ color: `${EMERALD}30` }}
                  >
                    {col.name}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 left-8 right-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex + '-hl'}
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
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `${EMERALD}12` }}>
          <motion.div
            className="h-full"
            style={{ background: EMERALD }}
            animate={{ width: `${((activeIndex + 1) / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </section>

    </div>
  )
}
