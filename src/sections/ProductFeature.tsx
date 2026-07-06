import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import bgImage from '../../assets/baground.png'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  { label: 'Thoughtful Design',    desc: 'Every detail has a purpose.' },
  { label: 'Quality Materials',    desc: 'Chosen for comfort and durability.' },
  { label: 'Expert Craftsmanship', desc: 'Stitched with precision and care.' },
  { label: 'Built to Last',        desc: 'Made to be worn. Made to stay.' },
]

export default function ProductFeature() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop only: slide in from sides
      mm.add('(min-width: 768px)', () => {
        gsap.from('.pf-text-desk', {
          x: -50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        })
        gsap.from('.pf-img-desk', {
          x: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        })
      })

      // Mobile only: gentle fade up
      mm.add('(max-width: 767px)', () => {
        gsap.from('.pf-img-mob', {
          y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        })
        gsap.from('.pf-text-mob', {
          y: 24, opacity: 0, duration: 0.7, delay: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        })
      })

      // Pillars — both breakpoints
      gsap.from('.pf-pillar', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.pf-pillars', start: 'top 90%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">

      {/* ══════════════════════════════════════
          MOBILE — image on top, text below
          ══════════════════════════════════════ */}
      <div className="md:hidden">

        {/* Full-width image — tall and impactful */}
        <div className="pf-img-mob relative w-full overflow-hidden" style={{ height: '55vh', minHeight: 240 }}>
          <img
            src={bgImage}
            alt="Snazzy embroidered garment"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#1B3C34]/10" />
        </div>

        {/* Text block */}
        <div className="pf-text-mob bg-[#FAF5E8] px-5 pt-7 pb-8">
          <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-[#555] mb-4">
            Premium Embroidered Streetwear
          </p>
          <h2 className="font-inter font-bold text-[1.75rem] leading-[1.15] tracking-tight text-[#111] mb-4">
            Crafted to<br />Be Remembered.
          </h2>
          <div className="w-8 h-px bg-[#111]/20 mb-5" />
          <p className="font-inter font-light text-[#555] text-sm leading-[1.75] mb-7">
            Every Snazzy piece is thoughtfully embroidered, produced in limited
            quantities, and created to celebrate craftsmanship over fast fashion.
          </p>
          <a
            href="#shop"
            className="flex w-full items-center justify-center gap-3 font-inter text-[10px] tracking-[0.4em] uppercase px-7 py-4 bg-[#111] text-[#FAF5E8] active:bg-black transition-colors"
          >
            Shop Collection
            <span className="text-xs leading-none">→</span>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — split left / right
          ══════════════════════════════════════ */}
      <div className="hidden md:flex relative min-h-screen">

        {/* Left — text */}
        <div className="pf-text-desk relative z-10 flex flex-col justify-center px-16 lg:px-24 w-1/2 border-r border-[#1B3C34]/8">
          <p className="font-inter text-[10px] tracking-[0.5em] uppercase text-[#1B3C34]/40 mb-6">
            Premium Embroidered Streetwear
          </p>
          <h2 className="font-inter font-light text-5xl lg:text-6xl text-[#1B3C34] leading-tight mb-6 tracking-tight">
            Crafted to<br />Be Remembered.
          </h2>
          <div className="w-8 h-px bg-[#1B3C34]/30 mb-8" />
          <p className="font-inter font-light text-[#1B3C34]/50 text-sm leading-8 max-w-md mb-10">
            Every Snazzy piece is thoughtfully embroidered, produced in limited
            quantities, and created to celebrate craftsmanship over fast fashion.
          </p>
          <a
            href="#shop"
            className="inline-flex items-center gap-3 font-inter text-[11px] tracking-[0.3em] uppercase px-8 py-4 bg-[#1B3C34] text-white hover:bg-black transition-colors w-fit"
          >
            Shop Collection
            <span className="text-sm leading-none">→</span>
          </a>
        </div>

        {/* Right — image */}
        <div className="pf-img-desk relative w-1/2 min-h-screen overflow-hidden">
          <img
            src={bgImage}
            alt="Snazzy embroidered garment"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FAF5E8]/20" />
        </div>
      </div>

      {/* Pillars bar — dark 2×2 hairline grid on mobile, 4-col cream hairline on md+ */}
      <div className="pf-pillars bg-[#111] md:bg-[#FAF5E8] border-t border-white/10 md:border-[#1B3C34]/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 md:bg-[#1B3C34]/10">
          {pillars.map((item) => (
            <div
              key={item.label}
              className="pf-pillar bg-[#111] md:bg-[#FAF5E8] px-4 py-4 md:px-8 md:py-5"
            >
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#FAF5E8] md:text-gray-700 mb-1">
                {item.label}
              </p>
              <p className="font-inter text-[#FAF5E8]/50 md:text-gray-400 text-xs leading-5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
