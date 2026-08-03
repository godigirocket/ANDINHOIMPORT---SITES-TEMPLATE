import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { BrandLogo } from '@/components/BrandLogo';

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const isCollapsed = scrollY > 96;
  const showDesktopDock = isCollapsed && !isMobile;
  const hideMobileHeader = isCollapsed && isMobile;
  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Produtos', href: '#products' },
    { label: 'Beneficios', href: '#features' },
    { label: 'Depoimentos', href: '#testimonials' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -36, opacity: 0 }}
        animate={{ y: hideMobileHeader ? -28 : 0, opacity: hideMobileHeader ? 0 : 1, pointerEvents: hideMobileHeader ? 'none' : 'auto' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <motion.div
          className="mx-auto mt-3 flex items-center justify-between"
          animate={{
            width: showDesktopDock ? 'calc(100% - 24px)' : '100%',
            maxWidth: showDesktopDock ? 680 : 1220,
            paddingLeft: showDesktopDock ? 10 : 20,
            paddingRight: showDesktopDock ? 10 : 20,
            paddingTop: showDesktopDock ? 8 : 12,
            paddingBottom: showDesktopDock ? 8 : 12,
            borderRadius: showDesktopDock ? 999 : 0,
            backgroundColor: showDesktopDock ? 'rgba(12,12,15,0.72)' : 'rgba(0,0,0,0)',
            backdropFilter: showDesktopDock ? 'blur(20px) saturate(1.35)' : 'blur(0px)',
          }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: showDesktopDock ? '1px solid rgba(255,255,255,0.13)' : '1px solid transparent',
            boxShadow: showDesktopDock
              ? '0 18px 54px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 34px rgba(245,183,0,0.12)'
              : 'none',
          }}
        >
          <motion.a
            href="#hero"
            aria-label="Andinho Import"
            className="pointer-events-auto flex items-center gap-3"
            animate={{
              width: showDesktopDock ? 44 : 'auto',
              padding: 0,
            }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo size={showDesktopDock ? 38 : 48} glow={!showDesktopDock} />
            <motion.div
              className="overflow-hidden leading-none"
              animate={{ opacity: showDesktopDock ? 0 : 1, width: showDesktopDock ? 0 : 'auto' }}
              transition={{ duration: 0.24 }}
            >
              <p className="site-shimmer-text whitespace-nowrap text-[17px] font-black tracking-tight text-white">
                {clientConfig.company.name} {clientConfig.company.nameHighlight}
              </p>
              <p className="mt-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.34em] text-white/48">
                {clientConfig.company.slogan}
              </p>
            </motion.div>
          </motion.a>

          <motion.nav
            className="pointer-events-auto hidden items-center md:flex"
            animate={{ opacity: 1, y: 0, gap: showDesktopDock ? 8 : 40, pointerEvents: 'auto' }}
            transition={{ duration: 0.22 }}
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase transition-all hover:text-primary ${showDesktopDock ? 'rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 tracking-[0.14em] text-white/72' : 'tracking-[0.26em] text-white/76'}`}
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="pointer-events-auto rounded-full p-2 text-white md:hidden"
            animate={{ opacity: hideMobileHeader ? 0 : 1, scale: hideMobileHeader ? 0.9 : 1, pointerEvents: hideMobileHeader ? 'none' : 'auto' }}
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
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setIsMobileMenuOpen(false)}
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
