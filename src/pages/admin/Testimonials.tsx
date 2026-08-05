import { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Loader2, MessageSquare, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { clientConfig } from '@/config/client';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface Testimonial {
  id: string; name: string; text: string;
  avatar_url: string | null; rating: number; active: boolean; created_at: string;
}

const isOk = () => {
  const u = import.meta.env.VITE_SUPABASE_URL as string;
  const k = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return !!u && !!k && u !== 'https://placeholder.supabase.co' && u.includes('supabase.co');
};
const requireSupabase = () => {
  if (isOk()) return true;
  toast.error('Supabase nao configurado', { description: 'Configure o banco deste cliente para salvar depoimentos.' });
  return false;
};
const emptyForm = () => ({ name: '', text: '', avatar_url: null as string | null, rating: 5, active: true });

const avatarColors = ['hsl(43,96%,52%)', 'hsl(200,100%,55%)', 'hsl(280,80%,65%)', 'hsl(142,71%,45%)', 'hsl(0,84%,60%)', 'hsl(330,80%,60%)'];

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (!isOk()) return;
    setLoading(true);
    supabase.from('testimonials').select('*').eq('client_id', clientConfig.id).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) { setItems(data as Testimonial[]); }
        else if (error) { toast.error('Erro ao carregar depoimentos', { description: error.message }); }
      });
  }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (t: Testimonial) => { setEditId(t.id); setForm({ name: t.name, text: t.text, avatar_url: t.avatar_url, rating: t.rating, active: t.active }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.text) { toast.error('Nome e depoimento são obrigatórios'); return; }
    setSaving(true);    if (!requireSupabase()) { setSaving(false); return; }

    if (editId) {
      const { error } = await supabase.from('testimonials')
        .update({ name: form.name, text: form.text, avatar_url: form.avatar_url, rating: form.rating, active: form.active })
        .eq('id', editId).eq('client_id', clientConfig.id);
      setSaving(false);
      if (error) { toast.error('Erro ao salvar', { description: error.message }); return; }
      setItems(items.map(t => t.id === editId ? { ...t, name: form.name, text: form.text, avatar_url: form.avatar_url, rating: form.rating, active: form.active } : t));
      toast.success('Depoimento atualizado');
    } else {
      const { data, error } = await supabase.from('testimonials')
        .insert({ client_id: clientConfig.id, name: form.name, text: form.text, avatar_url: form.avatar_url, rating: form.rating, active: form.active })
        .select();
      setSaving(false);
      if (error) { toast.error('Erro ao criar', { description: error.message }); return; }
      setItems([data![0] as Testimonial, ...items]);
      toast.success('Depoimento criado');
    }
    setOpen(false); setForm(emptyForm()); setEditId(null);
  };

    const handleDelete = async (id: string) => {
    if (!requireSupabase()) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id).eq('client_id', clientConfig.id);
    if (error) { toast.error('Erro ao excluir', { description: error.message }); return; }
    setItems(items.filter(t => t.id !== id));
    toast.success('Removido');
  };

  const handleToggle = async (t: Testimonial) => {
    if (!requireSupabase()) return;
    const { error } = await supabase.from('testimonials').update({ active: !t.active }).eq('id', t.id).eq('client_id', clientConfig.id);
    if (error) { toast.error('Erro ao atualizar', { description: error.message }); return; }
    setItems(items.map(x => x.id === t.id ? { ...x, active: !x.active } : x));
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Depoimentos</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>{items.length} depoimento(s)</p>
          </div>
          <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Novo Depoimento
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-primary opacity-40" />
            <p className="text-white font-bold mb-1">Nenhum depoimento</p>
            <p className="text-sm mb-5" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Adicione avaliações de clientes</p>
            <button onClick={openCreate} className="btn-gold text-sm"><Plus className="w-4 h-4 mr-2 inline" />Adicionar</button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t, i) => (
              <div key={t.id} className="flex items-start gap-4 p-4 rounded-2xl transition-all"
                style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden font-black text-sm"
                  style={{ background: avatarColors[i % avatarColors.length], color: 'hsl(220,20%,4%)' }}>
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" /> : t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-white">{t.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < t.rating ? 'text-primary fill-primary' : 'text-white/20'}`} />)}
                    </div>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'hsla(45,20%,96%,0.55)' }}>{t.text}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch checked={t.active} onCheckedChange={() => handleToggle(t)} />
                  <button onClick={() => openEdit(t)}
                    className="p-2 rounded-lg transition-colors hover:text-primary"
                    style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg transition-colors hover:text-red-400"
                    style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? 'Editar Depoimento' : 'Novo Depoimento'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <ImageUploadField label="Foto (opcional)" bucket="testimonials" aspect="square"
              value={form.avatar_url ?? ''} onChange={url => setForm(p => ({...p, avatar_url: url || null}))} />
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input placeholder="João Silva" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Depoimento *</Label>
              <Textarea placeholder="Ótimo atendimento, produto chegou rápido..." rows={3} value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Avaliação</Label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(p => ({...p, rating: n}))} className="p-1">
                    <Star className={`w-6 h-6 transition-colors ${n <= form.rating ? 'text-primary fill-primary' : 'text-white/20'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid hsla(255,255%,255%,0.1)', color: 'hsla(45,20%,96%,0.6)' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
