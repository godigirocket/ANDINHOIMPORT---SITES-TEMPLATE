-- Runtime settings that must be persisted per client, never in the browser.

ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS payment_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS taxonomy_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}'::jsonb;
