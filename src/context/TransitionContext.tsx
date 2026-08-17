import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface TransitionOptions {
  to: string
  themeColor?: string
  title?: string
}

interface TransitionContextType {
  navigateWithCinematicTransition: (options: TransitionOptions | string) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionState, setTransitionState] = useState<{ color: string; title: string }>({
    color: '#050505',
    title: 'Drop',
  })
  const prefersReducedMotion = useReducedMotion()

  const navigateWithCinematicTransition = (options: TransitionOptions | string) => {
    if (isTransitioning) return
    setIsTransitioning(true)

    const to = typeof options === 'string' ? options : options.to
    const color = typeof options === 'string' ? '#050505' : options.themeColor || '#050505'
    const title = typeof options === 'string' ? '' : options.title || ''

    setTransitionState({ color, title })

    const transitionDuration = prefersReducedMotion ? 200 : 800
    const holdDuration = 300

    setTimeout(() => {
      navigate(to)
      
      // Briefly hold the dark screen before revealing the new page
      setTimeout(() => {
        setIsTransitioning(false)
      }, holdDuration)
    }, transitionDuration)
  }

  return (
    <TransitionContext.Provider value={{ navigateWithCinematicTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{ backgroundColor: transitionState.color }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.4,
                duration: 0.6,
                ease: 'easeOut',
              }}
              className="flex flex-col items-center gap-4"
            >
              <span className="font-bodoni text-3xl md:text-4xl text-white tracking-widest uppercase">
                {transitionState.title}
              </span>
              <span className="font-inter text-[9px] tracking-[0.4em] text-white/40 uppercase">
                {transitionState.title ? 'Entering experience' : ''}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}

export function useCinematicTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useCinematicTransition must be used within a TransitionProvider')
  }
  return context
}
