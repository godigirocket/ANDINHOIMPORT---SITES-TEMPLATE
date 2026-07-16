import { useEffect, useState } from 'react';
import { Save, Loader2, Search, Globe, FileText, Sparkles, Copy, Check, ExternalLink, Info, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentStore, type SiteContentData } from '@/lib/stores/contentStore';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
// Sugere keywords baseadas no nome da empresa, cidade e produtos
function suggestKeywords(companyName: string, city: string, products: { title: string; category: string | null }[]): string[] {
  const base = new Set<string>();
  const company = companyName.toLowerCase();
  if (company) base.add(company);
  if (city) {
    base.add(city.toLowerCase());
    base.add(`${company} ${city.toLowerCase()}`);
  }
  // Categorias e palavras dos títulos (tokens longos)
  const tokens = new Set<string>();
  products.forEach(p => {
    if (p.category) tokens.add(p.category.toLowerCase());
    p.title.toLowerCase().split(/\s+/).forEach(t => {
      if (t.length > 3) tokens.add(t);
    });
  });
  const sorted = Array.from(tokens).slice(0, 8);
  sorted.forEach(t => base.add(t));
  return Array.from(base).slice(0, 15);
}

function InfoBox({ text, type = 'info' }: { text: string; type?: 'info' | 'warning' | 'success' }) {
  const colors = {
    info: { bg: 'hsla(43,96%,52%,0.06)', border: 'hsla(43,96%,52%,0.2)', icon: 'hsl(43,96%,52%)' },
    warning: { bg: 'hsla(25,95%,55%,0.06)', border: 'hsla(25,95%,55%,0.2)', icon: 'hsl(25,95%,55%)' },
    success: { bg: 'hsla(142,71%,45%,0.06)', border: 'hsla(142,71%,45%,0.2)', icon: 'hsl(142,71%,45%)' },
  }[type];
  const Icon = type === 'warning' ? AlertCircle : Info;
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: colors.icon }} />
      <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.7)' }}>{text}</p>
    </div>
  );
}

export default function AdminSEO() {
  const { content, fetchContent, saveContent, isSaving } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const [form, setForm] = useState<SiteContentData>(content);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetchContent();
    fetchProducts();
  }, [fetchContent, fetchProducts]);

  useEffect(() => {
    setForm(content);
  }, [content]);

  const set = <K extends keyof SiteContentData>(key: K, value: SiteContentData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const { error } = await saveContent(form);
    if (error) toast.error('Erro ao salvar', { description: error });
    else toast.success('SEO salvo com sucesso');
  };

  const generateSuggestions = () => {
    const suggestions = suggestKeywords(
      clientConfig.company.name + ' ' + clientConfig.company.nameHighlight,
      clientConfig.company.location.city,
      products
    );
    set('seo_keywords', suggestions.join(', '));
    toast.success('Keywords geradas com base nos seus produtos');
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copiado');
    setTimeout(() => setCopied(''), 2000);
  };

  const titleLen = form.seo_title.length;
  const descLen = form.seo_description.length;
  const titleStatus = titleLen < 30 ? 'short' : titleLen > 60 ? 'long' : 'good';
  const descStatus = descLen < 120 ? 'short' : descLen > 160 ? 'long' : 'good';

  // URL base do site (para sitemap/robots)
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seu-site.com';

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout

Sitemap: ${siteUrl}/sitemap.xml`;

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">SEO & Google</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              Apareça no Google · Otimização para buscas
            </p>
          </div>
          <button onClick={handleSave} disabled={isSaving}
            className="btn-gold flex items-center gap-2 text-sm disabled:opacity-60">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>

        {/* Title & Description */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'hsla(43,96%,52%,0.12)' }}>
              <Search className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Como aparece no Google</h3>
              <p className="text-xs text-white/40">Título e descrição que o Google exibe</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Título da página</Label>
              <span className={`text-[10px] font-bold ${titleStatus === 'good' ? 'text-green-400' : titleStatus === 'short' ? 'text-amber-400' : 'text-red-400'}`}>
                {titleLen}/60 {titleStatus === 'good' ? '✓' : titleStatus === 'short' ? '(curto)' : '(longo)'}
              </span>
            </div>
            <Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)}
              placeholder="Sua loja - Produtos importados com garantia" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Meta description</Label>
              <span className={`text-[10px] font-bold ${descStatus === 'good' ? 'text-green-400' : descStatus === 'short' ? 'text-amber-400' : 'text-red-400'}`}>
                {descLen}/160 {descStatus === 'good' ? '✓' : descStatus === 'short' ? '(curto)' : '(longo)'}
              </span>
            </div>
            <Textarea rows={3} value={form.seo_description} onChange={e => set('seo_description', e.target.value)}
              placeholder="Compre celulares importados com parcelamento em 18x e entrega rápida." />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Keywords (separadas por vírgula)</Label>
              <button onClick={generateSuggestions}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                style={{ background: 'hsla(43,96%,52%,0.15)', border: '1px solid hsla(43,96%,52%,0.3)', color: 'hsl(43,96%,52%)' }}>
                <Sparkles className="w-3 h-3" /> Gerar automaticamente
              </button>
            </div>
            <Input value={form.seo_keywords} onChange={e => set('seo_keywords', e.target.value)}
              placeholder="iphone, xiaomi, importados, sua-cidade" />
          </div>

          {/* Preview Google */}
          <div className="p-4 rounded-xl space-y-1"
            style={{ background: 'hsla(0,0%,100%,0.04)', border: '1px solid hsla(255,255%,255%,0.08)' }}>
            <p className="text-[10px] font-semibold text-white/40 mb-2">PREVIEW GOOGLE</p>
            <p className="text-blue-400 text-base font-medium line-clamp-1 leading-snug">{form.seo_title || 'Título da página'}</p>
            <p className="text-green-500 text-xs">{siteUrl.replace('https://', '').replace('http://', '')}</p>
            <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">{form.seo_description || 'Descrição que aparece nos resultados...'}</p>
          </div>
        </div>

        {/* Google Search Console */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'hsla(200,100%,60%,0.12)' }}>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Search Console</h3>
              <p className="text-xs text-white/40">Verifique seu site no Google</p>
            </div>
          </div>

          <InfoBox text="Esse código é fornecido pelo Google ao adicionar seu site no Search Console. Cole apenas o conteúdo do meta tag (a parte depois de content=)." />

          <ol className="text-xs space-y-1.5 pl-4 list-decimal" style={{ color: 'hsla(45,20%,96%,0.6)' }}>
            <li>Acesse <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">search.google.com/search-console</a></li>
            <li>Adicione propriedade do tipo <strong>Prefixo do URL</strong></li>
            <li>Escolha verificação por <strong>Tag HTML</strong></li>
            <li>Copie só o valor do <code className="px-1 rounded text-[10px]" style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>content="..."</code> e cole abaixo</li>
            <li>Salve, recarregue o site, volte no Google e clique em <strong>Verificar</strong></li>
          </ol>

          <div className="space-y-1.5">
            <Label className="text-xs">Token de verificação Google</Label>
            <Input value={form.google_search_console_token ?? ''}
              onChange={e => set('google_search_console_token', e.target.value)}
              placeholder="abc123def456..." className="text-xs font-mono" />
          </div>
        </div>

        {/* Sitemap & Robots */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'hsla(280,80%,65%,0.12)' }}>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sitemap & Robots</h3>
              <p className="text-xs text-white/40">Arquivos que ajudam o Google a indexar</p>
            </div>
          </div>

          <InfoBox text="O sitemap e o robots.txt já estão disponíveis nas URLs abaixo. Submeta o sitemap no Search Console depois de verificar o site." />

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Sitemap</p>
                <p className="text-[10px] truncate" style={{ color: 'hsla(45,20%,96%,0.5)' }}>{siteUrl}/sitemap.xml</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                </a>
                <button onClick={() => copy(`${siteUrl}/sitemap.xml`, 'sitemap-url')}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5">
                  {copied === 'sitemap-url' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'hsla(220,20%,9%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">robots.txt</p>
                <p className="text-[10px] truncate" style={{ color: 'hsla(45,20%,96%,0.5)' }}>{siteUrl}/robots.txt</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                </a>
                <button onClick={() => copy(`${siteUrl}/robots.txt`, 'robots-url')}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5">
                  {copied === 'robots-url' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
                </button>
              </div>
            </div>
          </div>

          <details className="rounded-xl p-3"
            style={{ background: 'hsla(220,20%,9%,0.5)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
            <summary className="text-xs font-semibold cursor-pointer text-white/60 hover:text-white">Ver conteúdo do sitemap.xml</summary>
            <pre className="mt-2 p-2 text-[10px] font-mono whitespace-pre-wrap" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
              {sitemapXml}
            </pre>
          </details>

          <details className="rounded-xl p-3"
            style={{ background: 'hsla(220,20%,9%,0.5)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
            <summary className="text-xs font-semibold cursor-pointer text-white/60 hover:text-white">Ver conteúdo do robots.txt</summary>
            <pre className="mt-2 p-2 text-[10px] font-mono whitespace-pre-wrap" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
              {robotsTxt}
            </pre>
          </details>
        </div>
      </div>
    </AdminLayout>
  );
}
