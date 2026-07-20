import { motion } from 'framer-motion';
import { MessageCircle, Wrench, Smartphone, Battery, Monitor } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default function Services() {
  const wa = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de consultar sobre assistência técnica.')}`;
  return (
    <div className="min-h-screen" style={{ background: '#050505', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Assistência <span style={{ color: '#F5B700' }}>Técnica</span>
          </h1>
          <p className="text-sm mb-10" style={{ color: '#a6a6aa' }}>
            Consulte os serviços disponíveis diretamente com nossa equipe.
            Atendemos smartphones Apple e Xiaomi.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: Smartphone, title: 'Diagnóstico', desc: 'Avaliação completa do aparelho' },
              { icon: Monitor, title: 'Reparo de tela', desc: 'Consulte disponibilidade para seu modelo' },
              { icon: Battery, title: 'Bateria', desc: 'Substituição com peças compatíveis' },
              { icon: Wrench, title: 'Manutenção geral', desc: 'Conectores, botões e componentes' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl" style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Icon className="w-5 h-5 mb-3" style={{ color: '#F5B700' }} />
                <p className="text-sm font-bold text-white mb-1">{title}</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl mb-8" style={{ background: 'rgba(245,183,0,0.04)', border: '1px solid rgba(245,183,0,0.15)' }}>
            <p className="text-xs" style={{ color: '#a6a6aa' }}>
              Os serviços e valores variam conforme o modelo e a disponibilidade de peças.
              Entre em contato para consultar o reparo específico para o seu aparelho.
            </p>
          </div>

          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm">
            <MessageCircle className="w-4 h-4" /> Consultar assistência
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
