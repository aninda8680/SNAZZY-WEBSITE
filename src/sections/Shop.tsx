import { useEffect, useRef, useState, useId } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavbarVisibility } from '../hooks'
import { useNavigate } from 'react-router-dom'
import { MAIN_PRODUCTS, type ProductData } from '../data/products'

gsap.registerPlugin(ScrollTrigger)

type Category = 'All' | "Men's T-Shirts" | "Women's T-Shirts" | 'Hoodies' | 'Sweatshirts'
type ShopVariant = 'section' | 'page'

const categories: Category[] = ['All', "Men's T-Shirts", "Women's T-Shirts", 'Hoodies', 'Sweatshirts']

// ── Skeleton card shimmer ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-[#1B3C34]/8 rounded-none" />
      <div className="pt-3 px-0 space-y-2">
        <div className="h-2.5 bg-[#1B3C34]/10 w-3/4" />
        <div className="h-3.5 bg-[#1B3C34]/8 w-1/3" />
      </div>
    </div>
  )
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  onClick,
}: {
  product: ProductData
  index: number
  onClick: (p: ProductData) => void
}) {
  const { addItem } = useCart()
  const [picking, setPicking] = useState(false)
  const [added, setAdded]     = useState<string | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const images = product.images

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation()
    setPicking(true)
  }

  function handlePickSize(e: React.MouseEvent, size: string) {
    e.stopPropagation()
    addItem({
      id: `${product.id}-${size}`,
      name: `${product.name} / ${size}`,
      price: product.price,
      priceNum: product.priceNum,
      accent: '#1B3C34',
    })
    setAdded(size)
    setTimeout(() => { setPicking(false); setAdded(null) }, 1200)
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation()
    setPicking(false)
  }

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col cursor-pointer"
      onClick={() => !picking && onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!added) setPicking(false); }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-transparent">
        
        {/* Swipeable Gallery (All Devices) */}
        <div className="w-full h-full relative">
          <motion.div
            className="w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe < -100 || offset.x < -40) {
                if (imgIndex < images.length - 1) setImgIndex(imgIndex + 1)
              } else if (swipe > 100 || offset.x > 40) {
                if (imgIndex > 0) setImgIndex(imgIndex - 1)
              }
            }}
          >
            <motion.div
              className="flex w-full h-full"
              animate={{ x: `-${imgIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} — view ${i + 1}`}
                  className="w-full h-full flex-shrink-0 object-cover object-top pointer-events-none"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wishlist — elegant fade in on hover */}
        <motion.button
          animate={{ opacity: hovered ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex absolute top-3 right-3 p-2 text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors z-20 bg-[#FAF5E8]/60 hover:bg-[#FAF5E8]/95 backdrop-blur-md rounded-full"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className="w-3.5 h-3.5" />
        </motion.button>

        {/* Badge */}
        {product.badge && (
          <span className="hidden md:block absolute top-3 left-3 font-inter text-[9px] tracking-[0.3em] uppercase text-[#1B3C34]/70 bg-[#FAF5E8]/80 backdrop-blur-md px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {/* Quick Add icon - visible on mobile, positioned down right */}
        <button
          onClick={handleQuickAdd}
          className="md:hidden absolute bottom-3 right-3 p-2 text-[#1B3C34]/80 bg-[#FAF5E8]/70 hover:bg-[#FAF5E8]/95 backdrop-blur-md rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.05)] z-20"
          aria-label={`Quick Add ${product.name}`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {/* Elegant Quick Add Drawer */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-30 ${
            picking ? 'translate-y-0' : 'translate-y-full md:group-hover:translate-y-0'
          }`}
        >
          <div className="bg-[#FAF5E8]/80 backdrop-blur-xl border-t border-[#1B3C34]/10 w-full">
            {!picking ? (
              <button
                onClick={handleQuickAdd}
                className="w-full py-4 hidden md:flex font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34] hover:bg-[#1B3C34]/5 transition-colors duration-200 items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick Add
              </button>
            ) : (
              <div className="px-4 pt-3 pb-4" onClick={(e) => e.stopPropagation()}>
                {added ? (
                  <p className="text-center font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34] py-3">
                    Size {added} Added
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#1B3C34]/50">
                        Select Size
                      </p>
                      <button
                        onClick={handleCancel}
                        className="font-inter text-[9px] tracking-[0.2em] uppercase text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => handlePickSize(e, size)}
                          className="flex-1 min-w-[36px] h-9 border border-[#1B3C34]/15 font-inter text-[10px] tracking-wider text-[#1B3C34] hover:bg-[#1B3C34] hover:text-[#FAF5E8] transition-colors duration-200"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seamless Progress Line (Moved below image) */}
      {images.length > 1 && (
        <div className="flex gap-0.5 pt-1.5 px-0">
          {images.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-[2px] rounded-full transition-colors duration-300 ${
                i === imgIndex ? 'bg-[#1B3C34]/70' : 'bg-[#1B3C34]/15'
              }`}
            />
          ))}
        </div>
      )}

      {/* Info Layout */}
      <div className="pt-3 pb-5 px-0 flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
        <div className="flex flex-col flex-1">
          <h3 className="font-inter font-medium text-[11px] md:text-[12px] tracking-[0.08em] uppercase text-[#1B3C34] leading-snug">
            {product.name}
          </h3>
          <p className="font-inter text-[9px] text-[#1B3C34]/40 mt-1 tracking-wide hidden md:block uppercase">
            {product.category}
          </p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end flex-shrink-0">
          <p className="font-cormorant text-[16px] md:text-[18px] font-medium text-[#1B3C34] leading-none">
            {product.price}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

// ── Sticky Filter Bar ────────────────────────────────────────────────────────
function FilterBar({
  active,
  onChange,
  variant,
  layoutId,
}: {
  active: Category
  onChange: (c: Category) => void
  variant: ShopVariant
  layoutId: string
}) {
  const showNavbar = useNavbarVisibility()

  const stickyClass =
    variant === 'page'
      ? `sticky z-30 bg-[#0A1C17]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${showNavbar ? 'top-14 md:top-16' : 'top-0'}`
      : ''

  return (
    <div className={`${stickyClass}`}>
      <div
        className={`max-w-[1400px] mx-auto ${variant === 'page' ? 'px-4 md:px-8' : 'px-4 md:px-8'}`}
      >
        {/* Scrollable wrapper with right-edge fade */}
        <div className="relative">
          <div className="flex w-max max-w-full mx-auto gap-x-6 md:gap-x-8 py-3.5 overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}>
            {categories.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  onClick={() => onChange(cat)}
                  className={`relative flex-shrink-0 font-inter text-[10px] md:text-[10.5px] tracking-[0.28em] uppercase pb-2 transition-colors duration-200 ${
                    variant === 'page'
                      ? (isActive ? 'text-white' : 'text-white/50 hover:text-white/80')
                      : (isActive ? 'text-[#1B3C34]' : 'text-[#1B3C34]/40 hover:text-[#1B3C34]/70')
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId={layoutId}
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${variant === 'page' ? 'bg-white' : 'bg-[#1B3C34]'}`}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          {/* Right fade mask */}
          <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 ${
            variant === 'page' ? 'bg-gradient-to-l from-[#0A1C17] to-transparent' : 'bg-gradient-to-l from-[#FAF5E8] to-transparent'
          } md:hidden`} />
        </div>
      </div>
    </div>
  )
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function Shop({ variant = 'section' }: { variant?: ShopVariant }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [active, setActive]      = useState<Category>('All')
  const navigate = useNavigate()
  const filterLayoutId = useId()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (variant === 'page') return // header lives outside this component
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 78%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [variant])

  const filtered = active === 'All' ? MAIN_PRODUCTS : MAIN_PRODUCTS.filter((p) => p.category === active)

  /* const DETAIL_THEME = {
    bg: '#FAF5E8',
    text: '#1B3C34',
    accent: '#1B3C34',
    border: 'rgba(27,60,52,0.1)',
    subtleText: 'rgba(27,60,52,0.6)',
    font: 'light' as const,
    hideShadow: true,
  } */

  return (
    <>
      <section
        ref={sectionRef}
        id="shop"
        className={`relative ${variant === 'section' ? 'bg-[#FAF5E8] py-12 md:py-24' : 'pb-16 md:pb-24'}`}
      >
        {/* Section heading — only shown when used as a landing-page section */}
        {variant === 'section' && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div ref={headingRef} className="mb-6 md:mb-10">
              <p className="font-inter text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#1B3C34]/50 mb-3">
                Shop The Collection
              </p>
              <div className="flex items-end justify-between gap-4 border-b border-[#1B3C34]/10 pb-5">
                <h2 className="font-cormorant font-light text-[2.2rem] md:text-5xl tracking-tight text-[#1B3C34] uppercase">
                  New Season
                </h2>
                <p className="font-inter text-[10px] text-[#1B3C34]/40 tracking-wide pb-1 hidden sm:block">
                  {MAIN_PRODUCTS.length} pieces
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <FilterBar
          active={active}
          onChange={setActive}
          variant={variant}
          layoutId={filterLayoutId}
        />

        {/* Product grid */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-10">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 text-center"
              >
                <p className="font-cormorant text-2xl text-[#1B3C34]/40 italic mb-2">
                  No pieces found in this category yet.
                </p>
                <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34]/25">
                  Check back soon
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={active}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onClick={(p) => navigate(`/product/${p.slug}`)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
