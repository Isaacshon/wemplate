import { PageTransition } from "@/components/page-transition";
import { Navbar } from "@/components/sections/navbar";
import { HeroBestSellers } from "@/components/sections/hero-best-sellers";
import { PriceFilterProvider } from "@/components/price-filter-context";
import { getPublishedTemplates } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const templates = await getPublishedTemplates();

  return (
    <PageTransition>
      <PriceFilterProvider>
        <Navbar />
        <main>
          <HeroBestSellers templates={templates} />
        </main>
      </PriceFilterProvider>
    </PageTransition>
  );
}
