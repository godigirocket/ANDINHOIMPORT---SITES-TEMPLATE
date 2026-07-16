import { clientConfig } from '@/config/client';
import { supabase } from '@/lib/supabase/client';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  method: string;
  status: 'pending_confirmation' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const LOCAL_KEY = `${clientConfig.id}_orders_v1`;

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

function loadLocal(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalAll(orders: Order[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(orders)); } catch {}
}

export function saveOrder(order: Order): void {
  // Sempre salva local para fallback
  const orders = loadLocal();
  orders.unshift(order);
  saveLocalAll(orders.slice(0, 200)); // mantém últimos 200

  // Tenta salvar no Supabase em paralelo (não bloqueia)
  if (isSupabaseConfigured()) {
    supabase.from('orders').insert({
      id: order.id,
      client_id: clientConfig.id,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      customer_cpf: order.customer.cpf,
      items: order.items,
      total: order.total,
      method: order.method,
      status: order.status,
      created_at: order.createdAt,
    }).then(({ error }) => {
      if (error) console.warn('[orders] Supabase save failed:', error.message);
    });
  }
}

export function listOrders(): Order[] {
  return loadLocal();
}

export async function fetchOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return loadLocal();
  const { data, error } = await supabase.from('orders')
    .select('*')
    .eq('client_id', clientConfig.id)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.warn('[orders] fetch failed:', error.message);
    return loadLocal();
  }
  const orders: Order[] = (data ?? []).map((d: any) => ({
    id: d.id,
    customer: { name: d.customer_name, email: d.customer_email, phone: d.customer_phone, cpf: d.customer_cpf },
    items: d.items ?? [],
    total: Number(d.total),
    method: d.method,
    status: d.status,
    createdAt: d.created_at,
  }));
  saveLocalAll(orders);
  return orders;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const orders = loadLocal();
  const updated = orders.map(o => o.id === id ? { ...o, status } : o);
  saveLocalAll(updated);
  if (isSupabaseConfigured()) {
    await supabase.from('orders').update({ status }).eq('id', id);
  }
}
