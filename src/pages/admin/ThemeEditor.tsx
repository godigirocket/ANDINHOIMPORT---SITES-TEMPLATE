import { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, Eye, Code, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { clientConfig } from '@/config/client';
import { applyTheme, saveCustomTheme, clearCustomTheme, loadCustomTheme } from '@/lib/utils/applyTheme';

const THEME_PRESETS = [
  { name: 'Gold (Andinho Import)', primary: '43 96% 52%', bg: '220 20% 4%', preview: '#f5a623' },
  { name: 'Roxo Premium', primary: '262 83% 58%', bg: '222 47% 3%', preview: '#7c3aed' },
  { name: 'Azul Tech', primary: '217 91% 60%', bg: '220 40% 4%', preview: '#3b82f6' },
  { name: 'Verde Neon', primary: '142 71% 45%', bg: '160 30% 4%', preview: '#22c55e' },
  { name: 'Vermelho Bold', primary: '0 84% 60%', bg: '0 20% 4%', preview: '#ef4444' },
  { name: 'Rosa Luxo', primary: '330 81% 60%', bg: '330 20% 4%', preview: '#ec4899' },
  { name: 'Laranja Vibrante', primary: '25 95% 53%', bg: '20 20% 4%', preview: '#ff6b35' },
  { name: 'Ciano Futurista', primary: '180 100% 50%', bg: '200 30% 4%', preview: '#00ffff' },
];

export default function ThemeEditor() {
  const savedTheme = loadCustomTheme();
  const [primary, setPrimary] = useState(savedTheme?.primary || clientConfig.brand.colorPrimary);
  const [bg, setBg] = useState(savedTheme?.background || clientConfig.brand.colorBackground);
  const [isSaved, setIsSaved] = useState(!!savedTheme);

  const handleApply = () => {
    // Salva permanentemente no localStorage
    saveCustomTheme(primary, bg);
    
    // Aplica no site inteiro
    applyTheme(primary, bg);
    
    toast.success('✅ Tema salvo e aplicado no site inteiro!');
    setIsSaved(true);
  };

  const handleReset = () => {
    // Remove tema customizado
    clearCustomTheme();
    
    // Volta pro padrão
    setPrimary(clientConfig.brand.colorPrimary);
    setBg(clientConfig.brand.colorBackground);
    applyTheme();
    
    toast.info('Tema restaurado para o padrão');
    setIsSaved(false);
  };

  const handleSave = () => {
    const code = `// Cole isso em src/config/client.ts na seção brand:
brand: {
  colorPrimary: '${primary}',
  colorBackground: '${bg}',
  colorForeground: '45 20% 96%',
  // ... resto do código
}`;
    
    navigator.clipboard.writeText(code);
    toast.success('Código copiado! Cole em src/config/client.ts');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              Editor de Tema
            </h1>
            <p className="text-sm text-muted-foreground">Personalize as cores sem mexer no código</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 text-xs hover:bg-surface transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">
              <Code className="w-3.5 h-3.5" />
              Copiar Código
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {isSaved && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-bold text-green-500">Tema Ativo no Site Inteiro</p>
                <p className="text-xs text-muted-foreground">As cores estão aplicadas permanentemente. Abra o site para ver!</p>
              </div>
            </div>
            <button onClick={() => window.open('/', '_blank')}
              className="btn-gold text-xs px-4 py-2">
              Ver Site
            </button>
          </div>
        )}

        {/* Presets */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Temas Prontos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEME_PRESETS.map(preset => (
              <button key={preset.name}
                onClick={() => { setPrimary(preset.primary); setBg(preset.bg); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 hover:border-primary/40 transition-all group">
                <div className="w-16 h-16 rounded-full ring-2 ring-white/10 group-hover:ring-primary/50 transition-all"
                  style={{ backgroundColor: preset.preview }} />
                <p className="text-xs font-semibold text-center">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4">Cores Personalizadas</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2">Cor Principal (HSL)</label>
              <input type="text" value={primary} onChange={e => setPrimary(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-sm font-mono"
                placeholder="43 96% 52%" />
              <p className="text-xs text-muted-foreground mt-1">Formato: H S% L% (ex: 43 96% 52%)</p>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-2">Cor de Fundo (HSL)</label>
              <input type="text" value={bg} onChange={e => setBg(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-sm font-mono"
                placeholder="220 20% 4%" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4">Preview</h2>
          <div className="space-y-3">
            <button className="btn-gold w-full py-3">Botão Principal</button>
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/10">
              <p className="text-sm text-primary font-semibold">Card com destaque</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-12 rounded-lg" style={{ background: `hsl(${primary})` }} />
              <div className="flex-1 h-12 rounded-lg" style={{ background: `hsl(${bg})` }} />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button onClick={handleApply}
          className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          Salvar e Aplicar no Site Inteiro
        </button>
        
        <p className="text-xs text-center text-muted-foreground">
          As cores serão aplicadas permanentemente no site e painel admin
        </p>
      </div>
    </AdminLayout>
  );
}
