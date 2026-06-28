import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

interface Collection {
  number: string
  name: string
  headline: string
  description: string
  specs: { label: string; value: string }[]
  image: string
  bgFrom: string
  bgTo: string
  accent: string
  textAccent: string
}

const collections: Collection[] = [
  {
    number: '01',
    name: 'PURE LUXE',
    headline: 'Crafted in Gold Thread',
    description:
      "Our flagship collection on 100% Pima cotton, featuring hand-placed gold metallic embroidery. Produced in limited runs of 50 — every PURE LUXE is a collector's item.",
    specs: [
      { label: 'Fabric', value: '100% Pima Cotton' },
      { label: 'Thread', value: 'Gold Metallic' },
      { label: 'Technique', value: 'Multi-Head Digital' },
      { label: 'Care', value: 'Cold Wash Only' },
    ],
    image: '/images/tshirt-luxe.png',
    bgFrom: '#1A0F00',
    bgTo: '#3D2800',
    accent: '#F59E0B',
    textAccent: '#FDE68A',
  },
  {
    number: '02',
    name: 'BLOOM SERIES',
    headline: 'Nature Woven Into Thread',
    description:
      'Inspired by Japanese botanical illustration, our Bloom Series translates delicate floral motifs into dense satin-stitch embroidery on super-soft jersey blend.',
    specs: [
      { label: 'Fabric', value: '220gsm Jersey' },
      { label: 'Thread', value: 'Silk-Finish Poly' },
      { label: 'Technique', value: 'Satin & Stem Stitch' },
      { label: 'Care', value: 'Gentle Cycle 30°C' },
    ],
    image: '/images/tshirt-bloom.png',
    bgFrom: '#2D0A1E',
    bgTo: '#5C1A3A',
    accent: '#F9A8D4',
    textAccent: '#FBCFE8',
  },
  {
    number: '03',
    name: 'MIDNIGHT EDGE',
    headline: 'Bold Design for Bold Souls',
    description:
      'High-contrast geometric embroidery on 280gsm heavyweight cotton. MIDNIGHT EDGE is designed for those who make every entrance count — angular, sharp, unforgettable.',
    specs: [
      { label: 'Fabric', value: '280gsm Cotton' },
      { label: 'Thread', value: 'High-Sheen Rayon' },
      { label: 'Technique', value: 'Fill & Run Stitch' },
      { label: 'Care', value: 'Machine Wash Cold' },
    ],
    image: '/images/tshirt-midnight.png',
    bgFrom: '#020617',
    bgTo: '#0F172A',
    accent: '#93C5FD',
    textAccent: '#BFDBFE',
  },
  {
    number: '04',
    name: 'EARTH ROOTS',
    headline: 'Heritage Patterns, Modern Fit',
    description:
      'Drawing from centuries of South Asian artisan traditions — kantha, zardozi, kutch — reimagined on contemporary streetwear silhouettes. Heritage never looked this relevant.',
    specs: [
      { label: 'Fabric', value: 'Organic Cotton' },
      { label: 'Thread', value: 'Natural Fibre' },
      { label: 'Technique', value: 'Chain & Kantha Stitch' },
      { label: 'Care', value: 'Hand Wash Preferred' },
    ],
    image: '/images/tshirt-earth.png',
    bgFrom: '#1A0E07',
    bgTo: '#3D2010',
    accent: '#D4A574',
    textAccent: '#E5C5A0',
  },
]

export default function CollectionsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=1400',
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
  }, [])

  const col = collections[activeIndex]

  return (
    <section
      ref={containerRef}
      id="collections"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex + '-bg'}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: `radial-gradient(ellipse at 60% 50%, ${col.bgTo}cc, ${col.bgFrom} 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i + '-' + activeIndex}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: col.accent,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              opacity: 0.15 + (i % 4) * 0.05,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-0">

        {/* Left column */}
        <div className="flex flex-col justify-center px-8 md:px-12 pt-24 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + '-left'}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-bodoni text-[120px] md:text-[160px] font-black leading-none text-white/5 select-none mb-4">
                {col.number}
              </p>
              <p
                className="font-inter text-xs tracking-[0.5em] uppercase mb-3"
                style={{ color: col.accent }}
              >
                Collection {col.number}
              </p>
              <h2 className="font-bodoni font-black text-3xl md:text-4xl text-white leading-tight mb-4">
                {col.name}
              </h2>
              <p className="font-inter font-bold text-sm text-white/70 mb-8 tracking-wide">
                {col.headline}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="font-inter font-bold text-xs tracking-[0.2em] uppercase px-7 py-3 border rounded-full transition-all duration-300 hover:scale-105"
                  style={{ borderColor: col.accent + '60', color: col.textAccent, background: col.accent + '15' }}
                >
                  Shop Collection
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I want this ${col.name} shirt`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-inter font-bold text-xs tracking-[0.2em] uppercase px-7 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: col.textAccent, color: col.bgFrom }}
                >
                  Buy on WhatsApp
                </a>
              </div>

              {/* Dots nav */}
              <div className="flex gap-3 mt-12">
                {collections.map((_, i) => (
                  <div
                    key={i}
                    className="h-px transition-all duration-500"
                    style={{
                      width: i === activeIndex ? '32px' : '16px',
                      backgroundColor: i === activeIndex ? col.accent : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center — product image */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + '-img'}
              className="relative"
              initial={{ y: '60%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-30%', opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={col.image}
                alt={col.name}
                className="h-[70vh] w-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.style.display = 'none'
                  const fallback = img.nextSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              {/* Image fallback */}
              <div
                className="hidden h-[70vh] w-64 rounded-lg items-center justify-center border border-white/10"
                style={{ background: `linear-gradient(135deg, ${col.bgFrom}, ${col.bgTo})` }}
              >
                <p className="font-bodoni text-white/30 text-xl text-center px-4">{col.name}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center px-8 md:px-12 pb-8 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + '-right'}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="font-inter font-light text-white/50 text-sm leading-8 mb-10 max-w-xs">
                {col.description}
              </p>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-6">
                {col.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="border-l-2 pl-4"
                    style={{ borderColor: col.accent + '40' }}
                  >
                    <p className="font-inter text-xs tracking-[0.2em] uppercase text-white/30 mb-1">
                      {spec.label}
                    </p>
                    <p className="font-inter font-bold text-sm text-white/80">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Price tag */}
              <div className="mt-10 pt-10 border-t border-white/10">
                <p className="font-inter text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                  Starting From
                </p>
                <p className="font-bodoni font-bold text-3xl" style={{ color: col.textAccent }}>
                  ₹1,499
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: col.accent }}
          animate={{ width: `${((activeIndex + 1) / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </section>
  )
}
