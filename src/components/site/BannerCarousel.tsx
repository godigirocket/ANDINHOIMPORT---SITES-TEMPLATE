import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link_url: string | null;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('banners').select('*').eq('client_id', clientConfig.id).eq('active', true).order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setBanners(data as Banner[]); });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent(i => (i + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const isInternal = banner.link_url?.startsWith('/');

  const content = (
    <div className="glow-on-hover relative rounded-2xl overflow-hidden"
      style={{ border: '1px solid hsla(43,96%,52%,0.12)', aspectRatio: '21/7' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={banner.id}
          src={banner.image_url}
          alt={banner.title ?? 'Promoção'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {banner.title && (
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6"
          style={{ background: 'linear-gradient(to top, hsla(240,6%,6%,0.85) 0%, transparent 100%)' }}>
          <p className="text-white font-black text-sm md:text-lg tracking-tight">{banner.title}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="relative py-8 md:py-10" style={{ background: 'hsl(240,6%,11%)' }}>
      <div className="max-w-7xl mx-auto px-4">
        {isInternal ? (
          <Link to={banner.link_url!} className="block">{content}</Link>
        ) : banner.link_url ? (
          <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
        ) : content}

        {banners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {banners.map((b, i) => (
              <button key={b.id} onClick={() => setCurrent(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === current ? 'hsl(43,96%,52%)' : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
