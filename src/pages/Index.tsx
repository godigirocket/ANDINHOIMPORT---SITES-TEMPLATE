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
import { FloatingCart } from '@/components/site/FloatingCart';
import { CartDrawer } from '@/components/site/CartDrawer';
import { TawkToChat } from '@/components/TawkToChat';
import { SimpleChatbot } from '@/components/SimpleChatbot';
import { ParticleBackground } from '@/components/ParticleBackground';
import { SectionDivider, SectionDividerGlow } from '@/components/site/SectionDivider';
import { useContentStore } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';
import { captureUTMs } from '@/lib/analytics/track';

const Index = () => {
  const { fetchContent, content } = useContentStore();
  const { products } = useProductStore();

  useEffect(() => {
    fetchContent();
    captureUTMs();
  }, [fetchContent]);

  // SEO dinâmico — meta tags, OG, Twitter Card
  useEffect(() => {
    const title = content.seo_title || clientConfig.seo.title;
    const desc  = content.seo_description || clientConfig.seo.description;
    const kw    = content.seo_keywords || clientConfig.seo.keywords.join(', ');
    const ogImage = content.hero_bg_1 || clientConfig.brand.heroBgImages[0];
    const siteUrl = window.location.origin;

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

    sm('description', desc);
    sm('keywords', kw);
    sm('robots', 'index, follow');
    sm('author', clientConfig.company.legalName);

    og('og:title', title);
    og('og:description', desc);
    og('og:type', 'website');
    og('og:url', siteUrl);
    og('og:image', ogImage);
    og('og:locale', 'pt_BR');
    og('og:site_name', `${clientConfig.company.name} ${clientConfig.company.nameHighlight}`);

    sm('twitter:card', 'summary_large_image');
    sm('twitter:title', title);
    sm('twitter:description', desc);
    sm('twitter:image', ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = siteUrl;
  }, [content.seo_title, content.seo_description, content.seo_keywords, content.hero_bg_1]);

  // Google Search Console verification
  useEffect(() => {
    if (!content.google_search_console_token) return;
    let el = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.name = 'google-site-verification';
      document.head.appendChild(el);
    }
    el.content = content.google_search_console_token;
  }, [content.google_search_console_token]);

  // Structured Data — JSON-LD para LocalBusiness + Products
  useEffect(() => {
    const siteUrl = window.location.origin;

    // LocalBusiness
    const businessLd = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: `${clientConfig.company.name} ${clientConfig.company.nameHighlight}`,
      description: content.seo_description || clientConfig.seo.description,
      url: siteUrl,
      telephone: content.contact_phone || clientConfig.company.contact.phone,
      email: content.contact_email || clientConfig.company.contact.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: clientConfig.company.location.city,
        addressRegion: clientConfig.company.location.state,
        addressCountry: 'BR',
      },
      sameAs: [
        content.instagram_link || clientConfig.company.social.instagram,
        clientConfig.company.social.facebook,
        clientConfig.company.social.tiktok,
      ].filter(Boolean),
    };

    let businessScript = document.getElementById('ld-business') as HTMLScriptElement | null;
    if (!businessScript) {
      businessScript = document.createElement('script');
      businessScript.id = 'ld-business';
      businessScript.type = 'application/ld+json';
      document.head.appendChild(businessScript);
    }
    businessScript.text = JSON.stringify(businessLd);

    // Catalog (ItemList of Products)
    const activeProducts = products.filter(p => p.status === 'active').slice(0, 30);
    if (activeProducts.length > 0) {
      const catalogLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: activeProducts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.title,
            description: p.description ?? undefined,
            image: p.image_url ?? undefined,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'BRL',
              price: p.price,
              availability: 'https://schema.org/InStock',
            },
          },
        })),
      };
      let catalogScript = document.getElementById('ld-catalog') as HTMLScriptElement | null;
      if (!catalogScript) {
        catalogScript = document.createElement('script');
        catalogScript.id = 'ld-catalog';
        catalogScript.type = 'application/ld+json';
        document.head.appendChild(catalogScript);
      }
      catalogScript.text = JSON.stringify(catalogLd);
    }
  }, [content, products]);

  // Analytics — GA4, Meta Pixel, TikTok Pixel
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
    if (content.tiktok_pixel && !document.getElementById('tiktok-pixel')) {
      const s = document.createElement('script'); s.id = 'tiktok-pixel';
      s.innerHTML = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${content.tiktok_pixel}');ttq.page();}(window,document,'ttq');`;
      document.head.appendChild(s);
    }
  }, [content.ga_id, content.meta_pixel, content.tiktok_pixel]);

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Header />
      <main>
        <HeroSection />
        <SectionDivider to="hsl(220,20%,5%)" />
        <BrandsTicker />
        <SectionDividerGlow />
        <ProductsSection />
        <SectionDivider from="hsl(225,25%,6%)" to="hsl(220,20%,4%)" flip />
        <FeaturesSection />
        <SectionDividerGlow />
        <TestimonialsSection />
        {content.instagram_enabled && (
          <>
            <SectionDividerGlow />
            <InstagramSection />
          </>
        )}
        <SectionDivider to="hsl(225,25%,8%)" />
        <CTASection />
      </main>
      <Footer />
      <FloatingCart />
      <CartDrawer />
      <SimpleChatbot />
      <TawkToChat />
    </div>
  );
};

export default Index;
