import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContentStore } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { usePaymentStore } from '@/lib/stores/paymentStore';
import { clientConfig } from '@/config/client';

const DISMISS_KEY = `${clientConfig.id}_onboarding_dismissed`;

interface Step {
  id: string;
  title: string;
  description: string;
  done: boolean;
  href: string;
}

export function OnboardingChecklist() {
  const { content } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const { config: paymentConfig } = usePaymentStore();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const steps: Step[] = [
    {
      id: 'products',
      title: 'Cadastre pelo menos 1 produto',
      description: 'Adicione fotos, preço e descrição',
      done: products.length > 0,
      href: '/admin/products',
    },
    {
      id: 'content',
      title: 'Personalize textos da home',
      description: 'Título, subtítulo e contato',
      done: !!content.hero_title && content.hero_title !== clientConfig.initialContent.hero.headline,
      href: '/admin/content',
    },
    {
      id: 'whatsapp',
      title: 'Configure o WhatsApp',
      description: 'Para receber leads e pedidos',
      done: !!content.whatsapp_link && content.whatsapp_link.includes('wa.me'),
      href: '/admin/content',
    },
    {
      id: 'payment',
      title: 'Configure o pagamento',
      description: 'WhatsApp ou Checkout (Pix/Cartão)',
      done: paymentConfig.mode === 'whatsapp' ||
        (paymentConfig.mode === 'checkout' && (
          (paymentConfig.pix_enabled && !!paymentConfig.pix_key) ||
          (paymentConfig.stripe_enabled && !!paymentConfig.stripe_public_key) ||
          (paymentConfig.mercadopago_enabled && !!paymentConfig.mercadopago_public_key)
        )),
      href: '/admin/payments',
    },
    {
      id: 'seo',
      title: 'Otimize para o Google',
      description: 'Título, descrição e Search Console',
      done: !!content.seo_title && !!content.seo_description && content.seo_description.length > 100,
      href: '/admin/seo',
    },
    {
      id: 'pixels',
      title: 'Conecte os pixels (opcional)',
      description: 'GA4, Meta Pixel, TikTok Pixel',
      done: !!content.ga_id || !!content.meta_pixel || !!content.tiktok_pixel,
      href: '/admin/analytics',
    },
  ];

  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  if (dismissed || completed === total) return null;

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsla(43,96%,52%,0.08) 0%, hsla(43,96%,52%,0.03) 100%)',
          border: '1px solid hsla(43,96%,52%,0.25)',
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsla(43,96%,52%,0.15) 0%, transparent 70%)' }} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))', boxShadow: '0 0 20px hsla(43,96%,52%,0.4)' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'hsl(220,20%,4%)' }} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Dicas de configuração</h3>
              <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.6)' }}>
                {completed} de {total} · opcional
              </p>
            </div>
          </div>
          <button onClick={handleDismiss}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            aria-label="Fechar checklist">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full overflow-hidden relative z-10"
          style={{ background: 'hsla(220,20%,12%,0.8)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, hsl(43,96%,52%), hsl(48,100%,65%))' }}
          />
        </div>

        {/* Steps */}
        <div className="mt-4 space-y-1.5 relative z-10">
          {steps.map((step) => (
            <Link key={step.id} to={step.href}
              className="flex items-center gap-3 p-2.5 rounded-lg transition-all group"
              style={{
                background: step.done ? 'hsla(142,71%,45%,0.06)' : 'hsla(220,20%,9%,0.5)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = step.done ? 'hsla(142,71%,45%,0.1)' : 'hsla(220,20%,11%,0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = step.done ? 'hsla(142,71%,45%,0.06)' : 'hsla(220,20%,9%,0.5)'; }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: step.done ? 'hsla(142,71%,45%,0.2)' : 'hsla(220,20%,15%,1)',
                  border: `1px solid ${step.done ? 'hsla(142,71%,45%,0.5)' : 'hsla(255,255%,255%,0.1)'}`,
                }}>
                {step.done && <Check className="w-3.5 h-3.5 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${step.done ? 'text-white/50 line-through' : 'text-white'}`}>{step.title}</p>
                <p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{step.description}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: step.done ? 'hsla(45,20%,96%,0.3)' : 'hsl(43,96%,52%)' }} />
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
