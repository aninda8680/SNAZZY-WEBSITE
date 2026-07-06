import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: string
  priceNum: number
  accent: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setIsOpen(true)
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) { removeItem(id); return }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i))
  }

  const total = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      total, count,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
