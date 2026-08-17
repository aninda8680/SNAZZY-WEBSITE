import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useCinematicTransition } from '../../context/TransitionContext'
import { DropConfig } from '../../config/dropsConfig'

interface Drop1FooterProps {
  drop: DropConfig
}

export default function Drop1Footer({ drop }: Drop1FooterProps) {
  const { navigateWithCinematicTransition } = useCinematicTransition()

  return (
    <footer className="relative w-full bg-[#050505] border-t border-white/5">
      {/* Persistent back bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center justify-between px-8 md:px-14 py-6 border-b border-white/5"
      >
        {/* Back button */}
        <button
          onClick={() =>
            navigateWithCinematicTransition({
              to: '/',
              themeColor: drop.themeColor,
              title: drop.name,
            })
          }
          className="group flex items-center gap-3 text-[#E8DDCA]/40 hover:text-[#E8DDCA] transition-colors duration-300 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E8DDCA]/30 transition-colors bg-white/3">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </div>
          <span className="font-inter text-[9px] tracking-[0.3em] uppercase font-medium">
            Back to Snazzydot
          </span>
        </button>

        {/* Brand mark */}
        <span className="font-inter font-semibold text-[10px] tracking-[0.35em] text-[#E8DDCA]/30 uppercase">
          SNAZZYDOT.
        </span>

        {/* Tagline */}
        <span className="font-inter text-[9px] tracking-[0.25em] text-[#E8DDCA]/20 uppercase hidden md:block">
          Wear Your Story.
        </span>
      </motion.div>

      {/* Bottom meta */}
      <div className="px-8 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-[9px] tracking-[0.2em] text-white/15 uppercase">
          © {new Date().getFullYear()} Snazzydot. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Returns'].map((link) => (
            <a
              key={link}
              href="#"
              className="font-inter text-[9px] tracking-[0.2em] text-white/15 hover:text-white/35 uppercase transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
