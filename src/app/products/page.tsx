"use client";

import { useEffect, useRef, useState, use, Suspense } from "react";
import { getAllProducts, getStrapiMedia } from "@/lib/strapi";
import Card from "@/app/components/ui/Card";
import Filter from "@/app/components/ui/Filter";
import Search from "@/app/components/ui/Search";
import gsap from "gsap";

export default function ProductsPage({ searchParams }: { searchParams: Promise<{ query?: string; category?: string }> }) {
  const resolvedParams = use(searchParams);
  const query = resolvedParams.query;
  const category = resolvedParams.category;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getAllProducts(50, category, query);
      setProducts(data || []);
      setLoading(false);
    }
    fetchData();
  }, [category, query]);

  useEffect(() => {
    if (loading || !products.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".product-card", { 
        y: 20, 
        opacity: 0, 
        duration: 0.5, 
        stagger: 0.05, 
        ease: "power2.out" 
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading, products]);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Hero Section */}
      <section className="bg-zinc-950 pt-32 pb-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-black uppercase text-white sm:text-7xl mb-4">
            The <span className="text-orange-500">Catalogue</span>
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm font-medium leading-relaxed uppercase tracking-widest">
            Explore our complete collection of heritage grains and experimental studio releases.
          </p>
        </div>
      </section>

      {/* 2. Interactive Toolbar (Search & Filter) */}
      <section className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-md">
              <Suspense fallback={<div className="h-12 w-full animate-pulse bg-zinc-100 rounded-2xl" />}>
                <Search />
              </Suspense>
            </div>
            <div className="w-full lg:w-auto">
              <Suspense fallback={<div className="h-10 w-64 animate-pulse bg-zinc-100 rounded-full" />}>
                <Filter />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Grid Section */}
      <section ref={gridRef} className="mx-auto max-w-7xl px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center py-40">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-orange-500 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Refreshing Collection</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.documentId || p.id} className="product-card">
                <Card
                  title={p.Name}
                  subtitle={p.categories?.[0]?.Name || "Collection"}
                  imageSrc={getStrapiMedia(p.Image)}
                  price={p.Price}
                  href={`/products/${p.documentId || p.id}`}
                  badges={p.badges}
                  variants={p.variants}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
            <h3 className="text-xl font-black uppercase text-zinc-900 mb-2">No Results Found</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}