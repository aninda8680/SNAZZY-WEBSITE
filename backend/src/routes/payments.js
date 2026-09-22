import { Router } from 'express'
import { body } from 'express-validator'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import supabase from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
const router = Router()

// Dynamic keys based on mode
const isLive = process.env.RAZORPAY_MODE === 'live'
const getKeyId = () => isLive ? process.env.RAZORPAY_LIVE_KEY_ID : process.env.RAZORPAY_TEST_KEY_ID
const getKeySecret = () => isLive ? process.env.RAZORPAY_LIVE_KEY_SECRET : process.env.RAZORPAY_TEST_KEY_SECRET
const getWebhookSecret = () => isLive ? process.env.RAZORPAY_LIVE_WEBHOOK_SECRET : process.env.RAZORPAY_TEST_WEBHOOK_SECRET

const getRazorpayInstance = () => new Razorpay({
  key_id: getKeyId(),
  key_secret: getKeySecret(),
})

// POST /api/payments/create-order
// Creates Razorpay order and saves pending order in DB
router.post(
  '/create-order',
  authenticate,
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
      const rpOrder = await getRazorpayInstance().orders.create({
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
        key_id: getKeyId(),
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
  authenticate,
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
        .createHmac('sha256', getKeySecret())
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
      if (order.status === 'paid') return res.json({ message: 'Already paid', order_id })

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

      // Atomically decrement stock — avoids race conditions from concurrent orders
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order_id)

      if (orderItems?.length) {
        await Promise.all(
          orderItems.map(({ product_id, quantity }) =>
            supabase.rpc('decrement_stock', { p_product_id: product_id, p_quantity: quantity })
          )
        )
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

// POST /api/payments/webhook
// Razorpay webhook endpoint for server-side verification and idempotency
router.post(
  '/webhook',
  async (req, res) => {
    try {
      const webhookSignature = req.headers['x-razorpay-signature']
      const webhookSecret = getWebhookSecret()

      // Validate webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex')

      if (expectedSignature !== webhookSignature) {
        console.error('Webhook signature mismatch')
        return res.status(400).send('Invalid signature')
      }

      const { event, payload } = req.body

      if (event === 'order.paid' || event === 'payment.captured') {
        const paymentEntity = payload.payment.entity
        const orderEntity = payload.order?.entity || { id: paymentEntity.order_id }

        const razorpay_order_id = orderEntity.id
        const razorpay_payment_id = paymentEntity.id

        // Fetch payment record
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('id, status, order_id')
          .eq('razorpay_order_id', razorpay_order_id)
          .single()

        if (!paymentRecord) {
          console.error(`Webhook: Payment record not found for razorpay_order_id: ${razorpay_order_id}`)
          return res.status(200).send('Record not found, skipping')
        }

        // Idempotency check
        if (paymentRecord.status === 'paid') {
          console.log(`Webhook: Order ${paymentRecord.order_id} is already paid. Ignoring duplicate.`)
          return res.status(200).send('Already processed')
        }

        // Mark order as paid
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', paymentRecord.order_id)

        // Update payment record
        await supabase
          .from('payments')
          .update({
            razorpay_payment_id,
            status: 'paid',
            verified_at: new Date().toISOString(),
          })
          .eq('id', paymentRecord.id)

        // Atomically decrement stock
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', paymentRecord.order_id)

        if (orderItems?.length) {
          await Promise.all(
            orderItems.map(({ product_id, quantity }) =>
              supabase.rpc('decrement_stock', { p_product_id: product_id, p_quantity: quantity })
            )
          )
        }

        console.log(`Webhook: Successfully processed payment for order ${paymentRecord.order_id}`)
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment.entity
        const razorpay_order_id = paymentEntity.order_id
        
        console.error(`Webhook: Payment failed for order ${razorpay_order_id}: ${paymentEntity.error_description}`)
        
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('razorpay_order_id', razorpay_order_id)
      }

      res.status(200).send('OK')
    } catch (err) {
      console.error('Webhook processing error:', err)
      res.status(500).send('Internal Server Error')
    }
  }
)

export default router
