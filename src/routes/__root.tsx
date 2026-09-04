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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
      <div className="max-w-xl w-full text-center glass-panel rounded-3xl p-8 border border-border/40 space-y-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Navigation or Page Error
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error?.message || "An unexpected error occurred while rendering this view."}
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
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            Retry Loading
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background/50 px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Xeno Craft — Premium Custom Merchandise" },
      {
        name: "description",
        content:
          "Premium custom merchandise, apparel and corporate branding products. Bulk printing with pan India delivery.",
      },
      { name: "author", content: "Xeno Craft" },
      { name: "theme-color", content: "#050505" },
      { property: "og:site_name", content: "Xeno Craft" },
      { property: "og:title", content: "Xeno Craft — Premium Custom Merchandise" },
      {
        property: "og:description",
        content:
          "Premium custom merchandise, apparel and corporate branding products. Bulk printing with pan India delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

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
