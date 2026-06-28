export interface AnimationConfig {
  duration: number
  easing: (t: number) => number
  smoothWheel: boolean
}

export interface GSAPTimelineDefaults {
  ease: string
}

export interface CursorConfig {
  DOT_HALF: number
  RING_HALF: number
  DOT_SIZE: number
  RING_SIZE: number
  DOT_DURATION: number
  RING_DURATION: number
  RING_SCALE_HOVER: number
  RING_COLOR_NORMAL: string
  RING_COLOR_HOVER: string
}

export interface NavbarState {
  scrolled: boolean
  menuOpen: boolean
}
