"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getCategories, type StrapiCategory } from "@/lib/strapi";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dbCategories, setDbCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getCategories();
        if (isMounted) {
          // getCategories already returns flattened data via our lib
          setDbCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Filter loading error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  function handleFilter(categoryName: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryName === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Filter By Category
        </span>
        {isPending && <div className="h-1 w-8 animate-pulse rounded-full bg-orange-500" />}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter("All")}
          disabled={isPending}
          className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
            activeCategory === "All"
              ? "bg-zinc-900 text-white shadow-lg ring-2 ring-zinc-900 ring-offset-2"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          All
        </button>

        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-zinc-100" />
          ))
        ) : (
          dbCategories.map((cat) => (
            <button
              key={cat.documentId || cat.id}
              onClick={() => handleFilter(cat.Name)}
              disabled={isPending}
              className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat.Name
                  ? "bg-zinc-900 text-white shadow-lg ring-2 ring-zinc-900 ring-offset-2"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {cat.Name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}