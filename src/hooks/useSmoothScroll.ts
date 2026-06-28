import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ANIMATION_CONFIG } from '../constants'

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: ANIMATION_CONFIG.DURATION,
      easing: ANIMATION_CONFIG.EASING,
      smoothWheel: ANIMATION_CONFIG.SMOOTH_WHEEL,
    })

    // Keep ScrollTrigger in sync with Lenis's virtual scroll position
    lenis.on('scroll', ScrollTrigger.update)

    const rafCb = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCb)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(rafCb)
      lenis.destroy()
    }
  }, [])
}
