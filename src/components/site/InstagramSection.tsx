import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { useState, useEffect } from 'react';

interface InstagramPost {
  id: string;
  url: string;
  img: string;
  caption: string;
}

const LOCAL_KEY = `${clientConfig.id}_instagram_posts`;

const DEFAULT_POSTS: InstagramPost[] = [
  { id:'1', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80&auto=format&fit=crop', caption:'iPhone 15 Pro Max disponível!' },
  { id:'2', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop', caption:'Novidades toda semana' },
];

function loadPosts(): InstagramPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return DEFAULT_POSTS;
    return JSON.parse(raw);
  } catch { return DEFAULT_POSTS; }
}

export function InstagramSection() {
  const { content } = useContentStore();
  const [posts, setPosts] = useState<InstagramPost[]>(DEFAULT_POSTS);
  const instagramUrl = content.instagram_link || clientConfig.company.social.instagram;

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'hsl(220,20%,4%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'hsla(45,20%,96%,0.35)' }}>Instagram</span>
            </div>
            <h2 className="font-black text-3xl md:text-4xl tracking-tight">
              Siga a{' '}
              <span className="gradient-text">{clientConfig.company.name} {clientConfig.company.nameHighlight}</span>
            </h2>
            <p className="text-sm mt-1" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
              @andinhoimport
            </p>
          </div>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0"
            style={{ border: '1px solid hsla(255,255%,255%,0.12)', color: 'hsla(45,20%,96%,0.65)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsla(330,80%,55%,0.4)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsla(255,255%,255%,0.12)'; (e.currentTarget as HTMLElement).style.color = 'hsla(45,20%,96%,0.65)'; }}>
            <Instagram className="w-4 h-4" />
            Ver perfil
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        {/* Grid de posts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {posts.map((post, i) => (
            <motion.a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="relative aspect-square rounded-xl overflow-hidden group block"
              style={{ border: '1px solid hsla(255,255%,255%,0.06)' }}>
              <img src={post.img} alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {/* Overlay hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2"
                style={{ background: 'linear-gradient(to top, hsla(0,0%,0%,0.8) 0%, transparent 60%)' }}>
                <p className="text-white text-[10px] font-semibold line-clamp-2">{post.caption}</p>
              </div>
              {/* Instagram icon no hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA seguir */}
        <motion.div initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
