import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import bgVideo from '../../assets/logo name.mp4'
import mobileBg from '../../assets/mobile bg.png'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const line1Ref     = useRef<HTMLSpanElement>(null)
  const line2Ref     = useRef<HTMLSpanElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const btnRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(eyebrowRef.current,  { y: 30,  opacity: 0, duration: 1.5 })
        .from(line1Ref.current,    { y: 120, opacity: 0, duration: 2.2 }, '-=0.8')
        .from(line2Ref.current,    { y: 120, opacity: 0, duration: 2.2 }, '-=1.8')
        .from(subRef.current,      { y: 30,  opacity: 0, duration: 1.5 }, '-=1.0')
        .from(btnRef.current,      { y: 20,  opacity: 0, duration: 1.2 }, '-=1.0')

      gsap.to(containerRef.current, {
        scale: 0.88,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >

      {/* ── MOBILE HERO ── */}
      <div className="md:hidden absolute inset-0">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(175deg, rgba(8,21,16,0.82) 0%, rgba(27,60,52,0.65) 60%, rgba(10,30,24,0.84) 100%), url(${mobileBg})`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* ── DESKTOP background ── */}
      <div className="hidden md:block">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0A1C17 0%, #1B3C34 50%, #0D2A23 100%)' }}
        />
        <video
          src={bgVideo}
          autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover scale-125 opacity-75"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      {/* ── Shared content (mobile + desktop) ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
        <p ref={eyebrowRef}
          className="font-inter text-[10px] tracking-[0.45em] uppercase text-white/50 mb-6">
          Embroidered in India — Worn by the World
        </p>

        <h1 className="font-bodoni font-black leading-[0.92] mb-6 overflow-hidden">
          <span ref={line1Ref} className="block text-[3.8rem] sm:text-7xl md:text-8xl lg:text-9xl text-white">
            Wear
          </span>
          <span ref={line2Ref} className="block text-[3.8rem] sm:text-7xl md:text-8xl lg:text-9xl text-white">
            Your Story
          </span>
        </h1>

        <p ref={subRef}
          className="font-inter font-light text-sm md:text-lg text-white/55 tracking-wider max-w-sm md:max-w-lg mx-auto mb-10">
          Handcrafted embroidery on premium cotton. Every stitch is a story.
        </p>

        <div ref={btnRef} className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#collections"
            className="font-inter font-bold text-xs tracking-[0.25em] uppercase px-8 py-4 min-h-[52px] flex items-center bg-white text-[#1B3C34] hover:bg-[#FAF5E8] active:opacity-80 transition-colors duration-300">
            Explore Collections
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 z-10">
        <span className="font-inter text-xs tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </section>
  )
}
