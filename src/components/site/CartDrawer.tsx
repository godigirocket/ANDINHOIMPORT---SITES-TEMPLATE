import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const navigate = useNavigate();
  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">Carrinho</h2>
                  <p className="text-xs text-white/40">{getItemCount()} item(s)</p>
                </div>
              </div>
              <button onClick={closeCart} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'hsla(43,96%,52%,0.08)', border: '1px solid hsla(43,96%,52%,0.15)' }}>
                    <ShoppingBag className="w-8 h-8 text-primary opacity-50" />
                  </div>
                  <p className="text-sm text-white/40">Carrinho vazio</p>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: 'hsla(220,20%,12%,1)' }}>
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-primary/40" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white line-clamp-1">{item.product.title}</p>
                      <p className="text-xs text-primary font-bold mt-0.5">{fmt(item.product.price)}</p>
                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: 'hsla(220,20%,14%,1)', border: '1px solid hsla(255,255%,255%,0.1)' }}>
                          <Minus className="w-3 h-3 text-white/60" />
                        </button>
                        <span className="text-xs font-bold text-white w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: 'hsla(220,20%,14%,1)', border: '1px solid hsla(255,255%,255%,0.1)' }}>
                          <Plus className="w-3 h-3 text-white/60" />
                        </button>
                      </div>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-lg self-start hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400/60 hover:text-red-400" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Total</span>
                  <span className="text-xl font-black text-primary">{fmt(getTotal())}</span>
                </div>
                <button onClick={handleCheckout}
                  className="btn-gold w-full flex items-center justify-center gap-2 text-sm">
                  Finalizar Compra <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
