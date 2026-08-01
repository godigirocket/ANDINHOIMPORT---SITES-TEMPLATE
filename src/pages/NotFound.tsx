import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404: rota inexistente acessada:', location.pathname);
  }, [location.pathname]);

  const waUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(240,6%,11%)' }}>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-20">
        <div className="text-center max-w-md">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'hsl(43,96%,52%)' }}>
            Erro 404
          </p>
          <RevealText as="h1" className="font-black text-5xl md:text-6xl tracking-tight text-white mb-4">
            Página não encontrada
          </RevealText>
          <p className="text-sm mb-8" style={{ color: 'hsla(45,20%,96%,0.55)' }}>
            O link que você seguiu pode estar quebrado, ou a página foi removida. Volte para o catálogo ou fale com a gente direto no WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PremiumButton href="/" variant="primary" className="text-sm">
              <Search className="w-4 h-4" />
              Ver produtos
            </PremiumButton>
            <PremiumButton href={waUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="text-sm">
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </PremiumButton>
          </div>
          <Link to="/" className="hover-underline inline-block text-xs mt-8" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
            Voltar à página inicial
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
