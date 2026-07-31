-- ============================================================================
-- Migration 005 — Galeria do Instagram (posts reais, multi-tenant)
--
-- A página admin de Instagram gerenciava posts só em localStorage, sem
-- nenhuma tabela — nada aparecia no site público. Esta tabela substitui
-- isso, seguindo o mesmo padrão de client_id + RLS usado em banners/testimonials.
-- ============================================================================

CREATE TABLE IF NOT EXISTS instagram_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   TEXT NOT NULL DEFAULT 'default',
  img         TEXT NOT NULL,
  url         TEXT,
  caption     TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_client_id ON instagram_posts(client_id);

ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- DROP + CREATE (em vez de só CREATE) pra ser seguro rodar de novo caso
-- uma tentativa anterior tenha parado no meio.
DROP POLICY IF EXISTS "instagram_posts_select_public" ON instagram_posts;
DROP POLICY IF EXISTS "instagram_posts_insert_own" ON instagram_posts;
DROP POLICY IF EXISTS "instagram_posts_update_own" ON instagram_posts;
DROP POLICY IF EXISTS "instagram_posts_delete_own" ON instagram_posts;

CREATE POLICY "instagram_posts_select_public" ON instagram_posts
  FOR SELECT USING (true);

CREATE POLICY "instagram_posts_insert_own" ON instagram_posts
  FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "instagram_posts_update_own" ON instagram_posts
  FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "instagram_posts_delete_own" ON instagram_posts
  FOR DELETE TO authenticated
  USING (client_id = get_my_client_id());
