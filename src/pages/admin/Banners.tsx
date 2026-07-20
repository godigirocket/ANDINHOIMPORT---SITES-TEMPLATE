import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader2, Upload, ImageIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import { uploadImage, compressImage } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { generateUUID } from '@/lib/utils/uuid';

interface Banner {
  id: string; image_url: string; title: string | null;
  active: boolean; sort_order: number; created_at: string;
}

const LOCAL_KEY = 'andinho-import_banners_v2';
const DEFAULT_BANNERS: Banner[] = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1696446702183-be9605d12d09?w=1200&q=85&auto=format&fit=crop', title: 'Banner principal', link_url: '', active: true, sort_order: 0 },
];
const load = (): Banner[] => { try { const r = localStorage.getItem(LOCAL_KEY); const p = r ? JSON.parse(r) : []; return p.length > 0 ? p : DEFAULT_BANNERS; } catch { return DEFAULT_BANNERS; } };
const save = (b: Banner[]) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(b)); } catch {} };
const isOk = () => { const u = import.meta.env.VITE_SUPABASE_URL as string; return !!u && u !== 'https://placeholder.supabase.co' && u.includes('supabase.co'); };

function BannerImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    setUploading(true);
    try {
      const c = await compressImage(file, 1920, 0.9);
      const url = await uploadImage('banners', c);
      onChange(url); toast.success('Imagem enviada');
    } catch {
      onChange(URL.createObjectURL(file));
      toast.warning('Preview local — configure Supabase Storage');
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">Imagem do Banner</Label>
      {value ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden group"
          style={{ border: '1px solid hsla(43,96%,52%,0.25)' }}>
          <img src={value} alt="Banner" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'hsla(0,84%,60%,0.8)' }}>
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
          style={{ border: '2px dashed hsla(43,96%,52%,0.3)', background: 'hsla(43,96%,52%,0.04)' }}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.1)'; }}
          onDragLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)'; }}
          onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)'; const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-primary animate-spin" /><span className="text-xs text-primary">Enviando...</span></>
            : <><Upload className="w-5 h-5 text-primary opacity-60" /><span className="text-xs text-primary font-semibold">Arraste ou clique</span></>}
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      <Input placeholder="Ou cole uma URL..." value={value} onChange={e => onChange(e.target.value)} className="text-xs" />
    </div>
  );
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>(load());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ image_url: '', title: '', active: true });

  useEffect(() => {
    if (!isOk()) return;
    setLoading(true);
    supabase.from('banners').select('*').order('sort_order')
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) { setBanners(data as Banner[]); save(data as Banner[]); }
      });
  }, []);

  const handleCreate = async () => {
    if (!form.image_url) { toast.error('Adicione uma imagem'); return; }
    setSaving(true);
    if (isOk()) {
      const { data, error } = await supabase.from('banners')
        .insert({ image_url: form.image_url, title: form.title || null, active: form.active, sort_order: banners.length })
        .select();
      setSaving(false);
      if (error) { toast.error('Erro ao criar', { description: error.message }); return; }
      const updated = [...banners, data![0] as Banner];
      setBanners(updated); save(updated);
    } else {
      const updated = [...banners, { id: generateUUID(), image_url: form.image_url, title: form.title || null, active: form.active, sort_order: banners.length, created_at: new Date().toISOString() }];
      setBanners(updated); save(updated); setSaving(false);
    }
    toast.success('Banner criado');
    setOpen(false); setForm({ image_url: '', title: '', active: true });
  };

  const handleDelete = async (id: string) => {
    if (isOk()) { const { error } = await supabase.from('banners').delete().eq('id', id); if (error) { toast.error('Erro ao excluir'); return; } }
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated); save(updated); toast.success('Banner removido');
  };

  const handleToggle = async (banner: Banner) => {
    if (isOk()) await supabase.from('banners').update({ active: !banner.active }).eq('id', banner.id);
    const updated = banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b);
    setBanners(updated); save(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Banners</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>{banners.length} banner(s)</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-gold flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Novo Banner
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-primary opacity-40" />
            <p className="text-white font-bold mb-1">Nenhum banner</p>
            <p className="text-sm mb-5" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Adicione imagens de destaque</p>
            <button onClick={() => setOpen(true)} className="btn-gold text-sm"><Plus className="w-4 h-4 mr-2 inline" />Adicionar Banner</button>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map(banner => (
              <div key={banner.id} className="flex items-center gap-4 rounded-2xl overflow-hidden transition-all"
                style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
                <div className="w-28 h-20 flex-shrink-0 overflow-hidden">
                  <img src={banner.image_url} alt={banner.title ?? 'Banner'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-3">
                  <p className="font-semibold text-sm text-white truncate">{banner.title ?? 'Sem título'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Ordem: {banner.sort_order}</p>
                </div>
                <div className="flex items-center gap-3 pr-4">
                  <Switch checked={banner.active} onCheckedChange={() => handleToggle(banner)} />
                  <button onClick={() => handleDelete(banner.id)}
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
          <DialogHeader><DialogTitle>Novo Banner</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <BannerImageUpload value={form.image_url} onChange={url => setForm(p => ({...p, image_url: url}))} />
            <div className="space-y-1.5">
              <Label className="text-xs">Título (opcional)</Label>
              <Input placeholder="Promoção de Verão" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="text-sm" />
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
              <button onClick={handleCreate} disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Banner'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
