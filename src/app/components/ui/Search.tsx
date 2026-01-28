"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useRef } from "react";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Local state for the input to keep typing snappy
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Sync local state if searchParams change externally (e.g., clearing filters)
    if (!isInitialMount.current) {
        setInputValue(searchParams.get("query") || "");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (inputValue) {
        params.set("query", inputValue);
      } else {
        params.delete("query");
      }

      startTransition(() => {
        router.replace(`/products?${params.toString()}`, { scroll: false });
      });
    }, 500); // 500ms debounce is optimal for API calls

    return () => clearTimeout(timer);
  }, [inputValue, router]);

  return (
    <div className="group relative w-full max-w-lg">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg 
          className={`h-4 w-4 transition-colors duration-300 ${
            isPending ? "text-orange-600 animate-pulse" : "text-zinc-400 group-focus-within:text-zinc-900"
          }`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="SEARCH COLLECTION..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-11 pr-11 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
        ) : (
          inputValue && (
            <button 
              onClick={() => setInputValue("")}
              className="rounded-lg p-1 text-zinc-300 hover:bg-zinc-50 hover:text-red-500 transition-all"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )
        )}
      </div>
    </div>
  );
}