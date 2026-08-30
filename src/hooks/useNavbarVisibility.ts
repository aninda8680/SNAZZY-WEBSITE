import { useState, useEffect, useRef } from 'react'

export function useNavbarVisibility(menuOpen: boolean = false) {
  const [showNavbar, setShowNavbar] = useState(true)
  const lastYRef = useRef(0)
  const lastTouchYRef = useRef(0)

  useEffect(() => {
    lastYRef.current = window.scrollY

    const handleMouseMove = (e: MouseEvent) => {
      if (e.movementY < 0) setShowNavbar(true)
    }

    const handleScroll = () => {
      if (menuOpen) return
      const y = window.scrollY
      if (y > lastYRef.current + 5)      setShowNavbar(false)
      else if (y < lastYRef.current - 2) setShowNavbar(true)
      lastYRef.current = y
    }

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (menuOpen) return
      const currentY = e.touches[0].clientY
      if (currentY > lastTouchYRef.current + 8) setShowNavbar(true)
      lastTouchYRef.current = currentY
    }

    window.addEventListener('mousemove',  handleMouseMove)
    window.addEventListener('scroll',     handleScroll,     { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove',  handleTouchMove,  { passive: true })

    return () => {
      window.removeEventListener('mousemove',  handleMouseMove)
      window.removeEventListener('scroll',     handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove',  handleTouchMove)
    }
  }, [menuOpen])

  return showNavbar
}
