import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteNav } from "@/components/xeno/SiteNav";
import { SiteFooter, FloatingActions } from "@/components/xeno/SiteFooter";
import { CursorGlow, ScrollProgress } from "@/components/xeno/Chrome";
import { PageTransition } from "@/components/xeno/PageTransition";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/stores/auth.store";
import { AuthModal } from "@/components/xeno/AuthModal";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/xeno/Logo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Logo variant="gradient" size="lg" glow={true} />
        </div>
        <h1 className="text-7xl font-bold text-foreground font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error('[Application ErrorBoundary]:', error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  const isDev = import.meta.env.DEV;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-xl w-full text-center glass-panel rounded-3xl p-8 border border-border/40 space-y-4 shadow-xl backdrop-blur-md">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
          Unable to display page
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We encountered an unexpected issue loading this section. Please try reloading or return home.
        </p>

        {isDev && error?.stack && (
          <div className="text-left bg-surface/80 rounded-2xl p-4 border border-destructive/20 max-h-48 overflow-auto">
            <p className="text-[11px] font-mono text-destructive whitespace-pre-wrap">
              {error.stack}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md cursor-pointer"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background/50 px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthModal />
        <Toaster position="bottom-right" richColors />
        {isAdminRoute ? (
          <Outlet />
        ) : (
          <>
            <ScrollProgress />
            <CursorGlow />
            <SiteNav />
            <main id="main">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </main>
            <SiteFooter />
            <FloatingActions />
          </>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
