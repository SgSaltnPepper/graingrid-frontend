"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { getCategories, type StrapiCategory } from "@/lib/strapi";
import { ChevronDown, Filter as FilterIcon, X, Check } from "lucide-react";
import gsap from "gsap";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dbCategories, setDbCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<number[]>([]);
  
  const activeCategory = searchParams.get("category") || "All";
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getCategories();
        if (isMounted) {
          setDbCategories(Array.isArray(data) ? data : []);
          if (Array.isArray(data)) {
             const activeCatObj = data.find(c => c.subcategories?.some(s => s.Name === activeCategory));
             if (activeCatObj) setExpandedCats([activeCatObj.id]);
          }
        }
      } catch (error) { console.error("Filter error:", error); } finally { if (isMounted) setLoading(false); }
    }
    load();
    return () => { isMounted = false; };
  }, [activeCategory]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(mobileMenuRef.current, { x: "0%", duration: 0.5, ease: "power3.out" });
    } else {
      document.body.style.overflow = "";
      gsap.to(mobileMenuRef.current, { x: "100%", duration: 0.4, ease: "power3.in" });
    }
  }, [mobileMenuOpen]);

  function handleFilter(categoryName: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName === "All") params.delete("category");
    else params.set("category", categoryName);
    setMobileMenuOpen(false);
    startTransition(() => { router.replace(`/products?${params.toString()}`, { scroll: false }); });
  }

  const toggleAccordion = (id: number) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const isCategoryActive = (cat: StrapiCategory) => activeCategory === cat.Name || cat.subcategories?.some(sub => sub.Name === activeCategory);

  // Safety filter for top level
  const topLevelCategories = dbCategories.filter(cat => !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name));

  return (
    <div className="relative mb-8 z-30">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100 sticky top-32">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200/50">
          <FilterIcon size={16} className="text-orange-600" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Categories</span>
          {isPending && <div className="ml-auto h-2 w-2 rounded-full bg-orange-500 animate-ping" />}
        </div>
        <div className="flex flex-col space-y-2">
            <button onClick={() => handleFilter("All")} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === "All" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-white hover:text-zinc-900"}`}>View All</button>
            {topLevelCategories.map(cat => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expandedCats.includes(cat.id);
                const isActive = isCategoryActive(cat);
                return (
                    <div key={cat.id} className="flex flex-col">
                        <div className={`flex items-center justify-between px-4 py-2 rounded-xl transition-all cursor-pointer ${isActive ? "bg-white shadow-sm" : "hover:bg-white/50"}`}>
                            <button onClick={() => handleFilter(cat.Name)} className={`flex-1 text-left text-xs font-bold uppercase tracking-widest ${isActive ? "text-orange-600" : "text-zinc-900"}`}>{cat.Name}</button>
                            {hasSubs && <button onClick={(e) => { e.stopPropagation(); toggleAccordion(cat.id); }} className="p-1 hover:bg-zinc-100 rounded-full"><ChevronDown size={14} className={`text-zinc-400 transition-transform ${isExpanded ? "rotate-180 text-orange-600" : ""}`} /></button>}
                        </div>
                        {hasSubs && isExpanded && (
                            <div className="pl-6 pr-2 py-2 flex flex-col gap-1 border-l-2 border-zinc-100 ml-4 mt-1">
                                {cat.subcategories?.map(sub => (
                                    <button key={sub.id} onClick={() => handleFilter(sub.Name)} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeCategory === sub.Name ? "text-orange-600 bg-orange-50" : "text-zinc-400 hover:text-zinc-900"}`}>
                                        <span className={`w-1 h-1 rounded-full ${activeCategory === sub.Name ? "bg-orange-500" : "bg-zinc-300"}`}></span>{sub.Name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>

      {/* MOBILE TRIGGER */}
      <div className="lg:hidden sticky top-4 z-40">
        <button onClick={() => setMobileMenuOpen(true)} className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
            <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"><FilterIcon size={16} /> Filters</span>
            <span className="flex items-center gap-2 text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full text-white">{activeCategory}</span>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div ref={mobileMenuRef} className="fixed inset-y-0 right-0 z-150 w-full max-w-xs bg-white shadow-2xl transform translate-x-full lg:hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><FilterIcon size={16} className="text-orange-600" /> Filters</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-500"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <button onClick={() => handleFilter("All")} className={`w-full text-left p-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${activeCategory === "All" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-100 text-zinc-500"}`}>View All</button>
            {topLevelCategories.map(cat => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isActive = isCategoryActive(cat);
                return (
                    <div key={cat.id} className={`rounded-2xl border transition-all ${isActive ? "border-orange-200 bg-orange-50/30" : "border-zinc-100"}`}>
                        <div className="flex items-center p-2">
                            <button onClick={() => handleFilter(cat.Name)} className={`flex-1 text-left p-2 text-xs font-bold uppercase tracking-widest ${isActive ? "text-orange-600" : "text-zinc-900"}`}>{cat.Name}</button>
                        </div>
                        {hasSubs && (
                            <div className="px-4 pb-4 space-y-1 border-t border-dashed border-orange-200/50 pt-2 mx-2">
                                {cat.subcategories?.map(sub => (
                                    <button key={sub.id} onClick={() => handleFilter(sub.Name)} className={`w-full text-left py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${activeCategory === sub.Name ? "text-orange-600 bg-white shadow-sm" : "text-zinc-400 hover:text-zinc-900"}`}>
                                        <span>{sub.Name}</span>
                                        {activeCategory === sub.Name && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        <div className="p-4 border-t border-zinc-100">
            <button onClick={() => setMobileMenuOpen(false)} className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Show {activeCategory}</button>
        </div>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-140 bg-zinc-950/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
}