import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: '2018', label: 'Founded' },
  { num: '500+', label: 'Designs' },
  { num: '12K+', label: 'Happy Customers' },
  { num: '100%', label: 'Premium Cotton' },
]

export default function Heritage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image clip-path reveal
      gsap.from(imgRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      // Parallax on the image
      const heroImg = imgRef.current?.querySelector('img')
      gsap.to(heroImg ?? imgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Text stagger reveal
      const textChildren = textBlockRef.current
        ? Array.from(textBlockRef.current.children)
        : []
      gsap.from(textChildren, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textBlockRef.current,
          start: 'top 75%',
        },
      })

      // Stats
      gsap.from('.heritage-stat', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.heritage-stats',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="relative bg-[#050505] py-24 md:py-36 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-16 md:gap-24">

          {/* Left — image */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <div
              ref={imgRef}
              className="relative overflow-hidden rounded-sm"
              style={{ clipPath: 'inset(0 0 0 0)' }}
            >
              <img
                src="/images/heritage.png"
                alt="Heritage craftsmanship"
                className="w-full h-[60vh] md:h-[70vh] object-cover grayscale mix-blend-luminosity"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  el.parentElement!.style.background = 'linear-gradient(135deg, #1a1a1a, #333)'
                  el.parentElement!.style.minHeight = '60vh'
                }}
              />
              {/* Amber overlay */}
              <div className="absolute inset-0 bg-amber-900/20 mix-blend-color" />
            </div>
          </div>

          {/* Right — text */}
          <div className="w-full md:w-7/12">
            <div ref={textBlockRef}>
              <p className="font-inter text-xs tracking-[0.5em] uppercase text-amber-400 mb-6">
                Est. 2018
              </p>
              <h2 className="font-bodoni font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-8">
                A Legacy of<br />
                <em className="italic text-white/70">Perfection</em>
              </h2>
              <p className="font-inter font-light text-white/60 text-base leading-8 mb-6 max-w-lg">
                Born in a small Hyderabad studio, SNAZZY began with a singular belief:
                embroidery is not decoration — it is a language. Since 2018, we have fused
                traditional South Asian needlecraft with contemporary streetwear silhouettes,
                creating pieces that speak across generations.
              </p>
              <p className="font-inter font-light text-white/50 text-base leading-8 mb-12 max-w-lg">
                Every thread pulled through fabric carries the memory of a craftsman's hand.
                Every design begins with a sketch and ends as thousands of individual stitches —
                each placed with mechanical precision guided by an artisan's eye.
              </p>

              <a
                href="#contact"
                className="inline-block font-inter font-bold text-xs tracking-[0.25em] uppercase px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                Our Story
              </a>
            </div>

            {/* Stats */}
            <div className="heritage-stats grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
              {stats.map((s) => (
                <div key={s.label} className="heritage-stat">
                  <p className="font-bodoni font-bold text-2xl md:text-3xl text-white mb-1">
                    {s.num}
                  </p>
                  <p className="font-inter text-xs tracking-[0.2em] uppercase text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
