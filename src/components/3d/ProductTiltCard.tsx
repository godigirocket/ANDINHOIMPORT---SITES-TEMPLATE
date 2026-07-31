import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { type ProductData, getWhatsAppUrl } from '@/data/products';
import { TiltCard } from '@/components/ui/TiltCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface Props {
  product: ProductData;
  index: number;
  onClick?: () => void;
}

/**
 * Card de produto padrão do site — mesmo TiltCard usado em Produtos,
 * Depoimentos e Benefícios, pra manter um único sistema de cards.
 */
export function ProductTiltCard({ product, index, onClick }: Props) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard
        onClick={onClick}
        className="overflow-hidden cursor-pointer group relative"
        style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(245,183,0,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      >
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden flex items-center justify-center" style={{ background: 'hsl(240,6%,13%)' }}>
          <img
            src={product.image}
            alt={`${product.title} ${product.storage} ${product.color}`}
            className="product-reflect w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'linear-gradient(135deg, #F5B700, #d4a000)', color: '#050505', boxShadow: '0 4px 12px rgba(245,183,0,0.3)' }}
            >
              {product.badge}
            </span>
          )}

          {/* Availability */}
          {product.availability === 'Pronta entrega' && (
            <span
              className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold"
              style={{ background: 'rgba(245,183,0,0.12)', border: '1px solid rgba(245,183,0,0.3)', color: 'hsl(43,96%,52%)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(43,96%,52%)' }} />
              Disponível
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-[#F5B700] transition-colors">
              {product.title} {product.storage}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#a6a6aa' }}>
              {product.color} · {product.condition}
            </p>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black" style={{ color: '#F5B700' }}>
                {fmt(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs line-through" style={{ color: '#666' }}>
                  {fmt(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: '#888' }}>
              ou {product.installments}x de {fmt(product.installmentValue)}
            </p>
          </div>

          {/* Warranty + CTA */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(245,183,0,0.05)' }}>
            <span className="text-[10px] font-medium" style={{ color: '#888' }}>
              Garantia {product.warranty}
            </span>
            <PremiumButton
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              variant="primary"
              className="px-3 py-1.5 text-[11px]"
            >
              <MessageCircle className="w-3 h-3" />
              Consultar
            </PremiumButton>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
