import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { clientConfig } from '@/config/client';

export function FloatingWhatsApp() {
  const handleClick = () => {
    const message = encodeURIComponent(clientConfig.company.contact.whatsappMessage);
    window.open(`${clientConfig.company.contact.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-accent shadow-accent-glow flex items-center justify-center hover:scale-110 transition-transform group"
      aria-label="Contato via WhatsApp"
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
      
      {/* Icon */}
      <MessageCircle className="w-7 h-7 text-foreground relative z-10 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 rounded-lg bg-surface text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Fale conosco!
      </span>
    </motion.button>
  );
}
