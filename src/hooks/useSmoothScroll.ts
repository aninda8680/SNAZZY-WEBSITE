import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ANIMATION_CONFIG } from '../constants'

export const useSmoothScroll = () => {
  useEffect(() => {
    // Skip Lenis on touch/mobile devices — native scroll is better on phones
    const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    if (isTouchDevice) return

    const lenis = new Lenis({
      duration: ANIMATION_CONFIG.DURATION,
      easing: ANIMATION_CONFIG.EASING,
      smoothWheel: ANIMATION_CONFIG.SMOOTH_WHEEL,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafCb = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCb)
    gsap.ticker.lagSmoothing(0)

    // Allow modals/overlays to pause and resume Lenis via custom events
    const pause  = () => lenis.stop()
    const resume = () => lenis.start()
    window.addEventListener('lenis-pause',  pause)
    window.addEventListener('lenis-resume', resume)

    return () => {
      gsap.ticker.remove(rafCb)
      lenis.destroy()
      window.removeEventListener('lenis-pause',  pause)
      window.removeEventListener('lenis-resume', resume)
    }
  }, [])
}
