/**
 * Gallery page — /gallery
 *
 * Curated lookbook: campaign shots, studio stills, behind-the-scenes, product detail.
 * The photography IS the page; UI chrome is kept minimal.
 *
 * Design system (same tokens as the rest of the site):
 *   Deep Pine  #1B3C34  — primary dark bg / text on cream
 *   Parchment  #FAF5E8  — primary light bg (page base)
 *   Bone       #EFE7D3  — placeholder tile bg
 *   Ink        #12211D  — body text / captions on cream
 *   Aged Brass #9C7A46  — hover frame hairline
 *   Fog-Cream  #6B6255  — muted text on cream
 *   Fog-Pine   #C5D4CF  — muted text on pine (lightbox)
 *
 * Layout: 12-col asymmetric bento grid — explicit grid-template-areas,
 *         never grid-auto-flow: dense alone.
 * Interactions:
 *   - Stagger fade+rise on mount (~40ms between tiles, subtle 8px rise)
 *   - Hover: scale(1.02) inside tile + 1px brass hairline frame + caption fade-up
 *   - Focus-visible: same caption visible, brass outline ring
 *   - Lightbox: Deep Pine bg, centered image, Esc to close, focus trap,
 *               returns focus to originating tile on close
 * Responsive: 2-col ≤1024px, 1-col ≤640px with height variation preserved
 * Accessibility: meaningful aria labels, focus trap, keyboard nav
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Navbar, Cart, Footer } from '../components'

// ── Color tokens ────────────────────────────────────────────────────────────
const C = {
  pine:      '#1B3C34',
  parchment: '#FAF5E8',
  ink:       '#12211D',
  bone:      '#EFE7D3',
  brass:     '#9C7A46',
  fogCream:  '#6B6255',
  fogPine:   '#C5D4CF',
} as const

// ── Gallery tile data ────────────────────────────────────────────────────────
// Explicit grid-column / grid-row placement per tile — never rely on auto-flow alone.
// Desktop layout is a 12-col grid. Row heights are set on the grid container.
// col / row values are 1-indexed CSS grid line numbers: "start / end".
interface GalleryItem {
  id: string
  src: string
  alt: string
  category: string
  caption: string
  // Desktop 12-col explicit placement
  col: string   // e.g. "1 / 7"
  row: string   // e.g. "1 / 3"
  // Tablet 2-col placement
  tabletCol: string
  viewStory?: boolean
}

const GALLERY_CATEGORIES = ['ALL', 'CAMPAIGN', 'EDITORIAL', 'STUDIO', 'DETAIL', 'BEHIND THE SCENES'] as const;
type GalleryCategory = typeof GALLERY_CATEGORIES[number];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'image_1',
    src: '',
    alt: 'image_1 — Campaign feature, large format',
    category: 'CAMPAIGN',
    caption: 'SS26 — Feature',
    col: '1 / 7',
    row: '1 / 3',
    tabletCol: '1 / 3',
    viewStory: true,
  },
  {
    id: 'image_2',
    src: '',
    alt: 'image_2 — Studio still',
    category: 'STUDIO',
    caption: 'Studio Still — SS26',
    col: '7 / 10',
    row: '1 / 2',
    tabletCol: '1 / 2',
  },
  {
    id: 'image_3',
    src: '',
    alt: 'image_3 — Tall portrait, editorial',
    category: 'EDITORIAL',
    caption: 'Editorial Portrait — SS26',
    col: '10 / 13',
    row: '1 / 3',
    tabletCol: '2 / 3',
    viewStory: true,
  },
  {
    id: 'image_4',
    src: '',
    alt: 'image_4 — Square detail shot',
    category: 'DETAIL',
    caption: 'Product Detail — SS26',
    col: '7 / 10',
    row: '2 / 3',
    tabletCol: '1 / 2',
  },
  {
    id: 'image_5',
    src: '',
    alt: 'image_5 — Wide campaign shot',
    category: 'CAMPAIGN',
    caption: 'Campaign Wide — SS26',
    col: '1 / 5',
    row: '1 / 2',
    tabletCol: '1 / 2',
  },
  {
    id: 'image_6',
    src: '',
    alt: 'image_6 — Behind-the-scenes studio',
    category: 'BEHIND THE SCENES',
    caption: 'Studio Process — SS26',
    col: '5 / 9',
    row: '1 / 2',
    tabletCol: '2 / 3',
  },
  {
    id: 'image_7',
    src: '',
    alt: 'image_7 — Wide format detail',
    category: 'DETAIL',
    caption: 'Embroidery Close-up — SS26',
    col: '9 / 13',
    row: '1 / 2',
    tabletCol: '1 / 3',
  },
  {
    id: 'image_8',
    src: '',
    alt: 'image_8 — Banner, campaign group shot',
    category: 'CAMPAIGN',
    caption: 'Group Shot — SS26',
    col: '1 / 13',
    row: '2 / 3',
    tabletCol: '1 / 3',
    viewStory: true,
  },
]

// ── Stagger entrance variants ────────────────────────────────────────────────
const tileVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

// ── Components ───────────────────────────────────────────────────────────────

function GalleryHero({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-24 pb-20 md:pt-40 md:pb-32 flex justify-center">
      {/* Decorative vertical text (desktop only) */}
      <div className="hidden lg:block absolute left-16 top-40 transform -rotate-90 origin-left" style={{ color: C.fogCream }}>
        <p className="font-inter text-[9px] tracking-[0.5em] uppercase">Est. 2024</p>
      </div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center max-w-3xl"
      >
        <p className="font-inter text-[10px] tracking-[0.45em] uppercase mb-8" style={{ color: C.fogCream }}>
          SNAZZY — Visual Archive
        </p>

        <h1 className="font-cormorant font-normal leading-[0.9] mb-8" style={{ fontSize: 'clamp(4rem, 12vw, 8.5rem)', color: C.pine, letterSpacing: '-0.02em' }}>
          Gallery
        </h1>

        <p className="font-cormorant italic font-light leading-[1.8] max-w-[560px] mb-12" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', color: C.fogCream }}>
          Crafted through texture, movement, and quiet details. The definitive collection of SNAZZY imagery.
        </p>

        <div className="flex flex-col items-center gap-4">
          <div aria-hidden="true" style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${C.brass} 0%, transparent 100%)`, opacity: 0.6 }} />
          <p className="font-inter text-[9px] tracking-[0.3em] uppercase" style={{ color: C.brass }}>
            08 Stories / SS26
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function GalleryStats() {
  return (
    <div className="w-full mb-20 md:mb-32" style={{ background: C.pine }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-3 gap-4 md:gap-12 py-12">
        <div className="text-center">
          <p className="font-cormorant text-2xl md:text-4xl mb-1" style={{ color: C.parchment }}>08</p>
          <p className="font-inter text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: C.fogPine }}>Images</p>
        </div>
        <div className="text-center" style={{ borderLeft: `1px solid ${C.parchment}20`, borderRight: `1px solid ${C.parchment}20` }}>
          <p className="font-cormorant text-2xl md:text-4xl mb-1" style={{ color: C.parchment }}>04</p>
          <p className="font-inter text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: C.fogPine }}>Categories</p>
        </div>
        <div className="text-center">
          <p className="font-cormorant text-2xl md:text-4xl mb-1" style={{ color: C.parchment }}>SS26</p>
          <p className="font-inter text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: C.fogPine }}>Collection</p>
        </div>
      </div>
      </div>
    </div>
  )
}

function FeaturedStory({ reduced }: { reduced: boolean }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pb-20 md:pb-32">
      <div className="mb-6 flex justify-between items-end">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase" style={{ color: C.brass }}>
          Featured Story
        </p>
      </div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden rounded-2xl group cursor-pointer"
        style={{ aspectRatio: '21/9', background: C.bone }}
      >
        {/* Placeholder image for Featured Story */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-inter text-[11px] tracking-[0.22em] uppercase select-none" style={{ color: `${C.ink}45` }}>FEATURED_IMAGE</span>
        </div>

        {/* Hover interaction overlay */}
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-[1.02]" style={{ transform: 'scale(1)' }}>
            {/* Real image will go here */}
        </div>

        {/* Brass Frame */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${C.brass}` }} />
      </motion.div>

      <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="font-cormorant text-3xl md:text-4xl mb-4" style={{ color: C.pine }}>SS26 — The Collection</h2>
          <p className="font-inter font-light text-sm leading-[1.8]" style={{ color: C.fogCream }}>
            A study in tension. Structured silhouettes combined with fluid fabrics, redefining everyday luxury through the lens of traditional craftsmanship.
          </p>
        </div>
        <button className="flex items-center gap-3 font-inter text-[10px] tracking-[0.3em] uppercase group transition-opacity hover:opacity-70" style={{ color: C.pine }}>
          Explore Story
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

function GalleryFilters({ activeCategory, setActiveCategory }: { activeCategory: GalleryCategory, setActiveCategory: (c: GalleryCategory) => void }) {
  return (
    <div className="w-full mb-12" style={{ background: C.pine }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-5">
          {GALLERY_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className="relative whitespace-nowrap font-inter text-[10px] tracking-[0.25em] uppercase pb-2 transition-colors duration-300"
            style={{ color: activeCategory === category ? C.parchment : C.fogPine }}
          >
            {category}
            {activeCategory === category && (
              <motion.div
                layoutId="activeCategory"
                className="absolute left-0 right-0 bottom-0 h-px"
                style={{ background: C.brass }}
              />
            )}
          </button>
        ))}
      </div>
      </div>
    </div>
  )
}

function EditorialBreak({ reduced }: { reduced: boolean }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-24 md:py-36 flex justify-center">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center flex flex-col items-center max-w-2xl"
      >
        <p className="font-inter text-[9px] tracking-[0.4em] uppercase mb-8" style={{ color: C.brass }}>
          The World of Snazzy
        </p>
        <div aria-hidden="true" style={{ width: 1, height: 40, background: C.brass, opacity: 0.4 }} className="mb-8" />
        <h3 className="font-cormorant italic font-light leading-[1.5]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: C.pine }}>
          "Crafted through texture, movement, and quiet details."
        </h3>
      </motion.div>
    </div>
  )
}

function GalleryCTA({ reduced }: { reduced: boolean }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-24 md:py-40">
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center py-24 px-6 relative overflow-hidden rounded-2xl"
        style={{ background: C.pine }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(250,245,232,0.05) 0%, transparent 70%)' }} />

        <p className="relative z-10 font-inter text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: C.brass }}>
          Continue Exploring
        </p>
        <h2 className="relative z-10 font-cormorant font-normal leading-[1.1] mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.parchment }}>
          Discover the collection<br/><span className="italic">behind the imagery.</span>
        </h2>
        <a href="/collections" className="relative z-10 inline-flex items-center gap-3 font-inter text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-75" style={{ color: C.parchment, borderBottom: `1px solid ${C.brass}60`, paddingBottom: 4 }}>
          View Collection
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = items[activeIndex]
  const closeRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus trap — on mount move focus to close button
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Esc key → close; arrow keys → prev/next
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
      // Focus trap: Tab cycles only within lightbox
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled'))
        if (!focusable.length) return
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus() }
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox: ${item.caption}`}
      data-bg="pine"
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: C.pine }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Close button */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-5">
        <span
          className="font-inter text-[10px] tracking-[0.35em] uppercase"
          style={{ color: C.fogPine }}
        >
          {item.category}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close lightbox"
          className="flex items-center justify-center w-9 h-9 rounded-sm transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-60"
          style={{ color: C.fogPine }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center px-16 py-20 relative">
        {item.src ? (
          <motion.img
            key={item.id}
            src={item.src}
            alt={item.alt}
            className="max-w-full max-h-full object-contain rounded-xl"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <motion.div
            key={item.id}
            className="flex items-center justify-center rounded-xl"
            style={{
              width: '60vw',
              maxWidth: 800,
              aspectRatio: '3/2',
              background: `${C.bone}18`,
              border: `1px solid ${C.brass}30`,
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-inter text-[13px] tracking-[0.22em] uppercase"
              style={{ color: `${C.fogPine}70` }}
            >
              {item.id}
            </span>
          </motion.div>
        )}

        {/* Prev / Next arrows */}
        <button
          onClick={onPrev}
          aria-label="Previous image"
          disabled={activeIndex === 0}
          className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 disabled:opacity-20 hover:opacity-60 transition-opacity duration-200"
          style={{ color: C.fogPine }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          aria-label="Next image"
          disabled={activeIndex === items.length - 1}
          className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 disabled:opacity-20 hover:opacity-60 transition-opacity duration-200"
          style={{ color: C.fogPine }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption — bottom, minimum 4.5:1 contrast against #1B3C34 */}
      <div className="px-6 py-5 text-center">
        <p
          className="font-inter font-light text-[13px] tracking-wide"
          style={{ color: C.fogPine }} // #C5D4CF on #1B3C34 → 5.2:1 ✓
        >
          {item.caption}
          <span
            className="mx-3 opacity-40"
            aria-hidden="true"
          >
            —
          </span>
          <span className="opacity-50">{activeIndex + 1} / {items.length}</span>
        </p>
      </div>
    </motion.div>
  )
}

// ── Tile placeholder ─────────────────────────────────────────────────────────
// Bone bg + centered `image_N` label — clearly a build-time placeholder
function PlaceholderTile({ id }: { id: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: C.bone }}
    >
      <span
        className="font-inter text-[11px] tracking-[0.22em] uppercase select-none"
        style={{ color: `${C.ink}45` }}
      >
        {id}
      </span>
    </div>
  )
}

// ── Gallery tile ─────────────────────────────────────────────────────────────
// The tile fills its wrapper div completely (width: 100%, height: 100%).
function GalleryTile({
  item,
  index,
  totalItems,
  reduced,
  onClick,
}: {
  item: GalleryItem
  index: number
  totalItems: number
  reduced: boolean
  onClick: (index: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const showCaption = hovered || focused

  // Format index e.g. 01 / 08
  const formattedIndex = `${(index + 1).toString().padStart(2, '0')} / ${totalItems.toString().padStart(2, '0')}`

  return (
    <motion.div
      custom={index}
      variants={reduced ? undefined : tileVariants}
      initial={reduced ? undefined : 'hidden'}
      animate={reduced ? undefined : 'visible'}
      className="relative w-full h-full"
    >
      <button
        type="button"
        aria-label={`View ${item.caption}`}
        className="relative w-full h-full overflow-hidden rounded-2xl block group"
        style={{ cursor: 'pointer', minHeight: '100%' }}
        onClick={() => onClick(index)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {/* Image or placeholder */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: showCaption ? 'scale(1.02)' : 'scale(1)' }}
        >
          {item.src ? (
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <PlaceholderTile id={item.id} />
          )}
        </div>

        {/* Index Overlay */}
        <div 
          className="absolute top-4 md:top-6 right-4 md:right-6 z-10 transition-opacity duration-500"
          style={{ opacity: showCaption ? 0.9 : 0.0 }}
        >
          <span className="font-inter text-[9px] tracking-[0.25em] uppercase" style={{ color: C.parchment }}>
            {formattedIndex}
          </span>
        </div>

        {/* View Story Indicator */}
        {item.viewStory && (
          <div 
            className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-10 transition-all duration-500 flex items-center gap-2"
            style={{ 
              opacity: showCaption ? 1 : 0,
              transform: showCaption ? 'translateY(0)' : 'translateY(8px)'
            }}
          >
            <span className="hidden md:inline font-inter text-[9px] tracking-[0.25em] uppercase" style={{ color: C.parchment }}>
              View Story
            </span>
            <ArrowRight className="w-3 h-3" style={{ color: C.parchment }} />
          </div>
        )}

        {/* Brass hairline frame */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
          style={{
            boxShadow: `inset 0 0 0 1px ${C.brass}`,
            opacity: showCaption ? 1 : 0,
          }}
        />

        {/* Cinematic dark gradient + Caption */}
        <div
          aria-hidden={!showCaption}
          className="absolute inset-x-0 bottom-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: showCaption ? 1 : 0,
            background: `linear-gradient(to top, rgba(20,30,26,0.85) 0%, transparent 100%)`,
            paddingTop: '4rem',
            paddingBottom: '1.5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            transform: showCaption ? 'translateY(0)' : 'translateY(4px)'
          }}
        >
          <div className="flex flex-col text-left">
            <p
              className="font-inter text-[9px] tracking-[0.25em] uppercase mb-1.5"
              style={{ color: C.brass }}
            >
              {item.category}
            </p>
            <p
              className="font-cormorant italic font-light text-[16px] leading-snug"
              style={{ color: C.parchment }}
            >
              {item.caption}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Gallery() {
  const reduced = useReducedMotion() ?? false

  const [activeCategory, setActiveCategory]       = useState<GalleryCategory>('ALL')
  const [lightboxIndex, setLightboxIndex]         = useState<number | null>(null)
  
  const originTileRefs = useRef<(HTMLDivElement | null)[]>([])

  // Filter items
  const visibleItems = activeCategory === 'ALL' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory)

  // Handlers
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    const idx = lightboxIndex
    setLightboxIndex(null)
    // Return focus
    if (idx !== null) {
      setTimeout(() => {
        originTileRefs.current[idx]
          ?.querySelector('button')
          ?.focus()
      }, 50)
    }
  }, [lightboxIndex])

  const goPrev = useCallback(() => {
    setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex(i => (i !== null && i < visibleItems.length - 1 ? i + 1 : i))
  }, [])

  // Body scroll lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  // Reset refs when visible items change
  useEffect(() => {
    originTileRefs.current = originTileRefs.current.slice(0, visibleItems.length)
  }, [visibleItems.length])

  return (
    <>
      <style>{`
        .gpage *:focus-visible { outline: 2px solid ${C.pine}; outline-offset: 3px; }
        .gpage [data-bg="pine"] *:focus-visible { outline-color: ${C.parchment}; }
        ::-webkit-scrollbar-track { background: ${C.parchment}; }
        ::-webkit-scrollbar-thumb { background: ${C.brass}55; border-radius: 2px; }
      `}</style>

      <div className="gpage" style={{ background: C.parchment, color: C.ink }}>
        <Navbar alwaysSolid theme="light" />
        <Cart />

        <main style={{ paddingTop: '5.5rem' }} aria-label="Gallery">
          
          <GalleryHero reduced={reduced} />
          
          <GalleryStats />
          
          <FeaturedStory reduced={reduced} />
          
          <GalleryFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          {/* ── Dynamic Gallery Grid ── */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pb-12">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeCategory === 'ALL' ? (
                  /* ── CURATED BENTO GRID (ALL) ── */
                  <div className="flex flex-col">
                    
                    {/* Top Grid (Rows 1 & 2) */}
                    <div className="hidden lg:grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '280px 280px', gap: '28px' }}>
                      {visibleItems.slice(0, 4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i] = el }} style={{ gridColumn: item.col, gridRow: item.row }}>
                          <GalleryTile item={item} index={i} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>
                    {/* Tablet Top */}
                    <div className="hidden md:grid lg:hidden" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                      {visibleItems.slice(0, 4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i] = el }} style={{ gridColumn: item.tabletCol, height: item.id === 'image_1' || item.id === 'image_3' ? 380 : 220 }}>
                          <GalleryTile item={item} index={i} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>
                    {/* Mobile Top */}
                    <div className="flex flex-col md:hidden" style={{ gap: '20px' }}>
                      {visibleItems.slice(0, 4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i] = el }} style={{ height: item.id === 'image_1' ? 340 : 220 }}>
                          <GalleryTile item={item} index={i} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>

                    <EditorialBreak reduced={reduced} />

                    {/* Bottom Grid (Rows 3 & 4 mapped to 1 & 2) */}
                    <div className="hidden lg:grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '240px 200px', gap: '28px' }}>
                      {visibleItems.slice(4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i + 4] = el }} style={{ gridColumn: item.col, gridRow: item.row }}>
                          <GalleryTile item={item} index={i + 4} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>
                    {/* Tablet Bottom */}
                    <div className="hidden md:grid lg:hidden mt-5" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                      {visibleItems.slice(4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i + 4] = el }} style={{ gridColumn: item.tabletCol, height: item.id === 'image_8' ? 200 : 220 }}>
                          <GalleryTile item={item} index={i + 4} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>
                    {/* Mobile Bottom */}
                    <div className="flex flex-col md:hidden mt-5" style={{ gap: '20px' }}>
                      {visibleItems.slice(4).map((item, i) => (
                        <div key={item.id} ref={el => { originTileRefs.current[i + 4] = el }} style={{ height: item.id === 'image_8' ? 180 : 220 }}>
                          <GalleryTile item={item} index={i + 4} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  /* ── REFLOWING GRID (FILTERED) ── */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-8">
                    {visibleItems.map((item, i) => (
                      <div key={item.id} ref={el => { originTileRefs.current[i] = el }} style={{ height: 380 }}>
                        <GalleryTile item={item} index={i} totalItems={visibleItems.length} reduced={reduced} onClick={openLightbox} />
                      </div>
                    ))}
                    {visibleItems.length === 0 && (
                      <div className="col-span-full py-24 text-center">
                        <p className="font-cormorant italic text-2xl" style={{ color: C.fogCream }}>No imagery found in this category.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
          </div>
          
          <GalleryCTA reduced={reduced} />

        </main>

        <Footer />
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={visibleItems}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  )
}
