import type { Product } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';

export function whatsappUrlForProduct(p: Pick<Product, 'title'>): string {
  const msg = `Olá! Tenho interesse no ${p.title}. Pode me passar mais informações?`;
  return `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/** Texto único pra qualquer campo opcional ausente — nunca inventa o dado. */
export const NAO_INFORMADO = 'Não informado';

export function conditionLabel(p: Pick<Product, 'condition'>): string {
  if (p.condition === 'novo') return 'Novo lacrado';
  if (p.condition === 'seminovo') return 'Seminovo';
  return NAO_INFORMADO;
}

export function storageLabel(p: Pick<Product, 'storage_gb'>): string {
  return p.storage_gb ? `${p.storage_gb}GB` : NAO_INFORMADO;
}

export function batteryLabel(p: Pick<Product, 'battery_health_pct'>): string {
  return p.battery_health_pct ? `${p.battery_health_pct}% de saúde` : NAO_INFORMADO;
}

export function colorLabel(p: Pick<Product, 'color'>): string {
  return p.color || NAO_INFORMADO;
}

export function warrantyLabel(p: Pick<Product, 'warranty_days'>): string {
  if (!p.warranty_days) return NAO_INFORMADO;
  if (p.warranty_days % 30 === 0) return `${p.warranty_days / 30} meses`;
  return `${p.warranty_days} dias`;
}

export function accessoriesLabel(p: Pick<Product, 'accessories_included'>): string {
  return p.accessories_included || NAO_INFORMADO;
}

export function priceLabel(price: number | null | undefined): string {
  if (!price || price <= 0) return 'Consulte o preço';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export function descriptionOrFallback(description: string | null | undefined): string {
  return description?.trim() || 'Descrição detalhada disponível por WhatsApp — nossa equipe confirma condição e especificações antes da compra.';
}

export function isAvailable(p: Pick<Product, 'status'>): boolean {
  return p.status === 'active';
}

const BROKEN_IMAGE_HOSTS = ['encrypted-tbn', 'gstatic.com/shopping'];

/** Detecta hosts conhecidos por serem hotlinks frágeis (thumbnail de busca, não imagem de produto real). */
export function isFragileImageSource(url: string | null | undefined): boolean {
  if (!url) return false;
  return BROKEN_IMAGE_HOSTS.some(host => url.includes(host));
}

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=85&auto=format&fit=crop';

/** URL segura pra <img>: nunca aponta pra um hotlink frágil, nunca fica vazia. */
export function safeImageUrl(url: string | null | undefined): string {
  if (!url || isFragileImageSource(url)) return FALLBACK_PRODUCT_IMAGE;
  return url;
}
