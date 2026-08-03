/**
 * Divisor entre seções — glass blur com linha dourada.
 */
export function SectionDivider() {
  return (
    <div className="relative py-1 flex items-center justify-center">
      {/* Glow blur background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-8 rounded-full" style={{ background: 'rgba(245,183,0,0.035)', filter: 'blur(24px)' }} />
      </div>
      {/* Linha com brilho em movimento (transform-only, GPU-safe) */}
      <div className="relative w-full max-w-xl flex items-center gap-4 px-5">
        <div className="divider-glow-line flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,183,0,0.15))' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(43,96%,52%)', boxShadow: '0 0 6px rgba(245,183,0,0.45)' }} />
        <div className="divider-glow-line flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(245,183,0,0.15), transparent)' }} />
      </div>
    </div>
  );
}
