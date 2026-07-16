import { create } from 'zustand';
import { clientConfig } from '@/config/client';

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

const LOCAL_KEY = `${clientConfig.id}_payment_config_v1`;

function loadLocal(): PaymentConfig {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch { return defaultConfig; }
}
function saveLocal(c: PaymentConfig) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(c)); } catch {}
}

interface PaymentStore {
  config: PaymentConfig;
  fetchConfig: () => void;
  saveConfig: (data: Partial<PaymentConfig>) => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  config: loadLocal(),

  fetchConfig: () => {
    set({ config: loadLocal() });
  },

  saveConfig: (data) => {
    const merged = { ...get().config, ...data };
    saveLocal(merged);
    set({ config: merged });
  },
}));
