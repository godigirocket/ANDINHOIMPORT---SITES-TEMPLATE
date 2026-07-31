import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Instagram as InstagramIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { generateUUID } from '@/lib/utils/uuid';
import { clientConfig } from '@/config/client';

interface InstagramPost {
  id: string; img: string; url: string | null; caption: string | null;
  active: boolean; sort_order: number; created_at: string;
}

const LOCAL_KEY = `${clientConfig.id}_instagram_posts_v2`;
const DEFAULT_POSTS: InstagramPost[] = [
  { id: '1', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80&auto=format&fit=crop', url: 'https://www.instagram.com/andinhoimport/', caption: 'iPhone 15 Pro Max disponível!', active: true, sort_order: 0, created_at: '' },
];
const load = (): InstagramPost[] => { try { const r = localStorage.getItem(LOCAL_KEY); const p = r ? JSON.parse(r) : []; return p.length > 0 ? p : DEFAULT_POSTS; } catch { return DEFAULT_POSTS; } };
const save = (p: InstagramPost[]) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(p)); } catch {} };
const isOk = () => { const u = import.meta.env.VITE_SUPABASE_URL as string; return !!u && u !== 'https://placeholder.supabase.co' && u.includes('supabase.co'); };
const emptyForm = () => ({ img: '', url: '', caption: '', active: true });

export default function AdminInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>(load());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (!isOk()) return;
    setLoading(true);
    supabase.from('instagram_posts').select('*').eq('client_id', clientConfig.id).order('sort_order')
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) { setPosts(data as InstagramPost[]); save(data as InstagramPost[]); }
        else if (error) { toast.error('Erro ao carregar posts', { description: error.message }); }
      });
  }, []);

  const handleCreate = async () => {
    if (!form.img) { toast.error('Adicione a URL da imagem'); return; }
    setSaving(true);
    if (isOk()) {
      const { data, error } = await supabase.from('instagram_posts')
        .insert({ client_id: clientConfig.id, img: form.img, url: form.url || null, caption: form.caption || null, active: form.active, sort_order: posts.length })
        .select();
      setSaving(false);
      if (error) { toast.error('Erro ao criar', { description: error.message }); return; }
      const updated = [...posts, data![0] as InstagramPost];
      setPosts(updated); save(updated);
    } else {
      const updated = [...posts, { id: generateUUID(), img: form.img, url: form.url || null, caption: form.caption || null, active: form.active, sort_order: posts.length, created_at: new Date().toISOString() }];
      setPosts(updated); save(updated); setSaving(false);
    }
    toast.success('Post adicionado');
    setOpen(false); setForm(emptyForm());
  };

  const handleDelete = async (id: string) => {
    if (isOk()) { const { error } = await supabase.from('instagram_posts').delete().eq('id', id).eq('client_id', clientConfig.id); if (error) { toast.error('Erro ao excluir'); return; } }
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated); save(updated); toast.success('Post removido');
  };

  const handleToggle = async (post: InstagramPost) => {
    if (isOk()) { const { error } = await supabase.from('instagram_posts').update({ active: !post.active }).eq('id', post.id).eq('client_id', clientConfig.id); if (error) { toast.error('Erro ao atualizar', { description: error.message }); return; } }
    const updated = posts.map(p => p.id === post.id ? { ...p, active: !p.active } : p);
    setPosts(updated); save(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Instagram</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>{posts.length} post(s) — aparecem na galeria do site</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-gold flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Novo Post
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <InstagramIcon className="w-12 h-12 mx-auto mb-3 text-primary opacity-40" />
            <p className="text-white font-bold mb-1">Nenhum post</p>
            <p className="text-sm mb-5" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Adicione fotos para a galeria do Instagram no site</p>
            <button onClick={() => setOpen(true)} className="btn-gold text-sm"><Plus className="w-4 h-4 mr-2 inline" />Adicionar Post</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map(post => (
              <div key={post.id} className="relative rounded-2xl overflow-hidden group"
                style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
                <div className="aspect-square overflow-hidden">
                  <img src={post.img} alt={post.caption ?? 'Post'} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs line-clamp-2" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{post.caption || 'Sem legenda'}</p>
                  <div className="flex items-center justify-between">
                    <Switch checked={post.active} onCheckedChange={() => handleToggle(post)} />
                    <button onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg transition-colors hover:text-red-400"
                      style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Post</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">URL da Imagem *</Label>
              <Input placeholder="https://..." value={form.img} onChange={e => setForm(p => ({...p, img: e.target.value}))} className="text-sm" />
            </div>
            {form.img && (
              <div className="aspect-square w-24 rounded-lg overflow-hidden" style={{ border: '1px solid hsla(43,96%,52%,0.25)' }}>
                <img src={form.img} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Link do post (opcional)</Label>
              <Input placeholder="https://www.instagram.com/p/..." value={form.url} onChange={e => setForm(p => ({...p, url: e.target.value}))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Legenda (opcional)</Label>
              <Input placeholder="iPhone 15 Pro Max disponível!" value={form.caption} onChange={e => setForm(p => ({...p, caption: e.target.value}))} className="text-sm" />
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
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
