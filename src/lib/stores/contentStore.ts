import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';

export interface SiteContentData {
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  whatsapp_link: string;
  instagram_link: string;
  support_text: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  ga_id: string;
  meta_pixel: string;
  tiktok_pixel: string;
  // URLs das imagens de fundo do hero — editáveis pelo painel
  hero_bg_1: string;
  hero_bg_2: string;
}

const defaultContent: SiteContentData = {
  hero_title:         clientConfig.initialContent.hero.headline,
  hero_subtitle:      clientConfig.initialContent.hero.subheadline,
  hero_badge:         clientConfig.initialContent.hero.badge,
  cta_primary_text:   clientConfig.initialContent.hero.ctaPrimary,
  cta_secondary_text: clientConfig.initialContent.hero.ctaSecondary,
  whatsapp_link:      `https://wa.me/${clientConfig.company.contact.whatsappNumber}`,
  instagram_link:     clientConfig.company.social.instagram,
  support_text:       clientConfig.initialContent.cta.subheadline,
  contact_phone:      clientConfig.company.contact.phone,
  contact_email:      clientConfig.company.contact.email,
  contact_address:    clientConfig.company.location.address,
  seo_title:          clientConfig.seo.title,
  seo_description:    clientConfig.seo.description,
  seo_keywords:       clientConfig.seo.keywords.join(', '),
  ga_id:              '',
  meta_pixel:         '',
  tiktok_pixel:       '',
  // Imagens padrão de alta qualidade (Unsplash — sem bloqueio)
  hero_bg_1: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=95&auto=format&fit=crop',
  hero_bg_2: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=95&auto=format&fit=crop',
};

const LOCAL_KEY = `${clientConfig.id}_content_v4`;

function loadLocal(): SiteContentData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return defaultContent;
    return { ...defaultContent, ...JSON.parse(raw) };
  } catch { return defaultContent; }
}
function saveLocal(d: SiteContentData) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(d)); } catch {}
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

interface ContentStore {
  content: SiteContentData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
  saveContent: (data: Partial<SiteContentData>) => Promise<{ error: string | null }>;
  resetToDefaults: () => void;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: loadLocal(),
  isLoading: false,
  isSaving: false,
  error: null,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ content: loadLocal(), isLoading: false });
      return;
    }
    const { data, error } = await supabase
      .from('site_content').select('*')
      .eq('client_id', clientConfig.id).maybeSingle();

    if (error) { set({ content: loadLocal(), isLoading: false, error: error.message }); return; }
    if (data) {
      const d = data as any;
      const content: SiteContentData = {
        hero_title:         d.hero_title         ?? defaultContent.hero_title,
        hero_subtitle:      d.hero_subtitle       ?? defaultContent.hero_subtitle,
        hero_badge:         d.hero_badge          ?? defaultContent.hero_badge,
        cta_primary_text:   d.cta_primary_text    ?? defaultContent.cta_primary_text,
        cta_secondary_text: d.cta_secondary_text  ?? defaultContent.cta_secondary_text,
        whatsapp_link:      d.whatsapp_link        ?? defaultContent.whatsapp_link,
        instagram_link:     d.instagram_link       ?? defaultContent.instagram_link,
        support_text:       d.support_text         ?? defaultContent.support_text,
        contact_phone:      d.contact_phone        ?? defaultContent.contact_phone,
        contact_email:      d.contact_email        ?? defaultContent.contact_email,
        contact_address:    d.contact_address      ?? defaultContent.contact_address,
        seo_title:          d.seo_title            ?? defaultContent.seo_title,
        seo_description:    d.seo_description      ?? defaultContent.seo_description,
        seo_keywords:       d.seo_keywords         ?? defaultContent.seo_keywords,
        ga_id:              d.ga_id                ?? '',
        meta_pixel:         d.meta_pixel           ?? '',
        tiktok_pixel:       d.tiktok_pixel         ?? '',
        hero_bg_1:          d.hero_bg_1            ?? defaultContent.hero_bg_1,
        hero_bg_2:          d.hero_bg_2            ?? defaultContent.hero_bg_2,
      };
      saveLocal(content);
      set({ content, isLoading: false });
    } else {
      set({ content: loadLocal(), isLoading: false });
    }
  },

  saveContent: async (data) => {
    set({ isSaving: true, error: null });
    const merged = { ...get().content, ...data };
    if (!isSupabaseConfigured()) {
      saveLocal(merged);
      set({ content: merged, isSaving: false });
      return { error: null };
    }
    const { error } = await supabase.from('site_content').upsert(
      { client_id: clientConfig.id, ...merged, updated_at: new Date().toISOString() },
      { onConflict: 'client_id' }
    );
    if (error) { set({ isSaving: false, error: error.message }); return { error: error.message }; }
    saveLocal(merged);
    set({ content: merged, isSaving: false });
    return { error: null };
  },

  resetToDefaults: () => { saveLocal(defaultContent); set({ content: defaultContent }); },
}));
