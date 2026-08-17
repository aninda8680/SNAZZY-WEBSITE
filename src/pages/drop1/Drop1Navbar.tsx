import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag, User } from 'lucide-react'
import logo from '../../../assets/logo.png'

const NAV_LINKS = ['DROP 1', 'COLLECTION', 'STORY', 'LOOKBOOK']

export default function Drop1Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : 0.9,
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-8 md:px-14 h-16">
        {/* Wordmark / Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} alt="SNAZZYDOT Logo" className="h-24 w-auto object-contain scale-110 origin-left translate-y-2 translate-x-12" />
        </a>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className={`font-inter text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 ${
                  link === 'DROP 1'
                    ? 'text-[#E8DDCA] border-b border-[#E8DDCA]/60 pb-0.5'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <button className="text-white/40 hover:text-white/80 transition-colors cursor-pointer">
            <User className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button className="text-white/40 hover:text-white/80 transition-colors cursor-pointer">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
