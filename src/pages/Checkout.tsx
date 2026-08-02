import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, QrCode, ShoppingBag, CheckCircle2, MessageCircle, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as QRCodeLib from 'qrcode';
import { useCartStore } from '@/lib/stores/cartStore';
import { usePaymentStore } from '@/lib/stores/paymentStore';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generatePixPayload, formatPixKeyForPayload } from '@/lib/pix/brcode';
import { trackEvent } from '@/lib/analytics/track';
import { saveOrder } from '@/lib/orders/orderStore';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { spawnRipple } from '@/lib/utils/ripple';

type Step = 'info' | 'payment' | 'success';
type PaymentMethod = 'pix' | 'stripe' | 'mercadopago';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, getItemCount } = useCartStore();
  const { config: paymentConfig } = usePaymentStore();
  const { content } = useContentStore();
  const [step, setStep] = useState<Step>('info');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '', cpf: '' });
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderId] = useState(() => `AI${Date.now().toString(36).toUpperCase()}`);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [pixError, setPixError] = useState<string>('');

  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);
  const total = getTotal();
  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;

  // Detecta retorno de gateway externo (Stripe / Mercado Pago)
  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get('success') === '1' || url.searchParams.get('status') === 'approved';
    const canceled = url.searchParams.get('canceled') === '1' || url.searchParams.get('status') === 'failure';
    const returnOrderId = url.searchParams.get('order') || url.searchParams.get('order_id');

    if (success && returnOrderId) {
      // Limpa query string
      window.history.replaceState({}, '', '/checkout');
      trackEvent('purchase', {
        transaction_id: returnOrderId,
        value: total,
        currency: 'BRL',
      });
      clearCart();
      setStep('success');
    } else if (canceled) {
      window.history.replaceState({}, '', '/checkout');
      alert('Pagamento cancelado. Você pode tentar novamente.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Início do checkout — track event
  useEffect(() => {
    if (items.length > 0) {
      trackEvent('begin_checkout', { value: total, currency: 'BRL', num_items: getItemCount() });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Gera Pix code + QR quando seleciona Pix
  useEffect(() => {
    if (method !== 'pix') return;
    try {
      if (!paymentConfig.pix_key) {
        setPixError('Chave Pix não configurada pelo lojista');
        return;
      }
      const formattedKey = formatPixKeyForPayload(paymentConfig.pix_key, paymentConfig.pix_key_type);
      const code = generatePixPayload({
        pixKey: formattedKey,
        merchantName: paymentConfig.pix_recipient_name || clientConfig.company.name,
        merchantCity: paymentConfig.pix_city || clientConfig.company.location.city,
        amount: total,
        txId: orderId,
      });
      setPixCode(code);
      setPixError('');

      QRCodeLib.toDataURL(code, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 280,
        color: { dark: '#000000', light: '#FFFFFF' },
      })
        .then(setQrDataUrl)
        .catch(() => setPixError('Erro ao gerar QR Code'));
    } catch (err) {
      setPixError(err instanceof Error ? err.message : 'Erro ao gerar Pix');
    }
  }, [method, paymentConfig, total, orderId]);

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fff' }}>
        <div className="text-center space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto" style={{ color: '#ddd' }} />
          <p className="font-bold" style={{ color: '#111' }}>Carrinho vazio</p>
          <PremiumButton onClick={() => navigate('/')} variant="primary" className="text-sm">
            <ArrowLeft className="w-4 h-4" />Voltar à loja
          </PremiumButton>
        </div>
      </div>
    );
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) return;
    trackEvent('add_payment_info', { value: total, currency: 'BRL' });
    setStep('payment');
  };

  const handleStripePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) return;
    setProcessing(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

      if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
        throw new Error('Supabase não configurado. O lojista precisa fazer o deploy da Edge Function stripe-checkout.');
      }

      // Salva info do pedido antes de redirecionar
      saveOrder({
        id: orderId,
        customer: customerInfo,
        items: items.map(i => ({ id: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
        total,
        method: 'stripe',
        status: 'pending_confirmation',
        createdAt: new Date().toISOString(),
      });

      const successUrl = `${window.location.origin}/checkout?success=1&order=${orderId}`;
      const cancelUrl = `${window.location.origin}/checkout?canceled=1`;

      const r = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          items: items.map(i => ({
            name: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image_url ?? undefined,
          })),
          orderId,
          customerEmail: customerInfo.email || undefined,
          successUrl,
          cancelUrl,
        }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }

      const { url } = await r.json();
      if (!url) throw new Error('Stripe não retornou URL de checkout');

      trackEvent('add_payment_info', { method: 'stripe', value: total });
      window.location.href = url;
    } catch (err) {
      setProcessing(false);
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      alert('Erro Stripe: ' + msg);
    }
  };

  const handleMercadoPagoPayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) return;
    setProcessing(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

      if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
        throw new Error('Supabase não configurado. O lojista precisa fazer o deploy da Edge Function mercadopago-checkout.');
      }

      saveOrder({
        id: orderId,
        customer: customerInfo,
        items: items.map(i => ({ id: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
        total,
        method: 'mercadopago',
        status: 'pending_confirmation',
        createdAt: new Date().toISOString(),
      });

      const successUrl = `${window.location.origin}/checkout?success=1&order=${orderId}`;
      const cancelUrl = `${window.location.origin}/checkout?canceled=1`;

      const r = await fetch(`${supabaseUrl}/functions/v1/mercadopago-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.product.id,
            title: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image_url ?? undefined,
          })),
          orderId,
          payer: {
            email: customerInfo.email || undefined,
            name: customerInfo.name,
            phone: customerInfo.phone,
          },
          successUrl,
          cancelUrl,
        }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }

      const { init_point } = await r.json();
      if (!init_point) throw new Error('Mercado Pago não retornou URL');

      trackEvent('add_payment_info', { method: 'mercadopago', value: total });
      window.location.href = init_point;
    } catch (err) {
      setProcessing(false);
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      alert('Erro Mercado Pago: ' + msg);
    }
  };

  const handlePaymentSuccess = (paidMethod: string) => {
    // Salva pedido localmente
    saveOrder({
      id: orderId,
      customer: customerInfo,
      items: items.map(i => ({ id: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
      total,
      method: paidMethod,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString(),
    });

    trackEvent('purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'BRL',
      items: items.map(i => ({ item_id: i.product.id, item_name: i.product.title, price: i.product.price, quantity: i.quantity })),
    });

    setStep('success');
    clearCart();
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const redirectWhatsApp = () => {
    const msg = paymentConfig.redirect_whatsapp_message
      .replace('{orderId}', orderId)
      .replace('{total}', fmt(total))
      .replace('{name}', customerInfo.name);
    const itemsList = items.map(i => `• ${i.quantity}x ${i.product.title}`).join('\n');
    const fullMsg = `${msg}\n\nItens:\n${itemsList}\nTotal: ${fmt(total)}`;
    window.open(`${whatsappUrl}?text=${encodeURIComponent(fullMsg)}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <header className="sticky top-0 z-40" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #eee' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => step === 'info' ? navigate('/') : (step === 'payment' && method ? setMethod(null) : setStep('info'))}
            className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#666' }}>
            <ArrowLeft className="w-4 h-4" />
            {step === 'info' ? 'Voltar à loja' : 'Voltar'}
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" style={{ color: 'hsl(43,96%,45%)' }} />
            <span className="text-sm font-display font-bold" style={{ color: '#111' }}>{getItemCount()} item(s) · {fmt(total)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="sr-only">Finalizar Compra — {clientConfig.company.name} {clientConfig.company.nameHighlight}</h1>
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Dados', 'Pagamento', 'Confirmação'].map((label, i) => {
            const stepIdx = step === 'info' ? 0 : step === 'payment' ? 1 : 2;
            const isActive = i <= stepIdx;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: isActive ? 'hsl(43,96%,52%)' : '#f0f0f0', color: isActive ? '#050505' : '#aaa' }}>
                  {i + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:block" style={{ color: isActive ? 'hsl(43,96%,40%)' : '#bbb' }}>{label}</span>
                {i < 2 && <div className="w-8 h-px" style={{ background: isActive ? 'hsl(43,96%,52%)' : '#eee' }} />}
              </div>
            );
          })}
        </div>

        {/* Step: Info */}
        {step === 'info' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background: '#fafafa', border: '1px solid #eee' }}>
              <h2 className="text-lg font-bold" style={{ color: '#111' }}>Seus dados</h2>
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome completo *</Label>
                    <Input placeholder="João Silva" value={customerInfo.name}
                      onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">WhatsApp *</Label>
                    <Input placeholder="(51) 99999-9999" value={customerInfo.phone}
                      onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" placeholder="joao@email.com" value={customerInfo.email}
                      onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">CPF</Label>
                    <Input placeholder="000.000.000-00" value={customerInfo.cpf}
                      onChange={e => setCustomerInfo(p => ({ ...p, cpf: e.target.value }))} />
                  </div>
                </div>

                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: '#fff', border: '1px solid #eee' }}>
                  <p className="text-xs font-bold mb-3" style={{ color: '#888' }}>Resumo do pedido</p>
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs">
                      <span style={{ color: '#555' }}>{item.quantity}x {item.product.title}</span>
                      <span className="font-bold" style={{ color: '#111' }}>{fmt(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 flex justify-between" style={{ borderTop: '1px solid #eee' }}>
                    <span className="text-sm font-bold" style={{ color: '#111' }}>Total</span>
                    <span className="text-lg font-display font-black" style={{ color: '#111' }}>{fmt(total)}</span>
                  </div>
                </div>

                <PremiumButton type="submit" variant="primary" className="w-full text-sm">
                  Continuar para pagamento <ArrowLeft className="w-4 h-4 rotate-180" />
                </PremiumButton>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step: Choose Payment Method */}
        {step === 'payment' && !method && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl p-6"
              style={{ background: '#fafafa', border: '1px solid #eee' }}>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#111' }}>Escolha o pagamento</h2>
              <p className="text-xs mb-5" style={{ color: '#888' }}>Total: <span className="font-display font-bold" style={{ color: '#111' }}>{fmt(total)}</span></p>

              <div className="space-y-3">
                {paymentConfig.pix_enabled && paymentConfig.pix_key && (
                  <button onClick={(e) => { spawnRipple(e.currentTarget, e.clientX, e.clientY); setMethod('pix'); }} disabled={processing}
                    className="ripple-container w-full flex items-center gap-4 p-4 rounded-xl text-left transition-transform hover:scale-[1.01]"
                    style={{ background: 'hsla(142,71%,45%,0.06)', border: '1px solid hsla(142,71%,45%,0.3)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'hsla(142,71%,45%,0.12)' }}>
                      <QrCode className="w-6 h-6" style={{ color: 'hsl(142,71%,38%)' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#111' }}>Pix</p>
                      <p className="text-xs" style={{ color: '#888' }}>Pagamento instantâneo · Sem taxas</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: 'hsla(142,71%,45%,0.15)', color: 'hsl(142,71%,32%)' }}>Recomendado</span>
                  </button>
                )}

                {paymentConfig.stripe_enabled && paymentConfig.stripe_public_key && (
                  <button onClick={(e) => { spawnRipple(e.currentTarget, e.clientX, e.clientY); handleStripePayment(); }} disabled={processing}
                    className="ripple-container w-full flex items-center gap-4 p-4 rounded-xl text-left transition-transform hover:scale-[1.01]"
                    style={{ background: 'hsla(200,100%,50%,0.05)', border: '1px solid hsla(200,100%,45%,0.25)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'hsla(200,100%,50%,0.1)' }}>
                      <CreditCard className="w-6 h-6" style={{ color: 'hsl(200,100%,42%)' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#111' }}>Cartão de Crédito</p>
                      <p className="text-xs" style={{ color: '#888' }}>Visa, Mastercard, Elo · Stripe</p>
                    </div>
                  </button>
                )}

                {paymentConfig.mercadopago_enabled && paymentConfig.mercadopago_public_key && (
                  <button onClick={(e) => { spawnRipple(e.currentTarget, e.clientX, e.clientY); handleMercadoPagoPayment(); }} disabled={processing}
                    className="ripple-container w-full flex items-center gap-4 p-4 rounded-xl text-left transition-transform hover:scale-[1.01]"
                    style={{ background: 'hsla(200,100%,45%,0.05)', border: '1px solid hsla(200,100%,40%,0.25)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'hsla(200,100%,45%,0.1)' }}>
                      <CreditCard className="w-6 h-6" style={{ color: 'hsl(200,100%,38%)' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#111' }}>Mercado Pago</p>
                      <p className="text-xs" style={{ color: '#888' }}>Cartão, boleto, saldo MP</p>
                    </div>
                  </button>
                )}

                {!paymentConfig.pix_enabled && !paymentConfig.stripe_enabled && !paymentConfig.mercadopago_enabled && (
                  <div className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: 'hsla(0,84%,60%,0.05)', border: '1px solid hsla(0,84%,55%,0.25)' }}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(0,84%,50%)' }} />
                    <p className="text-xs" style={{ color: 'hsl(0,84%,42%)' }}>Nenhum método de pagamento configurado. Acesse o admin para configurar.</p>
                  </div>
                )}
              </div>

              {processing && (
                <div className="flex items-center justify-center gap-2 mt-6" style={{ color: 'hsl(43,96%,42%)' }}>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-semibold">Processando...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step: Pix QR Code */}
        {step === 'payment' && method === 'pix' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background: '#fafafa', border: '1px solid hsla(142,71%,45%,0.25)' }}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'hsla(142,71%,45%,0.12)', border: '1px solid hsla(142,71%,45%,0.3)' }}>
                  <QrCode className="w-7 h-7" style={{ color: 'hsl(142,71%,38%)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#111' }}>Pague com Pix</h2>
                <p className="text-xs mt-1" style={{ color: '#888' }}>Escaneie o QR ou copie o código</p>
              </div>

              {pixError ? (
                <div className="p-4 rounded-xl flex items-center gap-3"
                  style={{ background: 'hsla(0,84%,60%,0.05)', border: '1px solid hsla(0,84%,55%,0.25)' }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(0,84%,50%)' }} />
                  <p className="text-xs" style={{ color: 'hsl(0,84%,42%)' }}>{pixError}</p>
                </div>
              ) : (
                <>
                  {/* QR Code */}
                  {qrDataUrl && (
                    <div className="flex justify-center">
                      <div className="p-3 rounded-2xl" style={{ background: '#fff', border: '1px solid #eee' }}>
                        <img src={qrDataUrl} alt="QR Code Pix" className="w-56 h-56" />
                      </div>
                    </div>
                  )}

                  {/* Valor */}
                  <div className="text-center p-4 rounded-xl"
                    style={{ background: 'hsla(142,71%,45%,0.06)', border: '1px solid hsla(142,71%,45%,0.25)' }}>
                    <p className="text-xs" style={{ color: 'hsl(142,71%,38%)' }}>Valor a pagar</p>
                    <p className="text-2xl font-display font-black" style={{ color: 'hsl(142,71%,32%)' }}>{fmt(total)}</p>
                  </div>

                  {/* Pix Copia e Cola */}
                  <div className="space-y-2">
                    <Label className="text-xs" style={{ color: '#888' }}>Pix Copia e Cola</Label>
                    <div className="relative">
                      <div className="p-3 pr-24 rounded-xl text-[10px] font-mono break-all max-h-24 overflow-y-auto"
                        style={{ background: '#fff', border: '1px solid #eee', color: '#555' }}>
                        {pixCode}
                      </div>
                      <button onClick={copyPix}
                        className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{ background: copied ? 'hsla(142,71%,45%,0.15)' : 'hsla(43,96%,52%,0.12)', border: `1px solid ${copied ? 'hsla(142,71%,45%,0.4)' : 'hsla(43,96%,52%,0.3)'}`, color: copied ? 'hsl(142,71%,32%)' : 'hsl(43,96%,40%)' }}>
                        {copied ? <><Check className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 rounded-xl text-xs space-y-1"
                    style={{ background: 'hsla(43,96%,52%,0.05)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
                    <p style={{ color: '#777' }}><strong style={{ color: '#333' }}>Destinatário:</strong> {paymentConfig.pix_recipient_name}</p>
                    <p style={{ color: '#777' }}><strong style={{ color: '#333' }}>Pedido:</strong> #{orderId}</p>
                  </div>

                  <PremiumButton onClick={() => handlePaymentSuccess('pix')} variant="primary" className="w-full text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Já paguei
                  </PremiumButton>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="rounded-2xl p-8 text-center space-y-5"
              style={{ background: '#fafafa', border: '1px solid hsla(142,71%,45%,0.3)' }}>
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'hsla(142,71%,45%,0.12)', border: '1px solid hsla(142,71%,45%,0.3)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: 'hsl(142,71%,38%)' }} />
              </div>
              <h2 className="text-xl font-black" style={{ color: '#111' }}>Pedido Confirmado!</h2>
              <p className="text-sm" style={{ color: '#777' }}>
                Pedido <span className="font-bold" style={{ color: 'hsl(43,96%,40%)' }}>#{orderId}</span> registrado com sucesso.
              </p>

              {paymentConfig.redirect_whatsapp_after_payment && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs" style={{ color: '#999' }}>
                    Envie o comprovante pelo WhatsApp para agilizar a entrega:
                  </p>
                  <PremiumButton onClick={redirectWhatsApp} variant="primary" className="w-full text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Enviar comprovante no WhatsApp
                  </PremiumButton>
                </div>
              )}

              <PremiumButton onClick={() => navigate('/')} variant="secondary"
                className="w-full py-2.5 text-sm font-semibold">
                Voltar à loja
              </PremiumButton>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
