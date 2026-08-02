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
            className="fixed inset-0 bg-black/50 z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{ background: '#fff' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #eee' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.3)' }}>
                  <ShoppingBag className="w-4 h-4" style={{ color: 'hsl(43,96%,45%)' }} />
                </div>
                <div>
                  <h2 className="font-bold text-sm" style={{ color: '#111' }}>Carrinho</h2>
                  <p className="text-xs" style={{ color: '#999' }}>{getItemCount()} item(s)</p>
                </div>
              </div>
              <button onClick={closeCart} className="p-2 rounded-lg transition-colors" style={{ color: '#999' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: '#fafafa', border: '1px solid #eee' }}>
                    <ShoppingBag className="w-8 h-8" style={{ color: '#ccc' }} />
                  </div>
                  <p className="text-sm" style={{ color: '#999' }}>Carrinho vazio</p>
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
                    style={{ background: '#fafafa', border: '1px solid #eee' }}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: '#f2f2f2' }}>
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5" style={{ color: '#ccc' }} />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold line-clamp-1" style={{ color: '#111' }}>{item.product.title}</p>
                      <p className="text-xs font-display font-bold mt-0.5" style={{ color: '#111' }}>{fmt(item.product.price)}</p>
                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                          <Minus className="w-3 h-3" style={{ color: '#555' }} />
                        </button>
                        <span className="text-xs font-bold w-5 text-center" style={{ color: '#111' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                          <Plus className="w-3 h-3" style={{ color: '#555' }} />
                        </button>
                      </div>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-lg self-start transition-colors">
                      <Trash2 className="w-3.5 h-3.5" style={{ color: '#d88' }} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 space-y-4" style={{ borderTop: '1px solid #eee' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#666' }}>Total</span>
                  <span className="text-xl font-display font-bold" style={{ color: '#111' }}>{fmt(getTotal())}</span>
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
