"use client";

import { useEffect, useRef, useState, use } from "react";
import { getAllProducts, getStrapiMedia, StrapiProduct } from "@/lib/strapi";
import Card from "@/app/components/ui/Card";
import Search from "@/app/components/ui/Search";
import Filter from "@/app/components/ui/Filter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProductPageProps {
  searchParams: Promise<{ query?: string; category?: string }>;
}

export default function ProductsPage({ searchParams }: ProductPageProps) {
  // Use 'use' to unwrap the searchParams promise safely in Client Components
  const resolvedParams = use(searchParams);
  
  const [products, setProducts] = useState<StrapiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryStr, setQueryStr] = useState(resolvedParams.query || "");
  const [catStr, setCatStr] = useState(resolvedParams.category || "");

  const heroRef = useRef(null);
  const gridRef = useRef(null);

  // 1. DATA FETCHING Logic
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const query = resolvedParams.query || "";
      const category = resolvedParams.category || "";
      
      setQueryStr(query);
      setCatStr(category);

      // getAllProducts handles the 'categories' plural logic we updated in strapi.ts
      const data = await getAllProducts(50, category, query);
      setProducts(data);
      setLoading(false);
    }
    fetchData();
  }, [resolvedParams.query, resolvedParams.category]);

  // 2. GSAP REVEAL ANIMATIONS
  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Text Reveal (runs once on load)
      gsap.from(".reveal-text", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      });

      // Product Cards Staggered Entrance (runs when products change)
      gsap.from(".product-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "expo.out",
        clearProps: "all" // Clears transform styles after animation for hover effects
      });
    });

    return () => ctx.revert();
  }, [loading, products.length]); // Re-run animation when product count changes

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* 1. HERO / HEADER SECTION */}
      <section ref={heroRef} className="bg-dark-900 pt-32 pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <div className="max-w-3xl overflow-hidden">
              <nav className="reveal-text mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="opacity-50 text-white">Main</span>
                <span className="text-white/20">/</span>
                <span className="text-orange-600">Products</span>
              </nav>
              <h1 className="reveal-text text-6xl font-black uppercase tracking-tighter text-white sm:text-8xl">
                The <span className="text-orange-600">Inventory</span>
              </h1>
              <p className="reveal-text mt-8 text-xl font-medium leading-relaxed text-light-400/70 max-w-xl">
              "Eat Fresh"  Focuses on health, quality ingredients, and a modern
              </p>
            </div>
            
            <div className="reveal-text w-full lg:max-w-md">
              <Search />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTROL BAR (Sticky) */}
      <section className="sticky top-0 z-40 border-b border-light-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
               <Filter />
               <div className="hidden h-8 w-px bg-light-200 md:block" />
               <div className="hidden flex-col md:flex">
                 <span className="text-[9px] font-black uppercase tracking-widest text-dark-400">Current View</span>
                 <p className="text-xs font-bold uppercase text-dark-900">
                    {catStr ? catStr : 'Global Archive'}
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-dark-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                {products.length} Results
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
               <span className="text-[10px] font-black uppercase tracking-widest text-dark-400">Syncing Collection...</span>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <div key={p.documentId} className="product-card">
                <Card
                  title={p.Name}
                  // Pull from 'categories' array we set up in Strapi
                  subtitle={p.categories?.[0]?.Name || "Masterpiece"}
                  description={p.Description?.[0]?.children?.[0]?.text || ""}
                  imageSrc={getStrapiMedia(p.Image?.[0]?.url)}
                  imageAlt={p.Image?.[0]?.alternativeText || p.Name}
                  price={p.Price}
                  href={`/products/${p.documentId}`}
                  badges={p.badges}
                />
              </div>
            ))}
          </div>
        ) : (
          /* 4. EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-light-100 text-dark-200">
               <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight text-dark-900">End of the Line</h3>
            <p className="mt-4 max-w-sm text-lg font-medium text-dark-500">
              We couldn't find any pieces matching "<span className="text-orange-600 font-bold">{queryStr}</span>" in the {catStr || 'selected'} collection.
            </p>
            <button 
               onClick={() => window.location.href = '/products'}
               className="mt-10 text-[10px] font-black uppercase tracking-widest text-orange-600 border-b-2 border-orange-600/20 pb-1 hover:border-orange-600 transition-all"
            >
              Reset Search
            </button>
          </div>
        )}
      </section>
    </main>
  );
}