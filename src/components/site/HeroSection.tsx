import { motion } from 'framer-motion';
import { MessageCircle, ArrowDown, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

export function HeroSection() {
  const { content } = useContentStore();
  const { hero } = content;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(clientConfig.company.contact.whatsappMessage);
    window.open(`${clientConfig.company.contact.whatsapp}?text=${message}`, '_blank');
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">{hero.badge}</span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6"
            >
              <span className="gradient-text">{hero.headline}</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10"
            >
              {hero.subheadline}
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button 
                size="lg"
                onClick={handleWhatsAppClick}
                className="gradient-accent shadow-accent-glow text-lg px-8 py-6 hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-5 h-5 mr-2 animate-pulse" />
                {hero.ctaPrimary.text}
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={scrollToProducts}
                className="border-border/50 hover:bg-surface-hover text-lg px-8 py-6"
              >
                <ArrowDown className="w-5 h-5 mr-2" />
                {hero.ctaSecondary.text}
              </Button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-3"
            >
              {hero.socialProof.map((proof, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{proof}</span>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Hero Visual */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-50" />
              
              {/* Card */}
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-8xl"
                    >
                      📱
                    </motion.div>
                    <div>
                      <p className="font-bold text-xl">{clientConfig.company.name}</p>
                      <p className="text-sm text-muted-foreground">{clientConfig.company.slogan}</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-xl bg-surface/50">
                    <div className="text-2xl font-bold text-primary">18x</div>
                    <div className="text-xs text-muted-foreground">s/ juros</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-surface/50">
                    <div className="text-2xl font-bold text-accent">2.5k+</div>
                    <div className="text-xs text-muted-foreground">seguidores</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-surface/50">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-xs text-muted-foreground">original</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
