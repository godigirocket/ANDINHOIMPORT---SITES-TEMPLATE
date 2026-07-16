import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Instagram as InstagramIcon, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { clientConfig } from '@/config/client';

interface InstagramPost {
  id: string;
  url: string;
  img: string;
  caption: string;
}

const LOCAL_KEY = `${clientConfig.id}_instagram_posts`;

function loadLocal(): InstagramPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return DEFAULT_POSTS;
    return JSON.parse(raw);
  } catch { return DEFAULT_POSTS; }
}

function saveLocal(posts: InstagramPost[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(posts)); } catch {}
}

const DEFAULT_POSTS: InstagramPost[] = [
  { id:'1', url:'https://www.instagram.com/p/DObPY6cjlKo/', img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80&auto=format&fit=crop', caption:'iPhone 15 Pro Max disponível!' },
  { id:'2', url:'https://www.instagram.com/p/C1pzytvPSdT/', img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop', caption:'Xiaomi 14 Ultra chegou!' },
  { id:'3', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80&auto=format&fit=crop', caption:'Apple Watch Series 9' },
  { id:'4', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80&auto=format&fit=crop', caption:'Parcelamento em até 18x' },
  { id:'5', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80&auto=format&fit=crop', caption:'Produtos originais garantidos' },
  { id:'6', url:'https://www.instagram.com/andinhoimport/', img:'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&q=80&auto=format&fit=crop', caption:'Entrega rápida para todo Brasil' },
];

export default function AdminInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>(loadLocal());
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ url: '', img: '', caption: '' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { setPosts(loadLocal()); }, []);

  const handleSave = () => {
    if (!form.img || !form.caption) { toast.error('Preencha imagem e legenda'); return; }
    setSaving(true);
    setTimeout(() => {
      if (editId) {
        const updated = posts.map(p => p.id === editId ? { ...p, ...form } : p);
        setPosts(updated);
        saveLocal(updated);
        toast.success('Post atualizado');
      } else {
        const newPost = { id: Date.now().toString(), ...form };
        const updated = [...posts, newPost];
        setPosts(updated);
        saveLocal(updated);
        toast.success('Post adicionado');
      }
      setOpen(false);
      setForm({ url: '', img: '', caption: '' });
      setEditId(null);
      setSaving(false);
    }, 300);
  };

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveLocal(updated);
    toast.success('Post removido');
  };

  const handleEdit = (post: InstagramPost) => {
    setForm({ url: post.url, img: post.img, caption: post.caption });
    setEditId(post.id);
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Instagram</h1>
            <p className="text-sm text-muted-foreground">Gerencie as imagens da galeria do Instagram no site</p>
          </div>
          <button onClick={() => { setForm({ url: '', img: '', caption: '' }); setEditId(null); setOpen(true); }}
            className="btn-gold flex items-center gap-2 text-xs px-4 py-2">
            <Plus className="w-4 h-4" />
            Novo Post
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {posts.map(post => (
            <div key={post.id} className="glass-card p-2 group">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                <img src={post.img} alt={post.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(post)}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:scale-110 transition-transform">
                    <InstagramIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:scale-110 transition-transform">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs line-clamp-2 text-muted-foreground">{post.caption}</p>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Editar Post' : 'Novo Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>URL do Post (opcional)</Label>
                <Input placeholder="https://www.instagram.com/p/..." value={form.url}
                  onChange={e => setForm(p => ({...p, url: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <Label>URL da Imagem *</Label>
                <Input placeholder="https://..." value={form.img}
                  onChange={e => setForm(p => ({...p, img: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <Label>Legenda *</Label>
                <Input placeholder="iPhone 15 Pro Max disponível!" value={form.caption}
                  onChange={e => setForm(p => ({...p, caption: e.target.value}))} />
              </div>
              {form.img && (
                <div className="aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={form.img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <button onClick={handleSave} disabled={saving}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {editId ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
