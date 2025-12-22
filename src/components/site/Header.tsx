import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clientConfig } from '@/config/client';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Produtos', href: '#products' },
    { label: 'Diferenciais', href: '#features' },
    { label: 'Contato', href: '#cta' },
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(clientConfig.company.contact.whatsappMessage);
    window.open(`${clientConfig.company.contact.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/40 transition-all" />
                <img
                  src={clientConfig.company.logo.url}
                  alt={clientConfig.company.logo.alt}
                  className="relative w-10 h-10 rounded-full object-cover ring-2 ring-primary/50"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg">{clientConfig.company.name}</span>
                <span className="block text-xs text-muted-foreground">{clientConfig.company.location.city}</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={clientConfig.company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <Button onClick={handleWhatsAppClick} className="gradient-accent shadow-accent-glow">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative pt-24 px-6 pb-8 flex flex-col gap-4"
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold py-2 border-b border-border/50"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <Button 
                  onClick={handleWhatsAppClick} 
                  className="w-full gradient-accent shadow-accent-glow"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
