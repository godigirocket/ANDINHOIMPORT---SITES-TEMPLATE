import { create } from 'zustand';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';

export const productSchema = z.object({
  title:          z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  description:    z.string().optional(),
  price:          z.number().positive('Preço deve ser maior que zero'),
  old_price:      z.number().positive().optional().nullable(),
  installments:   z.number().min(1).max(clientConfig.features.maxInstallments),
  image_url:      z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  affiliate_link: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  status:         z.enum(['active', 'inactive']),
  category:       z.string().optional(),
  badge:          z.string().optional(),
  featured:       z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id:             string;
  title:          string;
  description:    string | null;
  price:          number;
  old_price:      number | null;
  image_url:      string | null;
  affiliate_link: string | null;
  category:       string | null;
  featured:       boolean;
  status:         'active' | 'inactive';
  badge:          string | null;
  installments:   number;
  sort_order:     number;
  created_at:     string;
  updated_at:     string;
}

interface ProductStore {
  products:       Product[];
  isLoading:      boolean;
  error:          string | null;
  hasSupabase:    boolean;
  fetchProducts:  () => Promise<void>;
  getProduct:     (id: string) => Product | undefined;
  createProduct:  (data: ProductFormData) => Promise<{ error: string | null }>;
  updateProduct:  (id: string, data: Partial<ProductFormData>) => Promise<{ error: string | null }>;
  deleteProduct:  (id: string) => Promise<{ error: string | null }>;
  toggleStatus:   (id: string) => Promise<void>;
  reorderProducts:(orderedIds: string[]) => Promise<void>;
  getActiveProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

const LOCAL_KEY = `${clientConfig.id}_products_v3`;

const mk = (overrides: Partial<Product> & { title: string; price: number }): Product => ({
  id: crypto.randomUUID(), description: null, old_price: null, image_url: null,
  affiliate_link: null, category: null, featured: false, status: 'active',
  badge: null, installments: 12, sort_order: 0,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  ...overrides,
});

const initialProducts: Product[] = [
  mk({ title: 'iPhone 15 Pro Max 256GB', description: 'Titânio Natural — Novo, lacrado com nota fiscal', price: 7499, old_price: 8299, category: 'apple', featured: true, badge: 'LANÇAMENTO', installments: 18, sort_order: 0 }),
  mk({ title: 'iPhone 14 128GB',         description: 'Azul — Seminovo impecável com garantia',          price: 4299, old_price: 4999, category: 'apple', badge: 'PROMOÇÃO', installments: 12, sort_order: 1 }),
  mk({ title: 'Xiaomi 14 Ultra 512GB',   description: 'Preto — Câmera Leica, novo lacrado',              price: 5999, category: 'xiaomi', featured: true, installments: 18, sort_order: 2 }),
  mk({ title: 'Apple Watch Series 9 45mm', description: 'GPS + Celular — Meia-noite',                    price: 3499, category: 'smartwatch', badge: 'NOVO', sort_order: 3 }),
];

function loadLocal(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return initialProducts;
    const p = JSON.parse(raw);
    return Array.isArray(p) && p.length > 0 ? p : initialProducts;
  } catch { return initialProducts; }
}
function saveLocal(p: Product[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(p)); } catch {}
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products:    loadLocal(),
  isLoading:   false,
  error:       null,
  hasSupabase: isSupabaseConfigured(),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ products: loadLocal(), isLoading: false, hasSupabase: false });
      return;
    }
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[Products]', error.message);
      set({ products: loadLocal(), isLoading: false, error: null, hasSupabase: true });
      return;
    }
    const products = (data ?? []) as Product[];
    saveLocal(products);
    set({ products, isLoading: false, hasSupabase: true });
  },

  getProduct: (id) => get().products.find(p => p.id === id),

  createProduct: async (data) => {
    const sort_order = get().products.length;
    if (!isSupabaseConfigured()) {
      const p: Product = {
        id: crypto.randomUUID(), sort_order,
        title: data.title, description: data.description ?? null,
        price: data.price, old_price: data.old_price ?? null,
        image_url: data.image_url ?? null, affiliate_link: data.affiliate_link ?? null,
        category: data.category ?? null, featured: data.featured ?? false,
        status: data.status, badge: data.badge ?? null, installments: data.installments,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      const updated = [...get().products, p];
      saveLocal(updated); set({ products: updated });
      return { error: null };
    }
    const { data: rows, error } = await supabase.from('products').insert({
      title: data.title, description: data.description ?? null,
      price: data.price, old_price: data.old_price ?? null,
      image_url: data.image_url ?? null, affiliate_link: data.affiliate_link ?? null,
      category: data.category ?? null, featured: data.featured ?? false,
      status: data.status, badge: data.badge ?? null,
      installments: data.installments, sort_order,
    }).select();
    if (error) return { error: error.message };
    if (!rows?.length) return { error: 'Produto não criado' };
    const updated = [...get().products, rows[0] as Product];
    saveLocal(updated); set({ products: updated });
    return { error: null };
  },

  updateProduct: async (id, data) => {
    if (!isSupabaseConfigured()) {
      const updated = get().products.map(p =>
        p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
      );
      saveLocal(updated); set({ products: updated });
      return { error: null };
    }
    const { data: rows, error } = await supabase
      .from('products').update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id).select();
    if (error) return { error: error.message };
    const row = rows?.[0] as Product | undefined;
    const updated = get().products.map(p =>
      p.id === id ? (row ?? { ...p, ...data, updated_at: new Date().toISOString() }) : p
    );
    saveLocal(updated); set({ products: updated });
    return { error: null };
  },

  deleteProduct: async (id) => {
    if (!isSupabaseConfigured()) {
      const updated = get().products.filter(p => p.id !== id);
      saveLocal(updated); set({ products: updated });
      return { error: null };
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { error: error.message };
    const updated = get().products.filter(p => p.id !== id);
    saveLocal(updated); set({ products: updated });
    return { error: null };
  },

  toggleStatus: async (id) => {
    const p = get().products.find(p => p.id === id);
    if (!p) return;
    await get().updateProduct(id, { status: p.status === 'active' ? 'inactive' : 'active' });
  },

  // Drag & drop — reordena localmente e persiste no Supabase
  reorderProducts: async (orderedIds) => {
    const current = get().products;
    const reordered = orderedIds
      .map((id, i) => {
        const p = current.find(p => p.id === id);
        return p ? { ...p, sort_order: i } : null;
      })
      .filter(Boolean) as Product[];

    saveLocal(reordered);
    set({ products: reordered });

    if (!isSupabaseConfigured()) return;

    // Atualiza sort_order no Supabase em paralelo
    await Promise.all(
      reordered.map(p =>
        supabase.from('products').update({ sort_order: p.sort_order }).eq('id', p.id)
      )
    );
  },

  getActiveProducts: () => {
    const { products } = get();
    return Array.isArray(products)
      ? [...products].filter(p => p.status === 'active').sort((a, b) => a.sort_order - b.sort_order)
      : [];
  },

  searchProducts: (query) => {
    const q = query.toLowerCase();
    return get().products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  },
}));
