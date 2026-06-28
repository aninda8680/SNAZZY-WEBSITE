import gsap from 'gsap'
import { GSAP_DEFAULTS } from '../constants'

/**
 * Creates a standard animation timeline
 */
export const createAnimationTimeline = (defaults?: any) => {
  return gsap.timeline({
    defaults: {
      ...GSAP_DEFAULTS,
      ...defaults,
    },
  })
}

/**
 * Animates element entry from bottom
 */
export const animateFromBottom = (
  element: HTMLElement | null,
  duration = 1,
  delay = 0,
  stagger = 0
) => {
  if (!element) return

  return gsap.from(element, {
    y: 100,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: GSAP_DEFAULTS.EASE,
  })
}

/**
 * Animates element entry from top
 */
export const animateFromTop = (
  element: HTMLElement | null,
  duration = 1,
  delay = 0
) => {
  if (!element) return

  return gsap.from(element, {
    y: -100,
    opacity: 0,
    duration,
    delay,
    ease: GSAP_DEFAULTS.EASE,
  })
}

/**
 * Creates a scroll trigger animation
 */
export const createScrollTriggerAnimation = (
  target: HTMLElement | null,
  animation: { [key: string]: any },
  scrollTriggerOptions: any
) => {
  if (!target) return

  return gsap.to(target, {
    ...animation,
    scrollTrigger: {
      ...scrollTriggerOptions,
    },
  })
}
