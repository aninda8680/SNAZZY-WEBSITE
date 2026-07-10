import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, X, User, LogOut } from 'lucide-react'
import { useScrollAnimation } from '../hooks'
import {
  NAVIGATION_ITEMS,
  MOBILE_NAVIGATION_ITEMS,
  SCROLL_THRESHOLD,
} from '../constants'
import logo from '../../assets/logo1.png'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [showNavbar,   setShowNavbar]   = useState(true)
  const lastYRef       = useRef(0)
  const lastTouchYRef  = useRef(0)
  const { count, openCart } = useCart()
  const { user, logout } = useAuth()

  useScrollAnimation({ onScroll: setScrolled, threshold: SCROLL_THRESHOLD })

  useEffect(() => {
    lastYRef.current = window.scrollY

    const handleMouseMove = (e: MouseEvent) => {
      if (e.movementY < 0) setShowNavbar(true)
    }

    const handleScroll = () => {
      if (menuOpen) return  // never hide while menu is open
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

  const solid = scrolled || menuOpen

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showNavbar || menuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${
        solid
          ? 'bg-[#FAF5E8] border-b border-[#1B3C34]/10'
          : 'bg-transparent'
      }`}
    >
      {/* ── Top bar ── */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-4 flex items-center justify-between">

        {/* Logo */}
        <img
          src={logo}
          alt="SNAZZY"
          className="h-12 sm:h-14 md:h-20 w-auto object-contain"
        />

        {/* Desktop nav links */}
        <ul className={`hidden md:flex items-center gap-10 text-xs tracking-[0.25em] uppercase font-inter font-light transition-colors duration-300 ${
          solid ? 'text-[#1B3C34]/60' : 'text-white/60'
        }`}>
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-300 ${
                  solid ? 'hover:text-[#1B3C34]' : 'hover:text-white'
                }`}
              >
                {item}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/about"
              className={`transition-colors duration-300 ${
                solid ? 'hover:text-[#1B3C34]' : 'hover:text-white'
              }`}
            >
              About
            </a>
          </li>
        </ul>

        {/* Right — cart + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* Desktop Sign In / Sign Out */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <a
                href="/account"
                className={`text-xs tracking-[0.2em] uppercase font-inter transition-colors duration-300 ${
                  solid ? 'text-[#1B3C34]/60 hover:text-[#1B3C34]' : 'text-white/60 hover:text-white'
                }`}
              >
                Account
              </a>
              <button
                onClick={logout}
                className={`hidden md:inline-flex px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 font-inter border ${
                  solid
                    ? 'border-[#1B3C34]/25 text-[#1B3C34]/70 hover:bg-[#1B3C34] hover:text-white hover:border-[#1B3C34]'
                    : 'border-white/25 text-white/80 hover:bg-white hover:text-[#1B3C34]'
                }`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className={`hidden md:inline-flex px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 font-inter border ${
                solid
                  ? 'border-[#1B3C34]/25 text-[#1B3C34]/70 hover:bg-[#1B3C34] hover:text-white hover:border-[#1B3C34]'
                  : 'border-white/25 text-white/80 hover:bg-white hover:text-[#1B3C34]'
              }`}
            >
              Sign In
            </a>
          )}

          {/* Account icon — mobile only */}
          <a
            href={user ? '#' : '/login'}
            onClick={user ? (e) => { e.preventDefault(); setMenuOpen(true) } : undefined}
            className={`md:hidden p-4 sm:p-4.5 transition-colors ${
              solid ? 'text-[#1B3C34]/70' : 'text-white/80'
            }`}
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </a>

          {/* Cart */}
          <button
            onClick={openCart}
            className={`relative p-4 sm:p-4.5 md:p-2 transition-colors ${
              solid ? 'text-[#1B3C34]/70 hover:text-[#1B3C34]' : 'text-white/80 hover:text-white'
            }`}
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-2 right-1.5 md:-top-0.5 md:-right-0.5 w-[18px] h-[18px] bg-[#1B3C34] text-[#FAF5E8] text-[9px] font-bold font-inter flex items-center justify-center leading-none rounded-sm">
                {count}
              </span>
            )}
          </button>

          {/* Hamburger / Close */}
          <button
            className="md:hidden flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen
              ? <X className={`w-5 h-5 ${solid ? 'text-[#1B3C34]' : 'text-white'}`} />
              : (
                <span className="flex flex-col gap-[5px]">
                  <span className={`block w-5 h-[1.5px] transition-colors duration-300 ${solid ? 'bg-[#1B3C34]' : 'bg-white'}`} />
                  <span className={`block w-5 h-[1.5px] transition-colors duration-300 ${solid ? 'bg-[#1B3C34]' : 'bg-white'}`} />
                  <span className={`block w-3 h-[1.5px] transition-colors duration-300 ${solid ? 'bg-[#1B3C34]' : 'bg-white'}`} />
                </span>
              )
            }
          </button>
        </div>
      </div>

      {/* ── Mobile menu panel ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: '#1B3C34' }}
      >
        {/* Nav links */}
        <ul className="flex flex-col px-6 pt-2 pb-4">
          {MOBILE_NAVIGATION_ITEMS.map((item, i) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-inter text-[13px] tracking-[0.3em] uppercase text-[#FAF5E8]/80 active:text-[#FAF5E8]/50 transition-colors border-b border-[#FAF5E8]/10"
              >
                {item}
                <span className="font-inter text-[10px] text-[#FAF5E8]/25 tracking-[0.2em]">
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
          {/* About — page route, not anchor */}
          <li>
            <a
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-4 font-inter text-[13px] tracking-[0.3em] uppercase text-[#FAF5E8]/80 active:text-[#FAF5E8]/50 transition-colors"
            >
              About
              <span className="font-inter text-[10px] text-[#FAF5E8]/25 tracking-[0.2em]">
                0{MOBILE_NAVIGATION_ITEMS.length + 1}
              </span>
            </a>
          </li>
        </ul>

        {/* Account row */}
        <div className="px-6 pt-4 pb-2">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FAF5E8]/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-[#FAF5E8]/70" />
                </div>
                <div>
                  <p className="font-inter text-[11px] text-[#FAF5E8]/80 tracking-wide leading-none">
                    {user.full_name.split(' ')[0]}
                  </p>
                  <p className="font-inter text-[9px] text-[#FAF5E8]/35 tracking-wider mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#FAF5E8]/50 active:text-[#FAF5E8]/80 transition-colors py-2"
                >
                  Settings
                </a>
                <a
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#FAF5E8]/50 active:text-[#FAF5E8]/80 transition-colors py-2"
                >
                  Orders
                </a>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.25em] uppercase text-[#FAF5E8]/40 active:text-[#FAF5E8]/70 transition-colors py-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 py-3"
            >
              <div className="w-7 h-7 rounded-full border border-[#FAF5E8]/20 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-[#FAF5E8]/50" />
              </div>
              <div>
                <p className="font-inter text-[12px] tracking-[0.2em] uppercase text-[#FAF5E8]/70">
                  Sign In
                </p>
                <p className="font-inter text-[9px] text-[#FAF5E8]/30 tracking-wide mt-0.5">
                  Access your account
                </p>
              </div>
            </a>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-6 pt-3 border-t border-[#FAF5E8]/10">
          <a
            href="#shop"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-full py-4 bg-[#FAF5E8] text-[#1B3C34] font-inter text-[11px] tracking-[0.4em] uppercase font-medium active:opacity-80 transition-opacity"
          >
            Shop Now
          </a>
        </div>
      </div>
    </nav>
  )
}
