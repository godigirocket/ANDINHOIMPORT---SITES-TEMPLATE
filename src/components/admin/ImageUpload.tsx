import { useRef, useState, useCallback } from 'react';
import { Upload, X, Link, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImage, compressImage, type StorageBucket } from '@/lib/supabase/storage';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: StorageBucket;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, bucket, label = 'Imagem', className }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && value.startsWith('http') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Apenas imagens são aceitas.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Arquivo muito grande. Máximo 10MB.');
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const compressed = await compressImage(file);
        const url = await uploadImage(bucket, compressed);
        onChange(url);
      } catch (err: any) {
        // Fallback: usa URL de objeto local para preview (sem Supabase)
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
        setUploadError('Supabase não configurado — usando preview local (não persistido).');
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUrlConfirm = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label>{label}</Label>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            mode === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'bg-surface/50 text-muted-foreground hover:text-foreground'
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            mode === 'url'
              ? 'bg-primary text-primary-foreground'
              : 'bg-surface/50 text-muted-foreground hover:text-foreground'
          )}
        >
          <Link className="w-3.5 h-3.5" />
          URL externa
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border border-border/50 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border/50 hover:border-primary/50 hover:bg-surface/50'
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Enviando...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Arraste ou clique para enviar</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP até 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL Input */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlConfirm()}
          />
          <Button type="button" variant="outline" onClick={handleUrlConfirm} size="sm">
            OK
          </Button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-amber-400">{uploadError}</p>
      )}
    </div>
  );
}
