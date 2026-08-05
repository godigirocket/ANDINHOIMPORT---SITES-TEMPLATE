import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { generateUUID } from '@/lib/utils/uuid';

export type LeadStatus = 'novo' | 'contato' | 'negociando' | 'ganho' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  interest: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

type LeadInput = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;

interface LeadStore {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  createLead: (data: LeadInput) => Promise<{ error: string | null }>;
  updateLead: (id: string, data: Partial<LeadInput>) => Promise<{ error: string | null }>;
  deleteLead: (id: string) => Promise<{ error: string | null }>;
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return !!url && !!key && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ leads: [], isLoading: false, error: 'Supabase nao configurado para este cliente.' });
      return;
    }
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', clientConfig.id)
      .order('created_at', { ascending: false });
    if (error || !data) {
      set({ leads: [], isLoading: false, error: error?.message ?? 'Erro ao carregar leads.' });
      return;
    }
    const leads = data as Lead[];
    set({ leads, isLoading: false });
  },

  createLead: async (data) => {
    if (!isSupabaseConfigured()) return { error: 'Supabase nao configurado para este cliente.' };
    const lead: Lead = {
      id: generateUUID(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('leads').insert({ client_id: clientConfig.id, ...lead });
    if (error) return { error: error.message };
    set({ leads: [lead, ...get().leads] });
    return { error: null };
  },

  updateLead: async (id, data) => {
    if (!isSupabaseConfigured()) return { error: 'Supabase nao configurado para este cliente.' };
    const updated_at = new Date().toISOString();
    const { error } = await supabase.from('leads').update({ ...data, updated_at }).eq('id', id).eq('client_id', clientConfig.id);
    if (error) return { error: error.message };
    const leads = get().leads.map(lead =>
      lead.id === id ? { ...lead, ...data, updated_at } : lead
    );
    set({ leads });
    return { error: null };
  },

  deleteLead: async (id) => {
    if (!isSupabaseConfigured()) return { error: 'Supabase nao configurado para este cliente.' };
    const { error } = await supabase.from('leads').delete().eq('id', id).eq('client_id', clientConfig.id);
    if (error) return { error: error.message };
    const leads = get().leads.filter(lead => lead.id !== id);
    set({ leads });
    return { error: null };
  },
}));
