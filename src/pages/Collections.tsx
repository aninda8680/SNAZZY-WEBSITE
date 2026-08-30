import { useState, useEffect } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useSmoothScroll } from '../hooks'
import { Navbar, Cart, ViewToggle, Footer, TopographicBackground } from '../components'
import { Shop } from '../sections'

// ── Animated Page Header ─────────────────────────────────────────────────────
function CollectionsHeader() {
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  }
  const fade = prefersReducedMotion ? undefined : fadeUp
  const initial = prefersReducedMotion ? false : 'hidden'
  const animate = 'visible'

  return (
    <section
      className="w-full pt-10 pb-8 md:pt-32 md:pb-20 px-5 md:px-8 text-center"
      aria-label="Collections hero"
    >
      <div className="max-w-3xl mx-auto">

        {/* Eyebrow */}
        <motion.p
          className="font-inter text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-[#1B3C34]/55 mb-5"
          variants={fade}
          initial={initial}
          animate={animate}
          transition={{ duration: 0.5, ease }}
        >
          SS26 &nbsp;/&nbsp; Full Range
        </motion.p>

        <motion.h1
          className="font-cormorant font-semibold leading-[0.92] uppercase tracking-tight text-[#1B3C34] mb-4 md:mb-6"
          style={{ fontSize: 'clamp(2.4rem, 11vw, 7.5rem)' }}
          variants={fade}
          initial={initial}
          animate={animate}
          transition={{ duration: 0.55, ease, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          Full{' '}
          <em className="not-italic" style={{ fontStyle: 'italic' }}>Collection</em>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          className="hidden sm:block font-inter font-light text-[13px] md:text-[14px] leading-[1.85] text-[#1B3C34]/55 max-w-[520px] mx-auto mb-10"
          variants={fade}
          initial={initial}
          animate={animate}
          transition={{ duration: 0.5, ease, delay: prefersReducedMotion ? 0 : 0.22 }}
        >
          Handcrafted embroidery on premium cotton — produced in limited quantities,
          every piece made to last and made to say something.
        </motion.p>

        {/* Animated divider line */}
        <motion.div
          className="h-px bg-[#1B3C34]/15 w-12 md:w-16 mx-auto"
          initial={prefersReducedMotion ? false : { scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease, delay: prefersReducedMotion ? 0 : 0.3 }}
        />
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Collections() {
  useSmoothScroll()
  const [mobilePreview, setMobilePreview] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('mobile-preview', mobilePreview)
    return () => document.body.classList.remove('mobile-preview')
  }, [mobilePreview])

  return (
    <>
      <div
        className={`relative bg-[#FAF5E8] text-[#1B3C34] overflow-x-clip min-h-screen transition-all duration-300 ${
          mobilePreview
            ? 'max-w-[390px] mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_20px_60px_rgba(0,0,0,0.35)]'
            : ''
        }`}
      >
        <TopographicBackground />

        <div className="relative z-10">
          {/* Dark-themed solid navbar (Green UI) */}
          <Navbar alwaysSolid theme="dark" />
          <Cart />

          {/* Navbar spacer */}
          <div className="pt-14 md:pt-16">
            {/* Premium page header */}
            <CollectionsHeader />

            {/* Product grid — heading suppressed since we have our own above */}
            <Shop variant="page" />
          </div>

          {/* Lightweight footer */}
          <Footer transparent />
        </div>
      </div>

      <ViewToggle active={mobilePreview} onToggle={() => setMobilePreview(p => !p)} />
    </>
  )
}
