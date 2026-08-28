import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { DropConfig } from '../../config/dropsConfig'

// Word-by-word headline reveal
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(' ')

  if (prefersReducedMotion) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        {text}
      </motion.span>
    )
  }

  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              delay: delay + i * 0.1,
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  )
}

// Image claw-mark reveal
function ClawMark({ className, opacityTarget = 0.06 }: { className?: string, opacityTarget?: number }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.img
      src="/images/claw-mark.jpg"
      alt="Claw mark"
      className={`pointer-events-none mix-blend-screen ${className || ''}`}
      style={{ filter: 'invert(1) contrast(1.5)' }}
      initial={{ scale: prefersReducedMotion ? 1 : 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: opacityTarget }}
      transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
    />
  )
}

interface Drop1HeroProps {
  drop: DropConfig
  sectionRef: React.RefObject<HTMLElement>
}

export default function Drop1Hero({ drop, sectionRef }: Drop1HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as any },
  })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="drop-1"
      className="relative w-full min-h-screen flex items-stretch overflow-hidden"
      style={{ backgroundColor: drop.themeColor }}
    >
      <div ref={containerRef} className="relative w-full flex flex-col md:flex-row">
        {/* ── LEFT COLUMN ── */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-10 flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-28 pb-16 md:pb-0 w-full md:w-[48%] flex-shrink-0"
        >
          {/* Claw-mark as a large watermark behind text */}
          <ClawMark 
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[15%] w-[150%] max-w-[800px] -rotate-12"
            opacityTarget={0.06}
          />

          {/* Sub-label */}
          <motion.span
            {...fadeUp(0.1)}
            className="font-inter text-[10px] tracking-[0.5em] text-[#E8DDCA]/60 uppercase mb-6 block"
          >
            {drop.subLabel}
          </motion.span>

          {/* Headline container with its own claw mark */}
          <div className="relative mb-8 mt-12 md:mt-20">
            <ClawMark 
              className="absolute -top-[270px] md:-top-[460px] left-0 md:left-20 w-48 md:w-80 lg:w-[450px] opacity-[0.06] rotate-12 z-0"
              opacityTarget={0.06}
            />
            <h1 className="relative z-10 font-bodoni font-bold text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] text-[#E8DDCA] leading-[0.92] uppercase">
              <WordReveal text={drop.headline || drop.name} delay={0.25} />
            </h1>
          </div>

          {/* Descriptor */}
          <motion.p
            {...fadeUp(0.85)}
            className="relative font-inter font-light text-sm md:text-[15px] text-white/50 leading-relaxed max-w-sm mb-10"
          >
            {drop.descriptorCopy}
          </motion.p>

          {/* CTA Button */}
          <motion.div {...fadeUp(1.0)} className="relative">
            <button className="group relative inline-flex items-center gap-3 border border-[#E8DDCA]/40 text-[#E8DDCA] px-7 py-3.5 text-[10px] tracking-[0.3em] uppercase font-inter overflow-hidden hover:border-[#E8DDCA]/80 transition-colors duration-300 cursor-pointer">
              <span className="absolute inset-0 bg-[#E8DDCA]/5 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              <span className="relative">Explore Drop 1</span>
              <ArrowRight
                className="relative w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                strokeWidth={1.5}
              />
            </button>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — Hero Image ── */}
        <div className="relative flex-1 min-h-[60vw] md:min-h-0 overflow-hidden">
          {/* Parallax Image */}
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 w-full h-[115%] -top-[8%]"
          >
            <motion.img
              src={drop.heroImage}
              alt="Wild Instincts — Drop 1"
              className="w-full h-full object-cover object-center"
              initial={{ scale: prefersReducedMotion ? 1 : 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            />
            {/* dark gradient overlay on left edge to blend into content */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/30 to-transparent md:via-transparent" />
          </motion.div>

          {/* Sub-collection labels — bottom right */}
          <motion.div
            {...fadeUp(1.1)}
            className="absolute bottom-8 right-8 flex flex-col items-end gap-1 z-10"
          >
            {(drop.subcollections ?? []).map((sc, i) => (
              <span
                key={i}
                className="font-inter text-[9px] tracking-[0.4em] text-[#E8DDCA]/40 uppercase"
              >
                {sc}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-inter text-[8px] tracking-[0.4em] text-white/20 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
