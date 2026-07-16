-- ============================================================================
-- Migration 003 — Criar admin user para um novo cliente
--
-- INSTRUÇÕES:
--   Execute este SQL NO SQL EDITOR do Supabase para CADA NOVO CLIENTE.
--   Substitua os valores entre {{ }} pelos dados reais.
--
-- PRÉ-REQUISITO:
--   - Migration 001 e 002 já executadas
--   - Email provider habilitado em Authentication → Settings
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PASSO 1: Criar o usuário no Supabase Auth                   ║
-- ║                                                              ║
-- ║  OPÇÃO A: Pelo Dashboard (mais fácil)                        ║
-- ║    → Authentication → Users → Add User                       ║
-- ║    → Email: admin@sualoja.com                                ║
-- ║    → Senha: SenhaForte123!                                   ║
-- ║    → Marcar "Auto Confirm"                                   ║
-- ║                                                              ║
-- ║  OPÇÃO B: Via SQL (abaixo)                                   ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Descomente e substitua para criar via SQL:
-- 
-- INSERT INTO auth.users (
--   instance_id, id, aud, role, email, encrypted_password,
--   email_confirmed_at, created_at, updated_at, confirmation_token
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   '{{ADMIN_EMAIL}}',
--   crypt('{{ADMIN_PASSWORD}}', gen_salt('bf')),
--   NOW(), NOW(), NOW(), ''
-- );


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  PASSO 2: Vincular o usuário ao client_id da loja            ║
-- ║                                                              ║
-- ║  Substitua:                                                  ║
-- ║    {{USER_ID}} → ID do usuário criado no passo 1             ║
-- ║                  (copie de Authentication → Users)            ║
-- ║    {{CLIENT_ID}} → Mesmo valor de clientConfig.id            ║
-- ║                    (ex: 'andinho-import')                     ║
-- ╚══════════════════════════════════════════════════════════════╝

-- INSERT INTO admin_profiles (user_id, client_id, name)
-- VALUES (
--   '{{USER_ID}}',
--   '{{CLIENT_ID}}',
--   '{{ADMIN_NAME}}'
-- );


-- ============================================================================
-- EXEMPLO COMPLETO para a loja Andinho Import:
-- 
-- (Após criar o user no Dashboard e copiar o UUID dele)
--
-- INSERT INTO admin_profiles (user_id, client_id, name)
-- VALUES (
--   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- UUID do user criado
--   'andinho-import',                          -- clientConfig.id
--   'Anderson'                                 -- Nome do admin
-- );
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════╗
-- ║  VERIFICAÇÃO: Confirmar que tudo está correto                ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Listar todos os admins vinculados:
-- SELECT ap.client_id, ap.name, u.email
-- FROM admin_profiles ap
-- JOIN auth.users u ON u.id = ap.user_id;

-- Testar a função get_my_client_id() (rode como o user autenticado):
-- SELECT get_my_client_id();
-- → Deve retornar o client_id vinculado ao user logado
