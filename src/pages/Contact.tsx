import { motion } from 'framer-motion';
import { MessageCircle, Instagram, MapPin, Phone } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default function Contact() {
  const wa = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;
  return (
    <div className="min-h-screen" style={{ background: '#050505', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span style={{ color: '#F5B700' }}>Contato</span>
          </h1>
          <p className="text-sm mb-10" style={{ color: '#a6a6aa' }}>
            Fale diretamente com nossa equipe. Respondemos em minutos.
          </p>

          <div className="space-y-4 mb-10">
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:border-[#F5B700]/30"
              style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)' }}>
              <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} />
              <div>
                <p className="text-sm font-bold text-white">WhatsApp</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>{clientConfig.company.contact.phone}</p>
              </div>
            </a>
            <a href={clientConfig.company.social.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:border-[#F5B700]/30"
              style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Instagram className="w-6 h-6" style={{ color: '#E1306C' }} />
              <div>
                <p className="text-sm font-bold text-white">Instagram</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>@andinhoimport</p>
              </div>
            </a>
            <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)' }}>
              <MapPin className="w-6 h-6" style={{ color: '#F5B700' }} />
              <div>
                <p className="text-sm font-bold text-white">Localização</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>{clientConfig.company.location.city}, {clientConfig.company.location.state}</p>
              </div>
            </div>
          </div>

          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-sm w-full justify-center">
            <MessageCircle className="w-5 h-5" /> Iniciar conversa no WhatsApp
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
