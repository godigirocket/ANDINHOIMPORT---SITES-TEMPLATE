-- ============================================================================
-- Schema inicial — Sistema de E-commerce
-- Execute esse SQL inteiro no SQL Editor do Supabase em uma única vez.
-- ============================================================================

-- Habilita extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Tabela: products
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price > 0),
  old_price       NUMERIC(10,2),
  image_url       TEXT,
  affiliate_link  TEXT,
  category        TEXT,
  featured        BOOLEAN NOT NULL DEFAULT false,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  badge           TEXT,
  installments    INTEGER NOT NULL DEFAULT 12 CHECK (installments BETWEEN 1 AND 24),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_client_id ON products(client_id);
CREATE INDEX IF NOT EXISTS idx_products_status    ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sort      ON products(client_id, sort_order);

-- ============================================================================
-- Tabela: site_content
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_content (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id           TEXT NOT NULL UNIQUE,
  hero_title          TEXT,
  hero_subtitle       TEXT,
  hero_badge          TEXT,
  cta_primary_text    TEXT,
  cta_secondary_text  TEXT,
  whatsapp_link       TEXT,
  instagram_link      TEXT,
  support_text        TEXT,
  contact_phone       TEXT,
  contact_email       TEXT,
  contact_address     TEXT,
  seo_title           TEXT,
  seo_description     TEXT,
  seo_keywords        TEXT,
  ga_id               TEXT,
  meta_pixel          TEXT,
  tiktok_pixel        TEXT,
  hero_bg_1           TEXT,
  hero_bg_2           TEXT,
  google_search_console_token TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_client_id ON site_content(client_id);

-- ============================================================================
-- Tabela: banners
-- ============================================================================
CREATE TABLE IF NOT EXISTS banners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   TEXT NOT NULL DEFAULT 'default',
  image_url   TEXT NOT NULL,
  title       TEXT,
  link_url    TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_client ON banners(client_id, sort_order);

-- ============================================================================
-- Tabela: testimonials
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   TEXT NOT NULL DEFAULT 'default',
  name        TEXT NOT NULL,
  text        TEXT NOT NULL,
  avatar_url  TEXT,
  rating      INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_client ON testimonials(client_id);

-- ============================================================================
-- Tabela: orders (pedidos do checkout)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  client_id       TEXT NOT NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT,
  customer_phone  TEXT NOT NULL,
  customer_cpf    TEXT,
  items           JSONB NOT NULL,
  total           NUMERIC(10,2) NOT NULL,
  method          TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending_confirmation'
                  CHECK (status IN ('pending_confirmation','paid','shipped','delivered','cancelled')),
  utms            JSONB,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_client     ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- Trigger: atualiza updated_at automaticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON site_content;
CREATE TRIGGER trg_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- Row Level Security (RLS) — ativa, mas com políticas permissivas
-- Ajuste para sua estratégia de auth quando integrar Supabase Auth.
-- ============================================================================
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;

-- Leitura pública (catálogo do site)
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_banners" ON banners;
CREATE POLICY "public_read_banners" ON banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (true);

-- Inserção pública de pedidos (checkout)
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);

-- Leitura/Update/Delete: precisa de auth (admin do Supabase ou service_role)
-- Para liberar tudo enquanto você ainda não configura Supabase Auth, descomente:
--
-- DROP POLICY IF EXISTS "anon_all_products" ON products;
-- CREATE POLICY "anon_all_products" ON products FOR ALL USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "anon_all_site_content" ON site_content;
-- CREATE POLICY "anon_all_site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "anon_all_banners" ON banners;
-- CREATE POLICY "anon_all_banners" ON banners FOR ALL USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "anon_all_testimonials" ON testimonials;
-- CREATE POLICY "anon_all_testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "anon_all_orders" ON orders;
-- CREATE POLICY "anon_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- Storage Buckets (execute via UI ou descomente — requer permissão)
-- Vá em Supabase → Storage e crie 3 buckets PÚBLICOS:
--   - products
--   - banners
--   - testimonials
-- Configure cada um como "Public bucket".
-- ============================================================================
