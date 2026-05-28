import { useEffect, useState } from 'react';
import { Save, Loader2, RefreshCw, Info, ImageIcon, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentStore, type SiteContentData } from '@/lib/stores/contentStore';
import { uploadImage, compressImage } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

function HelpTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg mt-1"
      style={{ background: 'hsla(43,96%,52%,0.06)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
      <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{text}</p>
    </div>
  );
}

// Upload de imagem para o hero
function HeroImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 1920, 0.92);
      const url = await uploadImage('banners', compressed, 'hero');
      onChange(url);
      toast.success('Imagem enviada com sucesso');
    } catch {
      toast.error('Erro no upload', { description: 'Configure o Supabase Storage ou use uma URL externa' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden group"
          style={{ border: '1px solid hsla(43,96%,52%,0.2)' }}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'hsla(0,84%,60%,0.8)' }}>
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}
      {/* Upload zone */}
      <div className="flex gap-2">
        <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all"
          style={{ border: '1px dashed hsla(43,96%,52%,0.3)', background: 'hsla(43,96%,52%,0.04)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.08)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'hsla(43,96%,52%,0.04)')}>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
          {uploading
            ? <><Loader2 className="w-4 h-4 text-primary animate-spin" /><span className="text-xs text-primary">Enviando...</span></>
            : <><Upload className="w-4 h-4 text-primary" /><span className="text-xs text-primary">Upload (Supabase)</span></>
          }
        </label>
      </div>
      {/* URL manual */}
      <Input placeholder="Ou cole uma URL de imagem aqui..." value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs" style={{ background: 'hsla(220,20%,8%,0.8)' }} />
      <p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.35)' }}>
        💡 Para máxima qualidade: faça upload via Supabase Storage. URLs externas podem ter qualidade reduzida.
      </p>
    </div>
  );
}

export default function AdminContent() {
  const { content, fetchContent, saveContent, isSaving } = useContentStore();
  const [form, setForm] = useState<SiteContentData>(content);

  useEffect(() => {
    fetchContent().then(() => setForm(useContentStore.getState().content));
  }, [fetchContent]);

  const set = (key: keyof SiteContentData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    const { error } = await saveContent(form);
    if (error) toast.error('Erro ao salvar', { description: error });
    else toast.success('Conteúdo salvo com sucesso');
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Conteúdo do Site</h1>
            <p className="text-sm text-muted-foreground">Edite textos, links e informações de contato</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setForm(content); toast.info('Restaurado'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restaurar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-gold flex items-center gap-2 text-xs px-4 py-2 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Salvar
            </button>
          </div>
        </div>

        <Tabs defaultValue="hero">
          <TabsList className="bg-surface/50 flex-wrap h-auto gap-1">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="links">Redes Sociais</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* ── Imagens do Hero ── */}
          <TabsContent value="images" className="mt-4 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Imagens de Fundo do Hero
                </CardTitle>
                <CardDescription>
                  As imagens aparecem em slideshow no fundo da seção principal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <HelpTip text="Para máxima qualidade: faça upload direto pelo botão abaixo (usa Supabase Storage). Imagens de sites externos (ibb.co, etc.) podem ser bloqueadas ou ter qualidade reduzida." />

                <HeroImageUpload
                  label="Imagem 1 (principal)"
                  value={form.hero_bg_1}
                  onChange={url => setForm(prev => ({ ...prev, hero_bg_1: url }))}
                />

                <HeroImageUpload
                  label="Imagem 2 (slideshow)"
                  value={form.hero_bg_2}
                  onChange={url => setForm(prev => ({ ...prev, hero_bg_2: url }))}
                />

                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: 'hsla(220,20%,8%,0.6)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
                  <p className="text-xs font-bold text-white">Como fazer upload:</p>
                  <ol className="text-xs space-y-1.5" style={{ color: 'hsla(45,20%,96%,0.55)' }}>
                    <li>1. Acesse o Supabase → Storage → bucket <code className="px-1 rounded" style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>banners</code></li>
                    <li>2. Crie a pasta <code className="px-1 rounded" style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>hero</code> se não existir</li>
                    <li>3. Clique em "Upload" acima — a imagem vai direto para o Supabase</li>
                    <li>4. Ou cole a URL pública do Supabase no campo de texto</li>
                    <li>5. Clique em "Salvar" no topo da página</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Hero ── */}
          <TabsContent value="hero" className="mt-4 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Seção Principal (Hero)</CardTitle>
                <CardDescription>Textos exibidos no topo da landing page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HelpTip text="O badge aparece acima do título principal. Ex: 'NOVOS MODELOS DISPONÍVEIS'" />
                <div className="space-y-1.5">
                  <Label>Badge</Label>
                  <Input placeholder="NOVOS MODELOS DISPONÍVEIS" value={form.hero_badge} onChange={set('hero_badge')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Título Principal (parte branca)</Label>
                  <Input placeholder="ANDINHO" value={form.hero_title} onChange={set('hero_title')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Textarea placeholder="Apple, Xiaomi e Smartwatches com garantia..." rows={3} value={form.hero_subtitle} onChange={set('hero_subtitle')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Botão Primário (dourado)</Label>
                    <Input placeholder="Garante Agora" value={form.cta_primary_text} onChange={set('cta_primary_text')} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Botão Secundário</Label>
                    <Input placeholder="Explorar Catálogo" value={form.cta_secondary_text} onChange={set('cta_secondary_text')} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Texto da seção CTA</Label>
                  <Textarea placeholder="Atendimento rápido, preços justos..." rows={2} value={form.support_text} onChange={set('support_text')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Contato ── */}
          <TabsContent value="contact" className="mt-4 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Informações de Contato</CardTitle>
                <CardDescription>Aparecem no rodapé e na seção de contato do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HelpTip text="Estas informações aparecem no rodapé do site. Edite aqui para atualizar sem precisar mexer no código." />
                <div className="space-y-1.5">
                  <Label>WhatsApp (link completo)</Label>
                  <Input type="url" placeholder="https://wa.me/5551999999999" value={form.whatsapp_link} onChange={set('whatsapp_link')} />
                  <p className="text-xs text-muted-foreground">Formato: https://wa.me/55DDD9XXXXXXXX (só números)</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone (exibição)</Label>
                  <Input placeholder="+55 (51) 99644-5863" value={form.contact_phone} onChange={set('contact_phone')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="contato@andinhoimport.com.br" value={form.contact_email} onChange={set('contact_email')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Endereço / Localização</Label>
                  <Input placeholder="Estância Velha, RS" value={form.contact_address} onChange={set('contact_address')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Redes Sociais ── */}
          <TabsContent value="links" className="mt-4 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <HelpTip text="Os links das redes sociais aparecem no header e no rodapé do site." />
                <div className="space-y-1.5">
                  <Label>Instagram</Label>
                  <Input type="url" placeholder="https://instagram.com/andinhoimport" value={form.instagram_link} onChange={set('instagram_link')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SEO ── */}
          <TabsContent value="seo" className="mt-4 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">SEO — Metatags</CardTitle>
                <CardDescription>Como o site aparece no Google e redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HelpTip text="O título e a descrição são os textos que aparecem nos resultados do Google. Mantenha o título com até 60 caracteres e a descrição com até 160." />
                <div className="space-y-1.5">
                  <Label>Título da Página</Label>
                  <Input placeholder="Andinho Import — Celulares Importados" value={form.seo_title} onChange={set('seo_title')} />
                  <p className="text-xs text-muted-foreground">{form.seo_title.length}/60 caracteres</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description</Label>
                  <Textarea placeholder="Compre seu iPhone ou Xiaomi com garantia..." rows={3} value={form.seo_description} onChange={set('seo_description')} />
                  <p className="text-xs text-muted-foreground">{form.seo_description.length}/160 caracteres</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Keywords (separadas por vírgula)</Label>
                  <Input placeholder="iphone, xiaomi, celular importado..." value={form.seo_keywords} onChange={set('seo_keywords')} />
                </div>
                {/* Preview */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Preview Google</p>
                  <p className="text-blue-400 text-sm font-medium line-clamp-1">{form.seo_title || 'Título da página'}</p>
                  <p className="text-green-500 text-xs">andinhoimport.com.br</p>
                  <p className="text-muted-foreground text-xs line-clamp-2">{form.seo_description || 'Descrição...'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
