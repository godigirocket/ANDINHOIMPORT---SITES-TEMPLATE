/**
 * FONTE ÚNICA DE DADOS DOS PRODUTOS
 * 
 * Todos os componentes (cards, páginas, SEO, WhatsApp) consomem daqui.
 * Em produção, o Supabase é a fonte real — este arquivo serve como
 * fallback e referência de estrutura.
 * 
 * IMAGENS: Apenas fotos reais dos modelos corretos.
 * Não reutilizar imagem de um modelo em outro.
 */

import { clientConfig } from '@/config/client';

export interface ProductData {
  id: string;
  slug: string;
  title: string;
  storage?: string;
  color: string;
  condition: string;
  category: 'apple' | 'xiaomi' | 'smartwatch' | 'accessory';
  price: number;
  oldPrice?: number;
  installments: number;
  installmentValue: number;
  warranty: string;
  availability: string;
  badge?: string;
  featured: boolean;
  image: string;
  images: string[];
  whatsappMessage: string;
  description: string;
}

const WA = clientConfig.company.contact.whatsappNumber;

export const PRODUCTS: ProductData[] = [
  {
    id: 'iphone-14-128gb',
    slug: 'iphone-14-128gb',
    title: 'iPhone 14',
    storage: '128 GB',
    color: 'Azul',
    condition: 'Seminovo',
    category: 'apple',
    price: 4500,
    oldPrice: 7200,
    installments: 12,
    installmentValue: 375,
    warranty: '90 dias',
    availability: 'Pronta entrega',
    badge: 'DESTAQUE',
    featured: true,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-202209?wid=800&hei=800&fmt=jpeg&qlt=90',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-202209?wid=800&hei=800&fmt=jpeg&qlt=90',
    ],
    whatsappMessage: 'Olá! Vi o iPhone 14 128GB Azul no site e gostaria de consultar disponibilidade e condições.',
    description: 'iPhone 14 128GB Azul em estado impecável. Seminovo com garantia de 90 dias, bateria acima de 85%.',
  },
  {
    id: 'iphone-15-pro-max-256gb',
    slug: 'iphone-15-pro-max-256gb',
    title: 'iPhone 15 Pro Max',
    storage: '256 GB',
    color: 'Titânio Natural',
    condition: 'Novo lacrado',
    category: 'apple',
    price: 7499,
    oldPrice: 8299,
    installments: 18,
    installmentValue: 416.61,
    warranty: '12 meses',
    availability: 'Pronta entrega',
    badge: 'LANÇAMENTO',
    featured: true,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    ],
    whatsappMessage: 'Olá! Vi o iPhone 15 Pro Max 256GB no site e gostaria de consultar disponibilidade e condições.',
    description: 'iPhone 15 Pro Max 256GB Titânio Natural. Novo, lacrado, com nota fiscal e garantia Apple de 12 meses.',
  },
  {
    id: 'iphone-15-pro-128gb',
    slug: 'iphone-15-pro-128gb',
    title: 'iPhone 15 Pro',
    storage: '128 GB',
    color: 'Titânio Preto',
    condition: 'Novo lacrado',
    category: 'apple',
    price: 6299,
    oldPrice: 6999,
    installments: 18,
    installmentValue: 349.94,
    warranty: '12 meses',
    availability: 'Pronta entrega',
    badge: 'MAIS VENDIDO',
    featured: true,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    ],
    whatsappMessage: 'Olá! Vi o iPhone 15 Pro 128GB no site e gostaria de consultar disponibilidade e condições.',
    description: 'iPhone 15 Pro 128GB Titânio Preto. Chip A17 Pro, câmera 48MP, USB-C. Novo lacrado com garantia.',
  },
  {
    id: 'iphone-16-pro-256gb',
    slug: 'iphone-16-pro-256gb',
    title: 'iPhone 16 Pro',
    storage: '256 GB',
    color: 'Titânio Desert',
    condition: 'Novo lacrado',
    category: 'apple',
    price: 8999,
    installments: 18,
    installmentValue: 499.94,
    warranty: '12 meses',
    availability: 'Pronta entrega',
    badge: 'LANÇAMENTO',
    featured: true,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-desert-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-desert-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    ],
    whatsappMessage: 'Olá! Vi o iPhone 16 Pro 256GB no site e gostaria de consultar disponibilidade e condições.',
    description: 'iPhone 16 Pro 256GB Titânio Desert. Câmera 5x zoom, chip A18 Pro. Lançamento 2024, novo lacrado.',
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'apple', label: 'Apple' },
  { id: 'xiaomi', label: 'Xiaomi' },
  { id: 'smartwatch', label: 'Smartwatches' },
  { id: 'accessory', label: 'Acessórios' },
] as const;

export function getProductBySlug(slug: string): ProductData | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): ProductData[] {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function getWhatsAppUrl(product: ProductData): string {
  return `https://wa.me/${WA}?text=${encodeURIComponent(product.whatsappMessage)}`;
}
