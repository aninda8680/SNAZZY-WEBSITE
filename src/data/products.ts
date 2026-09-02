export interface ProductData {
  id: number | string
  slug: string
  name: string
  tagline?: string
  category: string
  description: string
  bullets: string[]
  images: string[]
  hoverImage?: string
  price: string
  priceNum: number
  sizes: string[]
  material?: string
  care?: string
  badge?: string
  themeType: 'main' | 'drop1'
}

const SIZES_TEE    = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_HOODIE = ['S', 'M', 'L', 'XL', 'XXL']

export const MAIN_PRODUCTS: ProductData[] = [
  {
    id: 1,
    slug: 'snazzy-tee-t1',
    name: 'Snazzy Tee — T1',
    tagline: 'Premium embroidered cotton tee',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    hoverImage: '/images/nobg/t1-back-nobg.png',
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    badge: 'Bestseller',
    description:
      'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest. Designed for those who believe clothing should say something. Structured fit that holds its shape wash after wash.',
    bullets: [
      'Material: 100% combed ring-spun cotton, 220gsm. Ribbed crew neck. Pre-shrunk fabric.',
      'Care: Machine wash cold (30°C), inside out. Do not tumble dry. Iron on reverse. Do not bleach.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed ring-spun cotton, 220gsm. Ribbed crew neck. Pre-shrunk fabric.',
    care: 'Machine wash cold (30°C), inside out. Do not tumble dry. Iron on reverse. Do not bleach.',
    themeType: 'main'
  },
  {
    id: 2,
    slug: 'snazzy-tee-t2',
    name: 'Snazzy Tee — T2',
    tagline: 'Signature streetwear drop',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    hoverImage: '/images/nobg/t2-back-nobg.png',
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    badge: 'New',
    description:
      'From the latest streetwear drop — bold embroidered branding on a relaxed-fit silhouette. The dropped shoulder and boxy cut make this an instant wardrobe anchor for any season.',
    bullets: [
      'Material: 100% combed cotton, 220gsm. Boxy oversized fit. Reinforced seams.',
      'Care: Machine wash cold. Turn inside out before washing. Hang to dry. Do not iron directly on embroidery.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Boxy oversized fit. Reinforced seams.',
    care: 'Machine wash cold. Turn inside out before washing. Hang to dry. Do not iron directly on embroidery.',
    themeType: 'main'
  },
  {
    id: 3,
    slug: 'snazzy-tee-t3',
    name: 'Snazzy Tee — T3',
    tagline: 'Bold graphic on 220gsm cotton',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    hoverImage: '/images/nobg/t3-back-nobg.png',
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    badge: 'Popular',
    description:
      'Statement embroidery meets everyday comfort. The T3 features a bold graphic design rendered in high-density thread on 220gsm cotton. A piece that gets better with every wear.',
    bullets: [
      'Material: 100% combed cotton, 220gsm. Regular fit. Double-stitched hems for durability.',
      'Care: Cold machine wash. Turn inside out. Hang dry. Iron on low heat avoiding embroidered areas.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Regular fit. Double-stitched hems for durability.',
    care: 'Cold machine wash. Turn inside out. Hang dry. Iron on low heat avoiding embroidered areas.',
    themeType: 'main'
  },
  {
    id: 4,
    slug: 'snazzy-tee-t4',
    name: 'Snazzy Tee — T4',
    tagline: 'Limited season drop',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    hoverImage: '/images/nobg/t4-back-nobg.png',
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    badge: 'Limited',
    description:
      "Part of our limited seasonal run — once it's gone, it's gone. The T4 features exclusive embroidery artwork produced in a single run of 100 units. No restocks, no second chances.",
    bullets: [
      'Material: 100% combed cotton, 220gsm. Slim regular fit. Pre-washed for minimal shrinkage.',
      'Care: Hand wash or gentle cycle cold. Lay flat to dry. Do not wring or bleach.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 220gsm. Slim regular fit. Pre-washed for minimal shrinkage.',
    care: 'Hand wash or gentle cycle cold. Lay flat to dry. Do not wring or bleach.',
    themeType: 'main'
  },
  {
    id: 5,
    slug: 'snazzy-tee-t5',
    name: 'Snazzy Tee — T5',
    tagline: 'Heavyweight oversized fit',
    category: "Men's T-Shirts",
    price: '₹1,499',
    priceNum: 1499,
    hoverImage: '/images/t5-back.png',
    images: ['/images/t5-front.png', '/images/t5-back.png'],
    badge: 'Bold',
    description:
      'Our heaviest tee — 260gsm fabric with a structured boxy silhouette. The oversized cut is intentional, not accidental. Embroidery on chest and sleeve for full coverage brand expression.',
    bullets: [
      'Material: 100% combed cotton, 260gsm. Oversized boxy fit. Extended back hem. Thick ribbed collar.',
      'Care: Machine wash 30°C. Turn inside out. Do not tumble dry. Steam press if needed — avoid embroidery.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 260gsm. Oversized boxy fit. Extended back hem. Thick ribbed collar.',
    care: 'Machine wash 30°C. Turn inside out. Do not tumble dry. Steam press if needed — avoid embroidery.',
    themeType: 'main'
  },
  {
    id: 6,
    slug: 'womens-tee-g1',
    name: "Women's Tee — G1",
    tagline: 'Relaxed fit, premium cotton',
    category: "Women's T-Shirts",
    price: '₹1,399',
    priceNum: 1399,
    hoverImage: '/images/nobg/grl-t1-back-nobg.png',
    images: ['/images/nobg/grl-t1-front-nobg.png', '/images/nobg/grl-t1-back-nobg.png'],
    badge: 'New',
    description:
      'Designed for her. A relaxed-fit tee in our softest cotton fabric, with delicate embroidery that elevates without overpowering. The silhouette is slightly cropped with a curved hem.',
    bullets: [
      'Material: 100% combed cotton, 180gsm. Relaxed cropped fit. Curved hem. Soft-touch finish.',
      'Care: Machine wash cold, gentle cycle. Reshape while damp. Do not tumble dry. Cool iron on reverse.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 180gsm. Relaxed cropped fit. Curved hem. Soft-touch finish.',
    care: 'Machine wash cold, gentle cycle. Reshape while damp. Do not tumble dry. Cool iron on reverse.',
    themeType: 'main'
  },
  {
    id: 7,
    slug: 'womens-tee-g2',
    name: "Women's Tee — G2",
    tagline: 'Soft drop-shoulder silhouette',
    category: "Women's T-Shirts",
    price: '₹1,399',
    priceNum: 1399,
    hoverImage: '/images/nobg/grl-t2-back-nobg.png',
    images: ['/images/nobg/grl-t2-front-nobg.png', '/images/nobg/grl-t2-back-nobg.png'],
    badge: 'Popular',
    description:
      'A wardrobe essential reimagined. The dropped shoulder gives an effortless off-duty feel while the embroidered detail keeps it distinctly Snazzy. Pairs with everything.',
    bullets: [
      'Material: 100% combed cotton, 180gsm. Drop-shoulder construction. Slightly oversized.',
      'Care: Machine wash cold. Hang to dry. Iron on low on the back. Do not bleach.'
    ],
    sizes: SIZES_TEE,
    material: '100% combed cotton, 180gsm. Drop-shoulder construction. Slightly oversized.',
    care: 'Machine wash cold. Hang to dry. Iron on low on the back. Do not bleach.',
    themeType: 'main'
  },
  {
    id: 8,
    slug: 'snazzy-hoodie',
    name: 'Snazzy Hoodie',
    tagline: 'Fleece-lined premium embroidered hoodie',
    category: 'Hoodies',
    price: '₹2,499',
    priceNum: 2499,
    hoverImage: '/images/nobg/hoodie-back-nobg.png',
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    badge: 'Bestseller',
    description:
      'The hoodie that redefines casual. 380gsm fleece-lined fabric with precision chest embroidery, an adjustable drawstring hood, and a kangaroo pocket finished with a woven brand label inside.',
    bullets: [
      'Material: 80% cotton, 20% polyester, 380gsm. Fleece-lined interior. Ribbed cuffs and hem. Metal eyelets.',
      'Care: Machine wash 30°C. Turn inside out. Do not tumble dry on high heat. Steam iron if needed.'
    ],
    sizes: SIZES_HOODIE,
    material: '80% cotton, 20% polyester, 380gsm. Fleece-lined interior. Ribbed cuffs and hem. Metal eyelets.',
    care: 'Machine wash 30°C. Turn inside out. Do not tumble dry on high heat. Steam iron if needed.',
    themeType: 'main'
  },
  {
    id: 9,
    slug: 'snazzy-sweatshirt',
    name: 'Snazzy Sweatshirt',
    tagline: '320gsm French terry, embroidered chest',
    category: 'Sweatshirts',
    price: '₹1,999',
    priceNum: 1999,
    hoverImage: '/images/nobg/sweatshirt-back-nobg.png',
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    badge: 'Artisan',
    description:
      'French terry construction meets artisan embroidery. The crewneck silhouette is clean and versatile — dress it up or down. The 320gsm weight means it keeps its shape without feeling heavy.',
    bullets: [
      'Material: 80% cotton, 20% polyester, 320gsm. French terry loopback. Ribbed crew neck, cuffs and waistband.',
      'Care: Machine wash cold, inside out. Reshape while damp. Do not bleach. Cool tumble dry or hang dry.'
    ],
    sizes: SIZES_HOODIE,
    material: '80% cotton, 20% polyester, 320gsm. French terry loopback. Ribbed crew neck, cuffs and waistband.',
    care: 'Machine wash cold, inside out. Reshape while damp. Do not bleach. Cool tumble dry or hang dry.',
    themeType: 'main'
  },
]

export const DROP1_PRODUCTS: ProductData[] = [
  {
    id: 'd1-1',
    slug: 'drop1-snazzy-tee-t1',
    name: 'Snazzy Tee — T1',
    price: '₹1,499',
    priceNum: 1499,
    category: 'T-Shirts',
    description:
      'Cut for those who move with intention. The T1 is the cornerstone of Wild Instincts — minimal on the surface, deliberate in every seam.',
    bullets: ['100% Organic Pima Cotton', 'Regular fit, slightly dropped shoulder', 'Machine wash cold, tumble dry low', 'Pre-shrunk, stonewash finish'],
    images: ['/images/nobg/t1-front-nobg.png', '/images/nobg/t1-back-nobg.png'],
    badge: 'Bestseller',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
  {
    id: 'd1-2',
    slug: 'drop1-snazzy-tee-t2',
    name: 'Snazzy Tee — T2',
    price: '₹1,499',
    priceNum: 1499,
    category: 'T-Shirts',
    description:
      'A quiet statement. The T2 carries the same exacting construction as the T1, refined with a slightly longer hem and tighter rib collar.',
    bullets: ['100% Organic Pima Cotton', 'Slim regular fit, longer hem', 'Ribbed crew collar', 'Garment-dyed in small batches'],
    images: ['/images/nobg/t2-front-nobg.png', '/images/nobg/t2-back-nobg.png'],
    badge: 'New',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
  {
    id: 'd1-3',
    slug: 'drop1-snazzy-tee-t3',
    name: 'Snazzy Tee — T3',
    price: '₹1,499',
    priceNum: 1499,
    category: 'T-Shirts',
    description:
      'The workhorse. The T3 is built for longevity — a heavier weight mid-gauge cotton that softens with every wash without losing its shape.',
    bullets: ['220 GSM mid-weight cotton', 'Boxy, relaxed fit', 'Reinforced side seams', 'Faded ink graphic — limited run'],
    images: ['/images/nobg/t3-front-nobg.png', '/images/nobg/t3-back-nobg.png'],
    badge: 'Popular',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
  {
    id: 'd1-4',
    slug: 'drop1-snazzy-hoodie-h1',
    name: 'Snazzy Hoodie — H1',
    price: '₹2,799',
    priceNum: 2799,
    category: 'Hoodies',
    description:
      'The weight of purpose. The H1 hoodie is a study in considered construction — brushed inner fleece, an unlined kangaroo pocket, and a hood that actually fits right.',
    bullets: ['380 GSM brushed fleece interior', 'Oversized, structured silhouette', 'Ribbed cuffs and hem, non-stretch', 'Garment-washed for immediate softness'],
    images: ['/images/nobg/hoodie-front-nobg.png', '/images/nobg/hoodie-back-nobg.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
  {
    id: 'd1-5',
    slug: 'drop1-snazzy-sweatshirt-s1',
    name: 'Snazzy Sweatshirt — S1',
    price: '₹2,299',
    priceNum: 2299,
    category: 'Sweatshirts',
    description:
      'Between seasons, between moments. The S1 crewneck is the layer that grounds every outfit — an honest sweatshirt with no excess.',
    bullets: ['320 GSM loop-back cotton', 'Classic crewneck, boxy fit', 'Set-in sleeves, clean finish', 'Cold wash recommended to preserve drape'],
    images: ['/images/nobg/sweatshirt-front-nobg.png', '/images/nobg/sweatshirt-back-nobg.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
  {
    id: 'd1-6',
    slug: 'drop1-snazzy-tee-t4',
    name: 'Snazzy Tee — T4',
    price: '₹1,499',
    priceNum: 1499,
    category: 'T-Shirts',
    description:
      'The outlier in the T-series. The T4 features an extended back hem and a subtle tonal graphic across the chest — for when understated becomes a language.',
    bullets: ['180 GSM single jersey cotton', 'Relaxed fit, extended back hem', 'Tonal print — barely-there in daylight', 'Narrow rib collar'],
    images: ['/images/nobg/t4-front-nobg.png', '/images/nobg/t4-back-nobg.png'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    themeType: 'drop1'
  },
]

export const ALL_PRODUCTS = [...MAIN_PRODUCTS, ...DROP1_PRODUCTS]

export const DETAIL_THEME = {
  bg: '#FAF5E8',
  text: '#1B3C34',
  accent: '#1B3C34',
  border: 'rgba(27,60,52,0.12)',
  subtleText: 'rgba(27,60,52,0.55)',
  font: 'light' as const,
  hideShadow: true,
}

export const DROP1_THEME = {
  bg: '#050505',
  text: '#E8DDCA',
  accent: '#E8DDCA',
  border: 'rgba(232,221,202,0.10)',
  subtleText: 'rgba(232,221,202,0.45)',
  font: 'dark' as const,
}

export function getProductBySlug(slug: string): ProductData | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug)
}

export function getThemeForProduct(product: ProductData) {
  return product.themeType === 'drop1' ? DROP1_THEME : DETAIL_THEME
}
