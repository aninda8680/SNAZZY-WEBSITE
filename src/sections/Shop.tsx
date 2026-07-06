import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductModal, { type ProductDetail } from '../components/ProductModal'

gsap.registerPlugin(ScrollTrigger)

type Category = 'All' | "Men's T-Shirts" | "Women's T-Shirts" | 'Hoodies' | 'Sweatshirts'

const SIZES_TEE     = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_HOODIE  = ['S', 'M', 'L', 'XL', 'XXL']

const products: ProductDetail[] = [
  {
    id: 1,
    name: 'Snazzy Tee — T1',
    tagline: 'Premium embroidered cotton tee',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    image: '/images/t1-front.png',
    hoverImage: '/images/t1-back.png',
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
    image: '/images/t2-front.png',
    hoverImage: '/images/t2-back.png',
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
    image: '/images/t3-front.png',
    hoverImage: '/images/t3-back.png',
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
    image: '/images/t4-front.png',
    hoverImage: '/images/t4-back.png',
    badge: 'Limited',
    description:
      'Part of our limited seasonal run — once it\'s gone, it\'s gone. The T4 features exclusive embroidery artwork produced in a single run of 100 units. No restocks, no second chances.',
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
    image: '/images/grl-t1-front.png',
    hoverImage: '/images/grl-t1-back.png',
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
    image: '/images/grl-t2-front.png',
    hoverImage: '/images/grl-t2-back.png',
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
    image: '/images/hoodie-front.png',
    hoverImage: '/images/hoodie-back.png',
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
    image: '/images/sweatshirt-front.png',
    hoverImage: '/images/sweatshirt-back.png',
    badge: 'Artisan',
    description:
      'French terry construction meets artisan embroidery. The crewneck silhouette is clean and versatile — dress it up or down. The 320gsm weight means it keeps its shape without feeling heavy.',
    sizes: SIZES_HOODIE,
    material: '80% cotton, 20% polyester, 320gsm. French terry loopback. Ribbed crew neck, cuffs and waistband.',
    care: 'Machine wash cold, inside out. Reshape while damp. Do not bleach. Cool tumble dry or hang dry.',
  },
]

const categories: Category[] = ['All', "Men's T-Shirts", "Women's T-Shirts", 'Hoodies', 'Sweatshirts']

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

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      accent: '#1B3C34',
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col cursor-pointer bg-[#FAF5E8] md:bg-transparent"
      onClick={() => onOpen(product)}
    >
      {/* Image area — full-bleed, no side gaps */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF5E8]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        )}

        {/* Wishlist — desktop only */}
        <button
          className="hidden md:flex absolute top-3 right-3 p-1.5 text-[#1B3C34]/40 hover:text-[#1B3C34] transition-colors z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Badge — desktop only (no clutter on mobile) */}
        {product.badge && (
          <span className="hidden md:block absolute top-3 left-3 font-inter text-[9px] tracking-[0.25em] uppercase text-[#1B3C34]/60">
            {product.badge}
          </span>
        )}

        {/* Quick Add — desktop hover only */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-white/95 backdrop-blur-sm font-inter text-[11px] tracking-[0.3em] uppercase text-[#1B3C34] font-medium hover:bg-[#1B3C34] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-3 px-3 md:px-0">
        <div className="flex items-start justify-between gap-2">
          {/* Bodoni Moda serif name on mobile — editorial Zara look */}
          <h3 className="font-bodoni md:font-inter text-[13px] md:text-[13px] font-normal text-[#1B3C34] leading-snug tracking-[0.04em] uppercase">
            {product.name}
          </h3>
          <p className="font-inter text-[11px] md:text-[13px] text-[#1B3C34]/70 md:text-[#1B3C34] flex-shrink-0">
            {product.price}
          </p>
        </div>
        <p className="font-inter text-[10px] text-[#1B3C34]/40 mt-1 tracking-wide hidden md:block">
          View details →
        </p>
      </div>

    </motion.article>
  )
}

export default function Shop() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLDivElement>(null)
  const [active, setActive]       = useState<Category>('All')
  const [modalProduct, setModal]  = useState<ProductDetail | null>(null)

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
    <>
      <section ref={sectionRef} id="shop" className="relative bg-[#FAF5E8] py-12 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">

          {/* Heading */}
          <div ref={headingRef} className="mb-6 md:mb-10">
            <p className="font-inter text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#555] md:text-[#1B3C34]/50 mb-3">
              Shop The Collection
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#111]/10 md:border-[#1B3C34]/10 pb-6">
              <h2 className="font-bodoni md:font-inter font-light text-[1.6rem] md:text-4xl tracking-tight text-[#1B3C34] uppercase">
                New Season
              </h2>
              <p className="font-inter text-xs text-[#555] md:text-[#1B3C34]/40 tracking-wide">
                {products.length} pieces
              </p>
            </div>
          </div>

          {/* Filter tabs — horizontal scroll row on mobile, wrapping row on desktop */}
          <div className="flex md:flex-wrap gap-5 md:gap-6 mb-8 md:mb-10 border-b border-[#111]/10 md:border-[#1B3C34]/10 pb-3 md:pb-4 overflow-x-auto md:overflow-visible scrollbar-none">
            {categories.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`font-inter text-[11px] tracking-[0.3em] md:tracking-[0.25em] uppercase whitespace-nowrap flex-shrink-0 py-3 md:py-0 md:pb-1 transition-all duration-200 ${
                    isActive
                      ? 'text-[#111] border-b-2 border-[#111] md:text-[#1B3C34] md:border-b-[1.5px] md:border-[#1B3C34]'
                      : 'text-[#555] md:text-[#1B3C34]/40 hover:text-[#1B3C34]/70'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Product grid — hairline gap on mobile (Zara style), spaced on desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1B3C34]/10 -mx-4 md:mx-0 md:bg-transparent md:gap-x-4 md:gap-y-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
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
          </AnimatePresence>

        </div>
      </section>

      {/* Product detail modal */}
      <ProductModal product={modalProduct} onClose={() => setModal(null)} />
    </>
  )
}
