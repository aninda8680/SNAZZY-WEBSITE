export const NAVIGATION_ITEMS = ['Collections', 'Heritage', 'Craft', 'Gallery']

export const MOBILE_NAVIGATION_ITEMS = [
  'Collections',
  'Heritage',
  'Craft',
  'Gallery',
  'Contact',
]

export const SCROLL_THRESHOLD = 50

export const ANIMATION_CONFIG = {
  DURATION: 1.2,
  EASING: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  SMOOTH_WHEEL: true,
}

export const GSAP_DEFAULTS = {
  EASE: 'power4.out',
}

export const CURSOR_CONFIG = {
  DOT_HALF: 4,
  RING_HALF: 16,
  DOT_SIZE: 8,
  RING_SIZE: 32,
  DOT_DURATION: 0.1,
  RING_DURATION: 0.4,
  RING_SCALE_HOVER: 2.2,
  RING_COLOR_NORMAL: 'rgba(255,255,255,0.3)',
  RING_COLOR_HOVER: 'rgba(245,158,11,0.7)',
}

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  TWO_XL: 1536,
}
