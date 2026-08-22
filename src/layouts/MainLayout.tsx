import { useState, useEffect } from 'react'
import { useSmoothScroll } from '../hooks'
import { Navbar, Cart, ViewToggle } from '../components'
import {
  Home,
  Shop,
  Gallery,
  Contact,
  DropsList,
  ProductShowcase,
} from '../sections'

export default function MainLayout() {
  useSmoothScroll()
  const [mobilePreview, setMobilePreview] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('mobile-preview', mobilePreview)
    return () => document.body.classList.remove('mobile-preview')
  }, [mobilePreview])

  return (
    <>
      <div
        className={`bg-[#FAF5E8] text-[#1B3C34] overflow-x-hidden transition-all duration-300 ${
          mobilePreview
            ? 'max-w-[390px] mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_20px_60px_rgba(0,0,0,0.35)]'
            : ''
        }`}
      >
        <Navbar />
        <Cart />
        <Home />
        <Shop />
        <DropsList />
        <ProductShowcase />
        {/* <Gallery /> */}
        <Contact />
      </div>
      <ViewToggle active={mobilePreview} onToggle={() => setMobilePreview(p => !p)} />
    </>
  )
}
