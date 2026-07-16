-- ============================================================================
-- Migration 004 — EMERGÊNCIA: Remove TODAS as policies e recria APENAS as seguras
--
-- MOTIVO: Policies antigas permissivas (FOR ALL USING (true)) estão ativas
-- e permitem que anon faça INSERT/UPDATE/DELETE.
--
-- EXECUTE AGORA no SQL Editor.
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PASSO 1: Dropar TODAS as policies de TODAS as tabelas       ║
-- ╚══════════════════════════════════════════════════════════════╝

-- PRODUCTS
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'products' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON products', pol.policyname);
  END LOOP;
END $$;

-- SITE_CONTENT
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'site_content' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON site_content', pol.policyname);
  END LOOP;
END $$;

-- BANNERS
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'banners' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON banners', pol.policyname);
  END LOOP;
END $$;

-- TESTIMONIALS
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'testimonials' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON testimonials', pol.policyname);
  END LOOP;
END $$;

-- ORDERS
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'orders' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON orders', pol.policyname);
  END LOOP;
END $$;

-- ADMIN_PROFILES
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'admin_profiles' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON admin_profiles', pol.policyname);
  END LOOP;
END $$;


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PASSO 2: Garantir que RLS está ATIVO em todas as tabelas    ║
-- ╚══════════════════════════════════════════════════════════════╝

ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- FORCE RLS para que nem o owner (postgres) passe sem policy
ALTER TABLE products      FORCE ROW LEVEL SECURITY;
ALTER TABLE site_content  FORCE ROW LEVEL SECURITY;
ALTER TABLE banners       FORCE ROW LEVEL SECURITY;
ALTER TABLE testimonials  FORCE ROW LEVEL SECURITY;
ALTER TABLE orders        FORCE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles FORCE ROW LEVEL SECURITY;


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PASSO 3: Recriar APENAS as policies seguras                 ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── ADMIN_PROFILES ──
CREATE POLICY "profiles_select_own" ON admin_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON admin_profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ── PRODUCTS ──
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_own" ON products
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "products_update_own" ON products
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "products_delete_own" ON products
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());

-- ── SITE_CONTENT ──
CREATE POLICY "content_select_public" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "content_insert_own" ON site_content
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "content_update_own" ON site_content
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "content_delete_own" ON site_content
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());

-- ── BANNERS ──
CREATE POLICY "banners_select_public" ON banners
  FOR SELECT USING (true);

CREATE POLICY "banners_insert_own" ON banners
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "banners_update_own" ON banners
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "banners_delete_own" ON banners
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());

-- ── TESTIMONIALS ──
CREATE POLICY "testimonials_select_public" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "testimonials_insert_own" ON testimonials
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "testimonials_update_own" ON testimonials
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "testimonials_delete_own" ON testimonials
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());

-- ── ORDERS ──
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());

CREATE POLICY "orders_update_own" ON orders
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "orders_delete_own" ON orders
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  VERIFICAÇÃO: Listar policies ativas                         ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Rode isso depois para confirmar:
-- SELECT tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;
