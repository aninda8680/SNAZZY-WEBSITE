import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 5000

// ── Security middleware ───────────────────────────────────────────────
app.use(helmet())
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// ── Rate limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 20 : 200,
  message: { error: 'Too many requests, please try again later.' },
})
app.use(limiter)

// ── Body parsing ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))

// ── Logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// ── Health check ─────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }))

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

// ── 404 handler ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack)
  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message
  res.status(status).json({ error: message })
})

app.listen(PORT, () => {
  console.log(`Snazzy API running on port ${PORT}`)
})

export default app
