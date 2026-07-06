import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '300+', label: 'Thread colours' },
  { value: '6hrs', label: 'Per complex design' },
  { value: '800', label: 'Stitches / minute' },
  { value: '100%', label: 'Hand-quality checked' },
]

export default function Heritage() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const imgRef      = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)

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

      // Subtle parallax on the image
      const heroImg = imgRef.current?.querySelector('img')
      gsap.to(heroImg ?? imgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Text block fade-in
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 75%',
        },
      })

      // Stats stagger
      gsap.from('.heritage-stat', {
        opacity: 0,
        y: 20,
        duration: 0.6,
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
      className="relative bg-[#050505] py-12 md:py-36 overflow-hidden"
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24">

          {/* Left — image */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <div
              ref={imgRef}
              className="relative overflow-hidden"
              style={{ clipPath: 'inset(0 0 0 0)' }}
            >
              <img
                src="/images/heritage.png"
                alt="Heritage craftsmanship"
                className="w-full h-[55vw] md:h-[70vh] object-cover grayscale mix-blend-luminosity"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  el.parentElement!.style.background = 'linear-gradient(135deg, #1a1a1a, #2a3a32)'
                  el.parentElement!.style.minHeight = '55vw'
                }}
              />
              {/* Emerald colour overlay */}
              <div className="absolute inset-0 bg-[#1B3C34]/15 mix-blend-color" />
            </div>
          </div>

          {/* Right — brand story */}
          <div ref={textRef} className="w-full md:w-7/12">
            <p className="font-inter text-[10px] tracking-[0.5em] uppercase text-white/25 mb-5">
              Our Heritage
            </p>
            <h2 className="font-inter font-light text-3xl md:text-5xl text-white leading-tight tracking-tight mb-8">
              Craft Forged<br />
              <span className="text-white/30">in India</span>
            </h2>
            <p className="font-inter font-light text-sm md:text-base text-white/50 leading-7 md:leading-8 mb-6 md:mb-8 max-w-lg">
              SNAZZY was born from a single conviction — that embroidery is not decoration, it's
              identity. Every piece we make carries the weight of South Asian artisan tradition,
              reinterpreted through a modern lens and executed with precision machines.
            </p>
            <p className="hidden md:block font-inter font-light text-base text-white/35 leading-8 mb-12 max-w-lg">
              Our studio in Vizianagram runs multi-head embroidery machines that work alongside
              our designers, translating digital sketches into dense thread patterns that won't
              fade, crack, or peel. No screen printing. No shortcuts.
            </p>

            {/* Stats */}
            <div className="heritage-stats grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="heritage-stat bg-[#050505] p-4 md:p-6 group hover:bg-[#1B3C34]/20 transition-colors duration-300"
                >
                  <p className="font-inter font-light text-2xl md:text-3xl text-[#FAF5E8] mb-1">
                    {value}
                  </p>
                  <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/30">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 md:mt-10 font-inter font-light italic text-sm md:text-base text-white/25 leading-7 max-w-sm">
              "We don't just put logos on fabric. We put stories on skin."
            </p>
            <p className="mt-2 font-inter text-[10px] tracking-[0.35em] uppercase text-white/15">
              — Founder, SNAZZY
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
