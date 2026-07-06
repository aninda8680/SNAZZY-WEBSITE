import { Router } from 'express'
import { body } from 'express-validator'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import supabase from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
router.use(authenticate)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST /api/payments/create-order
// Creates Razorpay order and saves pending order in DB
router.post(
  '/create-order',
  [
    body('address_id').isUUID(),
    body('items').isArray({ min: 1 }),
    body('items.*.product_id').isUUID(),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { address_id, items } = req.body

      // Verify address belongs to user
      const { data: address } = await supabase
        .from('addresses')
        .select('id')
        .eq('id', address_id)
        .eq('user_id', req.user.id)
        .single()

      if (!address) {
        return res.status(400).json({ error: 'Invalid address' })
      }

      // Fetch products and calculate total
      const productIds = items.map((i) => i.product_id)
      const { data: products } = await supabase
        .from('products')
        .select('id, price, in_stock, stock_quantity')
        .in('id', productIds)

      let totalPaise = 0
      const orderItems = []

      for (const item of items) {
        const product = products.find((p) => p.id === item.product_id)
        if (!product?.in_stock) {
          return res.status(400).json({ error: `Product ${item.product_id} is out of stock` })
        }
        totalPaise += product.price * item.quantity
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
        })
      }

      // Create Razorpay order
      const rpOrder = await razorpay.orders.create({
        amount: totalPaise,
        currency: 'INR',
        receipt: `snazzy_${Date.now()}`,
      })

      // Save order in DB (status: pending)
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: req.user.id,
          address_id,
          total_amount: totalPaise,
          razorpay_order_id: rpOrder.id,
          status: 'pending',
        })
        .select('id')
        .single()

      if (orderErr) throw orderErr

      // Save order items
      await supabase.from('order_items').insert(
        orderItems.map((i) => ({ ...i, order_id: order.id }))
      )

      // Save payment record
      await supabase.from('payments').insert({
        order_id: order.id,
        razorpay_order_id: rpOrder.id,
        amount: totalPaise,
        status: 'created',
      })

      res.json({
        razorpay_order_id: rpOrder.id,
        amount: totalPaise,
        currency: 'INR',
        order_id: order.id,
        key_id: process.env.RAZORPAY_KEY_ID,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create payment order' })
    }
  }
)

// POST /api/payments/verify
// Verifies Razorpay signature — NEVER trust frontend for this
router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty(),
    body('order_id').isUUID(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body

      // Verify the HMAC signature
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (expected !== razorpay_signature) {
        return res.status(400).json({ error: 'Payment verification failed' })
      }

      // Confirm the order belongs to this user
      const { data: order } = await supabase
        .from('orders')
        .select('id, status')
        .eq('id', order_id)
        .eq('user_id', req.user.id)
        .single()

      if (!order) return res.status(404).json({ error: 'Order not found' })
      if (order.status === 'paid') return res.json({ message: 'Already paid' })

      // Mark order as paid
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order_id)

      // Update payment record
      await supabase
        .from('payments')
        .update({
          razorpay_payment_id,
          razorpay_signature,
          status: 'paid',
          verified_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id)

      // Decrement stock for each item in the order
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order_id)

      if (orderItems?.length) {
        const productIds = orderItems.map((i) => i.product_id)
        const { data: stockData } = await supabase
          .from('products')
          .select('id, stock_quantity')
          .in('id', productIds)

        if (stockData) {
          await Promise.all(
            orderItems.map(({ product_id, quantity }) => {
              const current = stockData.find((p) => p.id === product_id)?.stock_quantity ?? 0
              const newQty = Math.max(0, current - quantity)
              return supabase
                .from('products')
                .update({ stock_quantity: newQty, in_stock: newQty > 0 })
                .eq('id', product_id)
            })
          )
        }
      }

      // Clear user's cart after successful payment
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', req.user.id)
        .single()

      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id)
      }

      res.json({ message: 'Payment verified', order_id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Verification failed' })
    }
  }
)

export default router
