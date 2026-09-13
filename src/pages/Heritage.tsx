/**
 * Heritage page — /heritage
 *
 * Premium editorial rebuild.
 *
 * Design system (unchanged from site truth):
 *   Deep Pine  #1B3C34  — primary dark bg / text on cream
 *   Parchment  #FAF5E8  — primary light bg
 *   Bone       #EFE7D3  — secondary light bg
 *   Ink        #12211D  — body text on cream
 *   Aged Brass #9C7A46  — accent: stitched seams, dates, dividers
 *   Sage-mist  #B8CCBF  — accent ON pine only
 *   Fog-Cream  #6B6255  — muted text ON cream (4.6:1)
 *   Fog-Pine   #C5D4CF  — muted text ON pine (5.2:1)
 *
 * Typography: Cormorant Garamond (display) + Inter (body) + Bodoni Moda (hero accent)
 * Animations: GSAP (parallax, Ken Burns, clip reveals) + Framer Motion (opacity reveals)
 * All animations respect prefers-reduced-motion.
 */

import { useEffect, useRef, type ReactNode, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
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

// ── Brand data (authentic only — no invented facts) ────────────────────────
const TIMELINE = [
  {
    year: '2024',
    title: 'A single conviction',
    desc: "SNAZZY is born in Vizianagram \u2014 a studio decision that embroidery is not decoration, it\u2019s identity. The first run: 50 pieces, no shortcuts.",
    img: '/images/t1-front.png',
    meta: 'First run · Vizianagram studio',
  },
  {
    year: 'Studio',
    title: 'Craft meets machine',
    desc: 'Six-head embroidery machines arrive. Designers and machines work side by side, turning digital sketches into dense thread patterns at 800 stitches per minute.',
    img: '/images/t2-front.png',
    meta: 'The machines · 800 stitches/min',
  },
  {
    year: 'Today',
    title: 'Limited, lasting drops',
    desc: 'Small-batch drops, premium threads, zero screen printing. Nothing that fades, cracks, or peels. Every piece hand-trimmed, quality-checked, steam-pressed.',
    img: '/images/t3-front.png',
    meta: 'Current production · Zero shortcuts',
  },
]

const SIGNATURES = [
  {
    name: 'Dense thread, never print',
    desc: 'Embroidery with real depth — patterns you can feel under your fingers, built to survive hundreds of washes.',
    numeral: '01',
  },
  {
    name: 'Seams that outlast',
    desc: 'Two rows of thread at every stress point. The inside of a SNAZZY piece looks as deliberate as the outside.',
    numeral: '02',
  },
  {
    name: 'Small batches, on purpose',
    desc: 'Limited runs from a single studio in Vizianagram. When a drop sells through, it stays sold through.',
    numeral: '03',
  },
]

const ARCHIVE = [
  { src: '/images/t1-front.png',   meta: '2024 · First run',     caption: 'Tee T1 — the conviction that started the house.' },
  { src: '/images/t2-front.png',   meta: 'Studio piece · 2024',  caption: 'Tee T2 — embroidered on location in Vizianagram.' },
  { src: '/images/t3-front.png',   meta: 'Recent drop',           caption: 'Tee T3 — six hours of machine time in a single design.' },
  { src: '/images/t1-back.png',    meta: 'Detail study',          caption: 'Back-panel finishing — hand-trimmed, quality-checked.' },
]

// ── Shared motion variants ─────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
}

const clipReveal: Variants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  visible: { clipPath: 'inset(0 0% 0 0)',   opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
}

// ── Utility ────────────────────────────────────────────────────────────────
function withFallback(e: SyntheticEvent<HTMLImageElement>, fallback: string) {
  const el = e.currentTarget
  el.onerror = null
  el.src = fallback
}

// ── Sub-components ─────────────────────────────────────────────────────────

/** Stitched seam divider — the house's recurring thread motif */
function Stitch({ className = '' }: { className?: string }) {
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

/** Brass micro-label used for kickers and metadata */
function Label({
  children,
  tone = 'cream',
}: {
  children: ReactNode
  tone?: 'cream' | 'pine'
}) {
  return (
    <p
      className="font-inter text-[11px] tracking-[0.22em] uppercase"
      style={{ color: tone === 'cream' ? C.fogCream : C.fogPine }}
    >
      {children}
    </p>
  )
}

/** Scroll-driven opacity + vertical settle reveal */
function Reveal({
  children,
  className,
  reduced,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  reduced: boolean
  delay?: number
}) {
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Clip-path image reveal (left to right) */
function ClipReveal({
  children,
  className,
  reduced,
}: {
  children: ReactNode
  className?: string
  reduced: boolean
}) {
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// ── Timeline Entry — editorial alternating layout ─────────────────────────
function TimelineEntry({
  item,
  index,
  reduced,
}: {
  item: (typeof TIMELINE)[0]
  index: number
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  const isOdd = index % 2 !== 0

  return (
    <motion.article
      ref={ref}
      style={reduced ? undefined : { opacity, y }}
      className="relative grid md:grid-cols-2 gap-0 min-h-[520px] md:min-h-[640px]"
      aria-label={`${item.year} — ${item.title}`}
    >
      {/* ── Image panel ── */}
      <div
        className={`relative overflow-hidden ${isOdd ? 'md:order-2' : 'md:order-1'}`}
        style={{ minHeight: 320 }}
      >
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          onError={(e) => withFallback(e, bgImage)}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
        />
        {/* Pine atmospheric overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to ${isOdd ? 'right' : 'left'}, rgba(18,33,29,0.45) 0%, transparent 65%)` }}
        />
        {/* Archival meta caption */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{ background: 'rgba(6,18,16,0.68)' }}
        >
          <p className="font-inter text-[10px] tracking-[0.18em] uppercase" style={{ color: C.fogPine }}>
            {item.meta}
          </p>
        </div>
      </div>

      {/* ── Text panel ── */}
      <div
        className={`relative flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14 md:py-20 ${isOdd ? 'md:order-1' : 'md:order-2'}`}
        style={{ background: C.parchment }}
      >
        {/* Giant year — the visual anchor */}
        <div
          className="absolute select-none pointer-events-none"
          aria-hidden="true"
          style={{
            top: '50%',
            left: isOdd ? 'auto' : '50%',
            right: isOdd ? '5%' : 'auto',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(5rem, 14vw, 11rem)',
            lineHeight: 0.85,
            color: `${C.pine}08`,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {item.year}
        </div>

        {/* Brass year label */}
        <p
          className="font-cormorant italic font-medium mb-4 relative z-10"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: C.brass, lineHeight: 1 }}
        >
          {item.year}
        </p>

        {/* Stitch divider */}
        <Stitch className="mb-6 relative z-10 w-16" />

        <h3
          className="font-cormorant font-semibold leading-tight mb-5 relative z-10"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: C.pine }}
        >
          {item.title}
        </h3>
        <p
          className="font-inter font-light leading-[1.85] relative z-10 max-w-[440px]"
          style={{ fontSize: '0.9rem', color: C.fogCream }}
        >
          {item.desc}
        </p>
      </div>
    </motion.article>
  )
}

// ── Craft panel — full-width macro with atmospheric overlay ───────────────
function CraftPanel({
  src,
  alt,
  caption,
  align,
  reduced,
}: {
  src: string
  alt: string
  caption: string
  align: 'left' | 'right'
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.4'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1])

  return (
    <motion.figure
      ref={ref}
      style={reduced ? undefined : { opacity }}
      className="relative w-full group"
      aria-label={alt}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(e) => withFallback(e as unknown as SyntheticEvent<HTMLImageElement>, bgImage)}
          style={reduced ? undefined : { scale }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Deep gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,28,22,0.6) 0%, transparent 55%)' }}
        />
        {/* Hover overlay lift */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
          style={{ background: `${C.pine}22` }}
        />
      </div>

      <figcaption
        className={`mt-5 max-w-[480px] ${align === 'right' ? 'ml-auto text-right' : ''}`}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 28,
            height: 1,
            background: C.brass,
            verticalAlign: 'middle',
            marginRight: align === 'right' ? 0 : 10,
            marginLeft: align === 'right' ? 10 : 0,
          }}
        />
        <span
          className="font-inter font-light text-[13px] leading-[1.8]"
          style={{ color: C.fogCream }}
        >
          {caption}
        </span>
      </figcaption>
    </motion.figure>
  )
}

// ── Archive item — editorial card ─────────────────────────────────────────
function ArchiveCard({
  item,
  className = '',
  reduced,
}: {
  item: (typeof ARCHIVE)[0]
  className?: string
  reduced: boolean
}) {
  return (
    <Reveal reduced={reduced} className={`group ${className}`}>
      <figure>
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <img
            src={item.src}
            alt={item.caption}
            loading="lazy"
            onError={(e) => withFallback(e, bgImage)}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
          {/* Lift overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: 'rgba(10,28,22,0.12)' }}
          />
        </div>
        <figcaption className="mt-4">
          <span
            className="block font-inter text-[10px] tracking-[0.18em] uppercase mb-2"
            style={{ color: C.brass }}
          >
            {item.meta}
          </span>
          <span
            className="block font-inter font-light text-[13px] leading-[1.75]"
            style={{ color: C.fogCream }}
          >
            {item.caption}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Heritage() {
  const reduced = useReducedMotion() ?? false

  // ── Hero refs for GSAP
  const heroRef          = useRef<HTMLElement>(null)
  const heroImgRef       = useRef<HTMLDivElement>(null)
  const heroEyebrowRef   = useRef<HTMLParagraphElement>(null)
  const heroHeadlineRef  = useRef<HTMLHeadingElement>(null)
  const heroBodyRef      = useRef<HTMLParagraphElement>(null)
  const heroCTARef       = useRef<HTMLAnchorElement>(null)

  // ── Craft section ghost word ref
  const craftWordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {

      // ── Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(heroEyebrowRef.current,  { opacity: 0, y: 20, duration: 1.2 })
        .from(heroHeadlineRef.current, { opacity: 0, y: 60, duration: 2.0 }, '-=0.6')
        .from(heroBodyRef.current,     { opacity: 0, y: 20, duration: 1.2 }, '-=1.0')
        .from(heroCTARef.current,      { opacity: 0, y: 16, duration: 1.0 }, '-=0.8')

      // ── Ken Burns on hero image
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          scale: 1.06,
          duration: 14,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })
      }

      // ── Hero parallax scroll-out
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 0.95,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // ── Craft ghost word horizontal float on scroll
      if (craftWordRef.current) {
        gsap.to(craftWordRef.current, {
          x: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: craftWordRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        })
      }

    })

    return () => ctx.revert()
  }, [reduced])

  return (
    <>
      <div style={{ background: C.parchment, color: C.ink }} className="overflow-x-clip">

        {/* Global focus styles for this page */}
        <style>{`
          .hpage *:focus-visible { outline: 2px solid ${C.pine}; outline-offset: 3px; }
          .hpage [data-bg="pine"] *:focus-visible { outline-color: ${C.parchment}; }
          @keyframes heritage-grain {
            0%, 100% { transform: translate(0, 0); }
            25%       { transform: translate(-1px, 1px); }
            50%       { transform: translate(1px, -1px); }
            75%       { transform: translate(-1px, -1px); }
          }
        `}</style>

        <div className="hpage">
          <Navbar alwaysSolid theme="light" />
          <Cart />

          <div className="pt-14 md:pt-16">

            {/* ══════════════════════════════════════════════════════════════
                1 · HERO — Full-viewport cinematic chamber
            ══════════════════════════════════════════════════════════════ */}
            <section
              ref={heroRef}
              aria-label="Heritage hero"
              className="relative overflow-hidden"
              style={{
                minHeight: '100svh',
                background: `linear-gradient(165deg, #050e0c 0%, ${C.pine} 50%, #071410 100%)`,
              }}
              data-bg="pine"
            >
              {/* ── Background image with Ken Burns ── */}
              <div
                ref={heroImgRef}
                className="absolute inset-0 will-change-transform"
                style={{ transformOrigin: 'center center' }}
              >
                <img
                  src="/images/t2-front.png"
                  alt=""
                  role="presentation"
                  onError={(e) => withFallback(e, bgImage)}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* ── Gradient overlays — layered for depth ── */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(165deg, rgba(5,14,12,0.92) 0%, rgba(27,60,52,0.7) 45%, rgba(5,14,12,0.88) 100%)' }}
              />
              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,10,8,0.5) 100%)' }}
              />

              {/* ── Giant ghost letterform ── */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                <span
                  className="font-bodoni font-black select-none"
                  style={{
                    fontSize: '75vw',
                    lineHeight: 0.85,
                    color: 'rgba(250,245,232,0.025)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  H
                </span>
              </div>

              {/* ── Top rule ── */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/10" aria-hidden="true" />

              {/* ── Hero content ── */}
              <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-end md:justify-center" style={{ minHeight: '100svh', paddingBottom: '5rem', paddingTop: '7rem' }}>
                <div className="max-w-3xl">
                  <p
                    ref={heroEyebrowRef}
                    className="font-inter text-[10px] tracking-[0.45em] uppercase mb-8"
                    style={{ color: C.fogPine }}
                  >
                    The house archive, opened
                  </p>

                  <h1
                    ref={heroHeadlineRef}
                    className="font-cormorant font-semibold leading-[0.92] mb-8"
                    style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', color: C.parchment }}
                  >
                    Rooted in
                    <br />
                    tradition.
                    <br />
                    <span className="font-medium italic" style={{ color: C.sage }}>
                      Cut for generations.
                    </span>
                  </h1>

                  <p
                    ref={heroBodyRef}
                    className="font-inter font-light leading-[1.9] mb-10 max-w-md"
                    style={{ fontSize: '0.9rem', color: C.fogPine }}
                  >
                    Step inside the SNAZZY archive — the studio, the machines,
                    and the thread that turned a 50-piece first run into a house style.
                  </p>

                  <a
                    ref={heroCTARef}
                    href="#house"
                    className="inline-flex items-center gap-3 font-inter text-[11px] tracking-[0.3em] uppercase py-4 px-9 transition-opacity duration-300 hover:opacity-75"
                    style={{ background: C.parchment, color: C.pine }}
                  >
                    Enter the archive
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* ── Bottom brass stitch ── */}
              <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
                <div
                  style={{
                    height: 2,
                    background: `repeating-linear-gradient(to right, ${C.brass} 0 8px, transparent 8px 14px)`,
                    opacity: 0.4,
                  }}
                />
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                2 · THE HOUSE — Bold editorial statement
            ══════════════════════════════════════════════════════════════ */}
            <section
              id="house"
              aria-label="The house"
              style={{ background: C.parchment }}
            >
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-20 md:py-36">
                <div className="grid md:grid-cols-[1fr_1px_1fr] gap-8 md:gap-16 items-start">

                  {/* Left — enormous statement */}
                  <Reveal reduced={reduced}>
                    <h2
                      className="font-cormorant font-semibold leading-[1.0]"
                      style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', color: C.pine }}
                    >
                      More than clothing —
                      <br />
                      <span className="italic font-medium" style={{ color: C.brass }}>
                        a tradition
                      </span>
                      <br />
                      carried forward,
                      <br />
                      stitch by stitch.
                    </h2>
                  </Reveal>

                  {/* Vertical divider — desktop only */}
                  <div
                    className="hidden md:block w-px self-stretch"
                    style={{ background: `${C.pine}15` }}
                    aria-hidden="true"
                  />

                  {/* Right — narrative */}
                  <Reveal reduced={reduced} delay={0.15}>
                    <Label tone="cream">Why the house exists</Label>
                    <p className="font-inter font-light leading-[1.95] mt-5 mb-5 max-w-[480px]" style={{ fontSize: '0.95rem', color: C.ink }}>
                      SNAZZY began in 2024 in Vizianagram, Andhra Pradesh, out of frustration
                      with fast fashion — clothing with no craft and no permanence. The
                      founders believed embroidery could carry identity the way a crest once
                      did: visibly, durably, personally.
                    </p>
                    <p className="font-inter font-light leading-[1.95] max-w-[480px]" style={{ fontSize: '0.95rem', color: C.fogCream }}>
                      That belief still decides everything — small batches, premium threads,
                      machines run by people who sign their work. The original vision
                      isn't a plaque on the wall; it's the production schedule.
                    </p>
                  </Reveal>

                </div>
              </div>

              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
                <Stitch />
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                3 · ORIGIN — Archival chapter
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="Origin story" style={{ background: C.parchment }}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-28">
                <div className="grid md:grid-cols-[42%_58%] gap-10 md:gap-20 items-center">

                  {/* Image — clip reveal */}
                  <ClipReveal reduced={reduced} className="mb-8 md:mb-0">
                    <figure>
                      <div className="relative overflow-hidden group" style={{ aspectRatio: '3/4' }}>
                        <img
                          src="/images/t1-front.png"
                          alt="Tee T1 from the 50-piece first run — the garment SNAZZY started with"
                          loading="lazy"
                          onError={(e) => withFallback(e, bgImage)}
                          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                        />
                        {/* Fine pine tint */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{ background: `${C.pine}15` }}
                        />
                      </div>
                      <figcaption className="mt-4 flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          style={{ display: 'inline-block', width: 20, height: 1, background: C.brass }}
                        />
                        <span className="font-inter text-[11px] tracking-[0.16em] uppercase" style={{ color: C.fogCream }}>
                          Plate 01 · Tee T1, first run of fifty
                        </span>
                      </figcaption>
                    </figure>
                  </ClipReveal>

                  {/* Text */}
                  <Reveal reduced={reduced}>
                    <Label tone="cream">The earliest period</Label>
                    <h2
                      className="font-cormorant font-semibold leading-tight mt-5 mb-6"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: C.pine }}
                    >
                      Fifty pieces, and a refusal to print.
                    </h2>
                    <p className="font-inter font-light leading-[1.9] mb-5 max-w-[520px]" style={{ fontSize: '0.9rem', color: C.ink }}>
                      The first SNAZZY run was fifty embroidered tees made in a single
                      Vizianagram studio. No screen printing, no shortcuts — thread on
                      cotton, trimmed by hand, checked piece by piece.
                    </p>
                    <p className="font-inter font-light leading-[1.9] mb-10 max-w-[520px]" style={{ fontSize: '0.9rem', color: C.fogCream }}>
                      Those fifty pieces sold to people who could feel the difference. The
                      studio kept the method and scaled only the care: the same machines,
                      the same checks, still in limited quantity.
                    </p>
                    <Link
                      to="/collections"
                      className="inline-flex items-center gap-3 font-inter text-[11px] tracking-[0.3em] uppercase py-4 px-8 transition-opacity duration-300 hover:opacity-75"
                      style={{ background: C.pine, color: C.parchment }}
                    >
                      See what it became
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </Reveal>

                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                4 · TIMELINE — Editorial alternating chapters
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="Brand timeline" style={{ background: C.bone }}>

              {/* Section header */}
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-20 md:pt-32 pb-12 md:pb-20">
                <Reveal reduced={reduced} className="max-w-2xl">
                  <Label tone="cream">From Vizianagram, outward</Label>
                  <h2
                    className="font-cormorant font-semibold leading-tight mt-5"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: C.pine }}
                  >
                    Three chapters,
                    <span className="italic font-medium" style={{ color: C.brass }}> one thread.</span>
                  </h2>
                </Reveal>
              </div>

              {/* Alternating timeline entries */}
              <div className="overflow-hidden">
                {TIMELINE.map((item, i) => (
                  <TimelineEntry key={item.title} item={item} index={i} reduced={reduced} />
                ))}
              </div>

              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                <Stitch />
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                5 · CRAFTSMANSHIP — Tactile + atmospheric
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="Craftsmanship details" style={{ background: C.parchment }}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-20 md:pt-32 pb-16 md:pb-20">

                {/* Ghost word — dramatic typographic backdrop */}
                <div className="relative overflow-hidden mb-12 md:mb-20">
                  <span
                    ref={craftWordRef}
                    aria-hidden="true"
                    className="font-bodoni font-black select-none pointer-events-none block leading-none will-change-transform"
                    style={{
                      fontSize: 'clamp(5rem, 24vw, 22rem)',
                      color: `${C.pine}07`,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.85,
                    }}
                  >
                    Craft
                  </span>
                  {/* Overlay heading — positioned above ghost word */}
                  <div className="absolute inset-0 flex flex-col justify-end pb-2 pl-1">
                    <Reveal reduced={reduced} className="max-w-2xl">
                      <Label tone="cream">Where tradition lives in every detail</Label>
                      <h2
                        className="font-cormorant font-semibold leading-tight mt-4 mb-4"
                        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: C.pine }}
                      >
                        The craft is the legacy.
                      </h2>
                      <p className="font-inter font-light leading-[1.85] max-w-[520px]" style={{ fontSize: '0.875rem', color: C.fogCream }}>
                        Heritage here isn't age — it's knowledge passed hand to hand:
                        fabric, stitching, finishing. Run your eyes over the thread the way a
                        checker runs their fingers over it.
                      </p>
                    </Reveal>
                  </div>
                </div>

                {/* Craft image panels */}
                <div className="space-y-16 md:space-y-28">
                  <CraftPanel
                    src="/images/t3-front.png"
                    alt="Overhead detail of embroidered design on Snazzy Tee T3 — dense thread coverage"
                    caption="A single complex design takes six hours on a six-head machine. That time is visible in every piece."
                    align="left"
                    reduced={reduced}
                  />
                  <CraftPanel
                    src="/images/t1-back.png"
                    alt="Back panel finishing on Snazzy Tee T1 — double-stitched seams at every stress point"
                    caption="Double-stitched at every stress point — because seams are where corners get cut."
                    align="right"
                    reduced={reduced}
                  />
                  <CraftPanel
                    src="/images/t2-front.png"
                    alt="Embroidered graphic on Snazzy Tee T2 — full chest coverage, tight thread density"
                    caption="800 stitches per minute. 300+ thread shades. One standard: if it's not right, it doesn't leave."
                    align="left"
                    reduced={reduced}
                  />
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                6 · SIGNATURES — The house ledger
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="House signatures" style={{ background: C.bone }}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-20 md:py-32">

                <Reveal reduced={reduced} className="mb-14 md:mb-20 max-w-2xl">
                  <Label tone="cream">The marks of the house</Label>
                  <h2
                    className="font-cormorant font-semibold leading-tight mt-5"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: C.pine }}
                  >
                    Signatures you can verify
                    <span className="italic font-medium" style={{ color: C.brass }}> with your hands.</span>
                  </h2>
                </Reveal>

                <div>
                  {SIGNATURES.map((sig, i) => (
                    <Reveal key={sig.name} reduced={reduced}>
                      <div className="group">
                        <div className="grid md:grid-cols-[72px_1fr_1fr] gap-3 md:gap-12 py-10 md:py-14 items-start">
                          {/* Number */}
                          <span
                            className="font-cormorant italic font-medium leading-none"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: `${C.pine}25` }}
                            aria-hidden="true"
                          >
                            {sig.numeral}
                          </span>

                          {/* Signature name */}
                          <h3
                            className="font-cormorant font-semibold leading-snug relative"
                            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: C.pine }}
                          >
                            {sig.name}
                            {/* Animated underline */}
                            <span
                              className="absolute bottom-0 left-0 h-px transition-all duration-500 ease-out"
                              style={{
                                width: '0%',
                                background: C.brass,
                              }}
                              aria-hidden="true"
                            />
                          </h3>

                          {/* Description */}
                          <p
                            className="font-inter font-light leading-[1.85]"
                            style={{ fontSize: '0.875rem', color: C.fogCream }}
                          >
                            {sig.desc}
                          </p>
                        </div>
                        {i < SIGNATURES.length - 1 && <Stitch />}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                7 · PAST → PRESENT — Diptych on dark pine
            ══════════════════════════════════════════════════════════════ */}
            <section
              aria-label="From first run to recent drop"
              style={{ background: C.pine }}
              data-bg="pine"
            >
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-20 md:py-32">

                <Reveal reduced={reduced} className="mb-14 md:mb-20 max-w-2xl">
                  <Label tone="pine">The same hands, sharper work</Label>
                  <h2
                    className="font-cormorant font-semibold leading-tight mt-5"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: C.parchment }}
                  >
                    Then and now,
                    <span className="italic font-medium" style={{ color: C.sage }}> side by side.</span>
                  </h2>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-6 md:gap-12">

                  <Reveal reduced={reduced}>
                    <figure className="group">
                      {/* Ghost label */}
                      <p
                        className="font-cormorant italic font-semibold leading-none mb-6 select-none"
                        style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: `${C.parchment}10` }}
                        aria-hidden="true"
                      >
                        Then
                      </p>
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                        <img
                          src="/images/t1-front.png"
                          alt="Tee T1 from the first run — the earliest SNAZZY garment"
                          loading="lazy"
                          onError={(e) => withFallback(e, bgImage)}
                          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <figcaption className="mt-5">
                        <span className="font-cormorant italic text-xl block mb-2" style={{ color: C.sage }}>
                          First run
                        </span>
                        <span className="font-inter font-light text-[13px] leading-[1.75] block" style={{ color: C.fogPine }}>
                          Fifty pieces. One studio. The method everything since is measured against.
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>

                  <Reveal reduced={reduced} delay={0.12}>
                    <figure className="group md:mt-24">
                      {/* Ghost label */}
                      <p
                        className="font-cormorant italic font-semibold leading-none mb-6 select-none text-right"
                        style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: `${C.parchment}10` }}
                        aria-hidden="true"
                      >
                        Now
                      </p>
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                        <img
                          src="/images/t3-front.png"
                          alt="Tee T3 from a recent drop — dense trident embroidery"
                          loading="lazy"
                          onError={(e) => withFallback(e, bgImage)}
                          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <figcaption className="mt-5 text-right">
                        <span className="font-cormorant italic text-xl block mb-2" style={{ color: C.sage }}>
                          Recent drop
                        </span>
                        <span className="font-inter font-light text-[13px] leading-[1.75] block" style={{ color: C.fogPine }}>
                          Six hours of machine time in a single design — the same refusal, refined.
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>

                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                8 · THE ARCHIVE — Curated editorial gallery
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="Selected archive pieces" style={{ background: C.parchment }}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-20 md:py-32">

                <Reveal reduced={reduced} className="mb-14 md:mb-20 max-w-2xl">
                  <Label tone="cream">The studio archive</Label>
                  <h2
                    className="font-cormorant font-semibold leading-tight mt-5 mb-5"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: C.pine }}
                  >
                    Selected from
                    <span className="italic font-medium" style={{ color: C.brass }}> the archive.</span>
                  </h2>
                  <p className="font-inter font-light leading-[1.85]" style={{ fontSize: '0.875rem', color: C.fogCream }}>
                    Four pieces the studio kept back — each one a decision the house still stands behind.
                  </p>
                </Reveal>

                {/* Editorial grid — intentional size variation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14 md:gap-x-12 md:gap-y-20">
                  {ARCHIVE.map((item, i) => (
                    <ArchiveCard
                      key={item.caption}
                      item={item}
                      reduced={reduced}
                      className={i % 2 === 1 ? 'sm:mt-16' : ''}
                    />
                  ))}
                </div>

              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                9 · THE PEOPLE — Heritage carried by hands
            ══════════════════════════════════════════════════════════════ */}
            <section aria-label="The people behind the house" style={{ background: C.bone }}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-20 md:py-32">

                <div className="grid md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-start">

                  <Reveal reduced={reduced}>
                    <Label tone="cream">The people</Label>
                    <h2
                      className="font-cormorant font-semibold leading-tight mt-5"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', color: C.pine }}
                    >
                      Carried by people,
                      <br />
                      <span className="italic font-medium" style={{ color: C.brass }}>not dates.</span>
                    </h2>
                  </Reveal>

                  <Reveal reduced={reduced} delay={0.1}>
                    {/* Pull-quote treatment — left brass border */}
                    <div
                      className="pl-6 py-1 mb-8"
                      style={{ borderLeft: `2px solid ${C.brass}` }}
                    >
                      <p className="font-inter font-light leading-[1.95]" style={{ fontSize: '0.95rem', color: C.ink }}>
                        The founder still approves every design before it touches thread.
                        The studio team — designers, machinists, finishers — trims, checks,
                        and presses each garment by hand.
                      </p>
                    </div>
                    <p className="font-inter font-light leading-[1.95]" style={{ fontSize: '0.9rem', color: C.fogCream }}>
                      No names on a wall of fame; the signatures are in the seams. When a
                      piece leaves Vizianagram, someone's work leaves with it — and
                      they stand behind it.
                    </p>
                  </Reveal>

                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                10 · PHILOSOPHY — Atmospheric quiet chamber
            ══════════════════════════════════════════════════════════════ */}
            <section
              aria-label="House philosophy"
              className="relative overflow-hidden flex items-center justify-center"
              style={{ background: C.pine, minHeight: '70vh' }}
              data-bg="pine"
            >
              {/* Atmospheric ghost text — enormous, barely visible */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                <span
                  className="font-cormorant font-semibold select-none text-center leading-none"
                  style={{
                    fontSize: 'clamp(8rem, 35vw, 32rem)',
                    color: `${C.parchment}05`,
                    letterSpacing: '-0.03em',
                    lineHeight: 0.85,
                  }}
                >
                  Story
                </span>
              </div>

              <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-28 md:py-44 text-center">
                <Reveal reduced={reduced} className="max-w-2xl mx-auto">
                  <Stitch className="w-20 mx-auto mb-14" />
                  <blockquote
                    className="font-cormorant font-medium italic leading-[1.35] mb-10"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', color: C.parchment }}
                  >
                    &ldquo;We don&apos;t put logos on fabric.
                    <br />
                    We put stories on skin.&rdquo;
                  </blockquote>
                  <p
                    className="font-inter text-[11px] tracking-[0.22em] uppercase mb-14"
                    style={{ color: C.fogPine }}
                  >
                    The belief that started the house, unchanged
                  </p>
                  <Stitch className="w-20 mx-auto" />
                </Reveal>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                11 · CLOSING — The story continues
            ══════════════════════════════════════════════════════════════ */}
            <section
              aria-label="Continue into the collection"
              className="relative overflow-hidden"
              style={{ minHeight: '80vh', background: C.pine }}
              data-bg="pine"
            >
              {/* Full-bleed product image overlay */}
              <div className="absolute inset-0">
                <img
                  src="/images/t5-front.png"
                  alt=""
                  role="presentation"
                  loading="lazy"
                  onError={(e) => withFallback(e, bgImage)}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                {/* Multi-layer pine overlay for depth */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(160deg, rgba(5,14,12,0.92) 0%, rgba(27,60,52,0.62) 50%, rgba(5,14,12,0.90) 100%)' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(3,9,7,0.45) 100%)' }}
                />
              </div>

              <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center" style={{ minHeight: '80vh' }}>
                <Reveal reduced={reduced}>
                  <p
                    className="font-inter text-[10px] tracking-[0.45em] uppercase mb-8"
                    style={{ color: C.fogPine }}
                  >
                    From one generation of drops to the next
                  </p>
                  <h2
                    className="font-cormorant font-semibold leading-[0.92] mb-12"
                    style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)', color: C.parchment }}
                  >
                    The story continues
                    <br />
                    <span className="italic font-medium" style={{ color: C.sage }}>on skin.</span>
                  </h2>
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-4 font-inter text-[11px] tracking-[0.3em] uppercase py-5 px-12 transition-opacity duration-300 hover:opacity-75"
                    style={{ background: C.parchment, color: C.pine }}
                  >
                    Explore the collection
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Reveal>
              </div>

              {/* Bottom brass stitch */}
              <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
                <div
                  style={{
                    height: 2,
                    background: `repeating-linear-gradient(to right, ${C.brass} 0 8px, transparent 8px 14px)`,
                    opacity: 0.35,
                  }}
                />
              </div>
            </section>

          </div>

          <Footer transparent />
        </div>
      </div>
    </>
  )
}
