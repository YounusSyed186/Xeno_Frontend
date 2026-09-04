import { createFileRoute } from "@tanstack/react-router";
import { Preloader } from "@/components/xeno/Preloader";
import { Hero } from "@/components/xeno/Hero";
import { Marquee } from "@/components/xeno/Marquee";
import { Bento } from "@/components/xeno/Bento";
import { Section } from "@/components/xeno/ui";
import { ProductGrid } from "@/components/xeno/Grids";
import { MagneticLink } from "@/components/xeno/MagneticButton";
import { SectionHeading, Reveal } from "@/components/xeno/Reveal";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/data-display/ProductCard";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

const title = "Xeno Craft — Premium Custom Merchandise & Corporate Branding";
const description =
  "Custom printed t-shirts, sports jerseys, hoodies, caps, stickers and corporate welcome kits. Premium bulk merchandise printing with pan India delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Xeno Craft",
          description,
          url: "/",
          email: "hello@xenocraft.in",
          telephone: "+91-90000-00000",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hyderabad",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: featuredProducts, isLoading, isError, error } = useFeaturedProducts({ per_page: 6 });

  return (
    <>
      <Preloader />
      <Hero />
      <Marquee />
      <Section>
        <SectionHeading
          eyebrow="Featured Products"
          title={<>Everything we make, <span className="text-gradient">made properly</span></>}
          copy="Fifteen product families, all produced in-house — pick a category to see materials, customisation and pricing."
        />
        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <EmptyState
              icon="alert"
              title="Unable to load featured products"
              description={error?.message || "Please try again later"}
              action={{ label: "Retry", onClick: () => window.location.reload() }}
            />
          ) : !featuredProducts?.products?.length ? (
            <EmptyState
              icon="package"
              title="No featured products"
              description="Check back later for our latest featured products"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.products.map((product: any, i: number) => (
                <Reveal key={product.id ?? i} delay={(i % 3) * 0.07}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10">
          <MagneticLink to="/products" variant="outline" className="px-7">
            View all products
          </MagneticLink>
        </div>
      </Section>
      <Bento />
    </>
  );
}