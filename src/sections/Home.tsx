import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import logo from '../../assets/logo.png'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLImageElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(eyebrowRef.current, { y: 30, opacity: 0, duration: 1 })
        .from(line1Ref.current, { y: 100, opacity: 0, duration: 1.2 }, '-=0.6')
        .from(line2Ref.current, { y: 100, opacity: 0, duration: 1.2 }, '-=0.9')
        .from(line3Ref.current, { y: 100, opacity: 0, duration: 1.2 }, '-=0.9')
        .from(subRef.current, { y: 30, opacity: 0, duration: 1 }, '-=0.7')
        .from(btnRef.current, { y: 20, opacity: 0, duration: 0.8 }, '-=0.7')

      // Parallax on scroll
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
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="/video/hero.mp4"
        onError={(e) => ((e.target as HTMLVideoElement).style.display = 'none')}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black pointer-events-none" />

      {/* Decorative thread lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
        <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-amber-500/10 to-transparent" />
      </div>

      {/* Dark gradient background (fallback when no video) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-950 via-black to-neutral-900" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          ref={eyebrowRef}
          className="font-inter text-xs tracking-[0.5em] uppercase text-white/60 mb-8"
        >
          Embroidered in India — Worn by the World
        </p>

        <h1 className="font-bodoni font-black leading-none mb-8 overflow-hidden">
          <span
            ref={line1Ref}
            className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white"
          >
            Wear
          </span>
          <span
            ref={line2Ref}
            className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white"
          >
            Your Story
          </span>
          <img
            ref={line3Ref}
            src={logo}
            alt="SNAZZY Logo"
            className="block w-64 sm:w-72 md:w-80 lg:w-96 mx-auto mt-4"
            style={{ maxWidth: '400px' }}
          />
        </h1>

        <p
          ref={subRef}
          className="font-inter font-light text-base md:text-lg text-white/60 tracking-wider max-w-lg mx-auto mb-12"
        >
          Handcrafted embroidery on premium cotton. Every stitch is a story.
        </p>

        <div ref={btnRef} className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#collections"
            className="font-inter font-bold text-xs tracking-[0.25em] uppercase px-8 py-4 bg-white text-black rounded-full hover:scale-105 transition-transform duration-300"
          >
            Explore Collections
          </a>
          <a
            href="#heritage"
            className="font-inter font-light text-xs tracking-[0.25em] uppercase px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="font-inter text-xs tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}
