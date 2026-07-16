// ============================================================================
// Supabase Edge Function: mercadopago-checkout
// Cria uma Preference do Mercado Pago e retorna o init_point (URL).
//
// DEPLOY:
//   1. supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
//   2. supabase functions deploy mercadopago-checkout --no-verify-jwt
//
// USO no frontend:
//   const r = await fetch(`${VITE_SUPABASE_URL}/functions/v1/mercadopago-checkout`, {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ items, orderId, payer, successUrl, cancelUrl }),
//   });
//   const { init_point } = await r.json();
//   window.location.href = init_point;
// ============================================================================

// @ts-nocheck — roda em Deno
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const MP_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  items: Array<{ id: string; title: string; price: number; quantity: number; image?: string }>;
  orderId: string;
  payer?: { email?: string; name?: string; phone?: string };
  successUrl: string;
  cancelUrl: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!MP_TOKEN) {
    return new Response(JSON.stringify({ error: 'MERCADOPAGO_ACCESS_TOKEN não configurado' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: CheckoutRequest = await req.json();
    const { items, orderId, payer, successUrl, cancelUrl } = body;

    const preference = {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        unit_price: Number(item.price.toFixed(2)),
        quantity: item.quantity,
        currency_id: 'BRL',
        picture_url: item.image,
      })),
      payer: payer ? {
        email: payer.email,
        name: payer.name,
        phone: payer.phone ? { number: payer.phone } : undefined,
      } : undefined,
      back_urls: {
        success: `${successUrl}?status=approved&order_id=${orderId}`,
        failure: `${cancelUrl}?status=failure&order_id=${orderId}`,
        pending: `${successUrl}?status=pending&order_id=${orderId}`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      statement_descriptor: 'PEDIDO',
    };

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await r.json();

    if (!r.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Erro Mercado Pago', details: data }), {
        status: r.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      preferenceId: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Erro desconhecido' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
