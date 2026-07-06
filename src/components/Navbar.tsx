import { useState, useEffect, useRef } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useScrollAnimation } from '../hooks'
import {
  NAVIGATION_ITEMS,
  MOBILE_NAVIGATION_ITEMS,
  SCROLL_THRESHOLD,
} from '../constants'
import logo from '../../assets/logo1.png'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const lastYRef         = useRef(0)
  const lastTouchYRef    = useRef(0)
  const { count, openCart } = useCart()

  useScrollAnimation({ onScroll: setScrolled, threshold: SCROLL_THRESHOLD })

  useEffect(() => {
    lastYRef.current = window.scrollY

    const handleMouseMove = (e: MouseEvent) => {
      if (e.movementY < 0) setShowNavbar(true)
    }

    const handleScroll = () => {
      const y = window.scrollY
      if (y > lastYRef.current + 5) setShowNavbar(false)
      else if (y < lastYRef.current - 2) setShowNavbar(true)
      lastYRef.current = y
    }

    // On mobile, restore navbar when user swipes down (finger moving down = scrolling up)
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      if (currentY > lastTouchYRef.current + 8) setShowNavbar(true)
      lastTouchYRef.current = currentY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2 md:py-4 flex items-center justify-between">
        {/* Logo — smaller on mobile so it doesn't eat the header */}
        <img src={logo} alt="SNAZZY Logo" className="h-9 sm:h-14 md:h-24 w-auto" />

        {/* Desktop nav links */}
        <ul
          className={`hidden md:flex items-center gap-10 text-xs tracking-[0.25em] uppercase font-inter font-light transition-colors duration-300 ${
            scrolled ? 'text-[#1B3C34]/60' : 'text-white/60'
          }`}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-300 ${
                  scrolled ? 'hover:text-[#1B3C34]' : 'hover:text-white'
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 md:gap-4">
          <a
            href="#shop"
            className={`hidden md:inline-flex px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 font-inter border ${
              scrolled
                ? 'border-[#1B3C34]/25 text-[#1B3C34]/70 hover:bg-[#1B3C34] hover:text-white hover:border-[#1B3C34]'
                : 'border-white/25 text-white/80 hover:bg-white hover:text-black'
            }`}
          >
            Shop Now
          </a>

          {/* Cart button — 44px touch target on mobile */}
          <button
            onClick={openCart}
            className={`relative p-3 md:p-2 transition-colors ${
              scrolled
                ? 'text-[#111] md:text-[#1B3C34]/60 md:hover:text-[#1B3C34]'
                : 'text-white/70 hover:text-white'
            }`}
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1 md:-top-0.5 md:-right-0.5 w-4 h-4 bg-[#111] md:bg-[#1B3C34] text-white text-[9px] font-bold font-inter flex items-center justify-center leading-none">
                {count}
              </span>
            )}
          </button>

          {/* Hamburger — 44px touch target */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-3"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? 'bg-[#111]' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? 'bg-[#111]' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? 'bg-[#111]' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu — Zara-style: black panel, white text */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-[#111] ${
          menuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-4 font-inter text-[#FAF5E8]">
          {MOBILE_NAVIGATION_ITEMS.map((item) => (
            <li key={item} className="border-b border-white/10">
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-4 min-w-[44px] text-base tracking-[0.3em] uppercase transition-colors active:text-white/60"
              >
                {item}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#shop"
              onClick={() => setMenuOpen(false)}
              className="block py-4 min-w-[44px] text-base tracking-[0.3em] uppercase transition-colors active:text-white/60"
            >
              Shop Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
