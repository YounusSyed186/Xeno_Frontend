import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginComponent,
});

function AdminLoginComponent() {
  const { login, isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('[AdminLogin] Authenticating admin user:', email);
    try {
      await login({ email, password });
      console.log('[AdminLogin] Admin authentication successful! Redirecting to dashboard...');
      toast.success('Authenticated to Operations Console');
      navigate({ to: '/admin/dashboard' });
    } catch (err: any) {
      console.error('[AdminLogin] Admin authentication failed:', err);
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Console Header */}
        <div className="text-center space-y-2">
          <div className="relative inline-flex items-center justify-center mx-auto mb-1">
            <div className="absolute -inset-2 rounded-full bg-[#5ef046]/25 blur-lg opacity-80" aria-hidden="true" />
            <img
              src="/favicon.png"
              alt="Xeno Craft"
              className="relative size-16 rounded-2xl object-contain drop-shadow-[0_0_15px_rgba(94,240,70,0.5)]"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Xeno Craft Operations
          </h1>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="size-3.5 text-primary" /> Internal Administrative Console
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 border border-border/40 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="admin@xenocraft.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border/20">
            <span className="text-[11px] text-muted-foreground">
              Protected administrative boundary. Authorized staff only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
