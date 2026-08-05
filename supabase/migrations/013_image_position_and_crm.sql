-- Image framing controls used by the admin preview/grid.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS hero_image_position TEXT DEFAULT '64% 50%';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS instagram_image_position TEXT DEFAULT 'center';

-- Lightweight CRM for landing-page clients. Optional: the app also works with localStorage.
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  source TEXT DEFAULT 'whatsapp',
  interest TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_select_own" ON leads;
DROP POLICY IF EXISTS "leads_insert_own" ON leads;
DROP POLICY IF EXISTS "leads_update_own" ON leads;
DROP POLICY IF EXISTS "leads_delete_own" ON leads;

CREATE POLICY "leads_select_own" ON leads
  FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::json->>'client_id');

CREATE POLICY "leads_insert_own" ON leads
  FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::json->>'client_id');

CREATE POLICY "leads_update_own" ON leads
  FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::json->>'client_id');

CREATE POLICY "leads_delete_own" ON leads
  FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::json->>'client_id');
