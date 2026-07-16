import { create } from 'zustand';
import { clientConfig } from '@/config/client';
import type { Product } from '@/lib/stores/productStore';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const LOCAL_KEY = `${clientConfig.id}_cart_v1`;

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); } catch {}
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadCart(),
  isOpen: false,

  addItem: (product) => {
    const items = get().items;
    const existing = items.find(i => i.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      updated = [...items, { product, quantity: 1 }];
    }
    saveCart(updated);
    set({ items: updated });
  },

  removeItem: (productId) => {
    const updated = get().items.filter(i => i.product.id !== productId);
    saveCart(updated);
    set({ items: updated });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const updated = get().items.map(i => i.product.id === productId ? { ...i, quantity } : i);
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => { saveCart([]); set({ items: [] }); },
  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
