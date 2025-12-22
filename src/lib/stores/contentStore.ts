import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clientConfig } from '@/config/client';
import { SiteContent } from '@/types';

interface ContentStore {
  content: SiteContent;
  isLoading: boolean;
  
  fetchContent: () => void;
  updateHero: (data: Partial<SiteContent['hero']>) => void;
  updateFeatures: (features: SiteContent['features']) => void;
  updateSocialProof: (data: Partial<SiteContent['socialProof']>) => void;
  updateCta: (data: Partial<SiteContent['cta']>) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = `${clientConfig.id}_content`;

const defaultContent: SiteContent = {
  hero: clientConfig.initialContent.hero,
  features: clientConfig.initialContent.features,
  products: clientConfig.initialContent.products,
  socialProof: clientConfig.initialContent.socialProof,
  cta: clientConfig.initialContent.cta
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: defaultContent,
      isLoading: false,
      
      fetchContent: () => {
        set({ isLoading: true });
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const content = stored ? JSON.parse(stored) : defaultContent;
          set({ content, isLoading: false });
        } catch {
          set({ content: defaultContent, isLoading: false });
        }
      },
      
      updateHero: (data) => {
        set(state => {
          const content = {
            ...state.content,
            hero: { ...state.content.hero, ...data }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          return { content };
        });
      },
      
      updateFeatures: (features) => {
        set(state => {
          const content = { ...state.content, features };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          return { content };
        });
      },
      
      updateSocialProof: (data) => {
        set(state => {
          const content = {
            ...state.content,
            socialProof: { ...state.content.socialProof, ...data }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          return { content };
        });
      },
      
      updateCta: (data) => {
        set(state => {
          const content = {
            ...state.content,
            cta: { ...state.content.cta, ...data }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          return { content };
        });
      },
      
      resetToDefaults: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
        set({ content: defaultContent });
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ content: state.content })
    }
  )
);
