import { supabase } from './client';

export type StorageBucket = 'products' | 'banners' | 'testimonials';

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * Retorna a URL pública do arquivo.
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  folder = ''
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(safeName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(safeName);
  return data.publicUrl;
}

/**
 * Remove um arquivo do Supabase Storage pela URL pública.
 * Não lança erro se o arquivo não existir.
 */
export async function deleteImage(bucket: StorageBucket, publicUrl: string): Promise<void> {
  try {
    // Extrai o path relativo da URL pública
    // URL formato: https://xxx.supabase.co/storage/v1/object/public/BUCKET/PATH
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // URL não é do Supabase Storage

    const filePath = decodeURIComponent(publicUrl.slice(idx + marker.length).split('?')[0]);
    if (!filePath) return;

    await supabase.storage.from(bucket).remove([filePath]);
  } catch {
    // Silencia erros de remoção — não crítico
  }
}

/**
 * Troca uma imagem: faz upload da nova e remove a antiga.
 */
export async function replaceImage(
  bucket: StorageBucket,
  newFile: File,
  oldUrl?: string | null,
  folder = ''
): Promise<string> {
  // Upload primeiro
  const newUrl = await uploadImage(bucket, newFile, folder);
  // Remove antiga em background (não bloqueia)
  if (oldUrl && oldUrl.includes('supabase.co')) {
    deleteImage(bucket, oldUrl).catch(() => {});
  }
  return newUrl;
}

/**
 * Comprime uma imagem antes do upload (client-side).
 */
export async function compressImage(
  file: File,
  maxWidthPx = 1200,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (!blob) return reject(new Error('Compressão falhou'));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Falha ao carregar imagem')); };
    img.src = url;
  });
}
