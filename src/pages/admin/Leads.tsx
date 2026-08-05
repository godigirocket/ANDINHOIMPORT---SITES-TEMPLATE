import { useEffect, useMemo, useState } from 'react';
import { Download, MessageCircle, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLeadStore, type LeadStatus } from '@/lib/stores/leadStore';
import { clientConfig } from '@/config/client';
import { toast } from 'sonner';

const statuses: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: '#60a5fa' },
  { value: 'contato', label: 'Contato', color: '#facc15' },
  { value: 'negociando', label: 'Negociando', color: '#fb923c' },
  { value: 'ganho', label: 'Ganho', color: '#4ade80' },
  { value: 'perdido', label: 'Perdido', color: '#f87171' },
];

const empty = {
  name: '',
  phone: '',
  source: 'WhatsApp',
  interest: '',
  status: 'novo' as LeadStatus,
  notes: '',
};

export default function AdminLeads() {
  const { leads, fetchLeads, createLead, updateLead, deleteLead } = useLeadStore();
  const [form, setForm] = useState(empty);
  const [query, setQuery] = useState('');

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(lead =>
      [lead.name, lead.phone, lead.interest, lead.source, lead.notes].some(value => value?.toLowerCase().includes(q))
    );
  }, [leads, query]);

  const addLead = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do lead');
      return;
    }
    await createLead(form);
    setForm(empty);
    toast.success('Lead adicionado');
  };

  const exportCsv = () => {
    const rows = [
      ['Nome', 'Telefone', 'Origem', 'Interesse', 'Status', 'Notas', 'Criado em'],
      ...leads.map(lead => [lead.name, lead.phone, lead.source, lead.interest, lead.status, lead.notes, lead.created_at]),
    ];
    const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientConfig.id}-leads.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openWhatsApp = (phone: string, interest: string) => {
    const digits = phone.replace(/\D/g, '');
    const target = digits ? (digits.startsWith('55') ? digits : `55${digits}`) : clientConfig.company.contact.whatsappNumber;
    const msg = `Olá! Vi seu interesse${interest ? ` em ${interest}` : ''}. Posso te ajudar?`;
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">CRM de leads</h1>
            <p className="mt-1 text-sm text-white/45">Organize contatos do WhatsApp, vendas e retornos sem ocupar hospedagem pesada.</p>
          </div>
          <button onClick={exportCsv} className="btn-outline-premium flex items-center gap-2 px-4 py-2 text-xs">
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <div className="rounded-xl p-4" style={{ background: 'hsla(220,20%,7%,0.82)', border: '1px solid hsla(43,96%,52%,0.12)' }}>
            <h2 className="mb-4 text-sm font-bold text-white">Novo lead</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nome</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Cliente" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">WhatsApp</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(51) 99999-9999" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Interesse</Label>
                <Input value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))} placeholder="iPhone, Xiaomi, orcamento..." className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Origem</Label>
                  <Input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as LeadStatus }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Notas</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Preferencia, prazo, combinado..." className="text-sm" />
              </div>
              <button onClick={addLead} className="btn-gold flex w-full items-center justify-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Adicionar lead
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar lead..." className="max-w-sm text-sm" />
            <div className="grid gap-3">
              {filtered.map(lead => {
                const status = statuses.find(item => item.value === lead.status) ?? statuses[0];
                return (
                  <div key={lead.id} className="rounded-xl p-4" style={{ background: 'hsla(220,20%,7%,0.82)', border: '1px solid hsla(255,255%,255%,0.08)' }}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-white">{lead.name}</p>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: `${status.color}22`, color: status.color }}>{status.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-white/45">{lead.phone || 'Sem telefone'} · {lead.source}</p>
                        {lead.interest && <p className="mt-2 text-sm text-primary">{lead.interest}</p>}
                        {lead.notes && <p className="mt-1 text-xs text-white/52">{lead.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={lead.status} onChange={e => updateLead(lead.id, { status: e.target.value as LeadStatus })} className="h-9 rounded-md border border-input bg-background px-2 text-xs">
                          {statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                        <button onClick={() => openWhatsApp(lead.phone, lead.interest)} className="rounded-lg p-2 text-green-400 transition-colors hover:bg-green-500/10" aria-label="Abrir WhatsApp">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteLead(lead.id)} className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10" aria-label="Excluir lead">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="rounded-xl py-12 text-center text-sm text-white/45" style={{ background: 'hsla(220,20%,7%,0.82)', border: '1px solid hsla(255,255%,255%,0.08)' }}>
                  Nenhum lead ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
