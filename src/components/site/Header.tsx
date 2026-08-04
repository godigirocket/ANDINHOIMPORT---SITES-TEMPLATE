import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clientConfig } from '@/config/client';
import { BrandLogo } from '@/components/BrandLogo';

export function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const update = () => {
      ticking = false;
      const next = window.scrollY > 84;
      setIsHidden(prev => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const navLinks = [
    { label: 'Inicio', hash: '#hero' },
    { label: 'Produtos', hash: '#products' },
    { label: 'Beneficios', hash: '#features' },
    { label: 'Depoimentos', hash: '#testimonials' },
  ];

  const jumpToSection = (hash: string) => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;
    window.history.replaceState(null, '', hash);
    window.__lenis?.stop?.();
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    window.requestAnimationFrame(() => window.__lenis?.start?.());
  };

  return (
    <>
      <motion.header
        initial={{ y: -36, opacity: 0 }}
        animate={{ y: isHidden ? -92 : 0, opacity: isHidden ? 0 : 1, pointerEvents: isHidden ? 'none' : 'auto' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 pointer-events-none"
      >
        <motion.div
          className="mx-auto mt-4 flex w-[calc(100%_-_24px)] max-w-[1220px] items-center justify-between rounded-full px-4 py-3 md:px-5"
          animate={{ backgroundColor: 'rgba(7,7,9,0.86)', backdropFilter: 'blur(18px) saturate(1.25)' }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 18px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <motion.a
            href="/#hero"
            onClick={(e) => {
              e.preventDefault();
              jumpToSection('#hero');
            }}
            aria-label="Andinho Import"
            className="pointer-events-auto flex items-center gap-3"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo size={46} glow />
            <div className="overflow-hidden leading-none">
              <p className="site-shimmer-text whitespace-nowrap text-[17px] font-black tracking-tight text-white">
                {clientConfig.company.name} {clientConfig.company.nameHighlight}
              </p>
              <p className="mt-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.34em] text-white/48">
                {clientConfig.company.slogan}
              </p>
            </div>
          </motion.a>

          <motion.nav
            className="pointer-events-auto hidden items-center gap-9 md:flex lg:gap-12"
            animate={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
            transition={{ duration: 0.22 }}
          >
            {navLinks.map(link => (
              <a
                key={link.hash}
                href={`/${link.hash}`}
                onClick={(e) => {
                  e.preventDefault();
                  jumpToSection(link.hash);
                }}
                className="relative px-1 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/76 transition-all hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="pointer-events-auto rounded-full p-2 text-white md:hidden"
            animate={{ opacity: isHidden ? 0 : 1, scale: isHidden ? 0.9 : 1, pointerEvents: isHidden ? 'none' : 'auto' }}
            transition={{ duration: 0.2 }}
            style={{ background: 'rgba(8,8,10,0.44)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
            style={{ background: 'rgba(6,6,8,0.96)', backdropFilter: 'blur(24px)' }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-3">
                <BrandLogo size={42} glow />
                <p className="text-sm font-black text-white">ANDINHO IMPORT</p>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 text-white" aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 pt-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.hash}
                  href={`/${link.hash}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpToSection(link.hash);
                  }}
                  className="block border-b border-white/10 py-5 text-2xl font-black text-white"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
