"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search({ isPending = false }: { isPending?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localPending, startTransition] = useTransition();
  
  const currentUrlSearch = searchParams.get("search") || "";
  
  const [inputValue, setInputValue] = useState(currentUrlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(currentUrlSearch);
  
  // Track pushed value to avoid overwriting active typing
  const [lastPushedValue, setLastPushedValue] = useState(currentUrlSearch);

  if (currentUrlSearch !== prevUrlSearch) {
    setPrevUrlSearch(currentUrlSearch);
    if (currentUrlSearch !== lastPushedValue) {
      setInputValue(currentUrlSearch);
      setLastPushedValue(currentUrlSearch);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== lastPushedValue) {
        setLastPushedValue(inputValue); 
        
        const params = new URLSearchParams(searchParams.toString());
        if (inputValue) {
          params.set("search", inputValue);
        } else {
          params.delete("search");
        }
        params.delete("page");

        startTransition(() => {
          router.replace(`/products?${params.toString()}`, { scroll: false });
        });
      }
    }, 400); 

    return () => clearTimeout(timeout);
  }, [inputValue, lastPushedValue, router, searchParams]);

  const showPulse = isPending || localPending;

  return (
    <div className="group relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
        <SearchIcon 
            size={20} 
            className={`transition-colors duration-300 ${showPulse ? "text-orange-600 animate-pulse" : "text-zinc-400 group-focus-within:text-zinc-900"}`} 
        />
      </div>
      
      <input
        type="text"
        placeholder="SEARCH FOR A SPECIFIC PRODUCT..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-full border-2 border-zinc-200 bg-zinc-50/50 py-5 pl-16 pr-14 text-xs lg:text-sm font-black uppercase tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm focus:shadow-xl hover:border-zinc-300"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {inputValue && (
            <button 
                onClick={() => setInputValue("")} 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all active:scale-95"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
        )}
      </div>
    </div>
  );
}