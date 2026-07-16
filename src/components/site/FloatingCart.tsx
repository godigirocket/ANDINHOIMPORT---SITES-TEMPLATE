import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { usePaymentStore } from '@/lib/stores/paymentStore';

export function FloatingCart() {
  const { openCart, getItemCount } = useCartStore();
  const { config } = usePaymentStore();
  const count = getItemCount();

  // Só mostra se modo checkout está ativo e tem itens
  if (config.mode !== 'checkout' || count === 0) return null;

  return (
    <motion.button
      onClick={openCart}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all group"
      style={{
        background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))',
        boxShadow: '0 4px 24px hsla(43,96%,52%,0.4)',
      }}
      aria-label="Abrir carrinho"
    >
      <ShoppingBag className="w-6 h-6" style={{ color: 'hsl(220,20%,4%)' }} />
      {/* Badge count */}
      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
        {count}
      </span>
      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-card border border-border/50 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl text-white">
        {count} item(s) no carrinho
      </span>
    </motion.button>
  );
}
