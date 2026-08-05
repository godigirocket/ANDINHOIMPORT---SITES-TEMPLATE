import { create } from 'zustand';
import { clientConfig } from '@/config/client';
import { supabase } from '@/lib/supabase/client';

export type PaymentMode = 'whatsapp' | 'checkout';

export interface PaymentConfig {
  mode: PaymentMode;
  pix_enabled: boolean;
  pix_key: string;
  pix_key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  pix_recipient_name: string;
  pix_city: string;
  stripe_enabled: boolean;
  stripe_public_key: string;
  mercadopago_enabled: boolean;
  mercadopago_public_key: string;
  redirect_whatsapp_after_payment: boolean;
  redirect_whatsapp_message: string;
}

const defaultConfig: PaymentConfig = {
  mode: 'whatsapp',
  pix_enabled: true,
  pix_key: '',
  pix_key_type: 'cpf',
  pix_recipient_name: clientConfig.company.legalName,
  pix_city: clientConfig.company.location.city,
  stripe_enabled: false,
  stripe_public_key: '',
  mercadopago_enabled: false,
  mercadopago_public_key: '',
  redirect_whatsapp_after_payment: true,
  redirect_whatsapp_message: 'Olá! Acabei de realizar o pagamento do pedido #{orderId}. Segue comprovante.',
};

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return !!url && !!key && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

interface PaymentStore {
  config: PaymentConfig;
  error: string | null;
  fetchConfig: () => Promise<void>;
  saveConfig: (data: Partial<PaymentConfig>) => Promise<{ error: string | null }>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  config: defaultConfig,
  error: null,

  fetchConfig: async () => {
    if (!isSupabaseConfigured()) {
      set({ config: defaultConfig, error: 'Supabase nao configurado para este cliente.' });
      return;
    }
    const { data, error } = await supabase
      .from('site_content')
      .select('payment_config')
      .eq('client_id', clientConfig.id)
      .maybeSingle();
    if (error) {
      set({ error: error.message });
      return;
    }
    set({ config: { ...defaultConfig, ...((data as any)?.payment_config ?? {}) }, error: null });
  },

  saveConfig: async (data) => {
    const merged = { ...get().config, ...data };
    if (!isSupabaseConfigured()) {
      const error = 'Supabase nao configurado para este cliente.';
      set({ error });
      return { error };
    }
    const { error } = await supabase.from('site_content').upsert(
      { client_id: clientConfig.id, payment_config: merged, updated_at: new Date().toISOString() } as any,
      { onConflict: 'client_id' }
    );
    if (error) {
      set({ error: error.message });
      return { error: error.message };
    }
    set({ config: merged });
    return { error: null };
  },
}));
