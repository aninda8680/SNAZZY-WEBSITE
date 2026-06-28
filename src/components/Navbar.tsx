import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks'
import {
  NAVIGATION_ITEMS,
  MOBILE_NAVIGATION_ITEMS,
  SCROLL_THRESHOLD,
} from '../constants'
import logo from '../../assets/logo1.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const lastYRef = useRef(0)

  useScrollAnimation({
    onScroll: setScrolled,
    threshold: SCROLL_THRESHOLD,
  })

  useEffect(() => {
    lastYRef.current = window.scrollY

    const handleMouseMove = (event: MouseEvent) => {
      if (event.movementY < 0) {
        setShowNavbar(true)
      }
    }

    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastYRef.current) {
        setShowNavbar(false)
      } else if (currentY < lastYRef.current) {
        setShowNavbar(true)
      }
      lastYRef.current = currentY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 navbar-transition ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-white/5 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <img src={logo} alt="SNAZZY Logo" className="h-32 w-auto" />

        <ul className="hidden md:flex items-center gap-10 text-white/60 text-xs tracking-[0.25em] uppercase font-inter font-light">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#shop"
            className="hidden md:inline-flex border border-white/20 px-6 py-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:bg-white hover:text-black transition-all duration-300 rounded-full font-inter"
          >
            Shop Now
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-4 gap-5 text-white/70 text-sm tracking-widest uppercase">
          {MOBILE_NAVIGATION_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#shop"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Shop Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
