import { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  frames?: string[];
  videoSrc?: string;
  poster: string;
  scrollHeight?: number;
  className?: string;
}

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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number>();
  const pinnedRef = useRef(false);
  const [isPinned, setIsPinned] = useState(false);

  const hasFrames = !!frames?.length;
  const hasVideo = !!videoSrc;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!container) return;

    const setPinned = (next: boolean) => {
      if (pinnedRef.current === next) return;
      pinnedRef.current = next;
      setIsPinned(next);
    };

    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgressRef.current = Math.min(1, Math.max(0, -rect.top / scrollable));
      setPinned(rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5);
    };

    const drawImage = (image: HTMLImageElement) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const nextWidth = Math.round(width * dpr);
      const nextHeight = Math.round(height * dpr);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
      const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.drawImage(image, x, y, drawWidth, drawHeight);
    };

    if (hasFrames && frames) {
      imagesRef.current = frames.map(src => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        return image;
      });
      const firstImage = imagesRef.current[0];
      if (firstImage) {
        firstImage.onload = () => drawImage(firstImage);
        if (firstImage.complete && firstImage.naturalWidth > 0) drawImage(firstImage);
      }
    }

    const tick = () => {
      smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.12;

      if (hasFrames) {
        const images = imagesRef.current;
        const index = Math.min(images.length - 1, Math.round(smoothProgressRef.current * (images.length - 1)));
        const image = images[index];
        if (image?.complete && image.naturalWidth > 0) drawImage(image);
      } else if (hasVideo && video?.duration) {
        video.currentTime = smoothProgressRef.current * video.duration;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frames, hasFrames, hasVideo]);

  return (
    <div
      ref={containerRef}
      className={`relative ml-[calc(50%-50vw)] w-screen max-w-none overflow-clip ${className}`}
      style={{ height: hasFrames || hasVideo ? `${scrollHeight}vh` : 'auto' }}
    >
      {hasFrames && (
        <>
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} top-0 left-0 z-[1] block h-screen w-screen object-cover`}
            decoding="async"
          />
          <canvas
            ref={canvasRef}
            aria-label="Produto em destaque"
            className={`${isPinned ? 'fixed' : 'sticky'} top-0 z-[2] block h-screen w-screen`}
          />
          <div
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} bottom-0 left-0 z-[3] h-28 w-screen pointer-events-none`}
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(8,8,10,0.82))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              maskImage: 'linear-gradient(180deg, transparent, black 55%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent, black 55%)',
            }}
          />
        </>
      )}

      {hasVideo && !hasFrames && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="sticky top-0 block w-full h-screen object-cover"
        />
      )}

      {!hasFrames && !hasVideo && (
        <img
          src={poster}
          alt="Produto em destaque"
          className="block w-full h-full object-cover"
        />
      )}
    </div>
  );
}
