import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import ProductDetail, {
  type ProductDetailData,
  type ProductDetailTheme,
} from '../../components/ProductDetail'

// ─── Drop 1 Theme ─────────────────────────────────────────────────────────────

const DROP1_THEME: ProductDetailTheme = {
  bg: '#050505',
  text: '#E8DDCA',
  accent: '#E8DDCA',
  border: 'rgba(232,221,202,0.10)',
  subtleText: 'rgba(232,221,202,0.45)',
  font: 'dark',
}

// ─── Product Data ─────────────────────────────────────────────────────────────

const DROP1_PRODUCTS: ProductDetailData[] = [
  {
    id: 1,
    name: 'Snazzy Tee — T1',
    price: '₹1,499',
    category: 'T-Shirts',
    description:
      'Cut for those who move with intention. The T1 is the cornerstone of Wild Instincts — minimal on the surface, deliberate in every seam.',
    bullets: ['100% Organic Pima Cotton', 'Regular fit, slightly dropped shoulder', 'Machine wash cold, tumble dry low', 'Pre-shrunk, stonewash finish'],
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    badge: 'Bestseller',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'Snazzy Tee — T2',
    price: '₹1,499',
    category: 'T-Shirts',
    description:
      'A quiet statement. The T2 carries the same exacting construction as the T1, refined with a slightly longer hem and tighter rib collar.',
    bullets: ['100% Organic Pima Cotton', 'Slim regular fit, longer hem', 'Ribbed crew collar', 'Garment-dyed in small batches'],
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    badge: 'New',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 3,
    name: 'Snazzy Tee — T3',
    price: '₹1,499',
    category: 'T-Shirts',
    description:
      'The workhorse. The T3 is built for longevity — a heavier weight mid-gauge cotton that softens with every wash without losing its shape.',
    bullets: ['220 GSM mid-weight cotton', 'Boxy, relaxed fit', 'Reinforced side seams', 'Faded ink graphic — limited run'],
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    badge: 'Popular',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 4,
    name: 'Snazzy Hoodie — H1',
    price: '₹2,799',
    category: 'Hoodies',
    description:
      'The weight of purpose. The H1 hoodie is a study in considered construction — brushed inner fleece, an unlined kangaroo pocket, and a hood that actually fits right.',
    bullets: ['380 GSM brushed fleece interior', 'Oversized, structured silhouette', 'Ribbed cuffs and hem, non-stretch', 'Garment-washed for immediate softness'],
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 5,
    name: 'Snazzy Sweatshirt — S1',
    price: '₹2,299',
    category: 'Sweatshirts',
    description:
      'Between seasons, between moments. The S1 crewneck is the layer that grounds every outfit — an honest sweatshirt with no excess.',
    bullets: ['320 GSM loop-back cotton', 'Classic crewneck, boxy fit', 'Set-in sleeves, clean finish', 'Cold wash recommended to preserve drape'],
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 6,
    name: 'Snazzy Tee — T4',
    price: '₹1,499',
    category: 'T-Shirts',
    description:
      'The outlier in the T-series. The T4 features an extended back hem and a subtle tonal graphic across the chest — for when understated becomes a language.',
    bullets: ['180 GSM single jersey cotton', 'Relaxed fit, extended back hem', 'Tonal print — barely-there in daylight', 'Narrow rib collar'],
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
]

const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Sweatshirts', 'Accessories']

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: ProductDetailData
  index: number
  onSelect: (p: ProductDetailData) => void
}) {
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="group cursor-pointer"
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#111] mb-4">
        {/* Front image */}
        <motion.img
          src={product.images[0]}
          alt={product.name}
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
        />
        {/* Back / hover image */}
        {product.images[1] && (
          <motion.img
            src={product.images[1]}
            alt={`${product.name} — back`}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
          />
        )}
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 font-inter text-[8px] tracking-[0.3em] uppercase text-[#050505] bg-[#E8DDCA] px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {/* Quick view overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 left-0 right-0 bg-[#050505]/80 backdrop-blur-sm py-3 text-center"
        >
          <span className="font-inter text-[9px] tracking-[0.35em] text-[#E8DDCA] uppercase">
            Quick View
          </span>
        </motion.div>
      </div>

      {/* Product info */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-inter text-[12px] tracking-wide text-[#E8DDCA]/80 mb-1">{product.name}</p>
          <p className="font-inter text-[11px] text-[#E8DDCA]/40">{product.price}</p>
        </div>
        <button
          className="mt-0.5 text-[#E8DDCA]/20 hover:text-[#E8DDCA]/60 transition-colors"
          onClick={(e) => { e.stopPropagation(); onSelect(product) }}
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface Drop1ProductGridProps {
  sectionRef: React.RefObject<HTMLElement>
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export default function Drop1ProductGrid({
  sectionRef,
  activeCategory,
  setActiveCategory,
}: Drop1ProductGridProps) {
  const [selected, setSelected] = useState<ProductDetailData | null>(null)

  const filteredProducts = DROP1_PRODUCTS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  )

  return (
    <>
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        id="lookbook"
        className="relative w-full bg-[#080808] py-24 md:py-32 px-8 md:px-14 lg:px-20 min-h-screen"
      >
        <div className="max-w-[1400px] mx-auto">

          {/* Header + Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span className="font-inter text-[9px] tracking-[0.45em] text-[#E8DDCA]/30 uppercase block mb-3">
                Full Collection
              </span>
              <h2 className="font-cormorant font-bold text-4xl text-[#E8DDCA] uppercase">
                Shop Drop 1
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-6 border-b border-white/5 pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative font-inter text-[9px] tracking-[0.25em] uppercase pb-2 transition-colors duration-300 cursor-pointer ${
                    activeCategory === category ? 'text-[#E8DDCA]' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E8DDCA]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={activeCategory}
                className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onSelect={setSelected}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full py-24 flex flex-col items-center justify-center text-center"
              >
                <p className="font-inter text-sm text-[#E8DDCA]/40 tracking-wider mb-4">
                  No items in {activeCategory} yet
                </p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#E8DDCA]/60 hover:text-[#E8DDCA] transition-colors border-b border-[#E8DDCA]/20 hover:border-[#E8DDCA]/60 pb-1 cursor-pointer"
                >
                  View all items
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Universal Product Detail Overlay — rendered at root level so it escapes the section */}
      <AnimatePresence>
        {selected && (
          <ProductDetail
            product={selected}
            theme={DROP1_THEME}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
