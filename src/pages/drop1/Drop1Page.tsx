import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DropConfig } from '../../config/dropsConfig'
import Drop1Navbar from './Drop1Navbar'
import Drop1Hero from './Drop1Hero'
import Drop1CollectionPreview from './Drop1CollectionPreview'
import Drop1Story from './Drop1Story'
import Drop1ProductGrid from './Drop1ProductGrid'
import Drop1Footer from './Drop1Footer'

// Section progress indicator — fixed right edge
function SectionProgress({
  labels,
  activeIndex,
}: {
  labels: string[]
  activeIndex: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0 pointer-events-none"
    >
      {labels.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-2">
            <span
              className={`font-inter text-[8px] tracking-[0.3em] transition-colors duration-300 ${
                i === activeIndex ? 'text-[#E8DDCA]' : 'text-white/20'
              }`}
            >
              0{i + 1}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className="w-px h-8 my-1 bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-[#E8DDCA]/40"
                animate={{ height: i < activeIndex ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  )
}

interface Drop1PageProps {
  drop: DropConfig
}

export default function Drop1Page({ drop }: Drop1PageProps) {
  const prefersReducedMotion = useReducedMotion()

  const heroRef = useRef<HTMLElement>(null)
  const collectionRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const productRef = useRef<HTMLElement>(null)

  const sectionRefs = [heroRef, collectionRef, storyRef, productRef]
  const sectionLabels = ['Hero', 'Collection', 'Story', 'Products']

  const [activeSection, setActiveSection] = React.useState(0)
  const [activeCategory, setActiveCategory] = React.useState('All')

  const scrollToProducts = (category: string) => {
    setActiveCategory(category)
    if (productRef.current) {
      // Small delay to allow state update before scrolling, or just scroll immediately
      productRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Track which section is in view
  React.useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionRefs.forEach((ref, i) => {
      if (!ref.current) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(i) },
        { threshold: 0.4 }
      )
      obs.observe(ref.current)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div
      className="relative min-h-screen text-white selection:bg-white/20 selection:text-white font-inter"
      style={{ backgroundColor: drop.themeColor }}
    >
      <Drop1Navbar />

      <SectionProgress labels={sectionLabels} activeIndex={activeSection} />

      {/* Sections */}
      <Drop1Hero drop={drop} sectionRef={heroRef} />
      <Drop1CollectionPreview 
        sectionRef={collectionRef} 
        onCategoryClick={scrollToProducts}
      />
      <Drop1Story sectionRef={storyRef} />
      <Drop1ProductGrid 
        sectionRef={productRef} 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <Drop1Footer drop={drop} />
    </div>
  )
}
