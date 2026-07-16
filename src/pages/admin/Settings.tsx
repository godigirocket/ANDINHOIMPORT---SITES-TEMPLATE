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

// Presets de temas disponíveis
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

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground">Sistema, banco de dados e personalização de cores</p>
        </div>

        {/* ── Supabase Status ── */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Banco de Dados</CardTitle>
                <CardDescription>Armazenamento de produtos, conteúdo e pedidos</CardDescription>
              </div>
              <Badge variant="outline" className={`ml-auto text-xs ${isConfigured ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'}`}>
                {isConfigured ? '● Conectado' : '○ Não configurado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isConfigured ? (
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-400 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                  Tudo funcionando. Seus dados são salvos automaticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <HelpTip text="Os dados estão sendo salvos apenas neste dispositivo. Para sincronizar entre dispositivos e fazer backup, configure o banco de dados em arquivo .env." />
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
            <HelpTip text="Para mudar a cor de toda a loja: copie o valor abaixo, abra src/config/client.ts, encontre 'colorPrimary' e cole o novo valor. Salve o arquivo e recarregue a página (F5). Tudo — botões, destaques, glow — muda automaticamente." />
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
              ['Stack',     'React 18 + Vite + Tailwind'],
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
