import { Router } from 'express'
import { body, param } from 'express-validator'
import supabase from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
router.use(authenticate)

async function getOrCreateCart(userId) {
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!cart) {
    const { data } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single()
    cart = data
  }
  return cart
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id)

    const { data: items } = await supabase
      .from('cart_items')
      .select('id, quantity, products(id, name, price, original_price, image_url, accent, text_accent)')
      .eq('cart_id', cart.id)

    const total = (items || []).reduce(
      (sum, i) => sum + i.products.price * i.quantity,
      0
    )

    res.json({ cart: { id: cart.id, items: items || [], total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// POST /api/cart/items
router.post(
  '/items',
  [body('product_id').isUUID(), body('quantity').isInt({ min: 1 })],
  handleValidation,
  async (req, res) => {
    try {
      const { product_id, quantity } = req.body
      const cart = await getOrCreateCart(req.user.id)

      // Check stock
      const { data: product } = await supabase
        .from('products')
        .select('id, stock_quantity, in_stock')
        .eq('id', product_id)
        .single()

      if (!product?.in_stock) {
        return res.status(400).json({ error: 'Product out of stock' })
      }

      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', product_id)
        .single()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({ cart_id: cart.id, product_id, quantity })
      }

      res.status(201).json({ message: 'Item added to cart' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to add item' })
    }
  }
)

// PUT /api/cart/items/:itemId
router.put(
  '/items/:itemId',
  [param('itemId').isUUID(), body('quantity').isInt({ min: 0 })],
  handleValidation,
  async (req, res) => {
    try {
      const { quantity } = req.body
      const cart = await getOrCreateCart(req.user.id)

      if (quantity === 0) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', req.params.itemId)
          .eq('cart_id', cart.id)
        return res.json({ message: 'Item removed' })
      }

      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', req.params.itemId)
        .eq('cart_id', cart.id)

      res.json({ message: 'Quantity updated' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to update item' })
    }
  }
)

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id)
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.itemId)
      .eq('cart_id', cart.id)
    res.json({ message: 'Item removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove item' })
  }
})

export default router
