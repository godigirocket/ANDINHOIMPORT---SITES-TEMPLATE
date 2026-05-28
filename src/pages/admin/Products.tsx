import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical, Eye, EyeOff, Loader2, Star, GripVertical, ImageIcon, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProductStore, type ProductFormData, productSchema, type Product } from '@/lib/stores/productStore';
import { uploadImage, compressImage, deleteImage, replaceImage } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';

const BADGE_PRESETS = [
  '🔥 50% OFF','⚡ LANÇAMENTO','🏷️ PROMOÇÃO','✨ NOVO',
  '💎 EXCLUSIVO','🎯 DESTAQUE','🚀 MAIS VENDIDO','💰 MELHOR PREÇO',
  '🔒 LACRADO','📦 PRONTA ENTREGA','⭐ TOP','🎁 OFERTA',
];

const emptyForm = (): ProductFormData => ({
  title:'', description:'', price:0, old_price:null,
  installments:12, image_url:null, affiliate_link:null,
  status:'active', category:'', badge:'', featured:false,
});

function ProductImageUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File, oldUrl?: string | null) => {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 1200, 0.88);
      const url = (oldUrl && oldUrl.includes('supabase.co'))
        ? await replaceImage('products', compressed, oldUrl)
        : await uploadImage('products', compressed);
      onChange(url);
      toast.success('Imagem enviada com sucesso');
    } catch {
      onChange(URL.createObjectURL(file));
      toast.warning('Preview local — configure Supabase Storage para persistir');
    } finally { setUploading(false); }
  };

  const handleRemove = () => {
    if (value && value.includes('supabase.co')) {
      deleteImage('products', value).catch(() => {});
    }
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">Imagem do Produto</Label>
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden group"
          style={{ border: '1px solid hsla(43,96%,52%,0.25)' }}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button"
              onClick={() => ref.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'hsl(43,96%,52%)', color: 'hsl(220,20%,4%)' }}>
              Trocar
            </button>
            <button type="button" onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: 'hsl(0,84%,60%)' }}>
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
          style={{ border: '2px dashed hsla(43,96%,52%,0.3)', background: 'hsla(43,96%,52%,0.04)' }}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.1)'; }}
          onDragLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)'; }}
          onDrop={e => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)';
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f, value);
          }}>
          {uploading
            ? <><Loader2 className="w-6 h-6 text-primary animate-spin" /><span className="text-xs text-primary">Enviando...</span></>
            : <><ImageIcon className="w-8 h-8 text-primary opacity-50" /><span className="text-xs text-primary font-semibold">Arraste ou clique para enviar</span><span className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.3)' }}>PNG, JPG, WEBP até 10MB</span></>}
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f, value); e.target.value = ''; }} />
      <Input placeholder="Ou cole uma URL de imagem..." value={value ?? ''}
        onChange={e => onChange(e.target.value || null)} className="text-xs" />
    </div>
  );
}

function BadgeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Badge / Etiqueta</Label>
      <div className="flex gap-2">
        <Input placeholder="Ex: 🔥 50% OFF" value={value}
          onChange={e => onChange(e.target.value)} className="text-xs flex-1" />
        <button type="button" onClick={() => setOpen(!open)}
          className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 flex-shrink-0"
          style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.3)', color: 'hsl(43,96%,52%)' }}>
          Presets <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      {open && (
        <div className="grid grid-cols-2 gap-1.5 p-3 rounded-xl"
          style={{ background: 'hsla(220,20%,9%,0.95)', border: '1px solid hsla(43,96%,52%,0.15)' }}>
          {BADGE_PRESETS.map(b => (
            <button key={b} type="button" onClick={() => { onChange(b); setOpen(false); }}
              className="text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: value === b ? 'hsla(43,96%,52%,0.2)' : 'hsla(220,20%,12%,0.8)',
                border: `1px solid ${value === b ? 'hsla(43,96%,52%,0.5)' : 'hsla(255,255%,255%,0.06)'}`,
                color: value === b ? 'hsl(43,96%,52%)' : 'hsla(45,20%,96%,0.7)',
              }}>
              {b}
            </button>
          ))}
          <button type="button" onClick={() => { onChange(''); setOpen(false); }}
            className="col-span-2 text-center px-2.5 py-1.5 rounded-lg text-xs"
            style={{ background: 'hsla(0,84%,60%,0.1)', border: '1px solid hsla(0,84%,60%,0.2)', color: 'hsl(0,84%,60%)' }}>
            Remover badge
          </button>
        </div>
      )}
    </div>
  );
}

function useDragSort(items: Product[], onReorder: (ids: string[]) => void) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const handleDragStart = (i: number) => { dragItem.current = i; };
  const handleDragEnter = (i: number) => { dragOver.current = i; };
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null || dragItem.current === dragOver.current) {
      dragItem.current = null; dragOver.current = null; return;
    }
    const copy = [...items];
    const [dragged] = copy.splice(dragItem.current, 1);
    copy.splice(dragOver.current, 0, dragged);
    onReorder(copy.map(p => p.id));
    dragItem.current = null; dragOver.current = null;
  };
  return { handleDragStart, handleDragEnter, handleDragEnd };
}

export default function AdminProducts() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, toggleStatus, searchProducts, reorderProducts } = useProductStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localOrder, setLocalOrder] = useState<Product[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setLocalOrder(products); }, [products]);

  const handleReorder = useCallback(async (orderedIds: string[]) => {
    const reordered = orderedIds.map((id, i) => ({ ...localOrder.find(p => p.id === id)!, sort_order: i }));
    setLocalOrder(reordered);
    await reorderProducts(orderedIds);
    toast.success('Ordem salva');
  }, [localOrder, reorderProducts]);

  const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSort(localOrder, handleReorder);
  const filtered = search ? searchProducts(search) : localOrder;
  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  const openModal = (product?: Product) => {
    if (product) {
      setSelected(product);
      setForm({ title: product.title, description: product.description ?? '', price: product.price, old_price: product.old_price ?? null, installments: product.installments, image_url: product.image_url ?? null, affiliate_link: product.affiliate_link ?? null, status: product.status, category: product.category ?? '', badge: product.badge ?? '', featured: product.featured });
    } else { setSelected(null); setForm(emptyForm()); }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const r = productSchema.safeParse(form);
    if (r.success) { setFormErrors({}); return true; }
    const e: Record<string, string> = {};
    r.error.errors.forEach(err => { if (err.path[0]) e[String(err.path[0])] = err.message; });
    setFormErrors(e); return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    const { error } = selected ? await updateProduct(selected.id, form) : await createProduct(form);
    setIsSaving(false);
    if (error) { toast.error('Erro ao salvar', { description: error }); return; }
    toast.success(selected ? 'Produto atualizado' : 'Produto criado');
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    // Remove imagem do Storage ao deletar produto
    if (selected.image_url && selected.image_url.includes('supabase.co')) {
      deleteImage('products', selected.image_url).catch(() => {});
    }
    setIsDeleting(true);
    const { error } = await deleteProduct(selected.id);
    setIsDeleting(false);
    if (error) { toast.error('Erro ao excluir', { description: error }); return; }
    toast.success('Produto excluído');
    setIsDeleteOpen(false); setSelected(null);
  };

  const f = (key: keyof ProductFormData) => ({
    value: (form[key] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
    className: `text-sm ${formErrors[key] ? 'border-destructive' : ''}`,
  });

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">Produtos</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              {products.length} produto(s) · <span className="text-primary">Arraste ⠿ para reordenar</span>
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-gold flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Novo Produto
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsla(45,20%,96%,0.35)' }} />
          <Input placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <div key={product.id}
                draggable={!search}
                onDragStart={() => { handleDragStart(i); setDragIdx(i); }}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={() => { handleDragEnd(); setDragIdx(null); }}
                onDragOver={e => e.preventDefault()}
                style={{ opacity: dragIdx === i ? 0.45 : 1, transition: 'opacity 0.15s' }}>
                <ProductCard product={product} fmt={fmt} showDrag={!search}
                  onEdit={() => openModal(product)}
                  onDelete={() => { setSelected(product); setIsDeleteOpen(true); }}
                  onToggle={() => toggleStatus(product.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'hsla(43,96%,52%,0.08)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <p className="text-white font-bold mb-1">{search ? 'Nenhum resultado' : 'Nenhum produto'}</p>
            <p className="text-sm mb-6" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{search ? 'Tente outra busca' : 'Adicione seu primeiro produto'}</p>
            {!search && <button onClick={() => openModal()} className="btn-gold text-sm"><Plus className="w-4 h-4 mr-2 inline" />Adicionar Produto</button>}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>{selected ? 'Atualize as informações' : 'Preencha os dados do produto'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <ProductImageUpload value={form.image_url ?? null} onChange={url => setForm(p => ({ ...p, image_url: url }))} />
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input placeholder="iPhone 15 Pro Max 256GB" {...f('title')} />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea placeholder="256GB — Titânio Natural, novo lacrado" rows={2} {...f('description')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Preço (R$) *</Label>
                <Input type="number" step="0.01" min="0" placeholder="5499.00"
                  value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  className={`text-sm ${formErrors.price ? 'border-destructive' : ''}`} />
                {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Preço Antigo (R$)</Label>
                <Input type="number" step="0.01" min="0" placeholder="6299.00"
                  value={form.old_price ?? ''} onChange={e => { const v = parseFloat(e.target.value); setForm(p => ({ ...p, old_price: isNaN(v) ? null : v })); }} className="text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Parcelas (até {clientConfig.features.maxInstallments}x)</Label>
                <Input type="number" min="1" max={clientConfig.features.maxInstallments}
                  value={form.installments} onChange={e => setForm(p => ({ ...p, installments: parseInt(e.target.value) || 1 }))} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Input placeholder="apple, xiaomi..." {...f('category')} />
              </div>
            </div>
            <BadgeSelector value={form.badge ?? ''} onChange={v => setForm(p => ({ ...p, badge: v }))} />
            <div className="space-y-1.5">
              <Label className="text-xs">Link Afiliado (opcional)</Label>
              <Input type="url" placeholder="https://..." {...f('affiliate_link')} />
            </div>
            <div className="space-y-3 p-4 rounded-xl" style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
              <div className="flex items-center justify-between">
                <div><Label className="text-xs">Ativo</Label><p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Aparece no site</p></div>
                <Switch checked={form.status === 'active'} onCheckedChange={v => setForm(p => ({ ...p, status: v ? 'active' : 'inactive' }))} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label className="text-xs">Destaque ⭐</Label><p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Aparece primeiro</p></div>
                <Switch checked={form.featured ?? false} onCheckedChange={v => setForm(p => ({ ...p, featured: v }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid hsla(255,255%,255%,0.1)', color: 'hsla(45,20%,96%,0.6)' }}>
                Cancelar
              </button>
              <button type="submit" disabled={isSaving} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : selected ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Excluir "{selected?.title}"? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ border: '1px solid hsla(255,255%,255%,0.1)', color: 'hsla(45,20%,96%,0.6)' }}>Cancelar</button>
            <button onClick={handleDelete} disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'hsl(0,84%,60%)' }}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Excluir'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function ProductCard({ product, fmt, showDrag, onEdit, onDelete, onToggle }: {
  product: Product; fmt: (p: number) => string; showDrag?: boolean;
  onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: 'linear-gradient(145deg,hsla(220,20%,9%,0.95),hsla(220,20%,7%,0.98))', border: '1px solid hsla(43,96%,52%,0.12)', boxShadow: '0 4px 20px hsla(0,0%,0%,0.3)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px hsla(43,96%,52%,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px hsla(0,0%,0%,0.3)'; }}>

      {showDrag && (
        <div className="absolute top-2 left-2 z-20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'hsla(220,20%,4%,0.85)', cursor: 'grab' }} title="Arraste para reordenar">
          <GripVertical className="w-3.5 h-3.5" style={{ color: 'hsla(45,20%,96%,0.6)' }} />
        </div>
      )}

      <div className="relative aspect-square overflow-hidden"
        style={{ background: 'linear-gradient(135deg,hsla(220,20%,11%,1),hsla(220,20%,8%,1))' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-10 h-10" style={{ color: 'hsla(43,96%,52%,0.2)' }} />
            <span className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.25)' }}>Sem imagem</span>
          </div>
        )}
        <span className="absolute top-2.5 left-8 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: product.status === 'active' ? 'hsla(142,71%,45%,0.9)' : 'hsla(220,20%,20%,0.9)', color: 'white' }}>
          {product.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
        {product.badge && (
          <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-black max-w-[calc(100%-16px)] truncate"
            style={{ background: 'linear-gradient(135deg,hsl(43,96%,52%),hsl(38,92%,44%))', color: 'hsl(220,20%,4%)', boxShadow: '0 0 10px hsla(43,96%,52%,0.5)' }}>
            {product.badge}
          </span>
        )}
        {product.featured && (
          <div className="absolute top-2.5 right-8 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'hsla(43,96%,52%,0.9)', boxShadow: '0 0 8px hsla(43,96%,52%,0.6)' }}>
            <Star className="w-3 h-3 fill-current" style={{ color: 'hsl(220,20%,4%)' }} />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              style={{ background: 'hsla(220,20%,4%,0.85)' }}>
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onToggle}>{product.status === 'active' ? <><EyeOff className="w-4 h-4 mr-2" />Desativar</> : <><Eye className="w-4 h-4 mr-2" />Ativar</>}</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm text-white line-clamp-1 mb-0.5">{product.title}</h3>
        <p className="text-xs line-clamp-1 mb-3" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{product.description ?? 'Sem descrição'}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-black text-sm text-primary">{fmt(product.price)}</span>
            {product.old_price && <span className="text-xs line-through ml-1.5" style={{ color: 'hsla(45,20%,96%,0.3)' }}>{fmt(product.old_price)}</span>}
          </div>
          <span className="text-xs" style={{ color: 'hsla(45,20%,96%,0.35)' }}>{product.installments}x</span>
        </div>
      </div>
    </div>
  );
}
