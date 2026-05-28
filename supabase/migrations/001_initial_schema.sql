-- ============================================================
-- ANDINHO IMPORT — Schema Completo v3
-- EXECUTE ESTE ARQUIVO COMPLETO no SQL Editor:
-- https://supabase.com/dashboard/project/gtfgljbdnqvtzyjqwvxp/sql/new
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── DROP tabelas existentes (recria do zero) ─────────────────
DROP TABLE IF EXISTS public.testimonials  CASCADE;
DROP TABLE IF EXISTS public.banners       CASCADE;
DROP TABLE IF EXISTS public.site_content  CASCADE;
DROP TABLE IF EXISTS public.products      CASCADE;

-- ── products ─────────────────────────────────────────────────
CREATE TABLE public.products (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT        NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  old_price      NUMERIC(10,2),
  image_url      TEXT,
  affiliate_link TEXT,
  category       TEXT,
  featured       BOOLEAN     NOT NULL DEFAULT false,
  status         TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  badge          TEXT,
  installments   INTEGER     NOT NULL DEFAULT 1 CHECK (installments >= 1 AND installments <= 24),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── site_content ─────────────────────────────────────────────
CREATE TABLE public.site_content (
  id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id          TEXT        NOT NULL UNIQUE,
  hero_title         TEXT,
  hero_subtitle      TEXT,
  hero_badge         TEXT,
  cta_primary_text   TEXT,
  cta_secondary_text TEXT,
  whatsapp_link      TEXT,
  instagram_link     TEXT,
  support_text       TEXT,
  contact_phone      TEXT,
  contact_email      TEXT,
  contact_address    TEXT,
  seo_title          TEXT,
  seo_description    TEXT,
  seo_keywords       TEXT,
  ga_id              TEXT,
  meta_pixel         TEXT,
  tiktok_pixel       TEXT,
  hero_bg_1          TEXT,
  hero_bg_2          TEXT,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── banners ──────────────────────────────────────────────────
CREATE TABLE public.banners (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT        NOT NULL,
  title       TEXT,
  active      BOOLEAN     NOT NULL DEFAULT true,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── testimonials ─────────────────────────────────────────────
CREATE TABLE public.testimonials (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  text        TEXT        NOT NULL,
  avatar_url  TEXT,
  rating      INTEGER     NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Trigger updated_at ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- products
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_auth"   ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update_auth"   ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_delete_auth"   ON public.products FOR DELETE TO authenticated USING (true);

-- site_content
CREATE POLICY "site_content_select_public" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content_insert_auth"   ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_content_update_auth"   ON public.site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- banners
CREATE POLICY "banners_select_public" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners_insert_auth"   ON public.banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "banners_update_auth"   ON public.banners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "banners_delete_auth"   ON public.banners FOR DELETE TO authenticated USING (true);

-- testimonials
CREATE POLICY "testimonials_select_public" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_insert_auth"   ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "testimonials_update_auth"   ON public.testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "testimonials_delete_auth"   ON public.testimonials FOR DELETE TO authenticated USING (true);

-- ── Dados iniciais ───────────────────────────────────────────
INSERT INTO public.products (title, description, price, old_price, category, featured, status, badge, installments)
VALUES
  ('iPhone 15 Pro Max 256GB', 'Titânio Natural — Novo, lacrado com nota fiscal', 7499.00, 8299.00, 'apple',      true,  'active', 'LANÇAMENTO', 18),
  ('iPhone 14 128GB',         'Azul — Seminovo impecável com garantia',          4299.00, 4999.00, 'apple',      false, 'active', 'PROMOÇÃO',   12),
  ('Xiaomi 14 Ultra 512GB',   'Preto — Câmera Leica, novo lacrado',              5999.00, NULL,    'xiaomi',     true,  'active', NULL,         18),
  ('Apple Watch Series 9 45mm','GPS + Celular — Meia-noite',                     3499.00, NULL,    'smartwatch', false, 'active', 'NOVO',       12);

INSERT INTO public.testimonials (name, text, rating, active)
VALUES
  ('Carlos M.',    'Produto chegou rápido, embalado perfeitamente. iPhone 15 Pro Max impecável, exatamente como descrito. Super recomendo!',         5, true),
  ('Ana Paula S.', 'Atendimento incrível! Tirou todas as minhas dúvidas antes da compra. Xiaomi 14 Ultra chegou em 2 dias. Nota 10!',                5, true),
  ('Rafael T.',    'Já é a terceira vez que compro aqui. Sempre produtos originais, preço justo e entrega rápida. Não compro em outro lugar.',        5, true),
  ('Juliana K.',   'Fiz o parcelamento em 18x sem juros, foi muito fácil. Apple Watch Series 9 chegou lacrado com nota fiscal. Perfeito!',            5, true),
  ('Pedro H.',     'Melhor loja de importados da região Sul. Produto original, garantia real e suporte pós-venda excelente. Recomendo demais!',       5, true),
  ('Fernanda L.',  'Comprei o iPhone 14 seminovo e estava impecável. Honestidade total na descrição do produto. Voltarei a comprar com certeza!',     5, true);

-- ── Storage Buckets ──────────────────────────────────────────
-- PASSO 1: Crie os buckets na UI do Supabase
--   Storage → New bucket → nome: products  → Public: ON
--   Storage → New bucket → nome: banners   → Public: ON
--   Storage → New bucket → nome: testimonials → Public: ON
--
-- PASSO 2: Execute as policies abaixo no SQL Editor
-- (a coluna correta é "bucket_id" em storage.objects, não "id")

-- Verificar buckets criados:
-- SELECT id, public FROM storage.buckets WHERE id IN ('products','banners','testimonials');

-- Policies para bucket 'products'
CREATE POLICY "storage_products_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "storage_products_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "storage_products_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "storage_products_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

-- Policies para bucket 'banners'
CREATE POLICY "storage_banners_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "storage_banners_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners');

CREATE POLICY "storage_banners_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners');

CREATE POLICY "storage_banners_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners');

-- Policies para bucket 'testimonials'
CREATE POLICY "storage_testimonials_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "storage_testimonials_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "storage_testimonials_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonials');
