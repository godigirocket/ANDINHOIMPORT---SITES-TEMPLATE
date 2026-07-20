import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { type ProductData, getWhatsAppUrl } from '@/data/products';

interface Props {
  product: ProductData;
  index: number;
  onClick?: () => void;
}

/**
 * Card 3D com tilt baseado no cursor.
 * Mobile: entrada suave sem tilt.
 * Usa CSS perspective + rotateX/Y + translateZ.
 */
export function ProductTiltCard({ product, index, onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -8, // max 4deg each side
      y: (x - 0.5) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? '12px' : '0px'})`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, #0c0c0f 0%, #08080a 100%)',
          border: `1px solid ${isHovered ? 'rgba(245,183,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isHovered
            ? '0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(245,183,0,0.08)'
            : '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden" style={{ background: '#0a0a0c' }}>
          <img
            src={product.image}
            alt={`${product.title} ${product.storage} ${product.color}`}
            className="w-full h-full object-contain p-6 transition-transform duration-500"
            style={{
              transform: `translateZ(30px) scale(${isHovered ? 1.05 : 1})`,
            }}
            loading="lazy"
          />

          {/* Reflection sweep on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              opacity: isHovered ? 1 : 0,
              background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.03) 45%, transparent 60%)',
            }}
          />

          {/* Badge */}
          {product.badge && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #F5B700, #d4a000)',
                color: '#050505',
                boxShadow: '0 4px 12px rgba(245,183,0,0.3)',
                transform: 'translateZ(40px)',
              }}
            >
              {product.badge}
            </span>
          )}

          {/* Availability */}
          {product.availability === 'Pronta entrega' && (
            <span
              className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#4ade80',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] font-medium" style={{ color: '#888' }}>
              Garantia {product.warranty}
            </span>
            <a
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #F5B700, #d4a000)',
                color: '#050505',
              }}
            >
              <MessageCircle className="w-3 h-3" />
              Consultar
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
