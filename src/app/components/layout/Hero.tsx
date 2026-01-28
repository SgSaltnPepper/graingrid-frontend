import { getFeaturedProducts } from "@/lib/strapi";
import HeroSlider from "../ui/HeroSlider";

export default async function Hero() {
  // Use a slight revalidate to ensure it updates but stays fast
  const featuredProducts = await getFeaturedProducts(5);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="h-[70vh] flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse text-zinc-700 font-black uppercase tracking-[1em]">Loading...</div>
      </section>
    ); 
  }

  return <HeroSlider products={featuredProducts} />;
}