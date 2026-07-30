import { type ReactNode } from 'react';
import { useTilt3D } from '@/hooks/useTilt3D';

interface TiltCardProps {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  intensity?: number;
  onClick?: () => void;
}

/**
 * Card padrão do site: tilt 3D suave seguindo o mouse + glow na borda no
 * hover. Usado por produtos, depoimentos, benefícios e features — todo
 * "card" do site compartilha este mesmo efeito.
 */
export function TiltCard({ className = '', style, children, intensity = 6, onClick }: TiltCardProps) {
  const ref = useTilt3D<HTMLDivElement>(intensity);
  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={ref}
        onClick={onClick}
        className={`glow-on-hover rounded-2xl ${className}`}
        style={{ transformStyle: 'preserve-3d', ...style }}
      >
        {children}
      </div>
    </div>
  );
}
