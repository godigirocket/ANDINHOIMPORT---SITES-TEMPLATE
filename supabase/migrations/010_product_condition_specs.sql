-- ============================================================================
-- Migration 010 — Campos estruturados de condição/especificação do produto
--
-- Antes, "128GB" / "seminovo" / "azul" só existiam como texto solto dentro
-- de title/description — impossível filtrar, comparar ou mostrar de forma
-- consistente. Adiciona campos reais, todos NULLABLE (produto existente
-- continua funcionando sem preenchê-los — o frontend mostra "não informado"
-- em vez de inventar o dado).
-- ============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS condition TEXT; -- 'novo' | 'seminovo' | null
ALTER TABLE products ADD COLUMN IF NOT EXISTS storage_gb INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS battery_health_pct INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_days INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS accessories_included TEXT; -- texto livre: "Carregador, caixa original"

CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_storage_gb ON products(storage_gb);
