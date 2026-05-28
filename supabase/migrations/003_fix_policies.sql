-- Cole este SQL no Supabase SQL Editor
-- Usa DROP IF EXISTS para não dar erro se já existir

DROP POLICY IF EXISTS "site_content_insert_anon"   ON public.site_content;
DROP POLICY IF EXISTS "site_content_update_anon"   ON public.site_content;
DROP POLICY IF EXISTS "site_content_insert_auth"   ON public.site_content;
DROP POLICY IF EXISTS "site_content_update_auth"   ON public.site_content;
DROP POLICY IF EXISTS "products_insert_anon"       ON public.products;
DROP POLICY IF EXISTS "products_update_anon"       ON public.products;
DROP POLICY IF EXISTS "products_delete_anon"       ON public.products;
DROP POLICY IF EXISTS "products_insert_auth"       ON public.products;
DROP POLICY IF EXISTS "products_update_auth"       ON public.products;
DROP POLICY IF EXISTS "products_delete_auth"       ON public.products;
DROP POLICY IF EXISTS "banners_insert_anon"        ON public.banners;
DROP POLICY IF EXISTS "banners_update_anon"        ON public.banners;
DROP POLICY IF EXISTS "banners_delete_anon"        ON public.banners;
DROP POLICY IF EXISTS "banners_insert_auth"        ON public.banners;
DROP POLICY IF EXISTS "banners_update_auth"        ON public.banners;
DROP POLICY IF EXISTS "banners_delete_auth"        ON public.banners;
DROP POLICY IF EXISTS "testimonials_insert_anon"   ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_update_anon"   ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_delete_anon"   ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_insert_auth"   ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_update_auth"   ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_delete_auth"   ON public.testimonials;

-- Recria tudo permitindo anon (a chave usada pelo painel)
CREATE POLICY "site_content_insert_anon"   ON public.site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "site_content_update_anon"   ON public.site_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products_insert_anon"       ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_anon"       ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products_delete_anon"       ON public.products FOR DELETE USING (true);
CREATE POLICY "banners_insert_anon"        ON public.banners FOR INSERT WITH CHECK (true);
CREATE POLICY "banners_update_anon"        ON public.banners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "banners_delete_anon"        ON public.banners FOR DELETE USING (true);
CREATE POLICY "testimonials_insert_anon"   ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "testimonials_update_anon"   ON public.testimonials FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "testimonials_delete_anon"   ON public.testimonials FOR DELETE USING (true);

-- Adiciona sort_order se não existir
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Storage policies
DROP POLICY IF EXISTS "storage_products_insert"     ON storage.objects;
DROP POLICY IF EXISTS "storage_products_update"     ON storage.objects;
DROP POLICY IF EXISTS "storage_products_delete"     ON storage.objects;
DROP POLICY IF EXISTS "storage_banners_insert"      ON storage.objects;
DROP POLICY IF EXISTS "storage_banners_update"      ON storage.objects;
DROP POLICY IF EXISTS "storage_banners_delete"      ON storage.objects;
DROP POLICY IF EXISTS "storage_testimonials_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_testimonials_delete" ON storage.objects;

CREATE POLICY "storage_products_insert"     ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "storage_products_update"     ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "storage_products_delete"     ON storage.objects FOR DELETE USING (bucket_id = 'products');
CREATE POLICY "storage_banners_insert"      ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');
CREATE POLICY "storage_banners_update"      ON storage.objects FOR UPDATE USING (bucket_id = 'banners');
CREATE POLICY "storage_banners_delete"      ON storage.objects FOR DELETE USING (bucket_id = 'banners');
CREATE POLICY "storage_testimonials_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials');
CREATE POLICY "storage_testimonials_delete" ON storage.objects FOR DELETE USING (bucket_id = 'testimonials');
