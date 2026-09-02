import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Twitter } from 'lucide-react'
import logo from '../../assets/logo1.png'

const SHOP_LINKS = [
  { label: "Men's T-Shirts", href: '/collections' },
  { label: "Women's T-Shirts", href: '/collections' },
  { label: 'Hoodies', href: '/collections' },
  { label: 'Sweatshirts', href: '/collections' },
]

const ABOUT_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'The Craft', href: '/about#brand' },
  { label: 'Drop Calendar', href: '/#drops' },
]

const SUPPORT_LINKS = [
  { label: 'Sizing Guide', href: '#' },
  { label: 'Care Instructions', href: '#' },
  { label: 'Returns & Exchanges', href: '#' },
  { label: 'Contact Us', href: '/#contact' },
]

export default function Footer({ transparent = false }: { transparent?: boolean } = {}) {
  const logoFilter = transparent ? 'brightness-0' : 'brightness-0'
  // using brightness-0 since background is light and text is dark
  return (
    <footer className={`${transparent ? 'bg-transparent' : 'bg-[#FAF5E8]'} border-t border-[#1B3C34]/10`}>

      {/* Main grid */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <img
                src={logo}
                alt="Snazzy"
                className="h-10 md:h-12 w-auto object-contain scale-125 origin-left -translate-x-1 brightness-0 opacity-90"
              />
            </Link>
            <p className="font-inter font-light text-[12px] leading-[1.8] text-[#1B3C34]/50 max-w-[200px] mb-5">
              Premium embroidered streetwear. Handcrafted in India, worn by the world.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-[#1B3C34]/35 hover:text-[#1B3C34] transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="text-[#1B3C34]/35 hover:text-[#1B3C34] transition-colors duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-[#1B3C34]/40 mb-4">
              Shop
            </p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="font-inter text-[12px] text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors duration-200 tracking-wide"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-[#1B3C34]/40 mb-4">
              Brand
            </p>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="font-inter text-[12px] text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors duration-200 tracking-wide"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-inter text-[9px] tracking-[0.45em] uppercase text-[#1B3C34]/40 mb-4">
              Support
            </p>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="font-inter text-[12px] text-[#1B3C34]/60 hover:text-[#1B3C34] transition-colors duration-200 tracking-wide"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1B3C34]/8 px-5 md:px-8 py-4 flex items-center justify-between flex-wrap gap-3">
        <span className="font-inter text-[9px] tracking-[0.35em] uppercase text-[#1B3C34]/30">
          © {new Date().getFullYear()} Snazzy — Vizianagram, India
        </span>
        <div className="flex items-center gap-3 text-[#1B3C34]/20">
          {/* Payment icons — minimal text placeholders */}
          {['VISA', 'MC', 'UPI', 'RZP'].map((p) => (
            <span key={p} className="font-inter text-[8px] tracking-[0.2em] border border-[#1B3C34]/15 px-1.5 py-0.5 text-[#1B3C34]/35">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
