-- ============================================================
-- MULTI-CLIENTE: Adiciona client_id em todas as tabelas
-- Permite usar 1 Supabase para N clientes
-- ============================================================

-- Adiciona client_id nas tabelas que ainda não têm
ALTER TABLE public.products      ADD COLUMN IF NOT EXISTS client_id TEXT NOT NULL DEFAULT 'andinho-import';
ALTER TABLE public.banners       ADD COLUMN IF NOT EXISTS client_id TEXT NOT NULL DEFAULT 'andinho-import';
ALTER TABLE public.testimonials  ADD COLUMN IF NOT EXISTS client_id TEXT NOT NULL DEFAULT 'andinho-import';

-- Índices para performance nas queries filtradas por client_id
CREATE INDEX IF NOT EXISTS idx_products_client     ON public.products(client_id);
CREATE INDEX IF NOT EXISTS idx_banners_client      ON public.banners(client_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_client ON public.testimonials(client_id);
CREATE INDEX IF NOT EXISTS idx_site_content_client ON public.site_content(client_id);
