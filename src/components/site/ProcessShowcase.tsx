import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, Eye, Camera, FileCheck2, ShieldCheck, PackageCheck, ArrowRight, MessageCircle, type LucideIcon } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useProductStore, type Product } from '@/lib/stores/productStore';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { safeImageUrl, batteryLabel, warrantyLabel, conditionLabel, accessoriesLabel } from '@/lib/utils/productFallbacks';

interface Panel {
  icon: LucideIcon;
  kicker: string;
  title: string;
  text: string;
}

function buildPanels(product: Product | undefined): Panel[] {
  return [
    {
      icon: BatteryCharging,
      kicker: '01 · Bateria',
      title: product?.battery_health_pct ? `${product.battery_health_pct}% de saúde da bateria` : 'Bateria testada antes da venda',
      text: 'Medimos a saúde real da bateria antes de anunciar. Se está abaixo do que consideramos aceitável, o aparelho não entra no catálogo.',
    },
    {
      icon: Eye,
      kicker: '02 · Tela',
      title: 'Tela conferida sem trincos ou pixels mortos',
      text: 'Checagem visual e de toque em toda a superfície, com luz direta pra achar qualquer risco que uma foto de anúncio esconderia.',
    },
    {
      icon: Camera,
      kicker: '03 · Câmeras',
      title: 'Câmeras testadas — foco, nitidez e flash',
      text: 'Fotografamos com cada lente antes da venda. Se alguma câmera falha, o problema aparece aqui, não na sua primeira semana de uso.',
    },
    {
      icon: FileCheck2,
      kicker: '04 · Procedência',
      title: 'Nota fiscal e origem verificada',
      text: product?.accessories_included
        ? `Acompanha ${accessoriesLabel(product)} — exatamente o que está descrito.`
        : 'Todo aparelho tem procedência checada antes de entrar no estoque.',
    },
    {
      icon: ShieldCheck,
      kicker: '05 · Garantia',
      title: product?.warranty_days ? `Garantia de ${warrantyLabel(product)}` : 'Garantia real, por escrito',
      text: 'Se alguma coisa fugir do combinado dentro do prazo, você fala com quem vendeu — não com um SAC terceirizado.',
    },
    {
      icon: PackageCheck,
      kicker: '06 · Estado',
      title: product?.condition ? conditionLabel(product) : 'Estado real, descrito com honestidade',
      text: 'A condição anunciada é a condição que chega até você, sem surpresa no desgaste.',
    },
  ];
}

/**
 * Um aparelho grande + checklist vertical — sem pin de tela cheia (pesava
 * demais) e sem repetir a mesma grade de fotos que a seção de Produtos logo
 * abaixo já usa.
 */
export function ProcessShowcase() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = products.filter(p => p.status === 'active');
  const product = activeProducts.find(p => p.featured) || activeProducts[0];
  const PANELS = buildPanels(product);
  const image = product?.image_url ? safeImageUrl(product.image_url) : safeImageUrl(undefined);

  const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;

  return (
    <section className="relative py-16 md:py-24" style={{ background: 'hsl(240,6%,11%)' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6">
        <div className="mb-10 max-w-lg">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'hsl(43,96%,52%)' }}>
            Inspeção antes da venda
          </p>
          <RevealText as="h2" className="font-display font-black tracking-tight text-white text-[clamp(1.6rem,2.4vw,2.2rem)]">
            O que a gente confere antes de anunciar
          </RevealText>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1fr] gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden lg:sticky lg:top-28 aspect-[4/5] max-w-md mx-auto lg:mx-0"
            style={{ background: 'hsl(200,12%,90%)' }}
          >
            <img src={image} alt={product?.title || 'Aparelho inspecionado'} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>

          <div className="space-y-0 divide-y" style={{ borderColor: 'hsla(255,255%,255%,0.06)' }}>
            {PANELS.map((panel, i) => (
              <motion.div key={panel.kicker}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-4 py-5 first:pt-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.25)' }}>
                  <panel.icon className="w-4 h-4" style={{ color: 'hsl(43,96%,52%)' }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1.5" style={{ color: 'hsl(43,96%,52%)' }}>{panel.kicker}</p>
                  <h3 className="font-display font-black text-[15px] text-white mb-1.5 leading-snug">{panel.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{panel.text}</p>
                </div>
              </motion.div>
            ))}

            <div className="pt-6">
              <PremiumButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="primary" className="text-sm">
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
                <ArrowRight className="w-4 h-4" />
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
