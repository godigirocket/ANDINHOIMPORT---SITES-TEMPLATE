import { create } from 'zustand';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { generateUUID } from '@/lib/utils/uuid';

const lenientUrl = z.string().refine(val => {
  if (!val) return true;
  if (val.startsWith('blob:') || val.startsWith('data:') || val.startsWith('/')) return true;
  try {
    const withProto = val.includes('://') ? val : `http://${val}`;
    new URL(withProto);
    return true;
  } catch {
    return false;
  }
}, 'URL inválida');

export const productSchema = z.object({
  title:          z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  description:    z.string().optional(),
  price:          z.number().positive('Preço deve ser maior que zero'),
  old_price:      z.number().positive().optional().nullable(),
  installments:   z.number().min(1).max(clientConfig.features.maxInstallments),
  image_url:      lenientUrl.optional().or(z.literal('')).nullable(),
  affiliate_link: lenientUrl.optional().or(z.literal('')).nullable(),
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
  
  // Campos específicos por nicho
  size?:          string | null;
  color?:         string | null;
  weight?:        string | null;
  volume?:        string | null;
  flavor?:        string | null;
  brand?:         string | null;
  model?:         string | null;
  expiration?:    string | null;
  ingredients?:   string | null;
  nutritional_info?: string | null;
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
  id: generateUUID(), description: null, old_price: null, image_url: null,
  affiliate_link: null, category: null, featured: false, status: 'active',
  badge: null, installments: 12, sort_order: 0,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  ...overrides,
});

const initialProducts: Product[] = [
  mk({
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Titânio Natural — Novo, lacrado com nota fiscal e garantia Apple',
    price: 7499, old_price: 8299,
    image_url: 'https://images.unsplash.com/photo-1696446702183-be9605d12d09?w=800&q=85&auto=format&fit=crop',
    category: 'apple', featured: true, badge: 'LANÇAMENTO', installments: 18, sort_order: 0,
  }),
  mk({
    title: 'iPhone 14 128GB',
    description: 'Azul — Seminovo impecável com garantia de 90 dias',
    price: 4299, old_price: 4999,
    image_url: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=85&auto=format&fit=crop',
    category: 'apple', badge: 'PROMOÇÃO', installments: 12, sort_order: 1,
  }),
  mk({
    title: 'iPhone 15 Pro 128GB',
    description: 'Titânio Preto — Chip A17 Pro, câmera 48MP, USB-C',
    price: 6299, old_price: 6999,
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=85&auto=format&fit=crop',
    category: 'apple', featured: true, badge: 'MAIS VENDIDO', installments: 18, sort_order: 2,
  }),
  mk({
    title: 'iPhone 13 128GB',
    description: 'Meia-noite — Seminovo estado de novo, bateria 92%',
    price: 3199, old_price: 3799,
    image_url: 'https://images.unsplash.com/photo-1632633173522-47456de71b76?w=800&q=85&auto=format&fit=crop',
    category: 'apple', badge: 'MELHOR PREÇO', installments: 12, sort_order: 3,
  }),
  mk({
    title: 'iPhone 16 Pro 256GB',
    description: 'Titânio Desert — Lançamento 2024, câmera 5x zoom',
    price: 8999,
    image_url: 'https://images.unsplash.com/photo-1710023038911-154e4820bab7?w=800&q=85&auto=format&fit=crop',
    category: 'apple', featured: true, badge: 'LANÇAMENTO', installments: 18, sort_order: 4,
  }),
  mk({
    title: 'Xiaomi 14 Ultra 512GB',
    description: 'Preto — Câmera Leica, novo lacrado, dual sim',
    price: 5999,
    image_url: 'https://images.unsplash.com/photo-1707498389796-bbe57212bd9b?w=800&q=85&auto=format&fit=crop',
    category: 'xiaomi', badge: 'TOP', installments: 18, sort_order: 5,
  }),
  mk({
    title: 'Apple Watch Series 9 45mm',
    description: 'GPS + Celular — Meia-noite, pulseira esportiva inclusa',
    price: 3499,
    image_url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=85&auto=format&fit=crop',
    category: 'smartwatch', badge: 'NOVO', installments: 12, sort_order: 6,
  }),
  mk({
    title: 'AirPods Pro 2ª Geração',
    description: 'Cancelamento ativo de ruído com case MagSafe USB-C',
    price: 1599, old_price: 1999,
    image_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=85&auto=format&fit=crop',
    category: 'apple', badge: 'OFERTA', installments: 10, sort_order: 7,
  }),
];

function loadCache(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}
function saveCache(p: Product[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(p)); } catch {}
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

export const useProductStore = create<ProductStore>((set, get) => ({
  // Carrega CACHE para exibição imediata, fetchProducts busca a verdade do Supabase
  products:    initialProducts,
  isLoading:   true,
  error:       null,
  hasSupabase: isSupabaseConfigured(),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured()) {
      console.warn('[Products] ⚠️ Supabase NÃO configurado. Usando dados locais (não persistentes entre dispositivos).');
      set({ products: initialProducts, isLoading: false, hasSupabase: false });
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('client_id', clientConfig.id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[Products] ❌ Erro ao buscar do Supabase:', error.message);
      console.error('[Products] Possíveis causas: projeto pausado, RLS bloqueando, env vars incorretas.');
      // Mantém cache se tiver, mas mostra o erro
      const cached = loadCache();
      set({ 
        products: cached.length > 0 ? cached : initialProducts, 
        isLoading: false, 
        error: `Falha ao conectar com banco de dados: ${error.message}`,
        hasSupabase: true 
      });
      return;
    }

    const products = (data ?? []) as Product[];

    saveCache(products);
    set({ products: products.length > 0 ? products : initialProducts, isLoading: false, hasSupabase: true, error: null });
  },

  getProduct: (id) => get().products.find(p => p.id === id),

  createProduct: async (data) => {
    const sort_order = get().products.length;

    if (!isSupabaseConfigured()) {
      return { error: '⚠️ Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para salvar dados permanentemente.' };
    }

    const { data: rows, error } = await supabase.from('products').insert({
      title: data.title, description: data.description ?? null,
      price: data.price, old_price: data.old_price ?? null,
      image_url: data.image_url ?? null, affiliate_link: data.affiliate_link ?? null,
      category: data.category ?? null, featured: data.featured ?? false,
      status: data.status, badge: data.badge ?? null,
      installments: data.installments, sort_order,
      client_id: clientConfig.id,
    }).select();

    if (error) {
      console.error('[Products] ❌ Erro ao criar produto:', error.message);
      return { error: `Não foi possível salvar no banco: ${error.message}. Verifique as políticas RLS no Supabase.` };
    }
    if (!rows?.length) return { error: 'Produto não criado — resposta vazia do banco.' };

    const updated = [...get().products, rows[0] as Product];
    saveCache(updated);
    set({ products: updated });
    return { error: null };
  },

  updateProduct: async (id, data) => {
    if (!isSupabaseConfigured()) {
      return { error: '⚠️ Supabase não configurado. Dados não serão persistidos.' };
    }

    // Filtrar apenas colunas que existem na tabela
    const allowedKeys = ['title', 'description', 'price', 'old_price', 'image_url', 'affiliate_link', 'category', 'featured', 'status', 'badge', 'installments', 'sort_order'];
    const filtered: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowedKeys) {
      if (key in data) filtered[key] = (data as Record<string, unknown>)[key];
    }

    const { data: rows, error } = await supabase
      .from('products').update(filtered)
      .eq('id', id).select();

    if (error) {
      console.error('[Products] ❌ Erro ao atualizar produto:', error.message);
      return { error: `Não foi possível salvar: ${error.message}` };
    }
    if (!rows || rows.length === 0) {
      return { error: 'Produto não encontrado ou sem permissão (verifique as políticas RLS no Supabase).' };
    }

    const row = rows[0] as Product;
    const updated = get().products.map(p => p.id === id ? row : p);
    saveCache(updated);
    set({ products: updated });
    return { error: null };
  },

  deleteProduct: async (id) => {
    if (!isSupabaseConfigured()) {
      return { error: '⚠️ Supabase não configurado.' };
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('[Products] ❌ Erro ao deletar produto:', error.message);
      return { error: `Não foi possível excluir: ${error.message}` };
    }

    const updated = get().products.filter(p => p.id !== id);
    saveCache(updated);
    set({ products: updated });
    return { error: null };
  },

  toggleStatus: async (id) => {
    const p = get().products.find(p => p.id === id);
    if (!p) return;
    await get().updateProduct(id, { status: p.status === 'active' ? 'inactive' : 'active' });
  },

  reorderProducts: async (orderedIds) => {
    const current = get().products;
    const reordered = orderedIds
      .map((id, i) => {
        const p = current.find(p => p.id === id);
        return p ? { ...p, sort_order: i } : null;
      })
      .filter(Boolean) as Product[];

    saveCache(reordered);
    set({ products: reordered });

    if (!isSupabaseConfigured()) return;

    const results = await Promise.all(
      reordered.map(p =>
        supabase.from('products').update({ sort_order: p.sort_order }).eq('id', p.id)
      )
    );
    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      console.error('[Products] ❌ Erro ao reordenar:', failed[0].error?.message);
    }
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
