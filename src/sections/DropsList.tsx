import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCinematicTransition } from '../context/TransitionContext'
import { ArrowRight } from 'lucide-react'
import { dropsConfig, DropConfig } from '../config/dropsConfig'

function DropCard({ drop, index }: { drop: DropConfig; index: number }) {
  const { navigateWithCinematicTransition } = useCinematicTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const handleClick = () => {
    navigateWithCinematicTransition({
      to: `/drop/${drop.id}`,
      themeColor: drop.themeColor,
      title: drop.name,
    })
  }

  const gradientStart = drop.gradientStart || '#111'
  const gradientEnd = drop.gradientEnd || drop.themeColor

  const statusLabel =
    drop.status === 'live' ? 'Now Live' :
    drop.status === 'upcoming' ? 'Coming Soon' :
    'Archived'

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[65vh] min-h-[440px] overflow-hidden group cursor-pointer border-t border-[#1B3C34]/10"
      onClick={handleClick}
      style={{ backgroundColor: drop.themeColor }}
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[116%] -top-[8%]"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(170deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          }}
        />
        {/* Subtle radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

        {/* Custom imagery for Drop 1 */}
        {drop.id === 'drop-1' && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            {/* Story image (Panther profile/detail) - Left side */}
            <motion.img
              src="/images/drop1-story.png"
              alt=""
              className="absolute -left-[10%] md:-left-[5%] bottom-0 h-[80%] md:h-[100%] object-contain opacity-40 mix-blend-screen"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' }}
              initial={{ x: -20, opacity: 0, scaleX: -1 }}
              whileInView={{ x: 0, opacity: 0.4, scaleX: -1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            
            {/* Hero image (Panther full/aggressive) - Right side */}
            <motion.img
              src="/images/drop1-hero.png"
              alt=""
              className="absolute -right-[10%] md:right-0 bottom-0 h-[85%] md:h-[110%] object-contain opacity-50 mix-blend-screen"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' }}
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            />

            {/* Generated Claw Mark - Center/Right behind text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-15 mix-blend-screen pointer-events-none"
              style={{ filter: 'invert(1) contrast(1.5)' }}
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
            >
              <img
                src="/images/claw-mark.jpg"
                alt=""
                className="w-full h-full max-w-[800px] object-cover md:object-contain"
              />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-6">
        {/* Status / Enter label swap */}
        <div className="relative h-4 overflow-hidden flex items-center justify-center">
          <span className="block font-inter text-[10px] tracking-[0.45em] text-white/40 uppercase transform translate-y-0 group-hover:-translate-y-full transition-transform duration-500 ease-in-out whitespace-nowrap">
            {statusLabel}
          </span>
          <span className="absolute block font-inter text-[10px] tracking-[0.45em] text-white/80 uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out whitespace-nowrap">
            Enter Experience
          </span>
        </div>

        {/* Drop Name */}
        <h2 className="font-bodoni font-bold text-6xl md:text-8xl lg:text-9xl text-white tracking-[0.12em] uppercase leading-none transform scale-100 group-hover:scale-[1.025] transition-transform duration-700 ease-out">
          {drop.name}
        </h2>

        {/* Arrow CTA */}
        <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center relative overflow-hidden group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-500">
          <ArrowRight className="w-4 h-4 text-white/40 absolute transform translate-x-0 group-hover:translate-x-5 transition-transform duration-400 ease-in-out" />
          <ArrowRight className="w-4 h-4 text-white absolute transform -translate-x-5 group-hover:translate-x-0 transition-transform duration-400 ease-in-out" />
        </div>
      </div>
    </div>
  )
}

export function DropsList() {
  return (
    <section className="relative w-full bg-[#FAF5E8]">
      {/* Section Header */}
      <div className="px-6 md:px-16 pt-16 pb-8 max-w-[1400px] mx-auto flex flex-col items-center text-center">
        <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40 mb-2">
          Exclusive Releases
        </p>
        <h2 className="font-bodoni font-bold text-4xl md:text-5xl text-[#1B3C34] tracking-[0.08em] uppercase leading-tight">
          The Drops
        </h2>
        <p className="font-inter text-[11px] tracking-wide text-[#1B3C34]/40 mt-2">
          Each drop is a distinct world
        </p>
      </div>

      {/* Cards Stack */}
      <div className="flex flex-col w-full">
        {dropsConfig.map((drop, i) => (
          <DropCard key={drop.id} drop={drop} index={i} />
        ))}
      </div>
    </section>
  )
}
