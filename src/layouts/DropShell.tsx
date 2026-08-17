import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCinematicTransition } from '../context/TransitionContext'
import { ArrowLeft } from 'lucide-react'
import { dropsConfig } from '../config/dropsConfig'
import Drop1Page from '../pages/drop1/Drop1Page'

export default function DropShell() {
  const { id } = useParams<{ id: string }>()
  const { navigateWithCinematicTransition } = useCinematicTransition()

  const drop = dropsConfig.find((d) => d.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!drop) {
    return <Navigate to="/" replace />
  }

  // ── Drop 1 gets the full experience ──
  if (id === 'drop-1') {
    return <Drop1Page drop={drop} />
  }

  // ── All other drops use the generic placeholder shell ──
  return (
    <div
      className="min-h-screen text-white selection:bg-white/20 selection:text-white font-inter overflow-x-hidden"
      style={{ backgroundColor: drop.themeColor }}
    >
      {/* Persistent Back Control */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
        onClick={() =>
          navigateWithCinematicTransition({
            to: '/',
            themeColor: drop.themeColor,
            title: drop.name,
          })
        }
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-white/50 hover:text-white transition-colors group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-white/5">
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
        <span className="text-[9px] tracking-[0.25em] uppercase font-medium">
          Back to Snazzydot
        </span>
      </motion.button>

      {/* Placeholder */}
      <main className="relative pt-32 pb-24 px-8 md:px-16 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center max-w-2xl"
        >
          <span className="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-8 block">
            {drop.status === 'upcoming' ? 'Coming Soon' : 'Archived'}
          </span>
          <h1 className="font-bodoni font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-8 uppercase">
            {drop.name}
          </h1>
          <p className="text-white/40 text-sm leading-relaxed font-light mb-12 max-w-md">
            {drop.status === 'upcoming'
              ? 'This drop is in development. Check back soon.'
              : 'This drop has been archived. Thank you for your support.'}
          </p>
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </main>
    </div>
  )
}
