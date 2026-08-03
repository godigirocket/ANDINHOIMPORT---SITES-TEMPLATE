import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { supabase } from '@/lib/supabase/client';
import { useReveal } from '@/lib/hooks/useReveal';
import { useTilt3D } from '@/hooks/useTilt3D';
import { useMagnetic } from '@/hooks/useMagnetic';
import { spawnRipple } from '@/lib/utils/ripple';
import { MeshBackground } from '@/components/site/MeshBackground';
import { usePinnedSequence } from '@/hooks/usePinnedSequence';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=1000&q=85&auto=format&fit=crop';

interface InstagramPost {
  id: string; img: string; url: string | null; caption: string | null;
}

function InstagramHeader() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
        <Instagram className="w-5 h-5 text-white" />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-white">@andinhoimport</p>
        <p className="text-xs text-white/60">Siga no Instagram</p>
      </div>
    </div>
  );
}

function FollowButton({ instagramUrl }: { instagramUrl: string }) {
  const followBtnRef = useMagnetic<HTMLAnchorElement>(0.2);
  return (
    <a
      ref={followBtnRef}
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="ripple-container inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform"
      style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff' }}
      onClick={(e) => spawnRipple(e.currentTarget, e.clientX, e.clientY)}
    >
      <Instagram className="w-4 h-4" />
      Seguir no Instagram
    </a>
  );
}

export function InstagramSection() {
  const { content } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const instagramUrl = content.instagram_link || clientConfig.company.social.instagram;
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [current, setCurrent] = useState(0);
  const photoRef = useReveal<HTMLDivElement>();
  // Mockup 3D: tilt fica num wrapper separado do elemento observado pelo
  // IntersectionObserver (misturar os dois no mesmo nó trava o reveal).
  const photoTiltRef = useTilt3D<HTMLDivElement>(8);
  // Só prende a tela (pin+scroll) quando há de fato múltiplos posts pra
  // passar um de cada vez — com 0 ou 1 foto não faz sentido prender a tela.
  const { wrapperRef, active, isPinned } = usePinnedSequence(posts.length);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('instagram_posts').select('*').eq('client_id', clientConfig.id).eq('active', true).order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setPosts(data as InstagramPost[]); });
  }, []);

  // No modo pinado, o índice vem do scroll. Fora dele, auto-rotate por tempo.
  useEffect(() => {
    if (isPinned || posts.length <= 1) return;
    const t = setInterval(() => setCurrent(i => (i + 1) % posts.length), 5000);
    return () => clearInterval(t);
  }, [isPinned, posts.length]);

  // Prioridade: post do admin (rotativo) > foto única configurada > produto em destaque > stock.
  // Se uma delas estiver quebrada (URL morta, hotlink bloqueado), cai pra próxima em vez de deixar a caixa vazia.
  const activeIdx = isPinned ? active : current;
  const activePost = posts[activeIdx];
  const featuredProductPhoto = products.find(p => p.featured && p.image_url)?.image_url
    || products.find(p => p.image_url)?.image_url;
  const photoCandidates = [activePost?.img, content.instagram_photo, featuredProductPhoto, FALLBACK_PHOTO]
    .filter((s): s is string => !!s);
  const [brokenCount, setBrokenCount] = useState(0);
  const photoSrc = photoCandidates[Math.min(brokenCount, photoCandidates.length - 1)];
  const photoLink = activePost?.url || instagramUrl;

  useEffect(() => { setBrokenCount(0); }, [activeIdx]);

  const Photo = (
    <a href={photoLink} target="_blank" rel="noopener noreferrer"
      style={{ perspective: '900px' }} className="mx-auto max-w-lg mb-6 block">
      <div ref={photoTiltRef} style={{ transformStyle: 'preserve-3d' }}>
        <div ref={photoRef} className="iris-reveal relative rounded-2xl overflow-hidden"
          style={{ background: 'hsl(28,10%,17%)', border: '1px solid rgba(245,183,0,0.12)', aspectRatio: '1/1', boxShadow: '0 0 30px hsla(43,96%,52%,0.15)' }}>
          <div className="iris-reveal-target w-full h-full overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activePost?.id ?? photoSrc}
                src={photoSrc}
                alt={activePost?.caption || 'Últimas novidades no Instagram da Andinho Import'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onError={() => setBrokenCount(n => Math.min(n + 1, photoCandidates.length - 1))}
                className="absolute inset-0 w-full h-full object-cover animate-kenburns"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </a>
  );

  if (isPinned) {
    return (
      <section ref={wrapperRef} className="relative" style={{ height: `${posts.length * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center" style={{ background: 'hsl(28,12%,13%)' }}>
          <MeshBackground />
          <div className="relative z-10 max-w-4xl mx-auto px-4 w-full text-center">
            <InstagramHeader />
            {Photo}
            <div className="flex gap-2 mb-6 max-w-xs mx-auto">
              {posts.map((_, i) => (
                <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden" style={{ background: 'hsla(255,255%,255%,0.12)' }}>
                  <div className="h-full rounded-full transition-transform duration-300 origin-left"
                    style={{ background: 'hsl(43,96%,52%)', transform: `scaleX(${i <= active ? 1 : 0})` }} />
                </div>
              ))}
            </div>
            <FollowButton instagramUrl={instagramUrl} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 md:py-16 overflow-hidden" style={{ background: 'hsl(28,12%,13%)' }}>
      <MeshBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="text-center">
          <InstagramHeader />
          {Photo}
          {posts.length > 1 && (
            <div className="flex justify-center gap-1.5 mb-6">
              {posts.map((p, i) => (
                <button key={p.id} onClick={() => setCurrent(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === current ? 'hsl(43,96%,52%)' : 'rgba(255,255,255,0.2)' }}
                />
              ))}
            </div>
          )}
          <FollowButton instagramUrl={instagramUrl} />
        </motion.div>
      </div>
    </section>
  );
}
