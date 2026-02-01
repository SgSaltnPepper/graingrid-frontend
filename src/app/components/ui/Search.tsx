"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useRef } from "react";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  const isInitialMount = useRef(true);

  useEffect(() => {
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
    }, 500); 
    return () => clearTimeout(timer);
  }, [inputValue, router]);

  return (
    <div className="group relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className={`h-3 w-3 transition-colors duration-300 ${isPending ? "text-orange-600 animate-pulse" : "text-zinc-400 group-focus-within:text-zinc-900"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="SEARCH..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-9 pr-8 text-[10px] font-black uppercase tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        {inputValue && (
            <button onClick={() => setInputValue("")} className="rounded-full p-1 text-zinc-300 hover:bg-zinc-100 hover:text-red-500 transition-all">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        )}
      </div>
    </div>
  );
}