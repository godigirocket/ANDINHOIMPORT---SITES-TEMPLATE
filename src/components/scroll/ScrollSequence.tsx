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
  const activeRef = useRef(false);
  const drawnFrameRef = useRef(-1);
  const lastVideoTimeRef = useRef(-1);
  const [isPinned, setIsPinned] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

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

    const ensureTick = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgressRef.current = Math.min(1, Math.max(0, -rect.top / scrollable));
      activeRef.current = rect.top < window.innerHeight * 1.15 && rect.bottom > -window.innerHeight * 0.15;
      setPinned(rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5);
      if (activeRef.current) ensureTick();
    };

    const drawImage = (image: HTMLImageElement) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.75);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const nextWidth = Math.round(width * dpr);
      const nextHeight = Math.round(height * dpr);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
        firstImage.onload = () => {
          drawImage(firstImage);
          drawnFrameRef.current = 0;
          setIsCanvasReady(true);
        };
        if (firstImage.complete && firstImage.naturalWidth > 0) {
          drawImage(firstImage);
          drawnFrameRef.current = 0;
          setIsCanvasReady(true);
        }
      }
    }

    function tick() {
      rafRef.current = undefined;
      smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.12;

      if (hasFrames) {
        const images = imagesRef.current;
        const index = Math.min(images.length - 1, Math.round(smoothProgressRef.current * (images.length - 1)));
        const image = images[index];
        if (index !== drawnFrameRef.current && image?.complete && image.naturalWidth > 0) {
          drawImage(image);
          drawnFrameRef.current = index;
        }
      } else if (hasVideo && video?.duration) {
        const nextTime = smoothProgressRef.current * video.duration;
        if (Math.abs(nextTime - lastVideoTimeRef.current) > 0.02) {
          video.currentTime = nextTime;
          lastVideoTimeRef.current = nextTime;
        }
      }

      const stillSettling = Math.abs(targetProgressRef.current - smoothProgressRef.current) > 0.001;
      if (activeRef.current && stillSettling) ensureTick();
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    ensureTick();

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
            className={`${isPinned ? 'fixed' : 'absolute'} top-0 left-0 z-[1] block h-screen w-screen object-cover transition-opacity duration-300 ${isCanvasReady ? 'opacity-0' : 'opacity-100'}`}
            decoding="async"
          />
          <canvas
            ref={canvasRef}
            aria-label="Produto em destaque"
            className={`${isPinned ? 'fixed' : 'sticky'} top-0 z-[2] block h-screen w-screen`}
          />
          <div
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} top-0 left-0 z-[3] h-40 w-screen pointer-events-none`}
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.62), rgba(0,0,0,0.22) 46%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} bottom-0 left-0 z-[3] h-44 w-screen pointer-events-none`}
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.24) 42%, rgba(0,0,0,0.78) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} inset-y-0 left-0 z-[3] w-[22vw] pointer-events-none`}
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.38), transparent)' }}
          />
          <div
            aria-hidden="true"
            className={`${isPinned ? 'fixed' : 'absolute'} inset-y-0 right-0 z-[3] w-[22vw] pointer-events-none`}
            style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.42), transparent)' }}
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
          className="sticky top-0 block w-full h-screen object-cover shadow-[inset_0_34px_56px_rgba(0,0,0,0.48),inset_0_-38px_70px_rgba(0,0,0,0.58)]"
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

