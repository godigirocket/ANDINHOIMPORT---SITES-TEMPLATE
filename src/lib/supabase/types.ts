export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          old_price: number | null;
          image_url: string | null;
          affiliate_link: string | null;
          category: string | null;
          featured: boolean;
          status: 'active' | 'inactive';
          badge: string | null;
          installments: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          old_price?: number | null;
          image_url?: string | null;
          affiliate_link?: string | null;
          category?: string | null;
          featured?: boolean;
          status?: 'active' | 'inactive';
          badge?: string | null;
          installments?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          old_price?: number | null;
          image_url?: string | null;
          affiliate_link?: string | null;
          category?: string | null;
          featured?: boolean;
          status?: 'active' | 'inactive';
          badge?: string | null;
          installments?: number;
          updated_at?: string;
        };
      };
      site_content: {
        Row: {
          id: string;
          client_id: string;
          hero_title: string | null;
          hero_subtitle: string | null;
          hero_badge: string | null;
          cta_primary_text: string | null;
          cta_secondary_text: string | null;
          whatsapp_link: string | null;
          instagram_link: string | null;
          support_text: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string | null;
          ga_id: string | null;
          meta_pixel: string | null;
          tiktok_pixel: string | null;
          google_search_console_token: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_badge?: string | null;
          cta_primary_text?: string | null;
          cta_secondary_text?: string | null;
          whatsapp_link?: string | null;
          instagram_link?: string | null;
          support_text?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          ga_id?: string | null;
          meta_pixel?: string | null;
          tiktok_pixel?: string | null;
          google_search_console_token?: string | null;
          updated_at?: string;
        };
        Update: {
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_badge?: string | null;
          cta_primary_text?: string | null;
          cta_secondary_text?: string | null;
          whatsapp_link?: string | null;
          instagram_link?: string | null;
          support_text?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          ga_id?: string | null;
          meta_pixel?: string | null;
          tiktok_pixel?: string | null;
          google_search_console_token?: string | null;
          updated_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          image_url: string;
          title: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          title?: string | null;
          active?: boolean;
          sort_order?: number;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          text: string;
          avatar_url: string | null;
          rating: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          text: string;
          avatar_url?: string | null;
          rating?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          text?: string;
          avatar_url?: string | null;
          rating?: number;
          active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string;
          customer_cpf: string | null;
          items: Json;
          total: number;
          method: string;
          status: 'pending_confirmation' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          utms: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          client_id: string;
          customer_name: string;
          customer_email?: string | null;
          customer_phone: string;
          customer_cpf?: string | null;
          items: Json;
          total: number;
          method: string;
          status?: 'pending_confirmation' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          utms?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending_confirmation' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          notes?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
