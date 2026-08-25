import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { label: 'T-Shirts', img: '/images/nobg/t1-front-nobg.png' },
  { label: 'Hoodies', img: '/images/nobg/hoodie-front-nobg.png' },
  { label: 'Sweatshirts', img: '/images/nobg/sweatshirt-front-nobg.png' },
]

interface Drop1CollectionPreviewProps {
  sectionRef: React.RefObject<HTMLElement>
  onCategoryClick: (category: string) => void
}

export default function Drop1CollectionPreview({ sectionRef, onCategoryClick }: Drop1CollectionPreviewProps) {
  const prefersReducedMotion = useReducedMotion()

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as any,
      },
    }),
  }

  const headlineVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as any } },
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="collection"
      className="relative w-full bg-[#080808] py-24 md:py-32 px-8 md:px-14 lg:px-20"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column (Pinned on Desktop) */}
        <motion.div
          className="flex flex-col justify-between lg:w-[26rem] flex-shrink-0 lg:sticky lg:top-[15vh] lg:self-start lg:h-fit"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={headlineVariants}
        >
          <div className="relative">
            <span className="absolute bottom-full left-0 mb-5 font-inter text-[9px] tracking-[0.45em] text-[#E8DDCA]/30 uppercase whitespace-nowrap block">
              The Collection
            </span>
            <h2 className="font-bodoni font-bold text-4xl md:text-5xl text-[#E8DDCA] leading-tight uppercase mb-8 -mt-[0.15em]">
              Built for<br />the Fearless
            </h2>
          </div>
          <button 
            onClick={() => onCategoryClick('All')}
            className="group inline-flex items-center gap-2 text-[#E8DDCA]/50 hover:text-[#E8DDCA] transition-colors cursor-pointer self-start"
          >
            <span className="font-inter text-[10px] tracking-[0.3em] uppercase">View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </button>
        </motion.div>

        {/* Right — 2×2 Category Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 h-fit">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              onClick={() => onCategoryClick(cat.label)}
              className="group relative overflow-hidden cursor-pointer bg-[#111] aspect-[3/4]"
            >
              {/* Image */}
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.opacity = '0'
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />

              {/* Label bar */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between">
                <span className="font-inter font-medium text-[11px] tracking-[0.25em] text-[#E8DDCA] uppercase">
                  {cat.label}
                </span>
                <ArrowRight
                  className="w-3.5 h-3.5 text-[#E8DDCA]/40 group-hover:text-[#E8DDCA] group-hover:translate-x-0.5 transition-all duration-300"
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
