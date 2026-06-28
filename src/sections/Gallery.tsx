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

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    // Wait a tick so all CSS widths are applied before measuring
    const init = () => {
      const totalWidth = track.scrollWidth - window.innerWidth
      if (totalWidth <= 0) return  // not enough content to scroll horizontally

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
            const velocity = Math.max(-12, Math.min(12, self.getVelocity() / 300))
            gsap.to('.gallery-item', {
              skewX: velocity,
              duration: 0.5,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          },
          onLeave: () => {
            // Reset skew when user scrolls past gallery
            gsap.to('.gallery-item', { skewX: 0, duration: 0.4 })
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }

    const cleanup = init()
    return () => { cleanup?.() }
  }, [])

  const closeModal = () => setModalIndex(null)
  const prevModal  = () => setModalIndex((i) => (i !== null ? Math.max(0, i - 1) : null))
  const nextModal  = () => setModalIndex((i) => (i !== null ? Math.min(galleryItems.length - 1, i + 1) : null))

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft')  prevModal()
      if (e.key === 'ArrowRight') nextModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <section ref={containerRef} id="gallery" className="relative h-screen overflow-hidden bg-black">
        {/* Vertical label */}
        <div className="absolute top-1/2 left-6 -translate-y-1/2 z-10 pointer-events-none">
          <p
            className="font-inter text-xs tracking-[0.5em] uppercase text-white/20 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Scroll to explore
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex items-center h-full gap-6 pl-24 pr-16 will-change-transform"
        >
          {/* Intro card */}
          <div className="gallery-item flex-shrink-0 w-72 md:w-96 flex flex-col justify-center pr-8">
            <p className="font-inter text-xs tracking-[0.5em] uppercase text-amber-400 mb-6">
              The Gallery
            </p>
            <h2 className="font-bodoni font-black text-5xl md:text-6xl text-white leading-tight">
              Craft in<br />
              <em className="italic text-white/40">Motion</em>
            </h2>
            <p className="font-inter font-light text-white/40 text-sm mt-6 leading-7 max-w-xs">
              Every image a testament to the detail that goes into every SNAZZY piece.
            </p>
          </div>

          {/* Image cards */}
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`gallery-item flex-shrink-0 relative cursor-pointer group overflow-hidden rounded-sm ${
                i % 2 === 0 ? 'w-72 h-[68vh]' : 'w-56 h-[52vh]'
              } ${i % 3 === 1 ? 'mt-16' : i % 3 === 2 ? '-mt-8' : ''}`}
              onClick={() => setModalIndex(i)}
            >
              {/* Fallback bg shown until image loads or on error */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(${120 + i * 25}deg, #111 0%, #222 100%)` }}
              />
              <img
                src={item.src}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/70 to-transparent">
                <p className="font-inter text-xs text-white/90 tracking-wide">{item.label}</p>
              </div>
            </div>
          ))}

          <div className="gallery-item flex-shrink-0 w-24" />
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              onClick={closeModal}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev */}
            {modalIndex > 0 && (
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); prevModal() }}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Next */}
            {modalIndex < galleryItems.length - 1 && (
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); nextModal() }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={modalIndex}
                className="flex flex-col items-center gap-5 px-20 max-w-4xl w-full"
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-full max-w-lg aspect-[3/4] rounded-sm overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}
                >
                  <img
                    src={galleryItems[modalIndex].src}
                    alt={galleryItems[modalIndex].label}
                    className="max-h-[70vh] max-w-full object-contain"
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                  />
                </div>
                <p className="font-inter text-sm text-white/60 tracking-wide text-center">
                  {galleryItems[modalIndex].label}
                </p>
                <p className="font-inter text-xs text-white/25 tracking-[0.3em] uppercase">
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
