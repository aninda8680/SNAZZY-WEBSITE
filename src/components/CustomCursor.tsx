import { useCursor } from '../hooks'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function CustomCursor() {
  const { dotRef, ringRef } = useCursor()

  if (isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ border: '1.5px solid rgba(255,255,255,0.75)' }}
      />
    </>
  )
}
