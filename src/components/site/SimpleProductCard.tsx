import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/stores/productStore';
import { slugify } from '@/lib/utils/slugify';
import { safeImageUrl, priceLabel, conditionLabel, storageLabel } from '@/lib/utils/productFallbacks';

interface SimpleProductCardProps {
  product: Product;
  index?: number;
  compareChecked?: boolean;
  onCompareToggle?: () => void;
  compareDisabled?: boolean;
}

/**
 * Cartão de produto — foto domina, sombra suave em vez de borda, sobe e
 * ganha zoom na foto ao passar o mouse. Usado no catálogo, na vitrine da
 * home e em relacionados.
 */
export function SimpleProductCard({ product, index = 0, compareChecked, onCompareToggle, compareDisabled }: SimpleProductCardProps) {
  const specs = [conditionLabel(product), storageLabel(product)].filter(s => s !== 'Não informado');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 32px -8px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'; }}
    >
      <Link to={`/produtos/${slugify(product.title)}`} className="block">
        <div className="aspect-[4/5] relative overflow-hidden" style={{ background: '#f4f4f4' }}>
          <img src={safeImageUrl(product.image_url)} alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]" loading="lazy" />
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#111', backdropFilter: 'blur(4px)' }}>
              {product.badge.replace(/[^\w\sÀ-ú]/g, '').trim()}
            </span>
          )}
        </div>
        <div className="px-4 pt-3.5">
          <p className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: '#111' }}>{product.title}</p>
          {specs.length > 0 && (
            <p className="text-xs mb-2" style={{ color: '#999' }}>{specs.join(' · ')}</p>
          )}
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold" style={{ color: '#111' }}>{priceLabel(product.price)}</p>
            {product.old_price && (
              <p className="text-xs line-through" style={{ color: '#bbb' }}>{priceLabel(product.old_price)}</p>
            )}
          </div>
          <p className="text-xs" style={{ color: '#999' }}>
            {product.installments}x de {priceLabel(product.price / product.installments)}
          </p>
        </div>
      </Link>
      {onCompareToggle && (
        <div className="px-4 pb-3.5 pt-2">
          <label className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer select-none"
            style={{ color: compareChecked ? '#111' : '#aaa' }}>
            <input type="checkbox" checked={!!compareChecked}
              onChange={onCompareToggle}
              disabled={!compareChecked && compareDisabled}
              className="w-3.5 h-3.5" />
            Comparar
          </label>
        </div>
      )}
    </motion.div>
  );
}
