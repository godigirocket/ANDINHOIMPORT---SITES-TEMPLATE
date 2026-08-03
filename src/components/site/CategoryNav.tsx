import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { Headphones, Smartphone, TabletSmartphone, Watch } from 'lucide-react';

const categories = [
  {
    title: 'iPhone',
    text: 'Modelos Apple novos, originais e com garantia.',
    href: '/produtos?categoria=apple',
    icon: Smartphone,
    accent: '#57D4FF',
    glow: 'rgba(87,212,255,0.28)',
  },
  {
    title: 'Xiaomi',
    text: 'Linhas premium e custo-beneficio com estoque consultado.',
    href: '/produtos?categoria=xiaomi',
    icon: TabletSmartphone,
    accent: '#FF7A1A',
    glow: 'rgba(255,122,26,0.28)',
  },
  {
    title: 'Smartwatches',
    text: 'Apple Watch e relogios inteligentes para pronta escolha.',
    href: '/produtos?categoria=smartwatch',
    icon: Watch,
    accent: '#8B5CFF',
    glow: 'rgba(139,92,255,0.28)',
  },
  {
    title: 'Acessorios',
    text: 'Fones e acessorios originais para fechar o kit.',
    href: '/produtos?categoria=accessory',
    icon: Headphones,
    accent: '#25D366',
    glow: 'rgba(37,211,102,0.25)',
  },
];

export function CategoryNav() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-14" style={{ background: '#08080a' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary sm:mb-2 sm:text-[11px]">Catalogo</p>
            <h2 className="font-display text-[clamp(1.25rem,2.4vw,2.15rem)] font-black tracking-tight text-white">
              Escolha por categoria
            </h2>
          </div>
          <Link to="/produtos" className="hidden text-sm font-bold text-white/58 transition-colors hover:text-primary sm:block">
            Ver tudo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {categories.map(item => (
            <Link
              key={item.title}
              to={item.href}
              className="animated-container neon-category-card group relative min-h-[118px] overflow-hidden rounded-xl p-3.5 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[168px] sm:p-5"
              style={{
                '--accent': item.accent,
                '--accent-glow': item.glow,
                background: `radial-gradient(circle at 18% 12%, ${item.glow}, transparent 38%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))`,
                border: `1px solid color-mix(in srgb, ${item.accent} 42%, transparent)`,
                boxShadow: `0 18px 46px rgba(0,0,0,0.24), 0 0 34px ${item.glow}`,
              } as CSSProperties}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-70 blur-2xl" style={{ background: item.glow }} />
              <div className="relative mb-3 flex h-9 w-9 items-center justify-center rounded-lg sm:mb-5 sm:h-11 sm:w-11 sm:rounded-xl"
                style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}55`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 0 24px ${item.glow}` }}>
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: item.accent }} />
              </div>
              <h3 className="relative mb-1 font-display text-[15px] font-black text-white transition-colors group-hover:text-[var(--accent)] sm:mb-2 sm:text-xl">{item.title}</h3>
              <p className="line-clamp-2 max-w-[20ch] text-[11px] leading-snug text-white/54 sm:max-w-[25ch] sm:text-sm sm:leading-relaxed">{item.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
