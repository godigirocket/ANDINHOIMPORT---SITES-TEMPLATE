import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Headphones } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

export function CTASection() {
  const { content } = useContentStore();
  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = encodeURIComponent(clientConfig.company.contact.whatsappMessage);

  return (
    <section id="cta" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background premium — gradiente dourado sutil */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, hsl(220,20%,4%) 0%, hsl(30,15%,5%) 50%, hsl(220,20%,4%) 100%)' }} />
      {/* Glow central dourado forte */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.12) 0%, transparent 65%)' }} />
      {/* Grid diagonal */}
      <div className="absolute inset-0 pointer-events-none opacity-15"
        style={{ backgroundImage: 'linear-gradient(45deg, hsla(43,96%,52%,0.05) 1px, transparent 1px), linear-gradient(-45deg, hsla(43,96%,52%,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ border: '1px solid hsla(43,96%,52%,0.3)', background: 'hsla(43,96%,52%,0.07)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary">Fale Agora</span>
          </div>

          <h2 className="font-black text-4xl md:text-6xl tracking-tight mb-6 leading-tight text-white">
            {clientConfig.initialContent.cta.headline}
          </h2>
          <p className="text-base mb-12 max-w-lg mx-auto" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
            {content.support_text || clientConfig.initialContent.cta.subheadline}
          </p>

          {/* CTA pill premium */}
          <motion.div initial={{ scale: 0.94, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.15 }} className="mb-12">
            <a href={`${whatsappUrl}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-base font-black transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))',
                color: 'hsl(220,20%,4%)',
                boxShadow: '0 0 40px hsla(43,96%,52%,0.4), 0 8px 32px hsla(43,96%,52%,0.2)',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px hsla(43,96%,52%,0.6), 0 8px 40px hsla(43,96%,52%,0.3)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px hsla(43,96%,52%,0.4), 0 8px 32px hsla(43,96%,52%,0.2)')}>
              {/* WhatsApp SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {clientConfig.initialContent.cta.buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Shield,     label: 'Compra 100% segura' },
              { icon: Clock,      label: 'Resposta em minutos' },
              { icon: Headphones, label: 'Suporte pós-venda' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs"
                style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                <item.icon className="w-3.5 h-3.5 text-primary" />
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
