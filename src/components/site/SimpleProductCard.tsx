import { Link } from 'react-router-dom';
import type { Product } from '@/lib/stores/productStore';
import { slugify } from '@/lib/utils/slugify';
import { safeImageUrl, priceLabel, conditionLabel, storageLabel } from '@/lib/utils/productFallbacks';

interface SimpleProductCardProps {
  product: Product;
  compareChecked?: boolean;
  onCompareToggle?: () => void;
  compareDisabled?: boolean;
}

/**
 * Cartão de produto "loja normal" — fundo branco, borda fina, sem tilt nem
 * glow. Usado no catálogo, na vitrine da home e em relacionados.
 */
export function SimpleProductCard({ product, compareChecked, onCompareToggle, compareDisabled }: SimpleProductCardProps) {
  const specs = [conditionLabel(product), storageLabel(product)].filter(s => s !== 'Não informado');

  return (
    <div className="rounded-xl overflow-hidden transition-colors" style={{ border: '1px solid #e5e5e5', background: '#fff' }}>
      <Link to={`/produtos/${slugify(product.title)}`} className="block">
        <div className="aspect-square flex items-center justify-center p-4" style={{ background: '#fafafa' }}>
          <img src={safeImageUrl(product.image_url)} alt={product.title}
            className="w-full h-full object-contain" loading="lazy" />
        </div>
        <div className="px-3 pt-3">
          <p className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: '#111' }}>{product.title}</p>
          {specs.length > 0 && (
            <p className="text-xs mb-1.5" style={{ color: '#888' }}>{specs.join(' · ')}</p>
          )}
          <div className="flex items-baseline gap-2">
            <p className="text-base font-bold" style={{ color: '#111' }}>{priceLabel(product.price)}</p>
            {product.old_price && (
              <p className="text-xs line-through" style={{ color: '#aaa' }}>{priceLabel(product.old_price)}</p>
            )}
          </div>
          <p className="text-xs" style={{ color: '#999' }}>
            {product.installments}x de {priceLabel(product.price / product.installments)}
          </p>
        </div>
      </Link>
      <div className="px-3 pb-3 pt-2 flex items-center justify-between">
        {onCompareToggle ? (
          <label className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer select-none"
            style={{ color: compareChecked ? '#111' : '#999' }}>
            <input type="checkbox" checked={!!compareChecked}
              onChange={onCompareToggle}
              disabled={!compareChecked && compareDisabled}
              className="w-3.5 h-3.5" />
            Comparar
          </label>
        ) : <span />}
        {product.badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#f2f2f2', color: '#555' }}>
            {product.badge.replace(/[^\w\sÀ-ú]/g, '').trim()}
          </span>
        )}
      </div>
    </div>
  );
}
