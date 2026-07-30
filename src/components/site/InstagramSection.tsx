import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { useReveal } from '@/lib/hooks/useReveal';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=1000&q=85&auto=format&fit=crop';

export function InstagramSection() {
  const { content } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const instagramUrl = content.instagram_link || clientConfig.company.social.instagram;
  const photoRef = useReveal<HTMLDivElement>();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Prioridade: foto configurada no admin > foto de um produto real em destaque > stock
  const featuredProductPhoto = products.find(p => p.featured && p.image_url)?.image_url
    || products.find(p => p.image_url)?.image_url;
  const photoSrc = content.instagram_photo || featuredProductPhoto || FALLBACK_PHOTO;

  return (
    <section className="relative py-16 md:py-24" style={{ background: 'hsl(28,12%,13%)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="text-center">

          {/* Header estilo Instagram */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">@andinhoimport</p>
              <p className="text-xs" style={{ color: '#888' }}>Siga no Instagram</p>
            </div>
          </div>

          {/* Foto grande central — reveal em íris ao entrar na viewport (IntersectionObserver) */}
          <div ref={photoRef} className="iris-reveal relative mx-auto max-w-lg rounded-2xl overflow-hidden mb-6"
            style={{ background: 'hsl(28,10%,17%)', border: '1px solid rgba(245,183,0,0.12)', aspectRatio: '1/1', boxShadow: '0 0 30px hsla(43,96%,52%,0.15)' }}>
            <div className="iris-reveal-target w-full h-full overflow-hidden">
              <img
                src={photoSrc}
                alt="Últimas novidades no Instagram da Andinho Import"
                className="w-full h-full object-cover animate-kenburns"
              />
            </div>
          </div>

          {/* CTA */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-on-hover inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              color: '#fff',
            }}
          >
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
