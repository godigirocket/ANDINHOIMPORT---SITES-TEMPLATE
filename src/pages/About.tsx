import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Instagram, Shield, Clock, Truck } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { TiltCard } from '@/components/ui/TiltCard';

export default function About() {
  const wa = `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  return (
    <div className="min-h-screen" style={{ background: 'hsl(240,6%,11%)', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <RevealText as="h1" className="text-3xl md:text-4xl font-black mb-6">
            Sobre a <span style={{ color: '#F5B700' }}>{clientConfig.company.name} {clientConfig.company.nameHighlight}</span>
          </RevealText>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#a6a6aa' }}>
            A {clientConfig.company.name} {clientConfig.company.nameHighlight} atende clientes de {clientConfig.company.location.city} e região
            com smartphones, smartwatches, acessórios e assistência técnica. Todos os produtos são originais, com garantia e condições
            facilitadas de pagamento.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-10 p-5 rounded-2xl"
            style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src="/731175346_17983530711007965_3386313320971034665_n.jpg" alt="Andinho, fundador da Andinho Import"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white mb-1">Quem atende você</p>
              <p className="text-xs leading-relaxed" style={{ color: '#a6a6aa' }}>
                Loja de verdade, atendimento direto — sem robô, sem intermediário. Quem responde no WhatsApp é quem cuida do estoque.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shield, label: 'Produtos originais com garantia' },
              { icon: Truck, label: 'Entrega rápida para a região' },
              { icon: Clock, label: 'Atendimento direto e ágil' },
            ].map(({ icon: Icon, label }) => (
              <TiltCard key={label} className="p-5" style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Icon className="w-5 h-5 mb-3" style={{ color: '#F5B700' }} />
                <p className="text-xs font-medium" style={{ color: '#ccc' }}>{label}</p>
              </TiltCard>
            ))}
          </div>

          <div className="p-6 rounded-2xl mb-8" style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <RevealText as="h2" className="font-bold text-sm mb-3 text-white">Localização e contato</RevealText>
            <div className="space-y-2 text-sm" style={{ color: '#a6a6aa' }}>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: '#F5B700' }} /> {clientConfig.company.location.city}, {clientConfig.company.location.state}</p>
              <p className="flex items-center gap-2"><MessageCircle className="w-4 h-4" style={{ color: '#F5B700' }} /> {clientConfig.company.contact.phone}</p>
              <p className="flex items-center gap-2"><Instagram className="w-4 h-4" style={{ color: '#F5B700' }} /> @andinhoimport</p>
            </div>
          </div>

          <PremiumButton href={wa} target="_blank" rel="noopener noreferrer" variant="primary" className="px-6 py-3 text-sm">
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
          </PremiumButton>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
