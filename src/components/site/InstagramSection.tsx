import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

export function InstagramSection() {
  const { content } = useContentStore();
  const instagramUrl = content.instagram_link || clientConfig.company.social.instagram;

  return (
    <section className="relative py-16 md:py-24" style={{ background: '#050505' }}>
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

          {/* Foto grande central — placeholder para o dono colocar */}
          <div className="relative mx-auto max-w-lg rounded-2xl overflow-hidden mb-6"
            style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '1/1' }}>
            {/* Placeholder — será substituído por foto real via admin */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Instagram className="w-12 h-12 mx-auto mb-3" style={{ color: '#333' }} />
                <p className="text-xs" style={{ color: '#555' }}>Foto do Instagram</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
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
