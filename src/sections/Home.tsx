import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import bgVideo from '../../assets/logo name.mp4'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(eyebrowRef.current, { y: 30, opacity: 0, duration: 1.5 })
        .from(line1Ref.current, { y: 120, opacity: 0, duration: 2.2 }, '-=0.8')
        .from(line2Ref.current, { y: 120, opacity: 0, duration: 2.2 }, '-=1.8')
        .from(subRef.current, { y: 30, opacity: 0, duration: 1.5 }, '-=1.0')
        .from(btnRef.current, { y: 20, opacity: 0, duration: 1.2 }, '-=1.0')

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
    >
      {/* Background video */}
      <video
        src={bgVideo}
        autoPlay
        muted
        playsInline
        onEnded={(e) => {
          const v = e.currentTarget
          v.currentTime = v.duration
          v.pause()
        }}
        className="absolute inset-0 w-full h-full object-cover scale-125"
      />

      {/* Shade + blur overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="font-bodoni font-black leading-none mb-8 overflow-hidden">
          <span
            ref={line1Ref}
            className="block text-[3.5rem] sm:text-7xl md:text-8xl lg:text-9xl text-white"
          >
            Wear
          </span>
          <span
            ref={line2Ref}
            className="block text-[3.5rem] sm:text-7xl md:text-8xl lg:text-9xl text-white"
          >
            Your Story
          </span>
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
            className="font-inter font-bold text-xs tracking-[0.25em] uppercase px-8 py-4 bg-white text-black hover:bg-[#FAF5E8] transition-colors duration-300"
          >
            Explore Collections
          </a>
        </div>

        <p
          ref={eyebrowRef}
          className="font-inter text-xs tracking-[0.5em] uppercase text-white/60 mt-8"
        >
          Embroidered in India — Worn by the World
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="font-inter text-xs tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}
