import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { clientConfig } from '@/config/client';
import { Product } from '@/types';

export const productSchema = z.object({
  title: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  installments: z.number().min(1).max(clientConfig.features.maxInstallments),
  image: z.string().url('URL inválida').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  category: z.string().optional(),
  badge: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: () => void;
  getProduct: (id: string) => Product | undefined;
  createProduct: (data: ProductFormData) => void;
  updateProduct: (id: string, data: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
  getActiveProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

const STORAGE_KEY = `${clientConfig.id}_products`;

// Produtos iniciais de exemplo
const initialProducts: Product[] = [
  {
    id: crypto.randomUUID(),
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Titânio Natural - Novo, lacrado com nota fiscal',
    price: 7499.00,
    installments: 18,
    image: '',
    status: 'active',
    category: 'apple',
    badge: 'LANÇAMENTO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'iPhone 14 128GB',
    description: 'Azul - Seminovo impecável com garantia',
    price: 4299.00,
    installments: 12,
    image: '',
    status: 'active',
    category: 'apple',
    badge: 'PROMOÇÃO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Xiaomi 14 Ultra 512GB',
    description: 'Preto - Câmera Leica, novo lacrado',
    price: 5999.00,
    installments: 18,
    image: '',
    status: 'active',
    category: 'xiaomi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Apple Watch Series 9 45mm',
    description: 'GPS + Celular - Meia-noite',
    price: 3499.00,
    installments: 12,
    image: '',
    status: 'active',
    category: 'smartwatch',
    badge: 'NOVO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      
      fetchProducts: () => {
        set({ isLoading: true, error: null });
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const products = stored ? JSON.parse(stored) : initialProducts;
          
          if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
          }
          
          set({ products, isLoading: false });
        } catch (error) {
          set({ error: 'Erro ao carregar produtos', isLoading: false });
        }
      },
      
      getProduct: (id) => {
        return get().products.find(p => p.id === id);
      },
      
      createProduct: (data) => {
        const newProduct: Product = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description || '',
          price: data.price,
          installments: data.installments,
          image: data.image || '',
          status: data.status,
          category: data.category || '',
          badge: data.badge || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => {
          const products = [...state.products, newProduct];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          return { products };
        });
      },
      
      updateProduct: (id, data) => {
        set(state => {
          const products = state.products.map(p => {
            if (p.id === id) {
              return {
                ...p,
                title: data.title ?? p.title,
                description: data.description ?? p.description,
                price: data.price ?? p.price,
                installments: data.installments ?? p.installments,
                image: data.image ?? p.image,
                status: data.status ?? p.status,
                category: data.category ?? p.category,
                badge: data.badge ?? p.badge,
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          return { products };
        });
      },
      
      deleteProduct: (id) => {
        set(state => {
          const products = state.products.filter(p => p.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          return { products };
        });
      },
      
      toggleStatus: (id) => {
        set(state => {
          const products = state.products.map(p => 
            p.id === id 
              ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const, updatedAt: new Date().toISOString() }
              : p
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          return { products };
        });
      },
      
      getActiveProducts: () => {
        return get().products.filter(p => p.status === 'active');
      },
      
      searchProducts: (query) => {
        const q = query.toLowerCase();
        return get().products.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ products: state.products })
    }
  )
);
