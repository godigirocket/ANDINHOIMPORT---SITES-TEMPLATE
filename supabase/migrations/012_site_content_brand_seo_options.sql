-- Add editable brand and SEO options used by the admin content panel.

ALTER TABLE site_content ADD COLUMN IF NOT EXISTS seo_canonical_url TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS seo_robots TEXT DEFAULT 'index, follow';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS seo_og_image TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS favicon_url TEXT;

