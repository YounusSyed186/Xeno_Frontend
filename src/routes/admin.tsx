import { createFileRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { AdminShell } from '@/components/admin/AdminShell';
import { ShieldAlert } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
  const { isAuthenticated, isAdmin, status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  if (isLoginPage) {
    return <Outlet />;
  }

  if (status === 'loading' || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-muted-foreground">Verifying operational credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-border/40 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Administrative Access Restricted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You must be authenticated with valid operational administrator credentials to access the Xeno Craft Operations Console.
          </p>
          <button
            onClick={() => navigate({ to: '/admin/login' })}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return <AdminShell />;
}
