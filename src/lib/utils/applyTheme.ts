import { clientConfig } from '@/config/client';

export interface RuntimeTheme {
  primary: string;
  background: string;
}

export function applyTheme(customPrimary?: string, customBg?: string) {
  const root = document.documentElement;
  const primary = customPrimary || clientConfig.brand.colorPrimary;
  const background = customBg || clientConfig.brand.colorBackground;

  root.style.setProperty('--primary', primary);
  root.style.setProperty('--background', background);
  root.style.setProperty('--foreground', clientConfig.brand.colorForeground);

  const [hRaw, sRaw, lRaw] = primary.split(' ');
  const h = parseFloat(hRaw);
  const s = parseFloat(sRaw);
  const l = parseFloat(lRaw);

  root.style.setProperty('--primary-dark', `${h} ${s}% ${Math.max(l - 10, 0)}%`);
  root.style.setProperty('--primary-light', `${h} ${Math.min(s + 4, 100)}% ${Math.min(l + 13, 100)}%`);
  root.style.setProperty('--accent', primary);
  root.style.setProperty('--ring', primary);
  root.style.setProperty('--sidebar-primary', primary);
  root.style.setProperty('--sidebar-ring', primary);
  root.style.setProperty('--primary-foreground', background);
  root.style.setProperty('--accent-foreground', background);
  root.style.setProperty('--sidebar-primary-foreground', background);
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${primary}) 0%, hsl(${h} ${s}% ${Math.max(l - 10, 0)}%) 100%)`);
  root.style.setProperty('--gradient-accent', `linear-gradient(135deg, hsl(${primary}) 0%, hsl(${h} ${Math.min(s + 4, 100)}% ${Math.min(l + 13, 100)}%) 100%)`);
  root.style.setProperty('--shadow-glow', `0 0 40px hsla(${h},${s}%,${l}%,0.3), 0 0 80px hsla(${h},${s}%,${l}%,0.1)`);
  root.style.setProperty('--shadow-accent', `0 0 30px hsla(${h},${s}%,${l}%,0.35)`);
}
