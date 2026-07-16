import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Loader2, MessageCircle, Phone, Mail, ChevronRight, X } from 'lucide-react';
import { fetchOrders, updateOrderStatus, type Order } from '@/lib/orders/orderStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending_confirmation: 'Aguardando',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_COLOR: Record<Order['status'], { bg: string; text: string; border: string }> = {
  pending_confirmation: { bg: 'hsla(43,96%,52%,0.1)', text: 'hsl(43,96%,52%)', border: 'hsla(43,96%,52%,0.3)' },
  paid: { bg: 'hsla(200,100%,60%,0.1)', text: 'hsl(200,100%,60%)', border: 'hsla(200,100%,60%,0.3)' },
  shipped: { bg: 'hsla(280,80%,65%,0.1)', text: 'hsl(280,80%,65%)', border: 'hsla(280,80%,65%,0.3)' },
  delivered: { bg: 'hsla(142,71%,45%,0.1)', text: 'hsl(142,71%,45%)', border: 'hsla(142,71%,45%,0.3)' },
  cancelled: { bg: 'hsla(0,84%,60%,0.1)', text: 'hsl(0,84%,60%)', border: 'hsla(0,84%,60%,0.3)' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);
  const fmtDate = (s: string) => new Date(s).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  const handleStatusChange = async (id: string, status: Order['status']) => {
    await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected({ ...selected, status });
    toast.success('Status atualizado');
  };

  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending_confirmation').length;

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Pedidos</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              {orders.length} pedido(s) · {pendingCount} aguardando
            </p>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.3)', color: 'hsl(43,96%,52%)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Total Vendido" value={fmt(totalRevenue)} color="hsl(142,71%,45%)" />
          <StatBox label="Pedidos" value={String(orders.length)} color="hsl(43,96%,52%)" />
          <StatBox label="Aguardando" value={String(pendingCount)} color="hsl(200,100%,60%)" />
          <StatBox label="Ticket Médio" value={fmt(orders.length ? totalRevenue / orders.length : 0)} color="hsl(280,80%,65%)" />
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <Package className="w-12 h-12 mx-auto mb-3 text-primary opacity-40" />
            <p className="text-white font-bold mb-1">Nenhum pedido ainda</p>
            <p className="text-sm" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Os pedidos aparecerão aqui após o checkout</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order, i) => (
              <motion.button key={order.id}
                onClick={() => setSelected(order)}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.005]"
                style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: STATUS_COLOR[order.status].bg, border: `1px solid ${STATUS_COLOR[order.status].border}` }}>
                  <Package className="w-4 h-4" style={{ color: STATUS_COLOR[order.status].text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">#{order.id}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: STATUS_COLOR[order.status].bg, color: STATUS_COLOR[order.status].text, border: `1px solid ${STATUS_COLOR[order.status].border}` }}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
                    {order.customer.name} · {order.customer.phone} · {fmtDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-primary">{fmt(order.total)}</p>
                  <p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{order.method.toUpperCase()}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'hsla(45,20%,96%,0.3)' }} />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Order details modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Pedido #{selected.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {/* Status switcher */}
                <div className="flex flex-wrap gap-1.5">
                  {(['pending_confirmation', 'paid', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                    <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: selected.status === s ? STATUS_COLOR[s].bg : 'transparent',
                        color: selected.status === s ? STATUS_COLOR[s].text : 'hsla(45,20%,96%,0.5)',
                        border: `1px solid ${selected.status === s ? STATUS_COLOR[s].border : 'hsla(255,255%,255%,0.1)'}`,
                      }}>
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>

                {/* Customer */}
                <div className="p-3 rounded-xl space-y-2"
                  style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                  <p className="text-xs font-bold text-white/60">CLIENTE</p>
                  <p className="text-sm font-bold text-white">{selected.customer.name}</p>
                  <div className="flex flex-col gap-1 text-xs text-white/60">
                    {selected.customer.phone && (
                      <a href={`https://wa.me/${selected.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {selected.customer.phone}
                      </a>
                    )}
                    {selected.customer.email && (
                      <a href={`mailto:${selected.customer.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {selected.customer.email}
                      </a>
                    )}
                    {selected.customer.cpf && <span>CPF: {selected.customer.cpf}</span>}
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl space-y-2"
                  style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                  <p className="text-xs font-bold text-white/60">ITENS</p>
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-white/70">{item.quantity}x {item.title}</span>
                      <span className="text-primary font-bold">{fmt(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                    <span className="text-sm font-bold text-white">Total</span>
                    <span className="text-sm font-black text-primary">{fmt(selected.total)}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="text-xs space-y-1" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
                  <p>Método: <strong className="text-white/70">{selected.method.toUpperCase()}</strong></p>
                  <p>Data: <strong className="text-white/70">{fmtDate(selected.createdAt)}</strong></p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-4"
      style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.08)' }}>
      <p className="text-[10px] font-semibold tracking-wide" style={{ color: 'hsla(45,20%,96%,0.45)' }}>{label}</p>
      <p className="text-xl font-black mt-1" style={{ color }}>{value}</p>
    </div>
  );
}
