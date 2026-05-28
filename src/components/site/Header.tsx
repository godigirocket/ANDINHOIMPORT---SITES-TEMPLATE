import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { BrandLogo } from '@/components/BrandLogo';

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { content } = useContentStore();

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isScrolled = scrollY > 40;
  // Logo encolhe ao rolar
  const logoSize = isScrolled ? 32 : 42;

  const navLinks = [
    { label: 'Início',      href: '#hero' },
    { label: 'Produtos',    href: '#products' },
    { label: 'Benefícios',  href: '#features' },
    { label: 'Depoimentos', href: '#testimonials' },
  ];

  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = encodeURIComponent(clientConfig.company.contact.whatsappMessage);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled
            ? 'hsla(220,20%,4%,0.96)'
            : 'hsla(220,20%,4%,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid hsla(43,96%,52%,0.1)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 30px hsla(0,0%,0%,0.4)' : 'none',
          padding: isScrolled ? '8px 0' : '14px 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo — encolhe ao rolar */}
          <a href="#" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              animate={{ width: logoSize, height: logoSize }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative flex-shrink-0"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/35 transition-all" />
              <BrandLogo size={logoSize} glow className="relative" />
            </motion.div>
            <div className="leading-none overflow-hidden">
              <motion.div
                animate={{ fontSize: isScrolled ? '13px' : '16px' }}
                transition={{ duration: 0.3 }}
                className="font-black tracking-tight"
              >
                <span className="text-white">{clientConfig.company.name} </span>
                <span className="text-primary">{clientConfig.company.nameHighlight}</span>
              </motion.div>
              <motion.div
                animate={{ opacity: isScrolled ? 0 : 1, height: isScrolled ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="text-[9px] text-white/40 tracking-[0.2em] uppercase flex items-center gap-1 overflow-hidden"
              >
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                {clientConfig.company.slogan}
              </motion.div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="text-[11px] font-bold tracking-[0.12em] text-white/55 hover:text-white transition-colors uppercase relative group">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <a href={`${whatsappUrl}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 text-[11px] font-bold text-white/70 hover:text-white hover:border-primary/50 hover:bg-primary/8 transition-all tracking-wide">
              <MessageCircle className="w-3.5 h-3.5" />
              FALE CONOSCO
            </a>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white" aria-label="Menu">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'hsla(220,20%,4%,0.98)', backdropFilter: 'blur(24px)' }}>
            <div className="pt-24 px-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a key={link.href} href={link.href}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black py-4 border-b border-white/8 text-white/80 hover:text-primary transition-colors">
                  {link.label}
                </motion.a>
              ))}
              <motion.a initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                href={`${whatsappUrl}?text=${msg}`} target="_blank" rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold mt-8 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
