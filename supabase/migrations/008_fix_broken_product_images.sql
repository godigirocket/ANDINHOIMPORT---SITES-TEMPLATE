-- ============================================================================
-- Migration 008 — Corrige imagens de produto hotlinkadas do Google Shopping
--
-- 2 dos 3 produtos reais no catálogo ao vivo usam image_url apontando pra
-- thumbnails do Google Shopping (encrypted-tbn1.gstatic.com/shopping?q=...).
-- Isso não é uma fonte de imagem estável: são thumbnails internos do buscador
-- do Google, não licenciados pra uso externo, e podem parar de funcionar a
-- qualquer momento sem aviso — além de ficarem distorcidos/cortados estranho
-- quando exibidos grandes nos cards (era exatamente o visual "quebrado" que
-- apareceu na auditoria).
--
-- PLACEHOLDER: as fotos abaixo são temporárias (stock verificado, condiz com
-- a cor/modelo descrito) até você subir fotos reais dos aparelhos via
-- Admin → Produtos → editar → upload de imagem.
-- ============================================================================

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=85&auto=format&fit=crop'
WHERE id = '4e18baed-9461-4928-bc3c-3580074ece83'; -- IPHONE 14 (Azul)

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=85&auto=format&fit=crop'
WHERE id = 'ed6ebd41-ce6f-47bd-8d72-e7c3bea950c5'; -- iPhone 15 Pro Max 256GB
