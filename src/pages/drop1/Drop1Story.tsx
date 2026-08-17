import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Drop1StoryProps {
  sectionRef: React.RefObject<HTMLElement>
}

export default function Drop1Story({ sectionRef }: Drop1StoryProps) {
  const prefersReducedMotion = useReducedMotion()

  const leftVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as any } },
  }
  const rightVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as any },
    },
  }

  const copyLines = [
    { delay: 0, text: 'Wild Instincts is not a trend — it is a posture.' },
    { delay: 0.1, text: 'It emerged from the conviction that clothing should carry weight: not in fabric, but in intent.' },
    { delay: 0.2, text: 'Three sub-collections — Pronoia, Valor, Maverick — each mapping a different edge of the same untamed identity.' },
    { delay: 0.3, text: 'Wear what the world cannot define.' },
  ]

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="story"
      className="relative w-full bg-[#050505] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row min-h-[70vh]">
        {/* Left — Image Panel */}
        <motion.div
          className="relative w-full md:w-1/2 min-h-[50vw] md:min-h-0 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={leftVariants}
        >
          <img
            src="/images/drop1-story.png"
            alt="Wild Instincts story"
            className="absolute inset-0 w-full h-full object-cover object-center -scale-x-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </motion.div>

        {/* Right — Concept Copy */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={rightVariants}
        >
          <span className="font-inter text-[9px] tracking-[0.45em] text-[#E8DDCA]/30 uppercase block mb-8">
            The Story
          </span>

          <h2 className="font-bodoni font-bold text-3xl md:text-4xl lg:text-5xl text-[#E8DDCA] uppercase leading-tight mb-10">
            More Than<br />A Collection
          </h2>

          <div className="flex flex-col gap-5 max-w-md">
            {copyLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: line.delay,
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`font-inter font-light leading-relaxed ${
                  i === copyLines.length - 1
                    ? 'text-[#E8DDCA]/80 italic text-[15px]'
                    : 'text-white/45 text-sm'
                }`}
              >
                {line.text}
              </motion.p>
            ))}
          </div>

          {/* Sub-collection pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {['Pronoia', 'Valor', 'Maverick'].map((sc) => (
              <span
                key={sc}
                className="font-inter text-[9px] tracking-[0.35em] uppercase text-[#E8DDCA]/40 border border-[#E8DDCA]/10 px-4 py-2"
              >
                {sc}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
