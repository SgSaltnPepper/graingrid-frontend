"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getCategories, StrapiCategory } from "@/lib/strapi";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dbCategories, setDbCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        setDbCategories(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleFilter(categoryName: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryName === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    
    // Start transition keeps the UI responsive while Next.js fetches data
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Collections
        </span>
        {isPending && <div className="h-1 w-12 bg-orange-500 animate-pulse rounded-full" />}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All Button */}
        <button
          onClick={() => handleFilter("All")}
          disabled={isPending}
          className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeCategory === "All"
              ? "bg-zinc-900 text-white shadow-md"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          All
        </button>

        {/* Skeleton Loading State */}
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-zinc-100" />
          ))
        ) : (
          dbCategories.map((cat) => {
            const isActive = activeCategory === cat.Name;
            return (
              <button
                key={cat.documentId}
                onClick={() => handleFilter(cat.Name)}
                disabled={isPending}
                className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-md"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {cat.Name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}