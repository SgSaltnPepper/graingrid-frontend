"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search({ isPending = false }: { isPending?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localPending, startTransition] = useTransition();
  
  // Local state for the input box
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");
  
  // Track if the user is actively typing to prevent the URL from overriding their input
  const isTyping = useRef(false);

  // 1. Handle user typing -> Update URL (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearchInUrl = searchParams.get("search") || "";
      
      // Only push to the router if the value actually differs from the URL
      if (inputValue !== currentSearchInUrl) {
        const params = new URLSearchParams(searchParams.toString());
        if (inputValue) {
          params.set("search", inputValue);
        } else {
          params.delete("search");
        }
        
        // Reset pagination when searching
        params.delete("page");

        startTransition(() => {
          router.replace(`/products?${params.toString()}`, { scroll: false });
        });
      }
      
      // Timer finished pushing to URL, user is no longer typing
      isTyping.current = false; 
    }, 400);

    return () => {
      // If the effect re-runs before the timer finishes, it means the user is actively typing
      isTyping.current = true;
      clearTimeout(timer);
    };
  }, [inputValue, router, searchParams]);

  // 2. Handle external URL changes (e.g., clicking "Back" in browser)
  useEffect(() => {
    // ONLY sync from URL to local input if the user isn't currently typing
    if (!isTyping.current) {
      const currentSearchInUrl = searchParams.get("search") || "";
      if (inputValue !== currentSearchInUrl) {
        setInputValue(currentSearchInUrl);
      }
    }
  }, [searchParams, inputValue]);

  const showPulse = isPending || localPending;

  return (
    <div className="group relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <SearchIcon 
            size={14} 
            className={`transition-colors duration-300 ${showPulse ? "text-orange-600 animate-pulse" : "text-zinc-400 group-focus-within:text-zinc-900"}`} 
        />
      </div>
      
      <input
        type="text"
        placeholder="SEARCH PRODUCTS..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-full border border-zinc-200 bg-white py-3.5 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest text-zinc-900 placeholder:text-zinc-300 focus:border-orange-500 focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        {inputValue && (
            <button 
                onClick={() => setInputValue("")} 
                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
        )}
      </div>
    </div>
  );
}