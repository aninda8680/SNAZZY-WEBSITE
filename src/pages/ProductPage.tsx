import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductDetail from '../components/ProductDetail'
import { getProductBySlug, getThemeForProduct } from '../data/products'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const product = slug ? getProductBySlug(slug) : undefined
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF5E8] text-[#1B3C34] gap-6">
        <h1 className="font-cormorant text-3xl">Product not found</h1>
        <button 
          onClick={() => navigate('/')} 
          className="font-inter text-xs tracking-[0.2em] uppercase border-b border-[#1B3C34]/30 pb-1"
        >
          Return Home
        </button>
      </div>
    )
  }

  const theme = getThemeForProduct(product)

  return (
    <div className="min-h-screen w-full relative">
      <ProductDetail 
        product={product} 
        theme={theme} 
        onClose={() => {
          if (window.history.length > 2) { // 2 because 1 is empty new tab usually in history length in some browsers, but let's be safe
            navigate(-1)
          } else {
            navigate('/')
          }
        }} 
      />
    </div>
  )
}
