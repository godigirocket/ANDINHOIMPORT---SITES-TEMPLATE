/**
 * Tracking unificado: dispara eventos para GA4, Meta Pixel e TikTok Pixel.
 * Os pixels devem ter sido carregados antes (via Index.tsx).
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: { track: (...args: any[]) => void; page: () => void };
    dataLayer?: any[];
  }
}

type EventName =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  | 'generate_lead'
  | 'whatsapp_click';

const META_EVENT_MAP: Record<string, string> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  add_payment_info: 'AddPaymentInfo',
  purchase: 'Purchase',
  generate_lead: 'Lead',
  whatsapp_click: 'Contact',
};

const TIKTOK_EVENT_MAP: Record<string, string> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  add_payment_info: 'AddPaymentInfo',
  purchase: 'CompletePayment',
  generate_lead: 'SubmitForm',
  whatsapp_click: 'Contact',
};

export function trackEvent(name: EventName, params: Record<string, any> = {}) {
  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params);
    }
    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      const fbName = META_EVENT_MAP[name];
      if (fbName) {
        window.fbq('track', fbName, params);
      } else {
        window.fbq('trackCustom', name, params);
      }
    }
    // TikTok Pixel
    if (typeof window !== 'undefined' && window.ttq) {
      const ttName = TIKTOK_EVENT_MAP[name];
      if (ttName) {
        window.ttq.track(ttName, params);
      }
    }
  } catch (err) {
    console.warn('[track]', err);
  }
}

/**
 * Captura UTMs da URL e salva em sessionStorage para envio posterior.
 */
export function captureUTMs() {
  try {
    const url = new URL(window.location.href);
    const utms: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(key => {
      const v = url.searchParams.get(key);
      if (v) utms[key] = v;
    });
    if (Object.keys(utms).length > 0) {
      sessionStorage.setItem('_utms', JSON.stringify(utms));
    }
  } catch {
    // ignore
  }
}

export function getUTMs(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem('_utms');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
