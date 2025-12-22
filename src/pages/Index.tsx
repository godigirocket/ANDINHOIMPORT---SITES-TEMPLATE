import { useEffect } from 'react';
import { Header } from '@/components/site/Header';
import { HeroSection } from '@/components/site/HeroSection';
import { ProductsSection } from '@/components/site/ProductsSection';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { CTASection } from '@/components/site/CTASection';
import { Footer } from '@/components/site/Footer';
import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp';
import { useContentStore } from '@/lib/stores/contentStore';
import { clientConfig } from '@/config/client';

const Index = () => {
  const { fetchContent } = useContentStore();

  useEffect(() => {
    fetchContent();
    document.title = clientConfig.seo.title;
  }, [fetchContent]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
