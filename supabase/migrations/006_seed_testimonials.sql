-- ============================================================================
-- Migration 006 — Popula depoimentos reais para o client_id 'andinho-import'
--
-- Os depoimentos exibidos no site sempre foram um fallback local
-- (hardcoded no componente), nunca dados reais do Supabase — por isso
-- nunca apareciam no painel admin para editar. Esta migration insere
-- esses mesmos textos como linhas reais, editáveis a partir de agora.
--
-- Roda só se ainda não houver nenhum depoimento para este client_id
-- (seguro de rodar mais de uma vez).
-- ============================================================================

INSERT INTO testimonials (client_id, name, text, avatar_url, rating, active)
SELECT 'andinho-import', v.name, v.text, NULL, 5, true
FROM (VALUES
  ('Carlos M.',  'iPhone 15 Pro Max chegou em 2 dias, lacrado e com nota. Atendimento impecável pelo WhatsApp.'),
  ('Ana Paula',  'Parcelei em 18x sem juros. Xiaomi 14 Ultra perfeito, exatamente como descrito.'),
  ('Rafael T.',  'Terceira compra aqui. Sempre original, preço justo e entrega rápida. Confiança total.'),
  ('Juliana K.', 'Apple Watch lacrado com nota fiscal. Pix com 5% de desconto, super tranquilo.')
) AS v(name, text)
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE client_id = 'andinho-import'
);
