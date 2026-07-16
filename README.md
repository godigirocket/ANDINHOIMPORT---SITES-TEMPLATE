# Andinho Import — Landing Page + Painel Admin

---

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Supabase (Database + Storage + RLS)
- Zustand (State Management)
- Zod (Validação)

## Setup Rápido

```sh
# 1. Instale as dependências
npm install

# 2. Configure o .env
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Execute os SQLs no Supabase SQL Editor (ordem importa)
# → supabase/migrations/001_initial_schema.sql
# → supabase/migrations/002_enable_anon_write.sql

# 4. Rode o projeto
npm run dev
```

## Supabase — Configuração Obrigatória

O Supabase é a **ÚNICA fonte de verdade** para dados. Sem ele:
- Produtos, pedidos, conteúdo NÃO persistem entre dispositivos
- O painel admin mostra aviso de erro

### Variáveis de ambiente (.env)
```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### ⚠️ Importante para produção (Vercel/Netlify)
Essas mesmas variáveis precisam estar configuradas no painel da hospedagem:
- Vercel: Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

### Supabase Free — Evitar Pausa
O plano gratuito pausa após 7 dias sem uso. O GitHub Action em
`.github/workflows/keep-alive.yml` faz ping a cada 3 dias automaticamente.
Configure os secrets no GitHub:
- `SUPABASE_URL` → mesma URL do .env
- `SUPABASE_ANON_KEY` → mesma key do .env

## Estratégia de Dados: 1 Projeto por Cliente vs Multi-Tenant

### Recomendado (início): 1 projeto Supabase por cliente
- Isolamento total (zero risco de vazamento entre lojas)
- Cada cliente tem seu .env com URL/key próprias
- Mais simples de gerenciar
- Limite: 2 projetos free por conta Supabase

### Escala futura: 1 projeto compartilhado com RLS
- Todas as lojas no mesmo banco, filtradas por `client_id`
- Execute `003_multi_tenant_store_id.sql` para ativar
- Cada deploy tem seu `client_id` no `src/config/client.ts`
- Economiza projetos Supabase, mas exige mais cuidado com RLS

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

## Deploy

```sh
npm run build
```

O build gera a pasta `dist/` pronta para deploy em Vercel, Netlify ou qualquer hosting estático.

Arquivos de configuração incluídos:
- `vercel.json` — rewrites para SPA
- `public/_redirects` — fallback para Netlify

## Painel Admin

Acesse `/admin/login` com as credenciais configuradas em `src/config/client.ts`.

## Personalização para novo cliente

1. Duplique o projeto
2. Edite `src/config/client.ts` com os dados do novo cliente
3. Personalize cores, logo e textos
4. Configure integrações (opcional):
   - **Tawk.to** (chat grátis): Edite `src/components/TawkToChat.tsx`
   - **Google Analytics**: Admin → Analytics
   - **Meta Pixel**: Admin → Analytics
5. Faça deploy
2. Edite `src/config/client.ts` — nome, cores, logo, contato
3. Execute o SQL no Supabase do novo projeto
4. Deploy

---

© 2025 DigiRocket Developers · Todos os direitos reservados
