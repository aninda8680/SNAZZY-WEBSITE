import { Router } from 'express'
import { body } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import supabase from '../config/supabase.js'
import { handleValidation } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, full_name, phone } = req.body

      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (existing) {
        return res.status(409).json({ error: 'Email already registered' })
      }

      const password_hash = await bcrypt.hash(password, 12)

      const { data: user, error } = await supabase
        .from('users')
        .insert({ email, password_hash, full_name, phone })
        .select('id, email, full_name, role')
        .single()

      if (error) throw error

      res.status(201).json({ token: signToken(user), user })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Registration failed' })
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body

      const { data: user } = await supabase
        .from('users')
        .select('id, email, full_name, role, password_hash')
        .eq('email', email)
        .single()

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const { password_hash: _, ...safeUser } = user
      res.json({ token: signToken(safeUser), user: safeUser })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Login failed' })
    }
  }
)

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone, role')
    .eq('id', req.user.id)
    .single()

  if (error || !user) return res.status(404).json({ error: 'User not found' })
  res.json({ user })
})

export default router
