import { Router } from 'express'
import { body } from 'express-validator'
import supabase from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
router.use(authenticate)

// GET /api/orders  — order history for logged-in user
router.get('/', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, status, total_amount, created_at, razorpay_order_id,
        addresses(full_name, line1, city, state, pincode),
        order_items(quantity, unit_price, products(id, name, image_url))
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ orders })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/user/addresses  — list saved addresses (must be before /:id)
router.get('/user/addresses', async (req, res) => {
  try {
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_default', { ascending: false })

    if (error) throw error
    res.json({ addresses: addresses || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch addresses' })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id, status, total_amount, created_at, razorpay_order_id,
      addresses(full_name, phone, line1, line2, city, state, pincode),
      order_items(quantity, unit_price, products(id, name, image_url, price)),
      payments(razorpay_payment_id, status, verified_at)
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (error || !order) return res.status(404).json({ error: 'Order not found' })
  res.json({ order })
})

// POST /api/orders/address  — save shipping address
router.post(
  '/address',
  [
    body('full_name').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('line1').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('pincode').trim().isLength({ min: 6, max: 6 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { full_name, phone, line1, line2, city, state, pincode, is_default } = req.body

      const { data: address, error } = await supabase
        .from('addresses')
        .insert({
          user_id: req.user.id,
          full_name,
          phone,
          line1,
          line2,
          city,
          state,
          pincode,
          is_default: is_default ?? false,
        })
        .select()
        .single()

      if (error) throw error
      res.status(201).json({ address })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to save address' })
    }
  }
)


export default router
