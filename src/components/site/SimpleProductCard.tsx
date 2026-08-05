import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/stores/productStore';
import { slugify } from '@/lib/utils/slugify';
import { conditionLabel, priceLabel, safeImageUrl, storageLabel } from '@/lib/utils/productFallbacks';

interface SimpleProductCardProps {
  product: Product;
  index?: number;
  compareChecked?: boolean;
  onCompareToggle?: () => void;
  compareDisabled?: boolean;
}

export function SimpleProductCard({ product, index = 0, compareChecked, onCompareToggle, compareDisabled }: SimpleProductCardProps) {
  const specs = [conditionLabel(product), storageLabel(product)].filter(s => s !== 'Nao informado');

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="neon-product-card group relative min-w-0 overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(152deg, rgba(18,18,23,0.98), rgba(8,8,10,0.99))',
        border: '1px solid rgba(245,183,0,0.2)',
        boxShadow: '0 18px 36px rgba(0,0,0,0.2), 0 0 24px rgba(245,183,0,0.08)',
        transformStyle: 'preserve-3d',
      }}
    >
      <Link to={`/produtos/${slugify(product.title)}`} className="block min-w-0">
        <div className="relative aspect-[4/3.05] overflow-hidden bg-[#08080a] sm:aspect-[4/3.45]">
          <img
            src={safeImageUrl(product.image_url)}
            alt={product.title}
            className="h-full w-full scale-[1.12] object-cover object-center transition-transform duration-500 group-hover:scale-[1.16]"
            style={{ objectPosition: product.image_position || 'center' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/58" />

          {product.badge && (
            <span
              className="absolute left-2 top-2 max-w-[calc(100%-16px)] truncate rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide"
              style={{
                background: 'rgba(245,183,0,0.94)',
                color: '#08080a',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 18px rgba(245,183,0,0.35)',
              }}
            >
              {product.badge.replace(/[^\w\sÀ-ú]/g, '').trim()}
            </span>
          )}
        </div>

        <div className="min-w-0 px-3 py-3 sm:px-4 sm:py-3.5">
          <p className="mb-1 line-clamp-1 min-w-0 text-[12px] font-bold text-white sm:text-sm">{product.title}</p>
          {specs.length > 0 && (
            <p className="mb-2 truncate text-[11px] text-white/42">{specs.join(' · ')}</p>
          )}
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="whitespace-nowrap text-[0.98rem] font-black leading-tight text-primary drop-shadow-[0_0_12px_rgba(245,183,0,0.35)] sm:text-lg">
              {priceLabel(product.price)}
            </p>
            {product.old_price && (
              <p className="whitespace-nowrap text-[11px] text-white/30 line-through">{priceLabel(product.old_price)}</p>
            )}
          </div>
          <p className="truncate text-[10.5px] text-cyan-200/55 sm:text-xs">
            {product.installments}x de {priceLabel(product.price / product.installments)}
          </p>
        </div>
      </Link>

      {onCompareToggle && (
        <div className="px-3.5 pb-3.5 pt-0 sm:px-4">
          <label
            className="flex cursor-pointer select-none items-center gap-1.5 text-[11px] font-medium"
            style={{ color: compareChecked ? 'hsl(43,96%,52%)' : 'rgba(255,255,255,0.5)' }}
          >
            <input
              type="checkbox"
              checked={!!compareChecked}
              onChange={onCompareToggle}
              disabled={!compareChecked && compareDisabled}
              className="h-3.5 w-3.5"
            />
            Comparar
          </label>
        </div>
      )}
    </motion.article>
  );
}
