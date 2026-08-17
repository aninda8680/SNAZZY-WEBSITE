export interface DropConfig {
  id: string
  name: string
  themeColor: string
  gradientStart?: string
  gradientEnd?: string
  status: 'live' | 'upcoming' | 'archived'
  // Drop page content
  headline?: string
  subLabel?: string
  descriptorCopy?: string
  subcollections?: string[]
  heroImage?: string
}

export const dropsConfig: DropConfig[] = [
  {
    id: 'drop-1',
    name: 'Drop 1',
    themeColor: '#050505',
    gradientStart: '#111111',
    gradientEnd: '#050505',
    status: 'live',
    headline: 'WILD INSTINCTS',
    subLabel: 'DROP 1',
    descriptorCopy: "Born from instinct, refined by craft. A collection that doesn't ask for permission — it commands attention. Each piece is a statement worn without explanation.",
    subcollections: ['PRONOIA', 'VALOR', 'MAVERICK'],
    heroImage: '/images/drop1-hero.png',
  },
  {
    id: 'drop-2',
    name: 'Drop 2',
    themeColor: '#1A0F00',
    gradientStart: '#2C1A00',
    gradientEnd: '#1A0F00',
    status: 'upcoming',
  },
  {
    id: 'drop-3',
    name: 'Drop 3',
    themeColor: '#020617',
    gradientStart: '#0F172A',
    gradientEnd: '#020617',
    status: 'archived',
  },
]
