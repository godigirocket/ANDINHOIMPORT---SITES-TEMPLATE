import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileCheck2, MessageCircle, PackageCheck, ShieldCheck, type LucideIcon } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useProductStore } from '@/lib/stores/productStore';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ScrollSequence } from '@/components/scroll/ScrollSequence';
import { safeImageUrl } from '@/lib/utils/productFallbacks';

interface Panel {
  icon: LucideIcon;
  kicker: string;
  title: string;
  text: string;
}

const sequenceFrames = Array.from(
  { length: 12 },
  (_, i) => `/media/ezgif-frame-${String(i + 5).padStart(3, '0')}.png`
);

const panels: Panel[] = [
  {
    icon: PackageCheck,
    kicker: '01 - Produto novo',
    title: 'Aparelhos originais e lacrados',
    text: 'Compra limpa: produto novo, original e pronto para uso.',
  },
  {
    icon: FileCheck2,
    kicker: '02 - Nota fiscal',
    title: 'Procedencia documentada',
    text: 'Nota fiscal e condicoes combinadas antes de fechar.',
  },
  {
    icon: ShieldCheck,
    kicker: '03 - Garantia',
    title: 'Suporte direto com a loja',
    text: 'Depois da compra, voce fala com quem conhece o estoque.',
  },
];

export function ProcessShowcase() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = products.filter(p => p.status === 'active');
  const product = activeProducts.find(p => p.featured) || activeProducts[0];
  const poster = sequenceFrames[0] || (product?.image_url ? safeImageUrl(product.image_url) : safeImageUrl(undefined));

  const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;

  return (
    <section className="relative overflow-hidden" style={{ background: 'hsl(240,6%,11%)' }}>
      <div className="relative">
        <ScrollSequence
          frames={sequenceFrames}
          poster={poster}
          scrollHeight={220}
          className="bg-[#08080a] [&>canvas]:h-[100svh]"
        />
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 max-w-xl"
        >
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
            Produto novo, compra segura
          </p>
          <RevealText as="h2" className="font-display text-[clamp(1.55rem,2.4vw,2.2rem)] font-black tracking-tight text-white">
            O essencial, sem enrolacao
          </RevealText>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-4">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.kicker}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.36, delay: i * 0.05 }}
              className="animated-container flex min-h-[156px] gap-4 rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                <panel.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{panel.kicker}</p>
                <h3 className="mb-1.5 font-display text-[15px] font-bold leading-snug text-white">{panel.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/58">{panel.text}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.36, delay: 0.16 }}
            className="animated-container flex min-h-[156px] flex-col items-start justify-center rounded-xl p-5"
            style={{ background: 'hsla(43,96%,52%,0.08)', border: '1px solid hsla(43,96%,52%,0.16)' }}
          >
            <p className="mb-4 text-sm font-bold text-white">Consultar estoque agora</p>
            <PremiumButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="primary" className="text-sm">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
              <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
