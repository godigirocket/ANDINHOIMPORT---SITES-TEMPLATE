# Edge Functions — Pagamento Online

Edge Functions do Supabase para processar pagamentos com Stripe e Mercado Pago.

## Pré-requisitos

1. Conta no Supabase: https://supabase.com
2. Supabase CLI instalado:
   ```bash
   npm install -g supabase
   ```
3. Login no CLI:
   ```bash
   supabase login
   ```
4. Vincular ao projeto:
   ```bash
   supabase link --project-ref SEU_PROJECT_REF
   ```
   (Pegue o ref na URL do dashboard: `https://supabase.com/dashboard/project/SEU_REF/...`)

---

## 1. Stripe

### Setup

1. Crie conta em https://stripe.com
2. Pegue a **Secret Key** em https://dashboard.stripe.com/apikeys (formato `sk_live_...` ou `sk_test_...`)
3. Configure como secret no Supabase:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_AAAAAAAA
   ```
4. Deploy da função:
   ```bash
   supabase functions deploy stripe-checkout --no-verify-jwt
   ```

### URL pública

Após o deploy, a função fica disponível em:
```
https://SEU_PROJECT_REF.supabase.co/functions/v1/stripe-checkout
```

---

## 2. Mercado Pago

### Setup

1. Crie aplicação em https://www.mercadopago.com.br/developers/panel
2. Pegue o **Access Token** (formato `APP_USR-...`)
3. Configure como secret:
   ```bash
   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-AAAAAAAAA
   ```
4. Deploy:
   ```bash
   supabase functions deploy mercadopago-checkout --no-verify-jwt
   ```

---

## Como o frontend usa

O frontend chama essas funções automaticamente quando o usuário escolhe Cartão (Stripe) ou Mercado Pago no checkout. Não precisa fazer mais nada além do deploy.

---

## Webhooks (recomendado para produção)

Para confirmar pagamentos em tempo real, configure webhooks:

### Stripe
1. Em https://dashboard.stripe.com/webhooks, adicione endpoint:
   `https://SEU_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
2. Eventos: `checkout.session.completed`, `payment_intent.succeeded`
3. Deploy a função `stripe-webhook` (a criar separadamente)

### Mercado Pago
1. Em https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. URL: `https://SEU_PROJECT_REF.supabase.co/functions/v1/mercadopago-webhook`
3. Tópicos: `payment`
