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
    <>
      <PageHero
        eyebrow="Design Studio"
        title={<>Build it here. <span className="text-gradient">We will make it real.</span></>}
        copy="Configure the product, colour and print placements, watch the preview update, then add to cart directly."
      />
      <ConfiguratorWrapper />
    </>
  );
}

function ConfiguratorWrapper() {
  const search = useSearch({ from: "/studio" });
  const { data: productsData, isLoading: productsLoading, isError: productsError, error: productsErr, refetch } = useProducts({ per_page: 50 });
  const { data: customizationData, isLoading: customizationLoading } = useCustomizationOptions();

  if (productsLoading || customizationLoading) {
    return (
      <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
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