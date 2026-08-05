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
  fetchLeads: () => Promise<void>;
  createLead: (data: LeadInput) => Promise<void>;
  updateLead: (id: string, data: Partial<LeadInput>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

const LOCAL_KEY = `${clientConfig.id}_leads_v1`;

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

function loadLocal(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(leads: Lead[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(leads)); } catch {}
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: loadLocal(),
  isLoading: false,

  fetchLeads: async () => {
    set({ isLoading: true });
    if (!isSupabaseConfigured()) {
      set({ leads: loadLocal(), isLoading: false });
      return;
    }
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', clientConfig.id)
      .order('created_at', { ascending: false });
    if (error || !data) {
      set({ leads: loadLocal(), isLoading: false });
      return;
    }
    const leads = data as Lead[];
    saveLocal(leads);
    set({ leads, isLoading: false });
  },

  createLead: async (data) => {
    const lead: Lead = {
      id: generateUUID(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const leads = [lead, ...get().leads];
    saveLocal(leads);
    set({ leads });
    if (isSupabaseConfigured()) {
      await supabase.from('leads').insert({ client_id: clientConfig.id, ...lead });
    }
  },

  updateLead: async (id, data) => {
    const leads = get().leads.map(lead =>
      lead.id === id ? { ...lead, ...data, updated_at: new Date().toISOString() } : lead
    );
    saveLocal(leads);
    set({ leads });
    if (isSupabaseConfigured()) {
      await supabase.from('leads').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).eq('client_id', clientConfig.id);
    }
  },

  deleteLead: async (id) => {
    const leads = get().leads.filter(lead => lead.id !== id);
    saveLocal(leads);
    set({ leads });
    if (isSupabaseConfigured()) {
      await supabase.from('leads').delete().eq('id', id).eq('client_id', clientConfig.id);
    }
  },
}));
