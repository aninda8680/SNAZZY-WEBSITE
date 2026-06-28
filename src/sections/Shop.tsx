import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type Category = 'All' | 'Pure Luxe' | 'Bloom Series' | 'Midnight Edge' | 'Earth Roots'

interface Product {
  id: number
  name: string
  tagline: string
  category: Exclude<Category, 'All'>
  price: string
  originalPrice?: string
  image: string
  bgFrom: string
  bgTo: string
  accent: string
  textAccent: string
  badge: string
  badgeBg: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Pure Luxe Classic',
    tagline: 'Gold metallic embroidery on Pima cotton',
    category: 'Pure Luxe',
    price: '₹1,499',
    image: '/images/tshirt-luxe.png',
    bgFrom: '#1A0F00',
    bgTo: '#3D2800',
    accent: '#F59E0B',
    textAccent: '#FDE68A',
    badge: 'Bestseller',
    badgeBg: '#F59E0B20',
  },
  {
    id: 2,
    name: 'Pure Luxe Premium',
    tagline: 'Limited run — 50 pieces worldwide',
    category: 'Pure Luxe',
    price: '₹1,999',
    originalPrice: '₹2,499',
    image: '/images/tshirt-luxe.png',
    bgFrom: '#1A0F00',
    bgTo: '#4A3200',
    accent: '#F59E0B',
    textAccent: '#FDE68A',
    badge: 'New',
    badgeBg: '#F59E0B20',
  },
  {
    id: 3,
    name: 'Bloom Floral Tee',
    tagline: 'Japanese botanical motifs in satin stitch',
    category: 'Bloom Series',
    price: '₹1,599',
    image: '/images/tshirt-bloom.png',
    bgFrom: '#2D0A1E',
    bgTo: '#5C1A3A',
    accent: '#F9A8D4',
    textAccent: '#FBCFE8',
    badge: 'Limited',
    badgeBg: '#F9A8D420',
  },
  {
    id: 4,
    name: 'Bloom Garden',
    tagline: 'Dense floral bloom on 220gsm jersey',
    category: 'Bloom Series',
    price: '₹1,799',
    image: '/images/tshirt-bloom.png',
    bgFrom: '#2D0A1E',
    bgTo: '#6B1F45',
    accent: '#F9A8D4',
    textAccent: '#FBCFE8',
    badge: 'Popular',
    badgeBg: '#F9A8D420',
  },
  {
    id: 5,
    name: 'Midnight Edge Geo',
    tagline: 'High-contrast geometric on 280gsm cotton',
    category: 'Midnight Edge',
    price: '₹1,699',
    image: '/images/tshirt-midnight.png',
    bgFrom: '#020617',
    bgTo: '#0F172A',
    accent: '#93C5FD',
    textAccent: '#BFDBFE',
    badge: 'Bold',
    badgeBg: '#93C5FD20',
  },
  {
    id: 6,
    name: 'Earth Roots Heritage',
    tagline: 'Kantha & zardozi on organic cotton',
    category: 'Earth Roots',
    price: '₹1,499',
    image: '/images/tshirt-earth.png',
    bgFrom: '#1A0E07',
    bgTo: '#3D2010',
    accent: '#D4A574',
    textAccent: '#E5C5A0',
    badge: 'Artisan',
    badgeBg: '#D4A57420',
  },
]

const categories: Category[] = ['All', 'Pure Luxe', 'Bloom Series', 'Midnight Edge', 'Earth Roots']

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-sm overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${product.bgFrom} 0%, ${product.bgTo} 100%)` }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${product.accent}33, transparent 70%)`,
            opacity: hovered ? 0.7 : 0.3,
          }}
        />

        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
        />

        {/* Badge */}
        <span
          className="absolute top-4 left-4 font-inter text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
          style={{
            background: product.badgeBg,
            color: product.accent,
            border: `1px solid ${product.accent}30`,
          }}
        >
          {product.badge}
        </span>

        {/* Hover: CTA slide up */}
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi! I'd like to order the ${product.name} (${product.price}). Please share availability & sizes.`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-inter font-bold text-xs tracking-[0.15em] uppercase transition-opacity duration-300"
            style={{ background: product.accent, color: '#000' }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Order on WhatsApp
          </a>
        </div>

        {/* Dark scrim at bottom for readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${product.bgFrom}cc, transparent)` }}
        />
      </div>

      {/* Info row */}
      <div
        className="flex items-start justify-between gap-4 px-5 py-4"
        style={{ background: `linear-gradient(180deg, ${product.bgFrom}ee 0%, #080808 100%)` }}
      >
        <div className="min-w-0">
          <p
            className="font-inter text-[9px] tracking-[0.35em] uppercase mb-1 truncate"
            style={{ color: product.accent + '99' }}
          >
            {product.category}
          </p>
          <h3 className="font-bodoni font-bold text-white text-lg leading-tight truncate">
            {product.name}
          </h3>
          <p className="font-inter font-light text-white/35 text-xs leading-5 mt-1 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        <div className="text-right flex-shrink-0 pt-1">
          <p className="font-bodoni font-bold text-xl" style={{ color: product.textAccent }}>
            {product.price}
          </p>
          {product.originalPrice && (
            <p className="font-inter text-xs text-white/25 line-through mt-0.5">
              {product.originalPrice}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Shop() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Category>('All')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 78%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <section ref={sectionRef} id="shop" className="relative bg-[#080808] py-24 md:py-36 overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* Amber ambient glow top-right */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F59E0B08 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div
          ref={headingRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <p className="font-inter text-xs tracking-[0.5em] uppercase text-amber-400">
                Shop The Collection
              </p>
            </div>
            <h2 className="font-bodoni font-black text-5xl md:text-7xl text-white leading-[1.05]">
              Find Your<br />
              <em className="italic text-white/35">Statement</em>
            </h2>
          </div>
          <div className="md:text-right max-w-xs">
            <p className="font-inter font-light text-white/40 text-sm leading-7">
              Every piece is crafted to order.
              <br />
              Limited quantities per season.
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="relative font-inter text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all duration-300 hover:border-white/30"
                style={{
                  color: isActive ? '#000' : 'rgba(255,255,255,0.45)',
                  background: isActive ? '#F59E0B' : 'transparent',
                  border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                <span className="relative z-10">{cat}</span>
              </button>
            )
          })}
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="mt-16 pt-16 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="font-inter text-xs text-white/30 tracking-wider text-center sm:text-left">
            Can't find what you're looking for? We do fully custom embroidery.
          </p>
          <a
            href="#contact"
            className="flex-shrink-0 font-inter font-bold text-xs tracking-[0.25em] uppercase px-8 py-3.5 rounded-full border border-white/15 text-white/70 hover:bg-white hover:text-black transition-all duration-300"
          >
            Request Custom Order
          </a>
        </div>
      </div>
    </section>
  )
}
