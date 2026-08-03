-- ============================================================================
-- Migration 011 - Buckets publicos de upload usados pelo painel admin
--
-- O frontend faz upload para:
--   - products
--   - banners
--   - testimonials
--
-- Se esses buckets nao existirem no Supabase Storage, o cadastro/edicao de
-- imagens no admin falha mesmo com as tabelas SQL corretas.
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('banners', 'banners', true, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('testimonials', 'testimonials', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public_read_site_uploads" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_insert_site_uploads" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_site_uploads" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_site_uploads" ON storage.objects;

CREATE POLICY "public_read_site_uploads" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('products', 'banners', 'testimonials'));

CREATE POLICY "authenticated_insert_site_uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('products', 'banners', 'testimonials'));

CREATE POLICY "authenticated_update_site_uploads" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('products', 'banners', 'testimonials'))
  WITH CHECK (bucket_id IN ('products', 'banners', 'testimonials'));

CREATE POLICY "authenticated_delete_site_uploads" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('products', 'banners', 'testimonials'));
