import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const galleryItems = [
  { id: 1, src: '/images/gallery1.png', label: 'Pure Luxe — Gold Thread Detail' },
  { id: 2, src: '/images/gallery2.png', label: 'Bloom Series — Floral Chest Embroidery' },
  { id: 3, src: '/images/gallery3.png', label: 'Midnight Edge — Geometric Back Print' },
  { id: 4, src: '/images/gallery4.png', label: 'Earth Roots — Kantha Sleeve Detail' },
  { id: 5, src: '/images/gallery5.png', label: 'Custom Order — Brand Logo Stitch' },
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  // JS-based breakpoint check — eliminates any Tailwind `hidden` class unreliability
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Desktop GSAP horizontal scroll — only wired when desktop renders
  useEffect(() => {
    if (isMobile) return
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const totalWidth = track.scrollWidth - window.innerWidth
      if (totalWidth <= 0) return

      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const velocity = Math.max(-8, Math.min(8, self.getVelocity() / 400))
            gsap.to('.gallery-item', {
              skewX: velocity,
              duration: 0.5,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          },
          onLeave: () => {
            gsap.to('.gallery-item', { skewX: 0, duration: 0.4 })
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [isMobile])

  // Keyboard navigation for fullscreen modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setModalIndex(null)
      if (e.key === 'ArrowLeft')  setModalIndex(i => (i !== null ? Math.max(0, i - 1) : null))
      if (e.key === 'ArrowRight') setModalIndex(i => (i !== null ? Math.min(galleryItems.length - 1, i + 1) : null))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* ══ MOBILE — native snap scroll ══ */}
      {isMobile && (
        <section id="gallery" className="bg-[#111] py-10">

          {/* Header */}
          <div className="px-6 mb-6">
            <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#FAF5E8]/40 mb-3">
              The Gallery
            </p>
            <h2 className="font-inter font-light text-[1.6rem] text-[#FAF5E8] leading-tight tracking-tight">
              Craft in <span className="text-[#FAF5E8]/30">Motion</span>
            </h2>
            <p className="font-inter text-[#FAF5E8]/40 text-xs mt-3 leading-[1.8]">
              Every image a testament to the detail that goes into every SNAZZY piece.
            </p>
          </div>

          {/* Horizontal snap strip */}
          <div
            className="flex overflow-x-auto pb-4 px-6 gap-3"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties}
          >
            {galleryItems.map((item, i) => (
              <div
                key={item.id}
                className="flex-shrink-0 relative overflow-hidden cursor-pointer active:opacity-80 bg-[#1a1a1a]"
                style={{ width: '64vw', height: '72vw', scrollSnapAlign: 'start' }}
                onClick={() => setModalIndex(i)}
              >
                {/* alt="" prevents browser alt-text from duplicating the overlay label */}
                <img
                  src={item.src}
                  alt=""
                  role="presentation"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent">
                  <p className="font-inter text-[10px] text-[#FAF5E8]/80 tracking-wide leading-snug">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
            {/* trailing space so last card isn't flush against edge */}
            <div className="flex-shrink-0 w-2" />
          </div>

        </section>
      )}

      {/* ══ DESKTOP — GSAP horizontal pin ══ */}
      {!isMobile && (
        <section
          ref={containerRef}
          id="gallery"
          className="relative h-screen overflow-hidden bg-white"
        >
          {/* Vertical label */}
          <div className="absolute top-1/2 left-6 -translate-y-1/2 z-10 pointer-events-none">
            <p
              className="font-inter text-[9px] tracking-[0.5em] uppercase text-[#1B3C34]/20 whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Scroll to explore
            </p>
          </div>

          <div
            ref={trackRef}
            className="flex items-center h-full gap-5 pl-24 pr-16 will-change-transform"
          >
            {/* Intro card */}
            <div className="gallery-item flex-shrink-0 w-72 md:w-80 flex flex-col justify-center pr-8 border-r border-[#1B3C34]/10">
              <p className="font-inter text-[10px] tracking-[0.5em] uppercase text-[#1B3C34]/35 mb-5">
                The Gallery
              </p>
              <h2 className="font-inter font-light text-4xl md:text-5xl text-[#1B3C34] leading-tight tracking-tight">
                Craft in<br />
                <span className="text-[#1B3C34]/25">Motion</span>
              </h2>
              <p className="font-inter font-light text-[#1B3C34]/40 text-sm mt-6 leading-7 max-w-xs">
                Every image a testament to the detail that goes into every SNAZZY piece.
              </p>
            </div>

            {/* Image cards */}
            {galleryItems.map((item, i) => (
              <div
                key={item.id}
                className={`gallery-item flex-shrink-0 relative cursor-pointer group overflow-hidden ${
                  i % 2 === 0 ? 'w-64 h-[65vh]' : 'w-52 h-[50vh]'
                } ${i % 3 === 1 ? 'mt-16' : i % 3 === 2 ? '-mt-8' : ''}`}
                onClick={() => setModalIndex(i)}
              >
                <div className="absolute inset-0 bg-[#E8E2DA]" />
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                />
                <div className="absolute inset-0 bg-[#1B3C34]/0 group-hover:bg-[#1B3C34]/15 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] bg-gradient-to-t from-[#1B3C34]/50 to-transparent">
                  <p className="font-inter text-[11px] text-white/90 tracking-wide">{item.label}</p>
                </div>
              </div>
            ))}

            <div className="gallery-item flex-shrink-0 w-20" />
          </div>
        </section>
      )}

      {/* ══ FULLSCREEN MODAL (shared) ══ */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalIndex(null)}
          >
            <button
              className="absolute top-5 right-5 w-11 h-11 border border-[#1B3C34]/15 flex items-center justify-center hover:bg-[#1B3C34]/5 transition-colors z-10"
              onClick={() => setModalIndex(null)}
              aria-label="Close"
            >
              <X className="w-4 h-4 text-[#1B3C34]" />
            </button>

            {modalIndex > 0 && (
              <button
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 border border-[#1B3C34]/15 flex items-center justify-center hover:bg-[#1B3C34]/5 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setModalIndex(i => (i !== null ? Math.max(0, i - 1) : null)) }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-[#1B3C34]" />
              </button>
            )}

            {modalIndex < galleryItems.length - 1 && (
              <button
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 border border-[#1B3C34]/15 flex items-center justify-center hover:bg-[#1B3C34]/5 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setModalIndex(i => (i !== null ? Math.min(galleryItems.length - 1, i + 1) : null)) }}
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-[#1B3C34]" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={modalIndex}
                className="flex flex-col items-center gap-5 px-14 md:px-20 max-w-4xl w-full"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full max-w-[260px] md:max-w-lg aspect-[3/4] overflow-hidden flex items-center justify-center bg-[#FAF5E8]">
                  <img
                    src={galleryItems[modalIndex].src}
                    alt={galleryItems[modalIndex].label}
                    className="max-h-[55vh] max-w-full object-contain"
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                  />
                </div>
                <p className="font-inter text-sm text-[#1B3C34]/50 tracking-wide text-center">
                  {galleryItems[modalIndex].label}
                </p>
                <p className="font-inter text-[10px] text-[#1B3C34]/25 tracking-[0.4em] uppercase">
                  {modalIndex + 1} / {galleryItems.length}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
