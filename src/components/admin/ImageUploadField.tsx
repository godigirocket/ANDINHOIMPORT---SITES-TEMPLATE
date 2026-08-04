import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImage, compressImage, type StorageBucket } from '@/lib/supabase/storage';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Bucket do Supabase Storage — só existem 'products' | 'banners' | 'testimonials'. */
  bucket: StorageBucket;
  /** Subpasta dentro do bucket (opcional), pra organizar por origem (ex: 'hero', 'instagram'). */
  subfolder?: string;
  /** Formato do preview: quadrado (avatares, posts) ou paisagem (banners, hero). */
  aspect?: 'square' | 'wide';
}

/**
 * Campo de imagem único do admin: upload por arquivo (clique ou arrastar,
 * comprime e envia pro Supabase Storage) OU colar uma URL — usado em
 * Banners, Galeria do Instagram, Avatar de Depoimentos e Hero, pra não
 * ter um jeito de enviar imagem diferente em cada tela.
 */
export function ImageUploadField({ label, value, onChange, bucket, subfolder = '', aspect = 'wide' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 1920, 0.9);
      const url = await uploadImage(bucket, compressed, subfolder);
      onChange(url);
      toast.success('Imagem enviada');
    } catch {
      onChange(URL.createObjectURL(file));
      toast.info('Preview aplicado. Salve uma URL publica ou configure o Storage para persistir o upload.');
    } finally {
      setUploading(false);
    }
  };

  const previewClass = aspect === 'square' ? 'w-24 h-24' : 'w-full h-32';

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {value ? (
        <div className={`relative ${previewClass} rounded-xl overflow-hidden group`}
          style={{ border: '1px solid hsla(43,96%,52%,0.25)' }}>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'hsla(0,84%,60%,0.8)' }}>
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div className={`${previewClass} rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all`}
          style={{ border: '2px dashed hsla(43,96%,52%,0.3)', background: 'hsla(43,96%,52%,0.04)' }}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.1)'; }}
          onDragLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)'; }}
          onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)'; const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-primary animate-spin" /><span className="text-xs text-primary">Enviando...</span></>
            : <><Upload className="w-5 h-5 text-primary opacity-60" /><span className="text-xs text-primary font-semibold text-center px-2">Arraste ou clique</span></>}
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      <Input placeholder="Ou cole uma URL..." value={value} onChange={e => onChange(e.target.value)} className="text-xs" />
    </div>
  );
}
