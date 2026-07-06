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
      className="bg-[#FAF5E8] py-12 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">

        {/* Heading — hidden on mobile */}
        <div ref={headingRef} className="hidden md:block mb-7 md:mb-16">
          <p className="font-inter text-[10px] tracking-[0.5em] uppercase text-[#1B3C34]/40 mb-3">
            The Process
          </p>
          <div className="border-b border-[#1B3C34]/10 pb-5">
            <h2 className="font-inter font-light text-[1.7rem] md:text-5xl text-[#1B3C34] leading-tight tracking-tight">
              Unseen Precision
            </h2>
          </div>
        </div>

        {/* Steps — 2×2 dark cards on mobile, 4-col hairline on desktop */}
        <div className="craft-steps grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-px lg:bg-[#1B3C34]/10">
          {steps.map((step) => (
            <div
              key={step.num}
              className="craft-step bg-[#111] md:bg-white lg:bg-[#FAF5E8] border border-[#FAF5E8]/10 md:border-[#1B3C34]/10 lg:border-0 p-5 md:p-10 group md:hover:bg-[#FAF5E8] transition-colors duration-300"
            >
              <p className="font-inter text-[10px] tracking-widest md:tracking-[0.4em] uppercase text-[#FAF5E8]/25 md:text-[#1B3C34]/40 mb-3 md:mb-6">
                {step.num}
              </p>
              <h3 className="font-inter font-medium text-sm md:text-xl text-[#FAF5E8] md:text-gray-900 mb-2 md:mb-4 tracking-wide">
                {step.title}
              </h3>
              <p className="font-inter text-[#FAF5E8]/60 md:text-gray-500 text-xs md:text-sm leading-[1.7] md:leading-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="craft-quote mt-8 md:mt-28 text-center border-t border-[#1B3C34]/10 pt-8 md:pt-16">
          <blockquote className="font-inter font-light italic text-sm md:text-3xl text-[#111] md:text-[#1B3C34]/50 max-w-2xl mx-auto leading-relaxed">
            "Every stitch is a decision. Every thread is a commitment."
          </blockquote>
          <p className="mt-3 font-inter text-[10px] tracking-[0.4em] uppercase text-[#555] md:text-[#1B3C34]/25">
            — SNAZZY Craft Philosophy
          </p>
        </div>

      </div>
    </section>
  )
}

