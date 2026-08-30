import { useEffect, useRef, useState, useId } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductModal, { type ProductDetail } from '../components/ProductModal'
import ProductDetailComponent from '../components/ProductDetail'
import { useNavbarVisibility } from '../hooks'

gsap.registerPlugin(ScrollTrigger)

type Category = 'All' | "Men's T-Shirts" | "Women's T-Shirts" | 'Hoodies' | 'Sweatshirts'
type ShopVariant = 'section' | 'page'

const SIZES_TEE    = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_HOODIE = ['S', 'M', 'L', 'XL', 'XXL']

const products: ProductDetail[] = [
  {
    id: 1,
    name: 'Snazzy Tee — T1',
    tagline: 'Premium embroidered cotton tee',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/nobg/t1-front-nobg.png',
    hoverImage: '/images/nobg/t1-back-nobg.png',
    badge: 'Bestseller',
    description:
      'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest. Designed for those who believe clothing should say something. Structured fit that holds its shape wash after wash.',
    sizes: SIZES_TEE,
    material: '100% combed ring-spun cotton, 220gsm. Ribbed crew neck. Pre-shrunk fabric.',
    care: 'Machine wash cold (30°C), inside out. Do not tumble dry. Iron on reverse. Do not bleach.',
  },
  {
    id: 2,
    name: 'Snazzy Tee — T2',
    tagline: 'Signature streetwear drop',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/nobg/t2-front-nobg.png',
    hoverImage: '/images/nobg/t2-back-nobg.png',
    badge: 'New',
    description:
      'From the latest streetwear drop — bold embroidered branding on a relaxed-fit silhouette. The dropped shoulder and boxy cut make this an instant wardrobe anchor for any season.',
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Boxy oversized fit. Reinforced seams.',
    care: 'Machine wash cold. Turn inside out before washing. Hang to dry. Do not iron directly on embroidery.',
  },
  {
    id: 3,
    name: 'Snazzy Tee — T3',
    tagline: 'Bold graphic on 220gsm cotton',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/nobg/t3-front-nobg.png',
    hoverImage: '/images/nobg/t3-back-nobg.png',
    badge: 'Popular',
    description:
      'Statement embroidery meets everyday comfort. The T3 features a bold graphic design rendered in high-density thread on 220gsm cotton. A piece that gets better with every wear.',
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Regular fit. Double-stitched hems for durability.',
    care: 'Cold machine wash. Turn inside out. Hang dry. Iron on low heat avoiding embroidered areas.',
  },
  {
    id: 4,
    name: 'Snazzy Tee — T4',
    tagline: 'Limited season drop',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/nobg/t4-front-nobg.png',
    hoverImage: '/images/nobg/t4-back-nobg.png',
    badge: 'Limited',
    description:
      "Part of our limited seasonal run — once it's gone, it's gone. The T4 features exclusive embroidery artwork produced in a single run of 100 units. No restocks, no second chances.",
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Slim regular fit. Pre-washed for minimal shrinkage.',
    care: 'Hand wash or gentle cycle cold. Lay flat to dry. Do not wring or bleach.',
  },
  {
    id: 5,
    name: 'Snazzy Tee — T5',
    tagline: 'Heavyweight oversized fit',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/t5-front.png',
    hoverImage: '/images/t5-back.png',
    badge: 'Bold',
    description:
      'Our heaviest tee — 260gsm fabric with a structured boxy silhouette. The oversized cut is intentional, not accidental. Embroidery on chest and sleeve for full coverage brand expression.',
    sizes: SIZES_TEE,
    material: '100% combed cotton, 260gsm. Oversized boxy fit. Extended back hem. Thick ribbed collar.',
    care: 'Machine wash 30°C. Turn inside out. Do not tumble dry. Steam press if needed — avoid embroidery.',
  },
  {
    id: 6,
    name: "Women's Tee — G1",
    tagline: 'Relaxed fit, premium cotton',
    category: "Women's T-Shirts",
    price: '₹1,399',
    priceNum: 1399,
    image: '/images/nobg/grl-t1-front-nobg.png',
    hoverImage: '/images/nobg/grl-t1-back-nobg.png',
    badge: 'New',
    description:
      'Designed for her. A relaxed-fit tee in our softest cotton fabric, with delicate embroidery that elevates without overpowering. The silhouette is slightly cropped with a curved hem.',
    sizes: SIZES_TEE,
    material: '100% combed cotton, 180gsm. Relaxed cropped fit. Curved hem. Soft-touch finish.',
    care: 'Machine wash cold, gentle cycle. Reshape while damp. Do not tumble dry. Cool iron on reverse.',
  },
  {
    id: 7,
    name: "Women's Tee — G2",
    tagline: 'Soft drop-shoulder silhouette',
    category: "Women's T-Shirts",
    price: '₹1,399',
    priceNum: 1399,
    image: '/images/nobg/grl-t2-front-nobg.png',
    hoverImage: '/images/nobg/grl-t2-back-nobg.png',
    badge: 'Popular',
    description:
      'A wardrobe essential reimagined. The dropped shoulder gives an effortless off-duty feel while the embroidered detail keeps it distinctly Snazzy. Pairs with everything.',
    sizes: SIZES_TEE,
    material: '100% combed cotton, 180gsm. Drop-shoulder construction. Slightly oversized.',
    care: 'Machine wash cold. Hang to dry. Iron on low on the back. Do not bleach.',
  },
  {
    id: 8,
    name: 'Snazzy Hoodie',
    tagline: 'Fleece-lined premium embroidered hoodie',
    category: 'Hoodies',
    price: '₹2,499',
    priceNum: 2499,
    image: '/images/nobg/hoodie-front-nobg.png',
    hoverImage: '/images/nobg/hoodie-back-nobg.png',
    badge: 'Bestseller',
    description:
      'The hoodie that redefines casual. 380gsm fleece-lined fabric with precision chest embroidery, an adjustable drawstring hood, and a kangaroo pocket finished with a woven brand label inside.',
    sizes: SIZES_HOODIE,
    material: '80% cotton, 20% polyester, 380gsm. Fleece-lined interior. Ribbed cuffs and hem. Metal eyelets.',
    care: 'Machine wash 30°C. Turn inside out. Do not tumble dry on high heat. Steam iron if needed.',
  },
  {
    id: 9,
    name: 'Snazzy Sweatshirt',
    tagline: '320gsm French terry, embroidered chest',
    category: 'Sweatshirts',
    price: '₹1,999',
    priceNum: 1999,
    image: '/images/nobg/sweatshirt-front-nobg.png',
    hoverImage: '/images/nobg/sweatshirt-back-nobg.png',
    badge: 'Artisan',
    description:
      'French terry construction meets artisan embroidery. The crewneck silhouette is clean and versatile — dress it up or down. The 320gsm weight means it keeps its shape without feeling heavy.',
    sizes: SIZES_HOODIE,
    material: '80% cotton, 20% polyester, 320gsm. French terry loopback. Ribbed crew neck, cuffs and waistband.',
    care: 'Machine wash cold, inside out. Reshape while damp. Do not bleach. Cool tumble dry or hang dry.',
  },
]

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
  onOpen,
}: {
  product: ProductDetail
  index: number
  onOpen: (p: ProductDetail) => void
}) {
  const { addItem } = useCart()
  const [picking, setPicking] = useState(false)
  const [added, setAdded]     = useState<string | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const images = [product.image, ...(product.hoverImage ? [product.hoverImage] : [])]

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
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col cursor-pointer"
      onClick={() => !picking && onOpen(product)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EAD9]">
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
              <motion.img
                key={i}
                src={img}
                alt={`${product.name} — view ${i + 1}`}
                className="w-full h-full flex-shrink-0 object-cover pointer-events-none"
                whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Carousel dots */}
        {images.length > 1 && (
          <div className={`absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none transition-all duration-400 ease-out ${picking ? 'opacity-0' : 'md:group-hover:-translate-y-14'}`}>
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === imgIndex ? 'bg-[#1B3C34]' : 'bg-[#1B3C34]/25'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist — desktop only */}
        <button
          className="hidden md:flex absolute top-3 right-3 p-1.5 text-[#1B3C34]/30 hover:text-[#1B3C34] transition-colors z-10"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="hidden md:block absolute top-3 left-3 font-inter text-[9px] tracking-[0.3em] uppercase text-[#1B3C34]/55 bg-[#FAF5E8]/80 backdrop-blur-sm px-2 py-1">
            {product.badge}
          </span>
        )}

        {/* Quick Add overlay — desktop hover, separated from swipe area */}
        <div
          className={`hidden md:block absolute inset-x-0 bottom-0 transition-transform duration-400 ease-out ${
            picking ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
          }`}
        >
          {!picking ? (
            <button
              onClick={handleQuickAdd}
              className="w-full py-3.5 bg-[#FAF5E8]/96 backdrop-blur-sm font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34] hover:bg-[#1B3C34] hover:text-[#FAF5E8] transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          ) : (
            <div className="bg-[#FAF5E8]/97 backdrop-blur-sm px-3 pt-2.5 pb-3" onClick={(e) => e.stopPropagation()}>
              {added ? (
                <p className="text-center font-inter text-[10px] tracking-[0.35em] uppercase text-[#1B3C34] py-2">
                  Size {added} added ✓
                </p>
              ) : (
                <>
                  <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#1B3C34]/40 text-center mb-2">
                    Select Size
                  </p>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => handlePickSize(e, size)}
                        className="w-9 h-9 border border-[#1B3C34]/20 font-inter text-[11px] text-[#1B3C34] hover:bg-[#1B3C34] hover:text-[#FAF5E8] hover:border-[#1B3C34] transition-colors duration-150"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-full mt-2 font-inter text-[9px] tracking-[0.3em] uppercase text-[#1B3C34]/30 hover:text-[#1B3C34]/60 transition-colors py-1"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-4 px-0">
        <h3 className="font-inter text-[11px] md:text-[12px] tracking-[0.08em] uppercase text-[#1B3C34] leading-snug mb-0.5">
          {product.name}
        </h3>
        <p className="font-cormorant text-[16px] md:text-[18px] text-[#1B3C34] leading-none">
          {product.price}
        </p>
        <p className="font-inter text-[9px] text-[#1B3C34]/35 mt-1 tracking-wide hidden md:block">
          View details →
        </p>
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
          <div className="flex gap-x-6 md:gap-x-8 py-3.5 overflow-x-auto scrollbar-hide"
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
  const [modalProduct, setModal] = useState<ProductDetail | null>(null)
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

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  const DETAIL_THEME = {
    bg: '#FAF5E8',
    text: '#1B3C34',
    accent: '#1B3C34',
    border: 'rgba(27,60,52,0.1)',
    subtleText: 'rgba(27,60,52,0.6)',
    font: 'light' as const,
    hideShadow: true,
  }

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
                  {products.length} pieces
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
                    onOpen={setModal}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Product Detail Modal */}
      {modalProduct && (
        <ProductDetailComponent
          product={{
            id: modalProduct.id,
            name: modalProduct.name,
            category: modalProduct.category,
            description: modalProduct.description,
            bullets: [
              `Material: ${modalProduct.material}`,
              `Care: ${modalProduct.care}`,
            ],
            images: [modalProduct.image, ...(modalProduct.hoverImage ? [modalProduct.hoverImage] : [])],
            price: modalProduct.price,
            sizes: modalProduct.sizes,
            badge: modalProduct.badge,
          }}
          theme={DETAIL_THEME}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
