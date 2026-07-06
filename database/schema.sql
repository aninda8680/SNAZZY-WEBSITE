-- ============================================================
-- Snazzy E-Commerce — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── users ────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  role          TEXT        NOT NULL DEFAULT 'customer'
                            CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        UNIQUE NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── products ─────────────────────────────────────────────────
CREATE TABLE products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID        REFERENCES categories(id) ON DELETE SET NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,
  tagline         TEXT,
  description     TEXT,
  price           INTEGER     NOT NULL CHECK (price > 0),   -- paise (₹1 = 100)
  original_price  INTEGER,
  image_url       TEXT,
  badge           TEXT,
  badge_bg        TEXT,
  bg_from         TEXT,
  bg_to           TEXT,
  accent          TEXT,
  text_accent     TEXT,
  in_stock        BOOLEAN     DEFAULT TRUE,
  stock_quantity  INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── addresses ────────────────────────────────────────────────
CREATE TABLE addresses (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name  TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  line1      TEXT        NOT NULL,
  line2      TEXT,
  city       TEXT        NOT NULL,
  state      TEXT        NOT NULL,
  pincode    TEXT        NOT NULL,
  is_default BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── carts ────────────────────────────────────────────────────
CREATE TABLE carts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── cart_items ───────────────────────────────────────────────
CREATE TABLE cart_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id    UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- ── orders ───────────────────────────────────────────────────
CREATE TABLE orders (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        REFERENCES users(id) ON DELETE SET NULL,
  address_id         UUID        REFERENCES addresses(id),
  status             TEXT        NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  total_amount       INTEGER     NOT NULL,  -- paise
  razorpay_order_id  TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── order_items ──────────────────────────────────────────────
CREATE TABLE order_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID        REFERENCES products(id) ON DELETE SET NULL,
  quantity   INTEGER     NOT NULL,
  unit_price INTEGER     NOT NULL,  -- paise, snapshot at time of order
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── payments ─────────────────────────────────────────────────
CREATE TABLE payments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id    TEXT        NOT NULL,
  razorpay_payment_id  TEXT,
  razorpay_signature   TEXT,
  amount               INTEGER     NOT NULL,  -- paise
  currency             TEXT        DEFAULT 'INR',
  status               TEXT        DEFAULT 'created'
                                   CHECK (status IN ('created','paid','failed','refunded')),
  verified_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_orders_user        ON orders(user_id);
CREATE INDEX idx_payments_order     ON payments(order_id);

-- ── Seed: categories ─────────────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
  ('Pure Luxe',     'pure-luxe',     'Gold metallic embroidery on Pima cotton'),
  ('Bloom Series',  'bloom-series',  'Japanese botanical motifs in satin stitch'),
  ('Midnight Edge', 'midnight-edge', 'High-contrast geometric on heavyweight cotton'),
  ('Earth Roots',   'earth-roots',   'Kantha & zardozi on organic cotton');

-- ── Seed: products ───────────────────────────────────────────
INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Pure Luxe Classic',
  'pure-luxe-classic',
  'Gold metallic embroidery on Pima cotton',
  149900, NULL,
  'Bestseller', '#F59E0B20', '#1A0F00', '#3D2800', '#F59E0B', '#FDE68A',
  true, 50
FROM categories c WHERE c.slug = 'pure-luxe';

INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Pure Luxe Premium',
  'pure-luxe-premium',
  'Limited run — 50 pieces worldwide',
  199900, 249900,
  'New', '#F59E0B20', '#1A0F00', '#4A3200', '#F59E0B', '#FDE68A',
  true, 20
FROM categories c WHERE c.slug = 'pure-luxe';

INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Bloom Floral Tee',
  'bloom-floral-tee',
  'Japanese botanical motifs in satin stitch',
  159900, NULL,
  'Limited', '#F9A8D420', '#2D0A1E', '#5C1A3A', '#F9A8D4', '#FBCFE8',
  true, 30
FROM categories c WHERE c.slug = 'bloom-series';

INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Bloom Garden',
  'bloom-garden',
  'Dense floral bloom on 220gsm jersey',
  179900, NULL,
  'Popular', '#F9A8D420', '#2D0A1E', '#6B1F45', '#F9A8D4', '#FBCFE8',
  true, 25
FROM categories c WHERE c.slug = 'bloom-series';

INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Midnight Edge Geo',
  'midnight-edge-geo',
  'High-contrast geometric on 280gsm cotton',
  169900, NULL,
  'Bold', '#93C5FD20', '#020617', '#0F172A', '#93C5FD', '#BFDBFE',
  true, 40
FROM categories c WHERE c.slug = 'midnight-edge';

INSERT INTO products (
  category_id, name, slug, tagline, price, original_price,
  badge, badge_bg, bg_from, bg_to, accent, text_accent, in_stock, stock_quantity
)
SELECT
  c.id,
  'Earth Roots Heritage',
  'earth-roots-heritage',
  'Kantha & zardozi on organic cotton',
  149900, NULL,
  'Artisan', '#D4A57420', '#1A0E07', '#3D2010', '#D4A574', '#E5C5A0',
  true, 35
FROM categories c WHERE c.slug = 'earth-roots';
