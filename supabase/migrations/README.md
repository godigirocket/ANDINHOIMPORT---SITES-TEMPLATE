# Migrations — ordem, dependências e efeito de cada uma

Rode em ordem numérica no Supabase SQL Editor. Todas de `002` em diante são
**idempotentes** (seguras de rodar mais de uma vez) — usam `IF NOT EXISTS`,
`DROP POLICY IF EXISTS` antes de recriar, ou `WHERE NOT EXISTS` nos inserts.
Nenhuma delete dados existentes; nenhuma é destrutiva.

| # | Depende de | O que faz | Destrutiva? | Já rodou? |
|---|---|---|---|---|
| 001 | — | Schema inicial: `site_content`, `banners`, `testimonials`, `products`, `orders` | Não | Sim (base do projeto) |
| 002 | 001 | RLS multi-tenant: `admin_profiles`, `get_my_client_id()`, policies por `client_id` | Não | Sim |
| 003 | 002 | Cria usuário admin inicial | Não | Sim |
| 004 | 002 | Corrige policies duplicadas de uma tentativa anterior | Não | Sim |
| 005 | 002 | Cria tabela `instagram_posts` (galeria do Instagram) | Não | **Pendente** |
| 006 | 001 | Popula depoimentos reais (mesmos textos que já apareciam fixos no site) | Não | **Pendente** |
| 007 | 001 | Adiciona colunas `instagram_enabled`/`instagram_photo` que faltavam em `site_content` | Não | **Pendente** |
| 008 | 001 | Troca 2 imagens de produto quebradas (hotlink do Google Shopping) por placeholder de estoque | Não (só UPDATE, mesmas linhas) | **Pendente** |
| 009 | 001 | Atualiza badge/subtítulo do Hero salvos no banco | Não (só UPDATE) | **Pendente** |
| 010 | 001 | Adiciona colunas `condition`, `storage_gb`, `battery_health_pct`, `color` em `products` (todas nullable — não quebra nada existente) | Não | **Pendente** |

## Por que o frontend não pode depender de nenhuma delas ter rodado

O código sempre trata essas colunas/tabelas como **opcionais**: se a coluna
não existir ainda ou vier `null`, a interface cai num fallback visível (nunca
erro, nunca tela em branco) — ver `src/lib/utils/productFallbacks.ts`.
Isso significa que é seguro fazer deploy do frontend antes de rodar as
migrations; elas só "destravam" informação que já tem um fallback decente.

## Efeito de rodar tudo, em uma frase cada

- **005+006**: depoimentos e galeria do Instagram passam a ser editáveis de verdade pelo admin.
- **007**: o toggle "mostrar seção Instagram" e a foto configurada param de dar erro ao salvar.
- **008**: as 2 fotos de produto quebradas (Google Shopping) saem, entram fotos de estoque limpas — **ainda é placeholder**, troque por fotos reais quando tiver.
- **009**: o texto do Hero passa a refletir o novo posicionamento (procedência/curadoria) em vez do texto genérico salvo antes.
- **010**: catálogo, página de produto e comparação passam a mostrar condição/armazenamento/bateria/cor reais quando o admin preencher — até lá, mostram "não informado" (nunca inventam o dado).
