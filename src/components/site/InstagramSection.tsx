import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { supabase } from '@/lib/supabase/client';
import { useReveal } from '@/lib/hooks/useReveal';
import { useTilt3D } from '@/hooks/useTilt3D';
import { useMagnetic } from '@/hooks/useMagnetic';
import { spawnRipple } from '@/lib/utils/ripple';
import { TiltCard } from '@/components/ui/TiltCard';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=1000&q=85&auto=format&fit=crop';

interface InstagramPost {
  id: string; img: string; url: string | null; caption: string | null;
}

export function InstagramSection() {
  const { content } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const instagramUrl = content.instagram_link || clientConfig.company.social.instagram;
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const photoRef = useReveal<HTMLDivElement>();
  // Mockup 3D: tilt fica num wrapper separado do elemento observado pelo
  // IntersectionObserver (misturar os dois no mesmo nó trava o reveal).
  const photoTiltRef = useTilt3D<HTMLDivElement>(8);
  const followBtnRef = useMagnetic<HTMLAnchorElement>(0.2);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('instagram_posts').select('*').eq('client_id', clientConfig.id).eq('active', true).order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setPosts(data as InstagramPost[]); });
  }, []);

  // Prioridade: foto configurada no admin > foto de um produto real em destaque > stock
  const featuredProductPhoto = products.find(p => p.featured && p.image_url)?.image_url
    || products.find(p => p.image_url)?.image_url;
  const photoSrc = content.instagram_photo || featuredProductPhoto || FALLBACK_PHOTO;

  // Se há posts reais cadastrados no admin, mostra galeria em grid.
  // Caso contrário, cai no mockup de foto única (comportamento anterior).
  if (posts.length > 0) {
    return (
      <section className="relative py-16 md:py-24" style={{ background: 'hsl(28,12%,13%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">@andinhoimport</p>
                <p className="text-xs" style={{ color: '#888' }}>Siga no Instagram</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {posts.map(post => {
                const Tile = (
                  <TiltCard intensity={5} className="aspect-square rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(245,183,0,0.12)' }}>
                    <img src={post.img} alt={post.caption ?? 'Post do Instagram'}
                      className="w-full h-full object-cover" loading="lazy" />
                  </TiltCard>
                );
                return post.url ? (
                  <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                    {Tile}
                  </a>
                ) : <div key={post.id}>{Tile}</div>;
              })}
            </div>

            <a
              ref={followBtnRef}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ripple-container inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform"
              style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff' }}
              onClick={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
            >
              <Instagram className="w-4 h-4" />
              Seguir no Instagram
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

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

          {/* Foto grande central — mockup 3D: tilt no wrapper + reveal em íris por dentro */}
          <div style={{ perspective: '900px' }} className="mx-auto max-w-lg mb-6">
            <div ref={photoTiltRef} style={{ transformStyle: 'preserve-3d' }}>
              <div ref={photoRef} className="iris-reveal relative rounded-2xl overflow-hidden"
                style={{ background: 'hsl(28,10%,17%)', border: '1px solid rgba(245,183,0,0.12)', aspectRatio: '1/1', boxShadow: '0 0 30px hsla(43,96%,52%,0.15)' }}>
                <div className="iris-reveal-target w-full h-full overflow-hidden">
                  <img
                    src={photoSrc}
                    alt="Últimas novidades no Instagram da Andinho Import"
                    className="w-full h-full object-cover animate-kenburns"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            ref={followBtnRef}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ripple-container inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform"
            style={{
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              color: '#fff',
            }}
            onClick={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
          >
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
