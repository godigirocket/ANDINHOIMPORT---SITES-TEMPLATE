import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowUpRight, Headphones, Smartphone, TabletSmartphone, Watch } from 'lucide-react';

const categories = [
  {
    title: 'iPhone',
    kicker: 'Apple original',
    text: 'Modelos lacrados, com nota e garantia.',
    href: '/produtos?categoria=apple',
    icon: Smartphone,
    accent: '#57D4FF',
    glow: 'rgba(87,212,255,0.28)',
    wash: 'rgba(87,212,255,0.10)',
  },
  {
    title: 'Xiaomi',
    kicker: 'Performance',
    text: 'Linha premium e custo-beneficio forte.',
    href: '/produtos?categoria=xiaomi',
    icon: TabletSmartphone,
    accent: '#FF7A1A',
    glow: 'rgba(255,122,26,0.28)',
    wash: 'rgba(255,122,26,0.11)',
  },
  {
    title: 'Smartwatch',
    kicker: 'Dia a dia',
    text: 'Apple Watch e relogios inteligentes.',
    href: '/produtos?categoria=smartwatch',
    icon: Watch,
    accent: '#A78BFA',
    glow: 'rgba(167,139,250,0.30)',
    wash: 'rgba(167,139,250,0.12)',
  },
  {
    title: 'Acessorios',
    kicker: 'Kit completo',
    text: 'Fones, carregadores e extras originais.',
    href: '/produtos?categoria=accessory',
    icon: Headphones,
    accent: '#25D366',
    glow: 'rgba(37,211,102,0.25)',
    wash: 'rgba(37,211,102,0.10)',
  },
];

export function CategoryNav() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16" style={{ background: 'linear-gradient(180deg, #070709 0%, #101014 54%, #08080a 100%)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="pointer-events-none absolute left-[8%] top-8 h-56 w-56 rounded-full bg-[#57D4FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary sm:text-[11px]">Catalogo premium</p>
            <h2 className="font-display text-[clamp(1.55rem,2.8vw,2.5rem)] font-black tracking-tight text-white">
              Escolha sua linha
            </h2>
          </div>
          <Link to="/produtos" className="hidden rounded-full border border-primary/25 bg-primary/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-primary transition-all hover:border-primary/50 hover:bg-primary/15 sm:block">
            Ver tudo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className="animated-container group relative min-h-[132px] overflow-hidden rounded-[22px] p-4 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[184px] sm:p-5"
              style={{
                '--accent': item.accent,
                background: `linear-gradient(155deg, rgba(255,255,255,0.11), rgba(255,255,255,0.035) 48%, ${item.wash}), radial-gradient(circle at 18% 12%, ${item.glow}, transparent 42%)`,
                border: `1px solid color-mix(in srgb, ${item.accent} 46%, rgba(255,255,255,0.12))`,
                boxShadow: `0 22px 46px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.14), 0 0 28px ${item.glow}`,
              } as CSSProperties}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-80 blur-2xl" style={{ background: item.glow }} />
              <div className="absolute inset-x-4 bottom-0 h-px opacity-80" style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }} />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl sm:h-12 sm:w-12"
                  style={{ background: `${item.accent}1f`, border: `1px solid ${item.accent}66`, boxShadow: `0 0 24px ${item.glow}` }}>
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: item.accent }} />
                </div>
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[10px] font-black text-white/58">
                  0{index + 1}
                </span>
              </div>

              <div className="relative mt-5 sm:mt-7">
                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: item.accent }}>{item.kicker}</p>
                <h3 className="font-display text-[17px] font-black leading-none text-white transition-colors group-hover:text-[var(--accent)] sm:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-[22ch] text-[11px] leading-snug text-white/62 sm:text-sm sm:leading-relaxed">{item.text}</p>
              </div>

              <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] text-white/70 transition-all group-hover:bg-[var(--accent)] group-hover:text-black sm:bottom-4 sm:right-4">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <Link to="/produtos" className="mt-4 flex h-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-black uppercase tracking-[0.18em] text-primary sm:hidden">
          Ver tudo
        </Link>
      </div>
    </section>
  );
}
