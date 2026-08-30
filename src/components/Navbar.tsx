import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, X, User, LogOut } from 'lucide-react'
import { useScrollAnimation, useNavbarVisibility } from '../hooks'
import {
  NAVIGATION_ITEMS,
  MOBILE_NAVIGATION_ITEMS,
  SCROLL_THRESHOLD,
} from '../constants'
import logo from '../../assets/logo1.png'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

type NavTheme = 'dark' | 'light'

export default function Navbar({
  alwaysSolid = false,
  theme = 'dark',
}: {
  alwaysSolid?: boolean
  theme?: NavTheme
} = {}) {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const showNavbar = useNavbarVisibility(menuOpen)
  const { count, openCart } = useCart()
  const { user, logout }    = useAuth()

  useScrollAnimation({ onScroll: setScrolled, threshold: SCROLL_THRESHOLD })

  const solid = alwaysSolid || scrolled || menuOpen
  const isLight = theme === 'light'

  // ── Color tokens based on theme × solid state ────────────────────────────
  // When solid + light: cream bg, dark-emerald text
  // When solid + dark:  dark-emerald bg (#0A1C17/95), white text   (original)
  // When not solid (transparent bg): always white text (landing hero)

  const navBg = solid
    ? isLight
      ? 'bg-[#FAF5E8]/95 backdrop-blur-md border-b border-[#1B3C34]/12'
      : 'bg-[#0A1C17]/95 backdrop-blur-md border-b border-white/10'
    : 'bg-transparent'

  // Text colors for links
  const linkColor   = solid && isLight ? 'text-[#1B3C34]/60'  : 'text-white/60'
  const linkHover   = solid && isLight ? 'hover:text-[#1B3C34]' : 'hover:text-white'
  const iconColor   = solid && isLight ? 'text-[#1B3C34]/70'  : 'text-white/80'
  const iconHover   = solid && isLight ? 'hover:text-[#1B3C34]' : 'hover:text-white'
  const badgeColors = solid && isLight
    ? 'bg-[#1B3C34] text-[#FAF5E8]'
    : 'bg-white text-[#1B3C34]'

  // Hamburger lines
  const lineColor = solid && isLight ? 'bg-[#1B3C34]' : 'bg-white'

  // Sign-in button
  const signInBorder = solid && isLight ? 'border-[#1B3C34]/30 text-[#1B3C34]/75 hover:bg-[#1B3C34] hover:text-[#FAF5E8]' : 'border-white/25 text-white/80 hover:bg-white hover:text-[#1B3C34]'

  // Mobile menu panel stays dark-emerald regardless of theme
  const mobileMenuBg = '#1B3C34'

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showNavbar || menuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${navBg}`}
    >
      {/* ── Glare Effect (dark theme only) ── */}
      {!isLight && (
        <div className={`absolute top-0 left-0 w-full h-14 md:h-16 overflow-hidden pointer-events-none transition-opacity duration-500 ${solid ? 'opacity-100' : 'opacity-0'}`}>
          <div className="glare-effect" />
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="SNAZZY"
            className={`h-16 sm:h-20 md:h-24 w-auto object-contain scale-125 origin-left translate-y-1 transition-all duration-300 ${
              solid && isLight ? 'brightness-0' : ''
            }`}
          />
        </a>

        {/* Desktop nav links */}
        <ul className={`hidden md:flex items-center gap-10 text-xs tracking-[0.25em] uppercase font-inter font-medium transition-colors duration-300 ${linkColor}`}>
          {NAVIGATION_ITEMS.map((item) => {
            const href = item === 'Collections' ? '/collections' : `#${item.toLowerCase()}`
            return (
              <li key={item}>
                <a href={href} className={`transition-colors duration-300 ${linkHover}`}>
                  {item}
                </a>
              </li>
            )
          })}
          <li>
            <a href="/about" className={`transition-colors duration-300 ${linkHover}`}>
              About
            </a>
          </li>
        </ul>

        {/* Right — cart + auth + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* Desktop Sign In / Sign Out */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <a
                href="/account"
                className={`text-xs tracking-[0.2em] uppercase font-inter transition-colors duration-300 ${linkColor} ${linkHover}`}
              >
                Account
              </a>
              <button
                onClick={logout}
                className={`hidden md:inline-flex px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 font-inter border ${signInBorder}`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className={`hidden md:inline-flex px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 font-inter border ${signInBorder}`}
            >
              Sign In
            </a>
          )}

          {/* Account icon — mobile only */}
          <a
            href={user ? '#' : '/login'}
            onClick={user ? (e) => { e.preventDefault(); setMenuOpen(true) } : undefined}
            className={`md:hidden p-4 sm:p-4.5 transition-colors ${iconColor}`}
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </a>

          {/* Cart */}
          <button
            onClick={openCart}
            className={`relative p-4 sm:p-4.5 md:p-2 transition-colors ${iconColor} ${iconHover}`}
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className={`absolute top-2 right-1.5 md:-top-0.5 md:-right-0.5 w-[18px] h-[18px] text-[9px] font-bold font-inter flex items-center justify-center leading-none rounded-sm ${badgeColors}`}>
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
              ? <X className={`w-5 h-5 ${solid && isLight ? 'text-[#1B3C34]' : 'text-white'}`} />
              : (
                <span className="flex flex-col gap-[5px]">
                  <span className={`block w-5 h-[1.5px] transition-colors duration-300 ${lineColor}`} />
                  <span className={`block w-5 h-[1.5px] transition-colors duration-300 ${lineColor}`} />
                  <span className={`block w-3 h-[1.5px] transition-colors duration-300 ${lineColor}`} />
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
        style={{ background: mobileMenuBg }}
      >
        {/* Nav links */}
        <ul className="flex flex-col px-6 pt-2 pb-4">
          {MOBILE_NAVIGATION_ITEMS.map((item, i) => {
            const href = item === 'Collections' ? '/collections' : `#${item.toLowerCase()}`
            return (
              <li key={item}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 font-inter text-[13px] tracking-[0.3em] uppercase text-[#FAF5E8]/80 active:text-[#FAF5E8]/50 transition-colors border-b border-[#FAF5E8]/10"
                >
                  {item}
                  <span className="font-inter text-[10px] text-[#FAF5E8]/25 tracking-[0.2em]">
                    0{i + 1}
                  </span>
                </a>
              </li>
            )
          })}
          {/* About */}
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
            href="/collections"
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
