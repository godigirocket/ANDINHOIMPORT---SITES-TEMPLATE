import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Database, Globe, Shield, Code, Palette, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

// Presets de temas prontos para novos clientes
const THEME_PRESETS = [
  { name: 'Gold (Andinho Import)', primary: '43 96% 52%', bg: '20 8% 5%',  preview: '#f5a623' },
  { name: 'Roxo Premium',          primary: '262 83% 58%', bg: '222 47% 3%', preview: '#7c3aed' },
  { name: 'Azul Tech',             primary: '217 91% 60%', bg: '220 40% 4%', preview: '#3b82f6' },
  { name: 'Verde Neon',            primary: '142 71% 45%', bg: '160 30% 4%', preview: '#22c55e' },
  { name: 'Vermelho Bold',         primary: '0 84% 60%',   bg: '0 20% 4%',   preview: '#ef4444' },
  { name: 'Rosa Luxo',             primary: '330 81% 60%', bg: '330 20% 4%', preview: '#ec4899' },
];

function HelpTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/8 border border-primary/20">
      <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs text-white/60">{text}</p>
    </div>
  );
}

export default function AdminSettings() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const isConfigured = !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.includes('supabase.co');
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copiado!');
    setTimeout(() => setCopied(''), 2000);
  };

  // Gera o bloco client.ts para novo cliente
  const [newClient, setNewClient] = useState({
    id: '',
    name: '',
    nameHighlight: '',
    slogan: '',
    whatsapp: '',
    instagram: '',
    email: '',
    city: '',
    primaryColor: '43 96% 52%',
    bgColor: '20 8% 5%',
    heroBg: '',
    logoUrl: '',
  });

  const generateConfig = () => {
    return `// src/config/client.ts — ${newClient.name} ${newClient.nameHighlight}
export const clientConfig = {
  id: '${newClient.id || 'meu-cliente'}',
  version: '1.0.0',
  brand: {
    colorPrimary: '${newClient.primaryColor}',
    colorBackground: '${newClient.bgColor}',
    colorForeground: '45 20% 96%',
    fontFamily: "'Inter', sans-serif",
    logoUrl: '${newClient.logoUrl}',
    logoAlt: '${newClient.name} ${newClient.nameHighlight}',
    heroBgImage: '${newClient.heroBg || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80'}',
  },
  company: {
    name: '${newClient.name || 'MINHA'}',
    nameHighlight: '${newClient.nameHighlight || 'LOJA'}',
    legalName: '${newClient.name} ${newClient.nameHighlight} LTDA',
    slogan: '${newClient.slogan || 'Qualidade e confiança'}',
    description: 'Descrição da loja aqui.',
    location: { city: '${newClient.city || 'Sua Cidade'}', state: 'XX', country: 'Brasil', address: '${newClient.city || 'Sua Cidade'}, XX' },
    contact: {
      phone: '${newClient.whatsapp}',
      whatsappNumber: '${newClient.whatsapp.replace(/\D/g, '')}',
      whatsappMessage: 'Olá! Vi o site e quero mais informações',
      email: '${newClient.email}',
    },
    social: { instagram: '${newClient.instagram}', facebook: '', tiktok: '' },
  },
  // ... resto igual ao template
};`;
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground">Sistema, Supabase e gerador de novo cliente</p>
        </div>

        {/* ── Supabase Status ── */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Supabase</CardTitle>
                <CardDescription>Banco de dados e storage</CardDescription>
              </div>
              <Badge variant="outline" className={`ml-auto text-xs ${isConfigured ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'}`}>
                {isConfigured ? '● Conectado' : '○ Não configurado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isConfigured ? (
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">URL</span>
                  <span className="font-mono text-xs truncate max-w-[220px]">{supabaseUrl}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-400 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <HelpTip text="Crie um arquivo .env na raiz do projeto com as variáveis abaixo. Depois execute o SQL em supabase/migrations/001_initial_schema.sql no SQL Editor do Supabase." />
                <div className="relative">
                  <pre className="bg-surface/60 p-3 rounded-lg text-xs font-mono overflow-x-auto text-white/70">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://seu-projeto.supabase.co\nVITE_SUPABASE_ANON_KEY=sua_anon_key', 'env')}
                    className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copied === 'env' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <a
                  href="https://supabase.com/dashboard/project/gtfgljbdnqvtzyjqwvxp/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  Abrir SQL Editor do Supabase →
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Temas Prontos ── */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Temas Prontos</CardTitle>
                <CardDescription>Copie o valor de colorPrimary para src/config/client.ts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <HelpTip text="Para mudar a cor de toda a loja, edite 'colorPrimary' em src/config/client.ts. Tudo — botões, destaques, glow — muda automaticamente." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => copyToClipboard(preset.primary, preset.name)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/40 hover:border-primary/40 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-white/10" style={{ backgroundColor: preset.preview }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{preset.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{preset.primary}</p>
                  </div>
                  {copied === preset.name
                    ? <Check className="w-3.5 h-3.5 text-green-400 ml-auto flex-shrink-0" />
                    : <Copy className="w-3.5 h-3.5 text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  }
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Gerador de Novo Cliente ── */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Gerador de Novo Cliente</CardTitle>
                <CardDescription>Preencha e copie o config pronto para duplicar o projeto</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <HelpTip text="Para criar um novo projeto: duplique a pasta, preencha os campos abaixo, copie o config gerado e cole em src/config/client.ts. Tudo muda automaticamente — logo, cores, nome, contato." />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">ID do projeto (sem espaços)</Label>
                <Input placeholder="minha-loja" value={newClient.id} onChange={e => setNewClient(p => ({...p, id: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Slogan</Label>
                <Input placeholder="Qualidade e confiança" value={newClient.slogan} onChange={e => setNewClient(p => ({...p, slogan: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nome (parte branca)</Label>
                <Input placeholder="MINHA" value={newClient.name} onChange={e => setNewClient(p => ({...p, name: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nome (parte colorida)</Label>
                <Input placeholder="LOJA" value={newClient.nameHighlight} onChange={e => setNewClient(p => ({...p, nameHighlight: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">WhatsApp (com DDI)</Label>
                <Input placeholder="5551999999999" value={newClient.whatsapp} onChange={e => setNewClient(p => ({...p, whatsapp: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input placeholder="contato@loja.com" value={newClient.email} onChange={e => setNewClient(p => ({...p, email: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Instagram (URL)</Label>
                <Input placeholder="https://instagram.com/loja" value={newClient.instagram} onChange={e => setNewClient(p => ({...p, instagram: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cidade</Label>
                <Input placeholder="Porto Alegre" value={newClient.city} onChange={e => setNewClient(p => ({...p, city: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">URL da Logo</Label>
                <Input placeholder="https://..." value={newClient.logoUrl} onChange={e => setNewClient(p => ({...p, logoUrl: e.target.value}))} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Imagem de fundo Hero (URL)</Label>
                <Input placeholder="https://unsplash.com/..." value={newClient.heroBg} onChange={e => setNewClient(p => ({...p, heroBg: e.target.value}))} className="text-xs" />
              </div>
            </div>

            {/* Seletor de cor */}
            <div className="space-y-2">
              <Label className="text-xs">Cor Principal</Label>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setNewClient(prev => ({...prev, primaryColor: p.primary, bgColor: p.bg}))}
                    className={`w-7 h-7 rounded-full ring-2 transition-all ${newClient.primaryColor === p.primary ? 'ring-white scale-110' : 'ring-transparent'}`}
                    style={{ backgroundColor: p.preview }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Config gerado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Config gerado — cole em src/config/client.ts</Label>
                <button
                  onClick={() => copyToClipboard(generateConfig(), 'config')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/25 transition-colors"
                >
                  {copied === 'config' ? <><Check className="w-3 h-3" />Copiado!</> : <><Copy className="w-3 h-3" />Copiar</>}
                </button>
              </div>
              <Textarea
                readOnly
                value={generateConfig()}
                rows={12}
                className="font-mono text-[10px] bg-surface/60 text-white/60 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Info do sistema ── */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {[
              ['Versão',    clientConfig.version],
              ['Client ID', clientConfig.id],
              ['Stack',     'React 18 + Vite + Supabase + Tailwind'],
              ['Admin',     clientConfig.admin.credentials.email],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono text-xs">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
