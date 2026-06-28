import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', title: 'Design', desc: 'Every piece starts as a digital sketch — colors, stitch paths, and thread counts mapped to the millimetre.' },
  { num: '02', title: 'Thread', desc: 'We source only premium polyester, rayon, and metallic threads — 300+ shades available on demand.' },
  { num: '03', title: 'Stitch', desc: 'Our 6-head embroidery machines run at 800 stitches per minute. A single complex design can take 6 hours.' },
  { num: '04', title: 'Finish', desc: 'Every garment is hand-trimmed, quality-checked, and steam-pressed before it earns the SNAZZY label.' },
]

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef     = useRef<HTMLImageElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax — no conflicting inline transform on the img element
      gsap.fromTo(
        bgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      // Heading fade in
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 65%',
          },
        }
      )

      // Steps stagger
      gsap.from('.craft-step', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.craft-steps',
          start: 'top 78%',
        },
      })

      // Pull quote
      gsap.from('.craft-quote', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.craft-quote',
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative min-h-screen bg-black overflow-hidden py-24"
    >
      {/* Parallax background image — no inline transform, GSAP handles it */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src="/images/craftsmanship.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      {/* Rotating decorative ring — @keyframes spin defined in index.css */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.04]">
        <div
          className="w-full h-full rounded-full border-2 border-dashed border-amber-400"
          style={{ animation: 'spin 120s linear infinite' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-24">
          <p className="font-inter text-xs tracking-[0.5em] uppercase text-amber-400 mb-6">
            The Process
          </p>
          <h2 className="font-bodoni font-black text-5xl md:text-7xl lg:text-8xl text-white leading-tight">
            Unseen<br />
            <span className="italic text-white/40">Precision</span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="craft-steps grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="craft-step group">
              <div className="border border-white/10 rounded-sm p-8 h-full hover:border-amber-400/40 hover:bg-white/5 transition-all duration-500">
                <p className="font-bodoni text-5xl font-bold text-white/10 group-hover:text-amber-400/30 transition-colors duration-500 mb-6">
                  {step.num}
                </p>
                <h3 className="font-bodoni font-bold text-2xl text-white mb-4">
                  {step.title}
                </h3>
                <p className="font-inter font-light text-white/50 text-sm leading-7">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="craft-quote mt-24 text-center border-t border-white/10 pt-16">
          <blockquote className="font-bodoni italic text-2xl md:text-4xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            "Every stitch is a decision. Every thread is a commitment."
          </blockquote>
          <p className="mt-6 font-inter text-xs tracking-[0.3em] uppercase text-white/30">
            — SNAZZY Craft Philosophy
          </p>
        </div>
      </div>
    </section>
  )
}
