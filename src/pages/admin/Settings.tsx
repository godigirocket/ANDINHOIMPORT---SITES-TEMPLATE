import AdminLayout from '@/components/admin/AdminLayout';
import { Database, Check } from 'lucide-react';

export default function AdminSettings() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const isConnected = !!supabaseUrl && supabaseUrl.includes('supabase.co');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground">Status do sistema</p>
        </div>

        {/* Status do banco */}
        <div className="rounded-2xl p-6" style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold">Banco de Dados</h2>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-400">Conectado</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-400">Não configurado</span>
              </>
            )}
          </div>
          {isConnected && (
            <p className="text-xs mt-2" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
              Dados salvos automaticamente no servidor.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
