import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldAlert, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth/AuthContext';
import { clientConfig } from '@/config/client';
import { BrandLogo } from '@/components/BrandLogo';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError, lockoutRemaining } = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(clearError, 8000);
      return () => clearTimeout(t);
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    const ok = await login(email, password);
    if (ok) navigate('/admin');
  };

  const formatLockout = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <ParticleBackground />

      {/* Glow dourado */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="glass-card p-8 border border-white/8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse" />
                <BrandLogo size={64} className="relative" />
              </div>
            </div>
            <h1 className="text-xl font-black mb-1">
              <span className="text-white">{clientConfig.company.name} </span>
              <span className="text-primary">{clientConfig.company.nameHighlight}</span>
            </h1>
            <p className="text-xs text-white/40 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-primary" />
              Painel Administrativo Seguro
            </p>
          </div>

          {/* Bloqueio */}
          {lockoutRemaining > 0 && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive mb-5"
            >
              <Timer className="w-4 h-4 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Acesso bloqueado</p>
                <p>Aguarde {formatLockout(lockoutRemaining)} para tentar novamente</p>
              </div>
            </motion.div>
          )}

          {/* Erro */}
          {error && lockoutRemaining === 0 && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive mb-5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Campo honeypot — captura bots */}
            <input type="text" name="username" className="hidden" tabIndex={-1} aria-hidden="true" />

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-white/60">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9 text-sm bg-white/5 border-white/10 focus:border-primary/50"
                  required
                  maxLength={254}
                  autoComplete="email"
                  disabled={lockoutRemaining > 0}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-white/60">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 pr-9 text-sm bg-white/5 border-white/10 focus:border-primary/50"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                  disabled={lockoutRemaining > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutRemaining > 0}
              className="btn-gold w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Verificando...</>
                : lockoutRemaining > 0
                ? <><Timer className="w-4 h-4" />{formatLockout(lockoutRemaining)}</>
                : 'Entrar no Painel'
              }
            </button>
          </form>

          {/* Sem credenciais expostas em produção */}
          <div className="mt-5 p-3 rounded-xl"
            style={{ background: 'hsla(220,20%,8%,0.6)', border: '1px solid hsla(255,255%,255%,0.06)' }}>
            <p className="text-[10px] text-center" style={{ color: 'hsla(45,20%,96%,0.3)' }}>
              Acesso restrito · Andinho Import
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <a href="/" className="text-xs text-white/30 hover:text-primary transition-colors">
            ← Voltar para o site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
