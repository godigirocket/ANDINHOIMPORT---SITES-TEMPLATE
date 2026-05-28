# Andinho Import — Landing Page + Painel Admin

Desenvolvido por **DigiRocket Developers** · [@GODIGIROCKET](https://www.instagram.com/GODIGIROCKET)

---

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Supabase (Database + Storage + RLS)
- Zustand (State Management)
- Zod (Validação)

## Setup

```sh
# 1. Clone o repositório
git clone https://github.com/godigirocket/ANDINHOIMPORT.git
cd ANDINHOIMPORT

# 2. Instale as dependências
npm install

# 3. Configure o Supabase
# Copie .env.example para .env e preencha com suas credenciais
cp .env.example .env

# 4. Execute o SQL no Supabase SQL Editor
# Cole o conteúdo de supabase/migrations/001_initial_schema.sql

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
2. Edite `src/config/client.ts` — nome, cores, logo, contato
3. Execute o SQL no Supabase do novo projeto
4. Deploy

---

© 2025 DigiRocket Developers · Todos os direitos reservados
