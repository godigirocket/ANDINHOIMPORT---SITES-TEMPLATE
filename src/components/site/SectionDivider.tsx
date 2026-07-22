/**
 * Divisor entre seções — linha blur com glow dourado sutil.
 */
export function SectionDivider() {
  return (
    <div className="relative py-8 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-xl h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,183,0,0.3), transparent)' }} />
      <div className="absolute w-32 h-8 rounded-full" style={{ background: 'rgba(245,183,0,0.08)', filter: 'blur(20px)' }} />
    </div>
  );
}
