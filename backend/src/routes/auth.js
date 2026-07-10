import { Router } from 'express'
import { body } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
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
    body('password').isLength({ min: 8 }),
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

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ error: 'Missing credential' })

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in backend .env')
      return res.status(500).json({ error: 'Google auth not configured on server' })
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, sub: google_id } = payload

    // Find existing user by email
    let { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('email', email)
      .maybeSingle()

    if (!user) {
      // Create new Google user — password_hash is a secure non-guessable value
      const fakeHash = await bcrypt.hash(google_id + process.env.JWT_SECRET, 10)
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ email, full_name: name, password_hash: fakeHash })
        .select('id, email, full_name, role')
        .single()

      if (error) throw error
      user = newUser
    }

    res.json({ token: signToken(user), user })
  } catch (err) {
    console.error('Google auth error:', err.message)
    // 401 only for bad Google token, 500 for everything else
    const isTokenError = err.message?.includes('Token') || err.message?.includes('token') || err.message?.includes('audience')
    res.status(isTokenError ? 401 : 500).json({ error: err.message || 'Google sign in failed' })
  }
})

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

// PUT /api/auth/me — update profile (name, phone)
router.put(
  '/me',
  authenticate,
  [
    body('full_name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('phone').optional().trim().isLength({ max: 20 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { full_name, phone } = req.body
      const patch = Object.fromEntries(
        Object.entries({ full_name, phone }).filter(([, v]) => v !== undefined)
      )
      const { data: user, error } = await supabase
        .from('users')
        .update(patch)
        .eq('id', req.user.id)
        .select('id, email, full_name, phone, role')
        .single()

      if (error) throw error
      res.json({ user })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to update profile' })
    }
  }
)

// PUT /api/auth/password — change password
router.put(
  '/password',
  authenticate,
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 8 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { current_password, new_password } = req.body

      const { data: user } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', req.user.id)
        .single()

      if (!user) return res.status(404).json({ error: 'User not found' })

      const valid = await bcrypt.compare(current_password, user.password_hash)
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })

      const password_hash = await bcrypt.hash(new_password, 12)
      await supabase.from('users').update({ password_hash }).eq('id', req.user.id)

      res.json({ message: 'Password updated' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to change password' })
    }
  }
)

export default router
