import { useEffect, useState } from 'react';
import { Save, Loader2, ExternalLink, Info, BarChart3, Facebook, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContentStore, type SiteContentData } from '@/lib/stores/contentStore';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl"
      style={{ background: 'hsla(43,96%,52%,0.06)', border: '1px solid hsla(43,96%,52%,0.18)' }}>
      <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{text}</p>
    </div>
  );
}

function PixelCard({ icon: Icon, title, desc, link, linkLabel, placeholder, value, onChange, configured }: {
  icon: React.ElementType; title: string; desc: string; link: string; linkLabel: string;
  placeholder: string; value: string; onChange: (v: string) => void; configured: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.45)' }}>{desc}</p>
          </div>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline">
          {linkLabel} <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">ID / Measurement ID</Label>
        <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="text-sm" />
      </div>
      {configured && (
        <div className="flex items-center gap-2 text-xs"
          style={{ color: 'hsla(142,71%,45%,1)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(142,71%,45%)' }} />
          Configurado: {value}
        </div>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const { content, fetchContent, saveContent, isSaving } = useContentStore();
  const [form, setForm] = useState({ ga_id: '', meta_pixel: '', tiktok_pixel: '' });

  useEffect(() => {
    fetchContent().then(() => {
      const c = useContentStore.getState().content;
      setForm({ ga_id: c.ga_id, meta_pixel: c.meta_pixel, tiktok_pixel: c.tiktok_pixel });
    });
  }, [fetchContent]);

  const handleSave = async () => {
    const { error } = await saveContent(form as Partial<SiteContentData>);
    if (error) toast.error('Erro ao salvar', { description: error });
    else toast.success('Analytics salvo com sucesso');
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Analytics & Pixels</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              Configure rastreamento de visitas e conversões
            </p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="btn-gold flex items-center gap-2 text-sm disabled:opacity-60">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar</>}
          </button>
        </div>

        <InfoBox text="Os IDs são injetados automaticamente no <head> da landing page. Deixe em branco para desativar." />

        <PixelCard icon={BarChart3} title="Google Analytics 4" desc="Rastreie visitas e comportamento"
          link="https://analytics.google.com" linkLabel="Abrir GA4"
          placeholder="G-XXXXXXXXXX" value={form.ga_id} onChange={v => setForm(p => ({...p, ga_id: v}))}
          configured={!!form.ga_id} />

        <PixelCard icon={Facebook} title="Meta Pixel (Facebook/Instagram)" desc="Rastreie conversões para anúncios"
          link="https://business.facebook.com/events_manager" linkLabel="Events Manager"
          placeholder="123456789012345" value={form.meta_pixel} onChange={v => setForm(p => ({...p, meta_pixel: v}))}
          configured={!!form.meta_pixel} />

        <PixelCard icon={TrendingUp} title="TikTok Pixel" desc="Rastreie conversões de anúncios TikTok"
          link="https://ads.tiktok.com" linkLabel="TikTok Ads"
          placeholder="CXXXXXXXXXXXXXXXXX" value={form.tiktok_pixel} onChange={v => setForm(p => ({...p, tiktok_pixel: v}))}
          configured={!!form.tiktok_pixel} />
      </div>
    </AdminLayout>
  );
}
