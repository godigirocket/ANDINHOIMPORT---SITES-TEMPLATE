-- ============================================================================
-- Migration 009 — Atualiza badge/subtítulo do Hero pro texto novo
--
-- O conteúdo do Hero é editável pelo admin (Conteúdo → Hero) e fica salvo
-- em site_content — por isso qualquer mudança no texto padrão do código
-- não aparece no site: o valor salvo no banco tem prioridade. Esta migration
-- atualiza o texto salvo pro novo posicionamento (foco em reduzir o medo de
-- comprar aparelho usado/seminovo, em vez de só listar marcas).
--
-- Alternativa: Admin → Conteúdo → aba Hero → campo "Badge" e "Subtítulo".
-- ============================================================================

UPDATE site_content
SET hero_badge = 'CURADORIA CRITERIOSA',
    hero_subtitle = 'Cada aparelho é revisado e testado antes de chegar até você. Procedência verificada, garantia real e parcelamento em até 18x — sem letra miúda.'
WHERE client_id = 'andinho-import';
