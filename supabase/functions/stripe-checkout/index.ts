// ============================================================================
// Supabase Edge Function: stripe-checkout
// Cria uma Stripe Checkout Session e retorna a URL de pagamento.
//
// DEPLOY:
//   1. Instale Supabase CLI: npm i -g supabase
//   2. Login: supabase login
//   3. Link: supabase link --project-ref SEU_REF
//   4. Configure secrets:
//        supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   5. Deploy:
//        supabase functions deploy stripe-checkout --no-verify-jwt
//
// USO no frontend:
//   const r = await fetch(`${VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ items, orderId, successUrl, cancelUrl }),
//   });
//   const { url } = await r.json();
//   window.location.href = url;
// ============================================================================

// @ts-nocheck — roda em Deno, não em Node
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  items: Array<{ name: string; price: number; quantity: number; image?: string }>;
  orderId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY não configurada' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: CheckoutRequest = await req.json();
    const { items, orderId, customerEmail, successUrl, cancelUrl } = body;

    if (!items?.length) {
      return new Response(JSON.stringify({ error: 'Items vazio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // centavos
        },
        quantity: item.quantity,
      })),
      customer_email: customerEmail,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: cancelUrl,
      metadata: { order_id: orderId },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Erro desconhecido' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
