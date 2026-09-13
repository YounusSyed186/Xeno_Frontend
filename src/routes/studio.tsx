import { createFileRoute, useSearch } from "@tanstack/react-router";
import { PageHero } from "@/components/xeno/ui";
import { Configurator } from "@/components/xeno/Configurator";
import { useProducts } from "@/hooks/useProducts";
import { useCustomizationOptions } from "@/hooks/useCustomization";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

const T = "Design Studio — Build & Preview Your Merchandise | Xeno Craft";
const D = "Choose a product, colour, print placements, logo position and quantity, preview it live and send the configuration straight to our team.";

export interface StudioSearch {
  product?: string | undefined;
  variant?: number | undefined;
}

export const Route = createFileRoute("/studio")({
  validateSearch: (search: Record<string, unknown>): StudioSearch => {
    const res: StudioSearch = {};
    if (typeof search['product'] === 'string' && search['product']) res.product = search['product'];
    if (search['variant']) res.variant = Number(search['variant']);
    return res;
  },
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <ConfiguratorWrapper />
    </div>
  );
}

function ConfiguratorWrapper() {
  const search = useSearch({ from: "/studio" });
  const { data: productsData, isLoading: productsLoading, isError: productsError, error: productsErr, refetch } = useProducts({ per_page: 50 });
  const { data: customizationData, isLoading: customizationLoading } = useCustomizationOptions();

  if (productsLoading || customizationLoading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
            <span className="size-3 rounded-full bg-primary animate-ping" />
          </div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">Loading XenoCraft Studio...</h2>
          <p className="text-xs text-muted-foreground">Initializing 3D photorealistic workspace and apparel catalog</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <EmptyState
          icon="alert"
          title="Failed to load studio assets"
          description={productsErr?.message || "Please check your network connection and try again"}
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      </section>
    );
  }

  const products = productsData?.products || [];

  if (products.length === 0) {
    return (
      <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <EmptyState
          icon="package"
          title="No customizable products available"
          description="We are currently stocking new customizable apparel in the catalog."
          action={{ label: "Browse Catalog", onClick: () => window.location.href = '/products', variant: 'outline' }}
        />
      </section>
    );
  }

  const printingMethods = customizationData?.printing_methods || [];
  const customizationOptions = customizationData?.options || [];

  return (
    <Configurator
      products={products}
      printingMethods={printingMethods}
      customizationOptions={customizationOptions}
      initialProductSlug={search.product}
      initialVariantId={search.variant}
    />
  );
}