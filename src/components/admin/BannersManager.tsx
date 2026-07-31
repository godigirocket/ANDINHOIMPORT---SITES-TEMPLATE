import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, ImageIcon, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils/uuid';
import { clientConfig } from '@/config/client';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface Banner {
  id: string; image_url: string; title: string | null; link_url: string | null;
  active: boolean; sort_order: number; created_at: string;
}

const LOCAL_KEY = `${clientConfig.id}_banners_v2`;
const load = (): Banner[] => { try { const r = localStorage.getItem(LOCAL_KEY); return r ? JSON.parse(r) : []; } catch { return []; } };
const save = (b: Banner[]) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(b)); } catch {} };
const isOk = () => { const u = import.meta.env.VITE_SUPABASE_URL as string; return !!u && u !== 'https://placeholder.supabase.co' && u.includes('supabase.co'); };
const emptyForm = () => ({ image_url: '', title: '', link_url: '', active: true });

export function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>(load());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (!isOk()) return;
    setLoading(true);
    supabase.from('banners').select('*').eq('client_id', clientConfig.id).order('sort_order')
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) { setBanners(data as Banner[]); save(data as Banner[]); }
        else if (error) { toast.error('Erro ao carregar banners', { description: error.message }); }
      });
  }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (b: Banner) => { setEditId(b.id); setForm({ image_url: b.image_url, title: b.title ?? '', link_url: b.link_url ?? '', active: b.active }); setOpen(true); };

  const handleSave = async () => {
    if (!form.image_url) { toast.error('Adicione uma imagem'); return; }
    setSaving(true);
    if (editId) {
      if (isOk()) {
        const { error } = await supabase.from('banners')
          .update({ image_url: form.image_url, title: form.title || null, link_url: form.link_url || null, active: form.active })
          .eq('id', editId).eq('client_id', clientConfig.id);
        setSaving(false);
        if (error) { toast.error('Erro ao salvar', { description: error.message }); return; }
      } else setSaving(false);
      const updated = banners.map(b => b.id === editId ? { ...b, image_url: form.image_url, title: form.title || null, link_url: form.link_url || null, active: form.active } : b);
      setBanners(updated); save(updated);
      toast.success('Banner atualizado');
    } else {
      if (isOk()) {
        const { data, error } = await supabase.from('banners')
          .insert({ client_id: clientConfig.id, image_url: form.image_url, title: form.title || null, link_url: form.link_url || null, active: form.active, sort_order: banners.length })
          .select();
        setSaving(false);
        if (error) { toast.error('Erro ao criar', { description: error.message }); return; }
        const updated = [...banners, data![0] as Banner];
        setBanners(updated); save(updated);
      } else {
        const updated = [...banners, { id: generateUUID(), image_url: form.image_url, title: form.title || null, link_url: form.link_url || null, active: form.active, sort_order: banners.length, created_at: new Date().toISOString() }];
        setBanners(updated); save(updated); setSaving(false);
      }
      toast.success('Banner criado');
    }
    setOpen(false); setForm(emptyForm()); setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (isOk()) { const { error } = await supabase.from('banners').delete().eq('id', id).eq('client_id', clientConfig.id); if (error) { toast.error('Erro ao excluir'); return; } }
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated); save(updated); toast.success('Banner removido');
  };

  const handleToggle = async (banner: Banner) => {
    if (isOk()) { const { error } = await supabase.from('banners').update({ active: !banner.active }).eq('id', banner.id).eq('client_id', clientConfig.id); if (error) { toast.error('Erro ao atualizar', { description: error.message }); return; } }
    const updated = banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b);
    setBanners(updated); save(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.5)' }}>{banners.length} banner(s) — aparecem em carrossel entre o Hero e os produtos</p>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-xs px-3 py-2">
          <Plus className="w-3.5 h-3.5" />Novo Banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-10 rounded-2xl"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-primary opacity-40" />
          <p className="text-sm text-white font-bold">Nenhum banner cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map(banner => (
            <div key={banner.id} className="flex items-center gap-4 rounded-2xl overflow-hidden"
              style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
              <div className="w-24 h-16 flex-shrink-0 overflow-hidden">
                <img src={banner.image_url} alt={banner.title ?? 'Banner'} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-2">
                <p className="font-semibold text-sm text-white truncate">{banner.title ?? 'Sem título'}</p>
                {banner.link_url && <p className="text-xs mt-0.5 truncate" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{banner.link_url}</p>}
              </div>
              <div className="flex items-center gap-2 pr-4">
                <Switch checked={banner.active} onCheckedChange={() => handleToggle(banner)} />
                <button onClick={() => openEdit(banner)} className="p-2 rounded-lg transition-colors hover:text-primary" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 rounded-lg transition-colors hover:text-red-400" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? 'Editar Banner' : 'Novo Banner'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <ImageUploadField label="Imagem do Banner" bucket="banners" aspect="wide"
              value={form.image_url} onChange={url => setForm(p => ({...p, image_url: url}))} />
            <div className="space-y-1.5">
              <Label className="text-xs">Título (opcional)</Label>
              <Input placeholder="Promoção de Verão" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Link ao clicar (opcional)</Label>
              <Input placeholder="/produtos ou https://..." value={form.link_url} onChange={e => setForm(p => ({...p, link_url: e.target.value}))} className="text-sm" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
              <Label className="text-xs">Ativo</Label>
              <Switch checked={form.active} onCheckedChange={v => setForm(p => ({...p, active: v}))} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid hsla(255,255%,255%,0.1)', color: 'hsla(45,20%,96%,0.6)' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Salvar' : 'Criar Banner'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
