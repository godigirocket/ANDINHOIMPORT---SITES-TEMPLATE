import { useState, useEffect } from 'react';
import { Save, Loader2, Info, QrCode, CreditCard, MessageCircle, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePaymentStore, type PaymentConfig } from '@/lib/stores/paymentStore';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl"
      style={{ background: 'hsla(43,96%,52%,0.06)', border: '1px solid hsla(43,96%,52%,0.18)' }}>
      <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{text}</p>
    </div>
  );
}

export default function AdminPayments() {
  const { config, saveConfig } = usePaymentStore();
  const [form, setForm] = useState<PaymentConfig>(config);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(config); }, [config]);

  const handleSave = () => {
    setSaving(true);
    saveConfig(form);
    setTimeout(() => {
      setSaving(false);
      toast.success('Configurações de pagamento salvas');
    }, 300);
  };

  const set = <K extends keyof PaymentConfig>(key: K, value: PaymentConfig[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Pagamentos</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              Configure como seus clientes pagam
            </p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 text-sm disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar</>}
          </button>
        </div>

        {/* Modo de venda */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.15)' }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Modo de Venda
          </h3>
          <InfoBox text="WhatsApp: o botão do produto abre conversa no WhatsApp (lead). Checkout: o cliente adiciona ao carrinho e paga online." />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => set('mode', 'whatsapp')}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: form.mode === 'whatsapp' ? 'hsla(142,71%,45%,0.1)' : 'hsla(220,20%,10%,0.8)',
                border: `2px solid ${form.mode === 'whatsapp' ? 'hsla(142,71%,45%,0.5)' : 'hsla(255,255%,255%,0.08)'}`,
              }}>
              <MessageCircle className={`w-6 h-6 mb-2 ${form.mode === 'whatsapp' ? 'text-green-400' : 'text-white/30'}`} />
              <p className={`text-sm font-bold ${form.mode === 'whatsapp' ? 'text-green-400' : 'text-white/60'}`}>WhatsApp</p>
              <p className="text-[10px] text-white/40 mt-0.5">Lead direto no WhatsApp</p>
            </button>
            <button
              onClick={() => set('mode', 'checkout')}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: form.mode === 'checkout' ? 'hsla(43,96%,52%,0.1)' : 'hsla(220,20%,10%,0.8)',
                border: `2px solid ${form.mode === 'checkout' ? 'hsla(43,96%,52%,0.5)' : 'hsla(255,255%,255%,0.08)'}`,
              }}>
              <ShoppingCart className={`w-6 h-6 mb-2 ${form.mode === 'checkout' ? 'text-primary' : 'text-white/30'}`} />
              <p className={`text-sm font-bold ${form.mode === 'checkout' ? 'text-primary' : 'text-white/60'}`}>Checkout Online</p>
              <p className="text-[10px] text-white/40 mt-0.5">Carrinho + pagamento</p>
            </button>
          </div>
        </div>

        {/* Pix */}
        {form.mode === 'checkout' && (
          <>
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(142,71%,45%,0.12)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'hsla(142,71%,45%,0.12)' }}>
                    <QrCode className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Pix</p>
                    <p className="text-xs text-white/40">Pagamento instantâneo</p>
                  </div>
                </div>
                <Switch checked={form.pix_enabled} onCheckedChange={v => set('pix_enabled', v)} />
              </div>

              {form.pix_enabled && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tipo da Chave</Label>
                      <select value={form.pix_key_type}
                        onChange={e => set('pix_key_type', e.target.value as PaymentConfig['pix_key_type'])}
                        className="w-full h-9 rounded-lg px-3 text-xs bg-input border border-border text-foreground">
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                        <option value="email">Email</option>
                        <option value="phone">Telefone</option>
                        <option value="random">Chave Aleatória</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Chave Pix *</Label>
                      <Input placeholder="Sua chave pix" value={form.pix_key}
                        onChange={e => set('pix_key', e.target.value)} className="text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome do Recebedor</Label>
                      <Input placeholder="Nome completo ou razão social" value={form.pix_recipient_name}
                        onChange={e => set('pix_recipient_name', e.target.value)} className="text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Cidade</Label>
                      <Input placeholder="Estância Velha" value={form.pix_city}
                        onChange={e => set('pix_city', e.target.value)} className="text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stripe */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(200,100%,60%,0.12)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'hsla(200,100%,60%,0.12)' }}>
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Stripe</p>
                    <p className="text-xs text-white/40">Cartão de crédito · Aceita do mundo todo</p>
                  </div>
                </div>
                <Switch checked={form.stripe_enabled} onCheckedChange={v => set('stripe_enabled', v)} />
              </div>

              {form.stripe_enabled && (
                <div className="space-y-3 pt-2">
                  <InfoBox text="O Stripe precisa de uma Edge Function rodando no Supabase. Veja o passo a passo abaixo." />
                  <details className="rounded-xl p-3"
                    style={{ background: 'hsla(220,20%,9%,0.5)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                    <summary className="text-xs font-semibold cursor-pointer text-white/70 hover:text-white">
                      📘 Como ativar o Stripe (passo a passo)
                    </summary>
                    <ol className="text-xs mt-3 space-y-2 pl-4 list-decimal" style={{ color: 'hsla(45,20%,96%,0.6)' }}>
                      <li>Crie conta em <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com</a></li>
                      <li>Pegue a <strong className="text-white/80">Secret Key</strong> em <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dashboard.stripe.com/apikeys</a> (começa com sk_)</li>
                      <li>Instale o Supabase CLI: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>npm i -g supabase</code></li>
                      <li>Login: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>supabase login</code></li>
                      <li>Configure o secret: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>supabase secrets set STRIPE_SECRET_KEY=sk_live_...</code></li>
                      <li>Deploy: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>supabase functions deploy stripe-checkout --no-verify-jwt</code></li>
                      <li>Cole abaixo a <strong className="text-white/80">Publishable Key</strong> (começa com pk_)</li>
                    </ol>
                  </details>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Stripe Publishable Key (pk_...)</Label>
                    <Input placeholder="pk_live_..." value={form.stripe_public_key}
                      onChange={e => set('stripe_public_key', e.target.value)} className="text-xs font-mono" />
                  </div>
                </div>
              )}
            </div>

            {/* Mercado Pago */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(200,100%,50%,0.12)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'hsla(200,100%,50%,0.12)' }}>
                    <CreditCard className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Mercado Pago</p>
                    <p className="text-xs text-white/40">Cartão, boleto, saldo MP, Pix</p>
                  </div>
                </div>
                <Switch checked={form.mercadopago_enabled} onCheckedChange={v => set('mercadopago_enabled', v)} />
              </div>

              {form.mercadopago_enabled && (
                <div className="space-y-3 pt-2">
                  <InfoBox text="O Mercado Pago precisa de uma Edge Function rodando no Supabase." />
                  <details className="rounded-xl p-3"
                    style={{ background: 'hsla(220,20%,9%,0.5)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                    <summary className="text-xs font-semibold cursor-pointer text-white/70 hover:text-white">
                      📘 Como ativar o Mercado Pago (passo a passo)
                    </summary>
                    <ol className="text-xs mt-3 space-y-2 pl-4 list-decimal" style={{ color: 'hsla(45,20%,96%,0.6)' }}>
                      <li>Crie aplicação em <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mercadopago.com.br/developers/panel</a></li>
                      <li>Pegue o <strong className="text-white/80">Access Token</strong> (começa com APP_USR-)</li>
                      <li>Configure: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-...</code></li>
                      <li>Deploy: <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'hsla(220,20%,15%,1)' }}>supabase functions deploy mercadopago-checkout --no-verify-jwt</code></li>
                      <li>Cole abaixo a <strong className="text-white/80">Public Key</strong> da sua aplicação</li>
                    </ol>
                  </details>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mercado Pago Public Key</Label>
                    <Input placeholder="APP_USR-..." value={form.mercadopago_public_key}
                      onChange={e => set('mercadopago_public_key', e.target.value)} className="text-xs font-mono" />
                  </div>
                </div>
              )}
            </div>

            {/* Pós-pagamento */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Pós-Pagamento
              </h3>
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                <div>
                  <Label className="text-xs">Redirecionar para WhatsApp após pagamento</Label>
                  <p className="text-[10px] text-white/40">Cliente envia comprovante automaticamente</p>
                </div>
                <Switch checked={form.redirect_whatsapp_after_payment}
                  onCheckedChange={v => set('redirect_whatsapp_after_payment', v)} />
              </div>
              {form.redirect_whatsapp_after_payment && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Mensagem pós-pagamento</Label>
                  <Input value={form.redirect_whatsapp_message}
                    onChange={e => set('redirect_whatsapp_message', e.target.value)} className="text-xs" />
                  <p className="text-[10px] text-white/30">Variáveis: {'{orderId}'}, {'{total}'}, {'{name}'}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
