import { useCursor } from '../hooks'

export default function CustomCursor() {
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      {/* No Tailwind translate classes — GSAP owns the transform */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9999]"
      />
    </>
  )
}
