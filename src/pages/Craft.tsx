import { useEffect, useRef, type ReactNode, type SyntheticEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion'
import { Navbar, Cart, Footer } from '../components'
import bgImage from '../../assets/baground.png'

gsap.registerPlugin(ScrollTrigger)

// ── Color tokens ───────────────────────────────────────────────────────────
const C = {
  pine:      '#1B3C34',
  parchment: '#FAF5E8',
  ink:       '#12211D',
  bone:      '#EFE7D3',
  brass:     '#9C7A46',
  sage:      '#B8CCBF',
  fogCream:  '#6B6255',
  fogPine:   '#C5D4CF',
} as const

// ── Utility ────────────────────────────────────────────────────────────────
function withFallback(e: SyntheticEvent<HTMLImageElement>, fallback: string) {
  const el = e.currentTarget
  el.onerror = null
  el.src = fallback
}

// ── Shared Sub-components ──────────────────────────────────────────────────

function Stitch({ className = '', vertical = false }: { className?: string, vertical?: boolean }) {
  if (vertical) {
    return (
      <div className={className} aria-hidden="true">
        <div
          style={{
            width: 1,
            height: '100%',
            background: `repeating-linear-gradient(to bottom, ${C.brass} 0 7px, transparent 7px 13px)`,
            opacity: 0.6,
          }}
        />
      </div>
    )
  }
  return (
    <div className={className} aria-hidden="true">
      <div
        style={{
          height: 1,
          background: `repeating-linear-gradient(to right, ${C.brass} 0 7px, transparent 7px 13px)`,
          opacity: 0.6,
        }}
      />
    </div>
  )
}

function Label({ children, tone = 'cream' }: { children: ReactNode; tone?: 'cream' | 'pine' }) {
  return (
    <p
      className="font-inter text-[11px] tracking-[0.22em] uppercase"
      style={{ color: tone === 'cream' ? C.fogCream : C.fogPine }}
    >
      {children}
    </p>
  )
}

// ── Section 1: Cinematic Hero ──────────────────────────────────────────────

function HeroSection() {
  const reduced = useReducedMotion() ?? false
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const yMeta = useTransform(scrollYProgress, [0, 1], ['0%', '-70%'])
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0])
  const opacityOverlay = useTransform(scrollYProgress, [0, 1], [0.4, 0.8])

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100svh', background: C.pine }}
      data-bg="pine"
    >
      {/* Background Parallax */}
      <motion.div
        className="absolute inset-0 origin-center"
        style={reduced ? undefined : { y: yBg, scale: 1.05 }}
      >
        <img
          src="/images/t2-front.png"
          alt="Hands working with fabric"
          role="presentation"
          onError={(e) => withFallback(e, bgImage)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </motion.div>

      {/* Dynamic Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,28,22,0.3) 0%, rgba(10,28,22,0.7) 100%)',
          opacity: reduced ? 0.6 : opacityOverlay
        }}
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={reduced ? undefined : { y: yText, opacity: opacityText }}
      >
        <p className="font-inter text-[10px] tracking-[0.45em] uppercase mb-6" style={{ color: C.fogPine }}>
          The Art of Making
        </p>
        <h1
          className="font-cormorant font-semibold leading-[0.92] mb-6 max-w-4xl"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: C.parchment }}
        >
          Crafted With<br />
          <span className="italic font-medium" style={{ color: C.sage }}>Intention.</span>
        </h1>
        <p className="font-inter font-light leading-[1.9] max-w-md mx-auto" style={{ fontSize: '0.95rem', color: C.fogPine }}>
          Every piece begins with material, patience, and an obsession with detail.
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={reduced ? undefined : { y: yMeta, opacity: opacityText }}
      >
        <span className="font-inter text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: C.fogPine }}>
          Scroll to Explore
        </span>
        <div className="w-px h-12 relative overflow-hidden" style={{ background: 'rgba(197, 212, 207, 0.2)' }}>
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: C.fogPine }}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ── Section 2: Editorial Statement ─────────────────────────────────────────

function EditorialStatement() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-text',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%' },
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 md:py-40 px-6" style={{ background: C.parchment }}>
      <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center justify-center">
        <h2
          className="font-cormorant font-semibold leading-[0.9]"
          style={{ fontSize: 'clamp(4rem, 11vw, 12rem)', color: C.pine }}
        >
          <div className="overflow-hidden pb-2"><div className="reveal-text">MADE</div></div>
          <div className="overflow-hidden pb-2"><div className="reveal-text italic" style={{ color: C.brass }}>BY HAND.</div></div>
          <div className="overflow-hidden pb-2"><div className="reveal-text">MADE</div></div>
          <div className="overflow-hidden pb-2"><div className="reveal-text">TO LAST.</div></div>
        </h2>
      </div>
    </section>
  )
}

// ── Section 3: Material Story ──────────────────────────────────────────────

function MaterialStory() {
  const reduced = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  
  const yImage1 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const yImage2 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden" style={{ background: C.bone }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* Left side text */}
        <div className="md:w-5/12 z-10">
          <Label tone="cream">Material First</Label>
          <h2 className="font-cormorant font-semibold leading-tight mt-6 mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.pine }}>
            The foundation of everything.
          </h2>
          <Stitch className="w-16 mb-8" />
          <p className="font-inter font-light leading-[1.95] text-[1rem] max-w-md" style={{ color: C.ink }}>
            We source only premium threads and heavyweight cottons. An embroidered piece is only as enduring as the canvas it rests upon. Touch the fabric, and you feel the weight of our intention.
          </p>
        </div>

        {/* Right side Parallax Images */}
        <div className="md:w-7/12 relative h-[600px] md:h-[800px] w-full flex items-center justify-center">
          
          <motion.div 
            className="absolute left-0 top-[10%] w-[70%] h-[70%] md:w-[65%] md:h-[75%] overflow-hidden z-10"
            style={reduced ? undefined : { y: yImage1 }}
          >
            <img src="/images/grl-t1-front.png" alt="Fabric details" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4">
              <span className="font-inter text-[10px] tracking-[0.2em] uppercase bg-white/90 px-3 py-1 text-black">
                Fabric / 01
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="absolute right-0 bottom-[10%] w-[55%] h-[55%] md:w-[50%] md:h-[60%] overflow-hidden z-20 shadow-2xl"
            style={reduced ? undefined : { y: yImage2 }}
          >
            <img src="/images/t3-front.png" alt="Texture details" className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-4 right-4">
              <span className="font-inter text-[10px] tracking-[0.2em] uppercase bg-black/80 px-3 py-1 text-white">
                Texture / 02
              </span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}

// ── Section 4: Pinned Process ──────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: '01', title: 'Select', desc: 'Curating the exact raw materials.', img: '/images/t1-front.png' },
  { num: '02', title: 'Cut', desc: 'Precision mapping for zero compromise.', img: '/images/sweatshirt-front.png' },
  { num: '03', title: 'Construct', desc: 'Layering thread upon thread.', img: '/images/hoodie-front.png' },
  { num: '04', title: 'Refine', desc: 'Inspecting every single seam.', img: '/images/t2-front.png' },
  { num: '05', title: 'Finish', desc: 'Pressing and securing the final label.', img: '/images/t3-back.png' },
]

function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  
  // Create an active step index based on scroll progress
  // progress goes from 0 to 1 over the height of the container
  // We have 5 steps
  const activeStepProgress = useTransform(scrollYProgress, [0, 1], [0, PROCESS_STEPS.length - 0.1])
  
  // Component state to re-render when the active step changes
  const [activeIndex, setActiveIndex] = useState(0)
  
  useMotionValueEvent(activeStepProgress, "change", (latest) => {
    setActiveIndex(Math.floor(latest))
  })

  const step = PROCESS_STEPS[activeIndex] || PROCESS_STEPS[0]

  return (
    <section ref={containerRef} className="relative h-[500vh]" style={{ background: C.pine }} data-bg="pine">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 opacity-40">
           <AnimatePresence mode="wait">
             <motion.img
               key={step.num}
               src={step.img}
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.8, ease: 'easeOut' }}
               className="w-full h-full object-cover blur-sm"
             />
           </AnimatePresence>
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <Label tone="pine">The Process</Label>
            <div className="mt-8 relative h-32 md:h-48">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <p className="font-inter text-sm tracking-[0.3em] uppercase mb-4" style={{ color: C.brass }}>
                    Step {step.num}
                  </p>
                  <h2 className="font-cormorant font-semibold text-5xl md:text-7xl mb-6" style={{ color: C.parchment }}>
                    {step.title}
                  </h2>
                  <p className="font-inter font-light text-lg max-w-sm" style={{ color: C.fogPine }}>
                    {step.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Nav list */}
            <div className="mt-12 flex flex-col gap-3">
              {PROCESS_STEPS.map((s, idx) => (
                <div key={s.num} className="flex items-center gap-4">
                  <div 
                    className="w-[2px] transition-all duration-300"
                    style={{ 
                      height: activeIndex === idx ? '24px' : '0px', 
                      background: activeIndex === idx ? C.brass : 'transparent' 
                    }}
                  />
                  <span 
                    className="font-inter text-xs tracking-widest uppercase transition-colors duration-300"
                    style={{ color: activeIndex === idx ? C.parchment : 'rgba(197, 212, 207, 0.3)' }}
                  >
                    {s.num} — {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
             <AnimatePresence mode="wait">
               <motion.img
                 key={step.num}
                 src={step.img}
                 initial={{ opacity: 0, x: 20, scale: 1.05 }}
                 animate={{ opacity: 1, x: 0, scale: 1 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-0 w-full h-full object-cover object-top"
               />
             </AnimatePresence>
             {/* Vignette */}
             <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,60,52,0.4) 0%, transparent 40%)' }} />
          </div>

        </div>
      </div>
    </section>
  )
}

// ── Section 5: Horizontal Scroll Story ─────────────────────────────────────

function HorizontalStory() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  
  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-65%'])

  return (
    <section ref={targetRef} className="relative h-[300vh]" style={{ background: C.parchment }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        <div className="absolute top-16 md:top-24 left-6 md:left-16 z-20">
          <Label tone="cream">The Journey of a Garment</Label>
        </div>

        <motion.div style={{ x }} className="flex gap-16 md:gap-32 pl-6 md:pl-24 pr-[50vw]">
          
          <div className="flex flex-col justify-center min-w-[70vw] md:min-w-[45vw]">
            <h2 className="font-cormorant font-semibold text-6xl md:text-8xl mb-8" style={{ color: C.pine }}>
              From Thread <span className="italic" style={{ color: C.brass }}>to Form.</span>
            </h2>
            <p className="font-inter font-light text-lg" style={{ color: C.fogCream }}>Scroll horizontally to witness the transformation.</p>
          </div>

          <div className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center">
            <div className="aspect-[4/3] relative overflow-hidden mb-6">
              <img src="/images/t4-front.png" className="w-full h-full object-cover" alt="Cutting" />
            </div>
            <p className="font-inter tracking-widest text-sm uppercase" style={{ color: C.brass }}>Phase I</p>
            <h3 className="font-cormorant text-4xl mt-2" style={{ color: C.pine }}>The Cut</h3>
          </div>

          <div className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center">
            <div className="aspect-[4/3] relative overflow-hidden mb-6">
              <img src="/images/hoodie-back.png" className="w-full h-full object-cover" alt="Assembly" />
            </div>
            <p className="font-inter tracking-widest text-sm uppercase" style={{ color: C.brass }}>Phase II</p>
            <h3 className="font-cormorant text-4xl mt-2" style={{ color: C.pine }}>The Assembly</h3>
          </div>

          <div className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center">
            <div className="aspect-[4/3] relative overflow-hidden mb-6">
              <img src="/images/t2-back.png" className="w-full h-full object-cover object-top" alt="Finishing" />
            </div>
            <p className="font-inter tracking-widest text-sm uppercase" style={{ color: C.brass }}>Phase III</p>
            <h3 className="font-cormorant text-4xl mt-2" style={{ color: C.pine }}>The Details</h3>
          </div>

        </motion.div>
      </div>
    </section>
  )
}

// ── Section 6: Details Matter ──────────────────────────────────────────────

function DetailsMatter() {
  const containerRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.detail-image').forEach((img: any) => {
        gsap.fromTo(img, 
          { clipPath: 'inset(8% 8% 8% 8%)', opacity: 0, scale: 1.05 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 80%',
            }
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 md:py-40" style={{ background: C.bone }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-24 md:gap-48">
        
        <div className="text-center mb-10">
          <Label tone="cream">Closer Look</Label>
          <h2 className="font-cormorant font-semibold text-5xl md:text-8xl mt-6" style={{ color: C.pine }}>
            DETAILS MATTER.
          </h2>
        </div>

        {/* Left aligned */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
          <div className="w-full md:w-3/5 detail-image overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src="/images/claw-mark.jpg" alt="Detail 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-2/5 text-center md:text-left">
            <h3 className="font-cormorant text-3xl mb-4" style={{ color: C.pine }}>Stitching Precision</h3>
            <p className="font-inter font-light" style={{ color: C.fogCream }}>
              Every seam is reinforced. Not because it has to be, but because it should be.
            </p>
          </div>
        </div>

        {/* Right aligned */}
        <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-20 items-center">
          <div className="w-full md:w-1/2 detail-image overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <img src="/images/t5-front.png" alt="Detail 2" className="w-full h-full object-cover object-top" />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-right">
            <h3 className="font-cormorant text-3xl mb-4" style={{ color: C.pine }}>Thread Integrity</h3>
            <p className="font-inter font-light ml-auto md:max-w-md" style={{ color: C.fogCream }}>
              Using the finest poly-blends that resist fading and retain tension across hundreds of wears.
            </p>
          </div>
        </div>

        {/* Center oversized */}
        <div className="flex flex-col items-center text-center">
          <div className="w-full detail-image overflow-hidden mb-12" style={{ aspectRatio: '16/9' }}>
            <img src="/images/t1-back.png" alt="Detail 3" className="w-full h-full object-cover object-top" />
          </div>
          <h3 className="font-cormorant text-3xl mb-4" style={{ color: C.pine }}>The Finishing Touch</h3>
          <p className="font-inter font-light max-w-lg" style={{ color: C.fogCream }}>
            Each garment is hand-inspected before it ever leaves our atelier. 
          </p>
        </div>

      </div>
    </section>
  )
}

// ── Section 7: Quote ───────────────────────────────────────────────────────

function QuoteSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  return (
    <section ref={ref} className="py-32 md:py-56 overflow-hidden relative" style={{ background: C.parchment }}>
      <motion.div style={{ y }} className="max-w-4xl mx-auto px-6 text-center">
        <blockquote 
          className="font-cormorant italic font-medium leading-snug mb-10"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: C.pine }}
        >
          "Good craftsmanship is felt before it is noticed."
        </blockquote>
        <Stitch className="w-24 mx-auto mb-8" />
        <p className="font-inter text-xs tracking-[0.4em] uppercase" style={{ color: C.fogCream }}>
          — The SNAZZY Atelier
        </p>
      </motion.div>
    </section>
  )
}

// ── Section 8: Hands Behind the Work ───────────────────────────────────────

function HandsBehindWork() {
  return (
    <section className="py-24 md:py-32" style={{ background: C.pine }} data-bg="pine">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
             <div className="relative overflow-hidden group">
               <img src="/images/drop1-hero.png" alt="Workshop Environment" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" style={{ aspectRatio: '3/4' }} />
             </div>
          </div>
          <div className="w-full md:w-1/2">
             <Label tone="pine">The Hands Behind the Work</Label>
             <h2 className="font-cormorant font-semibold text-4xl md:text-6xl mt-6 mb-8 text-white">
               Made by people,<br />
               not just machines.
             </h2>
             <p className="font-inter font-light text-lg mb-6 max-w-md text-white/60">
               While our embroidery machines execute the vision, it's the artisan's eye that guides the process. From thread selection to final trimming, every step is overseen by a master craftsperson.
             </p>
             <Stitch className="w-16 mt-12" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 9: Final Cinematic & CTA ───────────────────────────────────────

function FinalCinematic() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const yText = useTransform(scrollYProgress, [0, 1], ['50%', '-50%'])

  return (
    <section ref={ref} className="relative w-full overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: '120svh', background: C.pine }} data-bg="pine">
      
      <motion.div className="absolute inset-0 origin-center" style={{ scale }}>
        <img src="/images/grl-t2-front.png" alt="Crafted to be experienced" className="w-full h-full object-cover object-top opacity-50" />
      </motion.div>
      
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,28,22,1) 0%, rgba(10,28,22,0.4) 100%)' }} />

      <motion.div style={{ y: yText }} className="relative z-10 text-center px-6 pt-32">
        <h2 className="font-cormorant font-semibold text-5xl md:text-8xl mb-24 text-white">
          CRAFTED TO BE<br />
          <span className="italic" style={{ color: C.brass }}>EXPERIENCED.</span>
        </h2>
        
        <div className="flex flex-col items-center mt-32 md:mt-48">
          <p className="font-inter font-light text-sm text-white/60 mb-6 max-w-sm">
            Discover the pieces shaped by this exact process.
          </p>
          <a href="/collections" className="group flex flex-col items-center">
            <span className="font-cormorant text-4xl md:text-6xl text-white group-hover:text-[#9C7A46] transition-colors duration-500">
              EXPLORE THE COLLECTION
            </span>
            <div className="flex items-center gap-4 mt-8 font-inter text-xs tracking-widest uppercase text-white/80 group-hover:text-white transition-colors duration-500">
              View Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </a>
        </div>
      </motion.div>

    </section>
  )
}

// ── Global Scroll Progress ─────────────────────────────────────────────────

function GlobalScrollProgress() {
  const { scrollYProgress } = useScroll()
  
  // Calculate section numbers (1 to 5)
  const currentSection = useTransform(scrollYProgress, [0, 1], [1, 5])
  const [sectionNum, setSectionNum] = useState(1)

  useMotionValueEvent(currentSection, "change", (latest) => {
    setSectionNum(Math.min(5, Math.max(1, Math.round(latest))))
  })

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4 mix-blend-difference text-white">
      <span className="font-inter text-xs tracking-widest">0{sectionNum}</span>
      <div className="w-px h-32 bg-white/20 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-white origin-top"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <span className="font-inter text-xs tracking-widest">05</span>
    </div>
  )
}

// ── Main Page Component ────────────────────────────────────────────────────

export default function Craft() {
  
  return (
    <div className="overflow-x-clip bg-[#FAF5E8]">
      
      {/* Global Focus / Selection Styles specific to Craft */}
      <style>{`
        .craft-page *:focus-visible { outline: 2px solid ${C.pine}; outline-offset: 3px; }
        .craft-page [data-bg="pine"] *:focus-visible { outline-color: ${C.parchment}; }
        .craft-page ::selection { background: ${C.brass}; color: #fff; }
      `}</style>
      
      <div className="craft-page">
        <Navbar theme="light" />
        <Cart />
        <GlobalScrollProgress />

        <main>
          <HeroSection />
          <EditorialStatement />
          <MaterialStory />
          <ProcessSection />
          <HorizontalStory />
          <DetailsMatter />
          <QuoteSection />
          <HandsBehindWork />
          <FinalCinematic />
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
