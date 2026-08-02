import { create } from 'zustand';
import { clientConfig } from '@/config/client';

const KEY = `${clientConfig.id}_condition_options`;
const DEFAULTS = ['novo', 'seminovo'];

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length > 0 ? arr : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function save(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* noop */ }
}

interface TaxonomyStore {
  conditionOptions: string[];
  addCondition: (label: string) => void;
  removeCondition: (label: string) => void;
}

/**
 * Opções de "condição" (novo, seminovo, usado, recondicionado...) — editável
 * pelo admin em vez de fixo no código. Guardado local por enquanto (mesmo
 * padrão de outras configs do site quando o Supabase não tem tabela própria
 * pra isso ainda).
 */
export const useTaxonomyStore = create<TaxonomyStore>((set, get) => ({
  conditionOptions: load(),

  addCondition: (label) => {
    const clean = label.trim();
    if (!clean) return;
    const exists = get().conditionOptions.some(c => c.toLowerCase() === clean.toLowerCase());
    if (exists) return;
    const next = [...get().conditionOptions, clean];
    save(next);
    set({ conditionOptions: next });
  },

  removeCondition: (label) => {
    const next = get().conditionOptions.filter(c => c !== label);
    const final = next.length > 0 ? next : DEFAULTS;
    save(final);
    set({ conditionOptions: final });
  },
}));
