import { Router } from 'express'
import { body } from 'express-validator'
import supabase from '../config/supabase.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
router.use(authenticate, requireAdmin)

// ── Products ──────────────────────────────────────────────────────────

// GET /api/admin/products
router.get('/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ products: data })
})

// POST /api/admin/products
router.post(
  '/products',
  [
    body('name').trim().notEmpty(),
    body('price').isInt({ min: 1 }),
    body('category_id').isUUID(),
  ],
  handleValidation,
  async (req, res) => {
    const { data, error } = await supabase
      .from('products')
      .insert(req.body)
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ product: data })
  }
)

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ product: data })
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Product deleted' })
})

// ── Orders ───────────────────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, status, total_amount, created_at, razorpay_order_id,
      users(id, email, full_name),
      addresses(full_name, city, state),
      order_items(quantity, unit_price, products(name))
    `)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ orders: data })
})

// PUT /api/admin/orders/:id/status
router.put(
  '/orders/:id/status',
  [body('status').isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])],
  handleValidation,
  async (req, res) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: req.body.status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json({ order: data })
  }
)

// ── Dashboard stats ───────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalUsers },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('total_amount').eq('status', 'paid'),
  ])

  const totalRevenue = (revenue || []).reduce((s, o) => s + o.total_amount, 0)

  res.json({
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    },
  })
})

export default router
