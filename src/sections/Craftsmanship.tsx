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
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 65%' },
        }
      )

      gsap.from('.craft-step', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.craft-steps', start: 'top 78%' },
      })

      gsap.from('.craft-quote', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.craft-quote', start: 'top 85%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="bg-[#FAF5E8] py-16 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 overflow-hidden">

        {/* Heading — compact on mobile, full on desktop */}
        <div ref={headingRef} className="mb-7 md:mb-16">
          <p className="font-inter text-[10px] tracking-[0.5em] uppercase text-[#1B3C34]/40 mb-3">
            The Process
          </p>
          <div className="border-b border-[#1B3C34]/10 pb-5">
            <h2 className="font-bodoni md:font-inter font-light text-[1.6rem] md:text-5xl text-[#1B3C34] leading-tight tracking-tight uppercase md:normal-case">
              Unseen Precision
            </h2>
          </div>
        </div>

        {/* Steps — bold full-width cards on mobile */}
        <div className="craft-steps md:hidden -mx-6 flex flex-col">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="craft-step relative overflow-hidden px-6 py-8 border-b border-[#1B3C34]/10 last:border-0"
            >
              {/* Large number watermark */}
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 font-bodoni font-black leading-none select-none pointer-events-none"
                style={{ fontSize: '22vw', color: 'rgba(27,60,52,0.06)' }}
              >
                {step.num}
              </span>

              {/* Step number pill */}
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1B3C34] text-[#FAF5E8] font-inter text-[10px] font-bold mb-4">
                {i + 1}
              </span>

              {/* Title */}
              <h3 className="font-bodoni text-[1.35rem] text-[#1B3C34] leading-tight tracking-tight mb-3 uppercase">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-inter text-[13px] text-[#1B3C34]/55 leading-[1.85] max-w-[280px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop 4-col grid */}
        <div className="craft-steps hidden md:grid lg:grid-cols-4 gap-px bg-[#1B3C34]/10">
          {steps.map((step) => (
            <div
              key={step.num}
              className="craft-step bg-[#FAF5E8] border-0 p-10 group hover:bg-[#FAF5E8] transition-colors duration-300"
            >
              <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#1B3C34]/40 mb-6">
                {step.num}
              </p>
              <h3 className="font-inter font-semibold text-xl text-gray-900 mb-4 tracking-wide">
                {step.title}
              </h3>
              <p className="font-inter text-gray-500 text-sm leading-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="craft-quote mt-8 md:mt-28 text-center border-t border-[#1B3C34]/10 pt-8 md:pt-16">
          <blockquote className="font-inter font-light italic text-sm md:text-3xl text-[#1B3C34]/70 max-w-2xl mx-auto leading-relaxed">
            "Every stitch is a decision. Every thread is a commitment."
          </blockquote>
          <p className="mt-3 font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/30">
            — SNAZZY Craft Philosophy
          </p>
        </div>

      </div>
    </section>
  )
}

