import { type ReactNode, type MouseEvent } from 'react';
import { useTilt3D } from '@/hooks/useTilt3D';

interface TiltCardProps {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  intensity?: number;
  onClick?: () => void;
}

/**
 * Card padrão do site: tilt 3D suave seguindo o mouse + glow na borda +
 * spotlight neutro que acompanha o cursor + leve elevação no hover.
 * Usado por produtos, depoimentos, benefícios e features — todo "card"
 * do site compartilha este mesmo efeito.
 */
export function TiltCard({ className = '', style, children, intensity = 6, onClick }: TiltCardProps) {
  const ref = useTilt3D<HTMLDivElement>(intensity);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="tilt-lift" style={{ perspective: '1000px' }}>
      <div
        ref={ref}
        onClick={onClick}
        onMouseMove={onMouseMove}
        className={`glow-on-hover light-follow rounded-2xl ${className}`}
        style={{ transformStyle: 'preserve-3d', ...style }}
      >
        {children}
      </div>
    </div>
  );
}
