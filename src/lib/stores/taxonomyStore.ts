import { create } from 'zustand';
import { clientConfig } from '@/config/client';
import { supabase } from '@/lib/supabase/client';

const DEFAULTS = ['novo', 'seminovo'];

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return !!url && !!key && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

interface TaxonomyStore {
  conditionOptions: string[];
  error: string | null;
  fetchTaxonomy: () => Promise<void>;
  addCondition: (label: string) => Promise<void>;
  removeCondition: (label: string) => Promise<void>;
}

async function persist(conditionOptions: string[]) {
  if (!isSupabaseConfigured()) return 'Supabase nao configurado para este cliente.';

  const { error } = await supabase.from('site_content').upsert(
    {
      client_id: clientConfig.id,
      taxonomy_config: { conditionOptions },
      updated_at: new Date().toISOString(),
    } as any,
    { onConflict: 'client_id' }
  );
  return error?.message ?? null;
}

export const useTaxonomyStore = create<TaxonomyStore>((set, get) => ({
  conditionOptions: DEFAULTS,
  error: null,

  fetchTaxonomy: async () => {
    if (!isSupabaseConfigured()) {
      set({ conditionOptions: DEFAULTS, error: 'Supabase nao configurado para este cliente.' });
      return;
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('taxonomy_config')
      .eq('client_id', clientConfig.id)
      .maybeSingle();

    if (error) {
      set({ error: error.message });
      return;
    }

    const options = (data as any)?.taxonomy_config?.conditionOptions;
    set({
      conditionOptions: Array.isArray(options) && options.length > 0 ? options : DEFAULTS,
      error: null,
    });
  },

  addCondition: async (label) => {
    const clean = label.trim();
    if (!clean) return;
    const exists = get().conditionOptions.some(c => c.toLowerCase() === clean.toLowerCase());
    if (exists) return;

    const next = [...get().conditionOptions, clean];
    const error = await persist(next);
    if (error) {
      set({ error });
      return;
    }
    set({ conditionOptions: next, error: null });
  },

  removeCondition: async (label) => {
    const next = get().conditionOptions.filter(c => c !== label);
    const final = next.length > 0 ? next : DEFAULTS;
    const error = await persist(final);
    if (error) {
      set({ error });
      return;
    }
    set({ conditionOptions: final, error: null });
  },
}));
