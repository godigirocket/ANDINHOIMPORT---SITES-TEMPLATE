import { motion } from 'framer-motion';
import { Instagram, MessageCircle, MapPin, Mail, Phone } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { BrandLogo } from '@/components/BrandLogo';

const DigiRocketSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="none">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="#6EC72D"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="#6EC72D"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" fill="#4da81e"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" fill="#4da81e"/>
  </svg>
);

export function Footer() {
  const { company, initialContent } = clientConfig;
  const { content } = useContentStore();

  const whatsappUrl  = content.whatsapp_link  || `https://wa.me/${company.contact.whatsappNumber}`;
  const instagramUrl = content.instagram_link || company.social.instagram;
  const phone        = content.contact_phone   || company.contact.phone;
  const email        = content.contact_email   || company.contact.email;
  const address      = content.contact_address || company.location.address;
  const waMsg        = encodeURIComponent(company.contact.whatsappMessage);

  return (
    <footer className="relative overflow-hidden"
      style={{ background: 'hsl(220,20%,3%)', borderTop: '1px solid hsla(43,96%,52%,0.08)' }}>
      {/* Glow ambiente */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[250px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.07) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo size={44} glow />
              <div>
                <span className="font-black text-xl block">
                  <span className="text-white">{company.name} </span>
                  <span className="text-primary">{company.nameHighlight}</span>
                </span>
                <span className="text-xs text-white/40">{company.slogan}</span>
              </div>
            </div>
            <p className="text-sm text-white/50 mb-6 max-w-sm leading-relaxed">{company.description}</p>
            <div className="flex gap-2">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-primary transition-all"
                style={{ background: 'hsla(255,255%,255%,0.05)', border: '1px solid hsla(255,255%,255%,0.1)' }}>
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`${whatsappUrl}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-[#25D366] transition-all"
                style={{ background: 'hsla(255,255%,255%,0.05)', border: '1px solid hsla(255,255%,255%,0.1)' }}>
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-[10px] tracking-widest uppercase text-white/30 mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[['Início','#hero'],['Produtos','#products'],['Benefícios','#features'],['Depoimentos','#testimonials'],['Contato','#cta']].map(([l,h]) => (
                <li key={h}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold text-[10px] tracking-widest uppercase text-white/30 mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /><span>{address}</span></li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" /><a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a></li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" /><a href={`mailto:${email}`} className="hover:text-white transition-colors truncate text-xs">{email}</a></li>
              <li className="pt-1">
                <a href={`${whatsappUrl}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#25D366] text-xs font-semibold hover:opacity-80 transition-all"
                  style={{ background: 'hsla(142,71%,45%,0.1)', border: '1px solid hsla(142,71%,45%,0.25)' }}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── DigiRocket — menor, com efeito de luz passando ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col items-center gap-3">

          <p className="text-[9px] font-bold tracking-[0.4em] uppercase"
            style={{ color: 'hsla(43,96%,52%,0.45)' }}>
            Desenvolvido por
          </p>

          {/* Pill com efeito shimmer */}
          <a href="https://www.instagram.com/GODIGIROCKET" target="_blank" rel="noopener noreferrer"
            className="group relative flex items-center gap-2.5 px-6 py-3 rounded-full overflow-hidden transition-all duration-300"
            style={{
              background: 'hsl(220,20%,9%)',
              border: '1px solid hsla(255,255%,255%,0.1)',
              boxShadow: '0 2px 16px hsla(0,0%,0%,0.4)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsla(110,60%,50%,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px hsla(110,60%,50%,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsla(255,255%,255%,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px hsla(0,0%,0%,0.4)'; }}
          >
            {/* Efeito de luz passando */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, hsla(255,255%,255%,0.08) 50%, transparent 100%)', width: '60%' }}
              animate={{ x: ['-100%', '250%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
            <DigiRocketSVG />
            <span className="text-base font-black text-white group-hover:text-[#6EC72D] transition-colors">
              DigiRocket
            </span>
          </a>

          <p className="text-[10px] text-white/20 mt-1">{initialContent.footer.copyright}</p>
        </motion.div>
      </div>
    </footer>
  );
}
