import { getFeaturedProducts } from "@/sanity/lib/queries";
import HeroSlider from "../ui/HeroSlider";

export interface SanityBadge {
  _id: string;
  label: string;
  tone: string;
  isActive: boolean;
}

export interface SanityVariant {
  _key: string;
  Type: string;
  Label?: string;
  Value?: string;
  Description?: string;
}

export interface SanityProduct {
  _id: string;
  Name: string;
  Price: number;
  Image?: string;
  badges?: SanityBadge[];
  variants?: SanityVariant[];
  [key: string]: unknown;
}

export default async function Hero() {
  // Fetch from Sanity Content Lake
  const featuredProducts = await getFeaturedProducts(5);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="h-[85vh] flex items-center justify-center bg-[#F4F1EB]">
        <div className="animate-pulse text-zinc-500 font-black uppercase tracking-[1em]">Loading...</div>
      </section>
    ); 
  }

  const mappedProducts = featuredProducts.map((p: SanityProduct) => ({
    ...p,
    id: p._id as unknown as string,
    badges: p.badges?.map((b: SanityBadge) => ({ ...b, id: b._id })),
    variants: p.variants?.map((v: SanityVariant) => ({ ...v, id: v._key }))
  }));

  return <HeroSlider products={mappedProducts} />;
}