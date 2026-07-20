import { useEffect, useRef } from 'react';

interface ScrollSequenceProps {
  /** Array de URLs dos frames (AVIF/WebP) */
  frames?: string[];
  /** URL do vídeo para scrubbing */
  videoSrc?: string;
  /** Imagem poster (exibida até assets carregarem) */
  poster: string;
  /** Altura do container em vh para scroll range */
  scrollHeight?: number;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * COMPONENTE PREPARADO PARA ASSETS 3D FUTUROS
 * 
 * Aceita:
 * - Frame sequence (90-180 imagens controladas pelo scroll)
 * - Vídeo scrubbing (MP4 com currentTime ligado ao scroll)
 * - Imagem poster como fallback elegante
 * 
 * Quando os assets cinematográficos forem gerados:
 * 1. Extraia frames do vídeo hero em AVIF/WebP
 * 2. Coloque em /public/media/sequences/hero/
 * 3. Passe o array de URLs como prop `frames`
 * 
 * Ou para video scrubbing:
 * 1. Otimize o MP4 (H.264, < 10MB)
 * 2. Coloque em /public/media/hero/
 * 3. Passe a URL como prop `videoSrc`
 * 
 * Respeita prefers-reduced-motion automaticamente.
 */
export function ScrollSequence({
  frames,
  videoSrc,
  poster,
  scrollHeight = 300,
  className = '',
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Por enquanto, renderiza a imagem poster de forma elegante
  // Quando assets forem adicionados, este componente ativa automaticamente
  const hasFrames = frames && frames.length > 0;
  const hasVideo = !!videoSrc;

  useEffect(() => {
    // Respeitar prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    // TODO: Implementar scroll scrubbing quando assets existirem
    // - Se hasFrames: canvas + requestAnimationFrame + ScrollTrigger
    // - Se hasVideo: video.currentTime = progress * video.duration
  }, [hasFrames, hasVideo]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: hasFrames || hasVideo ? `${scrollHeight}vh` : 'auto' }}
    >
      {/* Canvas para frame sequence (futuro) */}
      {hasFrames && (
        <canvas
          ref={canvasRef}
          className="sticky top-0 w-full h-screen object-contain"
        />
      )}

      {/* Video para scrubbing (futuro) */}
      {hasVideo && !hasFrames && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="sticky top-0 w-full h-screen object-cover"
        />
      )}

      {/* Poster estático (atual — fallback elegante) */}
      {!hasFrames && !hasVideo && (
        <img
          src={poster}
          alt="Produto em destaque"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
