import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from './hooks'
import { Navbar, CustomCursor } from './components'
import {
  Home,
  CollectionsShowcase,
  Shop,
  Heritage,
  Craftsmanship,
  Gallery,
  Contact,
} from './sections'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useSmoothScroll()

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Home />
      <CollectionsShowcase />
      <Shop />
      <Heritage />
      <Craftsmanship />
      <Gallery />
      <Contact />
    </div>
  )
}
