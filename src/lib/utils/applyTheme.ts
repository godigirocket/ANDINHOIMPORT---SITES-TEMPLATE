import { clientConfig } from '@/config/client';

const THEME_STORAGE_KEY = 'andinho_custom_theme';

interface CustomTheme {
  primary: string;
  background: string;
}

/**
 * Salva tema customizado no localStorage
 */
export function saveCustomTheme(primary: string, background: string) {
  const theme: CustomTheme = { primary, background };
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  console.log('✅ [Theme] Salvo no localStorage:', theme);
}

/**
 * Carrega tema customizado do localStorage
 */
export function loadCustomTheme(): CustomTheme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Remove tema customizado (volta pro padrão)
 */
export function clearCustomTheme() {
  localStorage.removeItem(THEME_STORAGE_KEY);
  console.log('✅ [Theme] Tema customizado removido');
}

/**
 * Aplica as cores do clientConfig ou tema customizado como variáveis CSS no :root
 * Isso permite que as cores sejam alteradas dinamicamente
 */
export function applyTheme(customPrimary?: string, customBg?: string) {
  const root = document.documentElement;
  
  // Tenta carregar tema customizado do localStorage
  const savedTheme = loadCustomTheme();
  
  // Prioridade: parâmetros > localStorage > clientConfig
  const primary = customPrimary || savedTheme?.primary || clientConfig.brand.colorPrimary;
  const background = customBg || savedTheme?.background || clientConfig.brand.colorBackground;
  
  // Aplica as cores principais do brand
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--background', background);
  root.style.setProperty('--foreground', clientConfig.brand.colorForeground);
  
  // Deriva cores secundárias baseadas na primary
  const parts = primary.split(' ');
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]);
  const l = parseFloat(parts[2]);
  
  // Primary dark (reduz luminosidade em 10%)
  root.style.setProperty('--primary-dark', `${h} ${s}% ${Math.max(l - 10, 0)}%`);
  
  // Primary light (aumenta luminosidade em 13%)
  root.style.setProperty('--primary-light', `${h} ${Math.min(s + 4, 100)}% ${Math.min(l + 13, 100)}%`);
  
  // Accent (mesma cor da primary)
  root.style.setProperty('--accent', primary);
  root.style.setProperty('--ring', primary);
  root.style.setProperty('--sidebar-primary', primary);
  root.style.setProperty('--sidebar-ring', primary);
  
  // Foreground colors
  root.style.setProperty('--primary-foreground', background);
  root.style.setProperty('--accent-foreground', background);
  root.style.setProperty('--sidebar-primary-foreground', background);
  
  // Atualiza gradientes
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${primary}) 0%, hsl(${h} ${s}% ${Math.max(l - 10, 0)}%) 100%)`);
  root.style.setProperty('--gradient-accent', `linear-gradient(135deg, hsl(${primary}) 0%, hsl(${h} ${Math.min(s + 4, 100)}% ${Math.min(l + 13, 100)}%) 100%)`);
  
  // Atualiza shadows com a cor primary
  root.style.setProperty('--shadow-glow', `0 0 40px hsla(${h},${s}%,${l}%,0.3), 0 0 80px hsla(${h},${s}%,${l}%,0.1)`);
  root.style.setProperty('--shadow-accent', `0 0 30px hsla(${h},${s}%,${l}%,0.35)`);
  
  console.log(`✅ [Theme] Aplicado: primary=${primary}, bg=${background}`);
  console.log(`✅ [Theme] HSL calculado: h=${h}, s=${s}%, l=${l}%`);
}
