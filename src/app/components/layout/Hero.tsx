// src/app/components/layout/Hero.tsx
import { getFeaturedProducts } from "@/lib/strapi";
import HeroSlider from "../ui/HeroSlider";

export default async function Hero() {
  // Fetch up to 5 featured products for the slider
  // The buildQuery inside getFeaturedProducts now populates 'categories' plural
  const featuredProducts = await getFeaturedProducts(4);

  if (!featuredProducts || featuredProducts.length === 0) {
    return null; // Or a fallback static hero
  }

  return <HeroSlider products={featuredProducts} />;
}