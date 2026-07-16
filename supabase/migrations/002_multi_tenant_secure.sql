-- ============================================================================
-- Migration 002 — Multi-tenant SEGURO com isolamento por client_id
--
-- PRINCÍPIO:
--   Cada admin está vinculado a um client_id via tabela admin_profiles.
--   RLS garante que um admin SÓ acessa dados do seu próprio client_id.
--   Visitantes (anon) SÓ podem ler (SELECT) dados públicos.
--
-- SETUP:
--   1. Criar usuário admin em Authentication → Users → Add User
--   2. Inserir registro em admin_profiles vinculando user_id → client_id
--   3. Repetir para cada novo cliente/loja
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  TABELA: admin_profiles                                      ║
-- ║  Vincula auth.uid() ao client_id da loja que o admin gerencia║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS admin_profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id   TEXT NOT NULL,
  name        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_client_id ON admin_profiles(client_id);

-- Admin pode ler/editar apenas seu próprio perfil
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON admin_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON admin_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  FUNÇÃO HELPER: retorna o client_id do usuário logado        ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION get_my_client_id()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT client_id FROM admin_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PRODUCTS — Políticas isoladas por client_id                 ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Remove policies antigas
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "anon_all_products" ON products;
DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "products_insert_authenticated" ON products;
DROP POLICY IF EXISTS "products_update_authenticated" ON products;
DROP POLICY IF EXISTS "products_delete_authenticated" ON products;

-- Leitura pública (visitantes veem catálogo de todas as lojas via frontend filter)
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

-- INSERT: só authenticated E só no próprio client_id
CREATE POLICY "products_insert_own" ON products
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

-- UPDATE: só authenticated E só registros do próprio client_id
CREATE POLICY "products_update_own" ON products
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

-- DELETE: só authenticated E só registros do próprio client_id
CREATE POLICY "products_delete_own" ON products
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  SITE_CONTENT — Políticas isoladas por client_id             ║
-- ╚══════════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
DROP POLICY IF EXISTS "anon_all_site_content" ON site_content;
DROP POLICY IF EXISTS "content_select_public" ON site_content;
DROP POLICY IF EXISTS "content_insert_authenticated" ON site_content;
DROP POLICY IF EXISTS "content_update_authenticated" ON site_content;
DROP POLICY IF EXISTS "content_delete_authenticated" ON site_content;

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


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  BANNERS — Políticas isoladas por client_id                  ║
-- ╚══════════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "public_read_banners" ON banners;
DROP POLICY IF EXISTS "anon_all_banners" ON banners;
DROP POLICY IF EXISTS "banners_select_public" ON banners;
DROP POLICY IF EXISTS "banners_insert_authenticated" ON banners;
DROP POLICY IF EXISTS "banners_update_authenticated" ON banners;
DROP POLICY IF EXISTS "banners_delete_authenticated" ON banners;

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


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  TESTIMONIALS — Políticas isoladas por client_id             ║
-- ╚══════════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
DROP POLICY IF EXISTS "anon_all_testimonials" ON testimonials;
DROP POLICY IF EXISTS "testimonials_select_public" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert_authenticated" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update_authenticated" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete_authenticated" ON testimonials;

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


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  ORDERS — Isoladas por client_id + checkout público          ║
-- ╚══════════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_all_orders" ON orders;
DROP POLICY IF EXISTS "orders_select_authenticated" ON orders;
DROP POLICY IF EXISTS "orders_insert_public" ON orders;
DROP POLICY IF EXISTS "orders_update_authenticated" ON orders;
DROP POLICY IF EXISTS "orders_delete_authenticated" ON orders;

-- Checkout público: visitante pode criar pedido
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT WITH CHECK (true);

-- Admin lê APENAS pedidos da sua loja
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());

-- Leitura anon de pedidos: NEGADA (visitante não precisa listar pedidos)
-- (Nenhuma policy SELECT para anon = bloqueado por padrão com RLS ativo)

-- Admin atualiza/deleta APENAS pedidos da sua loja
CREATE POLICY "orders_update_own" ON orders
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "orders_delete_own" ON orders
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());
