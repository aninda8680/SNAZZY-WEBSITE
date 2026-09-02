import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DROP1_PRODUCTS, type ProductData } from '../../data/products'



const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Sweatshirts', 'Accessories']

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  onClick,
}: {
  product: ProductData
  index: number
  onClick: (p: ProductData) => void
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
      onClick={() => onClick(product)}
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
          onClick={(e) => { e.stopPropagation(); onClick(product) }}
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
  const navigate = useNavigate()

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
                    onClick={(p) => navigate(`/product/${p.slug}`)}
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


    </>
  )
}
