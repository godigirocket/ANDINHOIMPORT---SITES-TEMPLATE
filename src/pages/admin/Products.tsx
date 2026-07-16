import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical, Eye, EyeOff, Loader2, Star, GripVertical, ImageIcon, ChevronDown, Flame, Sparkles, Gift, Tag, Gem, Target, Rocket, DollarSign, Lock, PackageCheck, Award, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProductStore, type ProductFormData, productSchema, type Product } from '@/lib/stores/productStore';
import { getNicheConfig } from '@/config/niche';
import { uploadImage, compressImage, deleteImage, replaceImage } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';

// Pega badges do nicho configurado
const nicheConfig = getNicheConfig();
const BADGE_PRESETS = nicheConfig.badges;

// Mapeamento de badges para ícones (mesmo do ProductsSection)
const BADGE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  '50% OFF': Tag,
  'LANÇAMENTO': Zap,
  'PROMOÇÃO': Tag,
  'NOVO': Sparkles,
  'EXCLUSIVO': Gem,
  'DESTAQUE': Target,
  'MAIS VENDIDO': Rocket,
  'MELHOR PREÇO': DollarSign,
  'LACRADO': Lock,
  'PRONTA ENTREGA': PackageCheck,
  'TOP': Award,
  'OFERTA': Gift,
};

const emptyForm = (): ProductFormData => ({
  title:'', description:'', price:0, old_price:null,
  installments:12, image_url:null, affiliate_link:null,
  status:'active', category:'', badge:'', featured:false,
});

function ImagePreview({ src }: { src: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const prevSrc = useRef(src);

  // Reset quando src muda
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    if (error) setError(false);
    if (loaded) setLoaded(false);
  }

  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,hsla(220,20%,11%,1),hsla(220,20%,8%,1))' }}>
        <ImageIcon className="w-10 h-10" style={{ color: 'hsla(43,96%,52%,0.3)' }} />
        <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Sem imagem</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4"
        style={{ background: 'linear-gradient(135deg,hsla(220,20%,11%,1),hsla(220,20%,8%,1))' }}>
        <ImageIcon className="w-10 h-10" style={{ color: 'hsla(43,96%,52%,0.3)' }} />
        <p className="text-xs font-semibold" style={{ color: 'hsla(45,20%,96%,0.5)' }}>Não carregou</p>
        {!src.startsWith('data:') && (
          <a href={src} target="_blank" rel="noopener noreferrer"
            className="text-[10px] underline" style={{ color: 'hsl(43,96%,52%)' }}>
            Testar URL →
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,hsla(220,20%,11%,1),hsla(220,20%,8%,1))' }}>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}
      <img
        key={src}
        src={src}
        alt="Preview"
        className={`w-full h-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}

function ProductImageUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File, _oldUrl?: string | null) => {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    setUploading(true);
    try {
      // Converte direto pra base64 — funciona sempre, sem depender de servidor
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      onChange(base64);
      toast.success('Imagem adicionada');
    } catch {
      toast.error('Erro ao processar imagem');
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
          <ImagePreview src={value} />
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
        <Input placeholder="Ex: 50% OFF" value={value}
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
          {BADGE_PRESETS.map(b => {
            const Icon = BADGE_ICON_MAP[b];
            return (
              <button key={b} type="button" onClick={() => { onChange(b); setOpen(false); }}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                style={{
                  background: value === b ? 'hsla(43,96%,52%,0.2)' : 'hsla(220,20%,12%,0.8)',
                  border: `1px solid ${value === b ? 'hsla(43,96%,52%,0.5)' : 'hsla(255,255%,255%,0.06)'}`,
                  color: value === b ? 'hsl(43,96%,52%)' : 'hsla(45,20%,96%,0.7)',
                }}>
                {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
                {b}
              </button>
            );
          })}
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
  const [form, setForm] = useState<ProductFormData & Record<string, unknown>>(emptyForm());
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
      setForm({ 
        title: product.title, 
        description: product.description ?? '', 
        price: product.price, 
        old_price: product.old_price ?? null, 
        installments: product.installments, 
        image_url: product.image_url ?? null, 
        affiliate_link: product.affiliate_link ?? null, 
        status: product.status, 
        category: product.category ?? '', 
        badge: product.badge ?? '', 
        featured: product.featured,
        // Campos do nicho
        size: product.size ?? '',
        color: product.color ?? '',
        weight: product.weight ?? '',
        volume: product.volume ?? '',
        flavor: product.flavor ?? '',
        brand: product.brand ?? '',
        model: product.model ?? '',
        expiration: product.expiration ?? '',
        ingredients: product.ingredients ?? '',
        nutritional_info: product.nutritional_info ?? '',
      } as ProductFormData & Record<string, unknown>);
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
    if (!validate()) {
      toast.error('Erro de validação', {
        description: 'Por favor, corrija os erros no formulário destacados em vermelho.'
      });
      return;
    }
    setIsSaving(true);
    const { error } = selected ? await updateProduct(selected.id, form) : await createProduct(form);
    setIsSaving(false);
    if (error) {
      toast.error('Erro ao salvar o produto', {
        description: error,
        duration: 6000,
      });
      return;
    }
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
            {formErrors.image_url && <p className="text-xs text-destructive mt-1">{formErrors.image_url}</p>}
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input placeholder="iPhone 15 Pro Max 256GB" {...f('title')} />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea placeholder="256GB — Titânio Natural, novo lacrado" rows={2} {...f('description')} />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
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
                  value={form.old_price ?? ''} onChange={e => { const v = parseFloat(e.target.value); setForm(p => ({ ...p, old_price: isNaN(v) ? null : v })); }}
                  className={`text-sm ${formErrors.old_price ? 'border-destructive' : ''}`} />
                {formErrors.old_price && <p className="text-xs text-destructive">{formErrors.old_price}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Parcelas (até {clientConfig.features.maxInstallments}x)</Label>
                <Input type="number" min="1" max={clientConfig.features.maxInstallments}
                  value={form.installments} onChange={e => setForm(p => ({ ...p, installments: parseInt(e.target.value) || 1 }))}
                  className={`text-sm ${formErrors.installments ? 'border-destructive' : ''}`} />
                {formErrors.installments && <p className="text-xs text-destructive">{formErrors.installments}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Input placeholder="apple, xiaomi..." {...f('category')} />
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>
            </div>

            {/* Campos Dinâmicos por Nicho */}
            {(nicheConfig.productFields.size || nicheConfig.productFields.color || nicheConfig.productFields.brand || nicheConfig.productFields.model) && (
              <div className="grid grid-cols-2 gap-3">
                {nicheConfig.productFields.size && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tamanho</Label>
                    <Input placeholder="P, M, G, GG..." value={form.size ?? ''} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} className="text-sm" />
                  </div>
                )}
                {nicheConfig.productFields.color && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Cor</Label>
                    <Input placeholder="Preto, Branco..." value={form.color ?? ''} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="text-sm" />
                  </div>
                )}
                {nicheConfig.productFields.brand && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Marca</Label>
                    <Input placeholder="Apple, Samsung..." value={form.brand ?? ''} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="text-sm" />
                  </div>
                )}
                {nicheConfig.productFields.model && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Modelo</Label>
                    <Input placeholder="iPhone 15 Pro..." value={form.model ?? ''} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} className="text-sm" />
                  </div>
                )}
              </div>
            )}

            {(nicheConfig.productFields.weight || nicheConfig.productFields.volume || nicheConfig.productFields.flavor) && (
              <div className="grid grid-cols-2 gap-3">
                {nicheConfig.productFields.weight && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Peso</Label>
                    <Input placeholder="1kg, 500g..." value={form.weight ?? ''} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} className="text-sm" />
                  </div>
                )}
                {nicheConfig.productFields.volume && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Volume</Label>
                    <Input placeholder="1L, 500ml..." value={form.volume ?? ''} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} className="text-sm" />
                  </div>
                )}
                {nicheConfig.productFields.flavor && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sabor</Label>
                    <Input placeholder="Chocolate, Morango..." value={form.flavor ?? ''} onChange={e => setForm(p => ({ ...p, flavor: e.target.value }))} className="text-sm" />
                  </div>
                )}
              </div>
            )}

            {nicheConfig.productFields.expiration && (
              <div className="space-y-1.5">
                <Label className="text-xs">Validade</Label>
                <Input type="date" value={form.expiration ?? ''} onChange={e => setForm(p => ({ ...p, expiration: e.target.value }))} className="text-sm" />
              </div>
            )}

            {nicheConfig.productFields.ingredients && (
              <div className="space-y-1.5">
                <Label className="text-xs">Ingredientes</Label>
                <Textarea placeholder="Lista de ingredientes..." value={form.ingredients ?? ''} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))} className="text-sm resize-none" rows={3} />
              </div>
            )}

            {nicheConfig.productFields.nutritionalInfo && (
              <div className="space-y-1.5">
                <Label className="text-xs">Informação Nutricional</Label>
                <Textarea placeholder="Calorias, proteínas, carboidratos..." value={form.nutritional_info ?? ''} onChange={e => setForm(p => ({ ...p, nutritional_info: e.target.value }))} className="text-sm resize-none" rows={3} />
              </div>
            )}

            <BadgeSelector value={form.badge ?? ''} onChange={v => setForm(p => ({ ...p, badge: v }))} />
            {formErrors.badge && <p className="text-xs text-destructive">{formErrors.badge}</p>}
            <div className="space-y-1.5">
              <Label className="text-xs">Link Afiliado (opcional)</Label>
              <Input type="url" placeholder="https://..." {...f('affiliate_link')} />
              {formErrors.affiliate_link && <p className="text-xs text-destructive">{formErrors.affiliate_link}</p>}
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

function AdminProductImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <ImageIcon className="w-10 h-10" style={{ color: 'hsla(43,96%,52%,0.2)' }} />
        <span className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.25)' }}>Erro ao carregar</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
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
          <AdminProductImage src={product.image_url} alt={product.title} />
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
