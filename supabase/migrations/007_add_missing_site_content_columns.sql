-- ============================================================================
-- Migration 007 — Colunas que o código sempre esperou mas nunca existiram
-- na tabela site_content: instagram_enabled e instagram_photo.
--
-- Isso causava o erro "Could not find the 'instagram_enabled' column of
-- 'site_content' in the schema cache" ao salvar em Conteúdo do Site.
-- ============================================================================

ALTER TABLE site_content ADD COLUMN IF NOT EXISTS instagram_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS instagram_photo TEXT;
