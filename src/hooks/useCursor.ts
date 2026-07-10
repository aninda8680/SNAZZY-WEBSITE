import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CURSOR_CONFIG } from '../constants'

/**
 * Hook for managing custom cursor animation
 */
export const useCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const xDot = gsap.quickTo(dot, 'x', {
      duration: CURSOR_CONFIG.DOT_DURATION,
      ease: 'power3',
    })
    const yDot = gsap.quickTo(dot, 'y', {
      duration: CURSOR_CONFIG.DOT_DURATION,
      ease: 'power3',
    })
    const xRing = gsap.quickTo(ring, 'x', {
      duration: CURSOR_CONFIG.RING_DURATION,
      ease: 'power3',
    })
    const yRing = gsap.quickTo(ring, 'y', {
      duration: CURSOR_CONFIG.RING_DURATION,
      ease: 'power3',
    })

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX - CURSOR_CONFIG.DOT_HALF)
      yDot(e.clientY - CURSOR_CONFIG.DOT_HALF)
      xRing(e.clientX - CURSOR_CONFIG.RING_HALF)
      yRing(e.clientY - CURSOR_CONFIG.RING_HALF)
    }

    const onEnter = () => {
      gsap.to(ring, {
        scale: CURSOR_CONFIG.RING_SCALE_HOVER,
        borderColor: CURSOR_CONFIG.RING_COLOR_HOVER,
        duration: 0.3,
      })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }

    const onLeave = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: CURSOR_CONFIG.RING_COLOR_NORMAL,
        duration: 0.3,
      })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    const targets = document.querySelectorAll('a, button, [data-hover]')

    window.addEventListener('mousemove', onMove)
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return { dotRef, ringRef }
}
