export interface Collection {
  number: string
  name: string
  headline: string
  description: string
  specs: { label: string; value: string }[]
  image: string
  bgFrom: string
  bgTo: string
  accent: string
  textAccent: string
}

export const collections: Collection[] = [
  {
    number: '01',
    name: 'PURE LUXE',
    headline: 'Crafted in Gold Thread',
    description:
      "Our flagship collection on 100% Pima cotton, featuring hand-placed gold metallic embroidery. Produced in limited runs of 50 — every PURE LUXE is a collector's item.",
    specs: [
      { label: 'Fabric', value: '100% Pima Cotton' },
      { label: 'Thread', value: 'Gold Metallic' },
      { label: 'Technique', value: 'Multi-Head Digital' },
      { label: 'Care', value: 'Cold Wash Only' },
    ],
    image: '/images/tshirt-luxe.png',
    bgFrom: '#1A0F00',
    bgTo: '#3D2800',
    accent: '#F59E0B',
    textAccent: '#FDE68A',
  },
  {
    number: '02',
    name: 'BLOOM SERIES',
    headline: 'Nature Woven Into Thread',
    description:
      'Inspired by Japanese botanical illustration, our Bloom Series translates delicate floral motifs into dense satin-stitch embroidery on super-soft jersey blend.',
    specs: [
      { label: 'Fabric', value: '220gsm Jersey' },
      { label: 'Thread', value: 'Silk-Finish Poly' },
      { label: 'Technique', value: 'Satin & Stem Stitch' },
      { label: 'Care', value: 'Gentle Cycle 30°C' },
    ],
    image: '/images/tshirt-bloom.png',
    bgFrom: '#2D0A1E',
    bgTo: '#5C1A3A',
    accent: '#F9A8D4',
    textAccent: '#FBCFE8',
  },
  {
    number: '03',
    name: 'MIDNIGHT EDGE',
    headline: 'Bold Design for Bold Souls',
    description:
      'High-contrast geometric embroidery on 280gsm heavyweight cotton. MIDNIGHT EDGE is designed for those who make every entrance count — angular, sharp, unforgettable.',
    specs: [
      { label: 'Fabric', value: '280gsm Cotton' },
      { label: 'Thread', value: 'High-Sheen Rayon' },
      { label: 'Technique', value: 'Fill & Run Stitch' },
      { label: 'Care', value: 'Machine Wash Cold' },
    ],
    image: '/images/tshirt-midnight.png',
    bgFrom: '#020617',
    bgTo: '#0F172A',
    accent: '#93C5FD',
    textAccent: '#BFDBFE',
  },
  {
    number: '04',
    name: 'EARTH ROOTS',
    headline: 'Heritage Patterns, Modern Fit',
    description:
      'Drawing from centuries of South Asian artisan traditions — kantha, zardozi, kutch — reimagined on contemporary streetwear silhouettes. Heritage never looked this relevant.',
    specs: [
      { label: 'Fabric', value: 'Organic Cotton' },
      { label: 'Thread', value: 'Natural Fibre' },
      { label: 'Technique', value: 'Chain & Kantha Stitch' },
      { label: 'Care', value: 'Hand Wash Preferred' },
    ],
    image: '/images/tshirt-earth.png',
    bgFrom: '#1A0E07',
    bgTo: '#3D2010',
    accent: '#D4A574',
    textAccent: '#E5C5A0',
  },
]
