/**
 * Divisor entre seções — glass blur com linha dourada.
 */
export function SectionDivider() {
  return (
    <div className="relative py-6 flex items-center justify-center">
      {/* Glow blur background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-12 rounded-full" style={{ background: 'rgba(245,183,0,0.04)', filter: 'blur(30px)' }} />
      </div>
      {/* Line */}
      <div className="relative w-full max-w-3xl flex items-center gap-4 px-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,183,0,0.2))' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(43,96%,52%)', boxShadow: '0 0 8px rgba(245,183,0,0.5)' }} />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(245,183,0,0.2), transparent)' }} />
      </div>
    </div>
  );
}
