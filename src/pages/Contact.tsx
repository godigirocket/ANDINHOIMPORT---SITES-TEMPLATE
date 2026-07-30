import { motion } from 'framer-motion';
import { MessageCircle, Instagram, MapPin, Phone } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { TiltCard } from '@/components/ui/TiltCard';

export default function Contact() {
  const wa = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;
  return (
    <div className="min-h-screen" style={{ background: 'hsl(240,6%,11%)', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <RevealText as="h1" className="text-3xl md:text-4xl font-black mb-3">
            <span style={{ color: '#F5B700' }}>Contato</span>
          </RevealText>
          <p className="text-sm mb-10" style={{ color: '#a6a6aa' }}>
            Fale diretamente com nossa equipe. Respondemos em minutos.
          </p>

          <div className="space-y-4 mb-10">
            <TiltCard intensity={3} onClick={() => window.open(wa, '_blank')}
              className="flex items-center gap-4 p-5 cursor-pointer"
              style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} />
              <div>
                <p className="text-sm font-bold text-white">WhatsApp</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>{clientConfig.company.contact.phone}</p>
              </div>
            </TiltCard>
            <TiltCard intensity={3} onClick={() => window.open(clientConfig.company.social.instagram, '_blank')}
              className="flex items-center gap-4 p-5 cursor-pointer"
              style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Instagram className="w-6 h-6" style={{ color: '#E1306C' }} />
              <div>
                <p className="text-sm font-bold text-white">Instagram</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>@andinhoimport</p>
              </div>
            </TiltCard>
            <TiltCard intensity={3} className="flex items-center gap-4 p-5"
              style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <MapPin className="w-6 h-6" style={{ color: '#F5B700' }} />
              <div>
                <p className="text-sm font-bold text-white">Localização</p>
                <p className="text-xs" style={{ color: '#a6a6aa' }}>{clientConfig.company.location.city}, {clientConfig.company.location.state}</p>
              </div>
            </TiltCard>
          </div>

          <PremiumButton href={wa} target="_blank" rel="noopener noreferrer" variant="primary" className="px-8 py-4 text-sm w-full">
            <MessageCircle className="w-5 h-5" /> Iniciar conversa no WhatsApp
          </PremiumButton>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
