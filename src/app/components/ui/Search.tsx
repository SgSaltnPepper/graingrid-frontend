"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search({ isPending = false }: { isPending?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localPending, startTransition] = useTransition();
  
  // Local state for what is currently in the input box
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");
  
  // This REF is the magic fix! It tracks the last value we specifically sent to the backend.
  // It stops the URL from overwriting your text while you are actively typing or erasing.
  const lastPushedValue = useRef(searchParams.get("search") || "");

  // 1. Handle User Typing -> Send to URL (Debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      // ONLY push to the URL if the text box is actually different from our last push
      if (inputValue !== lastPushedValue.current) {
        lastPushedValue.current = inputValue; // Update our tracker
        
        const params = new URLSearchParams(searchParams.toString());
        if (inputValue) {
          params.set("search", inputValue);
        } else {
          params.delete("search");
        }
        
        // Reset page to 1 when a new search is made
        params.delete("page");

        startTransition(() => {
          router.replace(`/products?${params.toString()}`, { scroll: false });
        });
      }
    }, 400); // 400ms wait after you stop typing

    return () => clearTimeout(timeout);
  }, [inputValue, router, searchParams]);

  // 2. Handle External URL Changes (e.g. Browser 'Back' button or clicking 'Clear Filters')
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    // If the URL changes, but it doesn't match what we last pushed, it means the change
    // came from OUTSIDE the search bar (like hitting the back button). Then we update the input box.
    if (urlSearch !== lastPushedValue.current) {
      lastPushedValue.current = urlSearch;
      setInputValue(urlSearch);
    }
  }, [searchParams]);

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
                // When clicked, it manually empties the input, triggering the first useEffect to clear the URL cleanly
                onClick={() => setInputValue("")} 
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
        )}
      </div>
    </div>
  );
}