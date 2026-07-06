import { Router } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

// GET /api/products  (with optional ?category=slug&search=term)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    res.json({ products: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/category/:slug  (must be before /:id to avoid param shadowing)
router.get('/category/:slug', async (req, res) => {
  const { data: cat } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', req.params.slug)
    .single()

  if (!cat) return res.status(404).json({ error: 'Category not found' })

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', cat.id)
    .eq('in_stock', true)

  res.json({ category: cat, products })
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', req.params.id)
    .single()

  if (error || !product) {
    return res.status(404).json({ error: 'Product not found' })
  }
  res.json({ product })
})

export default router
