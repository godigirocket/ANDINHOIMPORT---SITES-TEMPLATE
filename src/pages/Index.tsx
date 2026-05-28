import { useEffect } from 'react';
import { Header } from '@/components/site/Header';
import { HeroSection } from '@/components/site/HeroSection';
import { BrandsTicker } from '@/components/site/BrandsTicker';
import { ProductsSection } from '@/components/site/ProductsSection';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { TestimonialsSection } from '@/components/site/TestimonialsSection';
import { InstagramSection } from '@/components/site/InstagramSection';
import { CTASection } from '@/components/site/CTASection';
import { Footer } from '@/components/site/Footer';
import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useContentStore } from '@/lib/stores/contentStore';
import { clientConfig } from '@/config/client';

const Index = () => {
  const { fetchContent, content } = useContentStore();

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // SEO dinâmico
  useEffect(() => {
    const title = content.seo_title || clientConfig.seo.title;
    const desc  = content.seo_description || clientConfig.seo.description;
    const kw    = content.seo_keywords || clientConfig.seo.keywords.join(', ');
    document.title = title;
    const sm = (name: string, val: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
      el.content = val;
    };
    const og = (prop: string, val: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.content = val;
    };
    sm('description', desc); sm('keywords', kw);
    og('og:title', title); og('og:description', desc); og('og:type', 'website');
    sm('twitter:card', 'summary_large_image');
    sm('twitter:title', title);
    sm('twitter:description', desc);
  }, [content.seo_title, content.seo_description, content.seo_keywords]);

  // Analytics
  useEffect(() => {
    if (content.ga_id && !document.getElementById('ga4-script')) {
      const s1 = document.createElement('script'); s1.id = 'ga4-script'; s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${content.ga_id}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script'); s2.id = 'ga4-init';
      s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${content.ga_id}');`;
      document.head.appendChild(s2);
    }
    if (content.meta_pixel && !document.getElementById('meta-pixel')) {
      const s = document.createElement('script'); s.id = 'meta-pixel';
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${content.meta_pixel}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, [content.ga_id, content.meta_pixel]);

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Header />
      <main>
        {/* 1. Hero — imagem de celular full-screen */}
        <HeroSection />
        {/* 2. Barra de marcas */}
        <BrandsTicker />
        {/* 3. Produtos */}
        <ProductsSection />
        {/* 4. Por que escolher — 6 cards */}
        <FeaturesSection />
        {/* 5. Depoimentos */}
        <TestimonialsSection />
        {/* 6. Feed Instagram */}
        <InstagramSection />
        {/* 7. CTA final */}
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
