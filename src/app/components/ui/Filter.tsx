"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { getCategories } from "@/sanity/lib/queries";
import { ChevronDown, Filter as FilterIcon, X, Check, Grid2X2 } from "lucide-react";
import gsap from "gsap";

export interface SanityCategory {
  _id: string;
  Name: string;
  CatImage?: string;
  subcategories?: SanityCategory[];
}

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [dbCategories, setDbCategories] = useState<SanityCategory[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Shared state for desktop & mobile accordions
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  
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
             const activeCatObj = data.find((c: SanityCategory) => c.subcategories?.some((s: SanityCategory) => s.Name === activeCategory));
             if (activeCatObj) setExpandedCats([activeCatObj._id]);
          }
        }
      } catch (error) { 
        console.error("Filter error:", error); 
      }
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
    
    params.delete("page"); 
    
    setMobileMenuOpen(false);
    startTransition(() => { router.replace(`/products?${params.toString()}`, { scroll: false }); });
  }

  const toggleAccordion = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const isCategoryActive = (cat: SanityCategory) => activeCategory === cat.Name || cat.subcategories?.some((sub: SanityCategory) => sub.Name === activeCategory);
  const topLevelCategories = dbCategories.filter((cat: SanityCategory) => !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name));

  const renderCategoryList = () => (
    <div className="flex flex-col space-y-3 w-full">
      <button 
        onClick={() => handleFilter("All")} 
        className={`w-full text-left p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${
          activeCategory === "All" ? "border-zinc-900 bg-zinc-900 text-white shadow-xl" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
        }`}
      >
        <span className="flex items-center gap-3"><Grid2X2 size={16} /> All Products</span>
      </button>

      {topLevelCategories.map(cat => {
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
        const isActive = isCategoryActive(cat);
        const isExpanded = expandedCats.includes(cat._id);

        return (
          <div key={cat._id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
            isActive ? "border-orange-200 bg-orange-50/50" : "border-zinc-200 hover:border-zinc-300 bg-white"
          }`}>
            <div className="flex items-center p-1">
                <button 
                  onClick={() => handleFilter(cat.Name)} 
                  className={`flex-1 text-left p-4 text-[11px] font-black uppercase tracking-widest transition-colors ${
                    isActive ? "text-orange-600" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {cat.Name}
                </button>
                
                {hasSubs && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleAccordion(cat._id); }} 
                    className="p-3 mr-1 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
                  >
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-orange-600" : "text-zinc-400"}`} />
                  </button>
                )}
            </div>
            
            {hasSubs && (
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-3 pb-4 space-y-1 border-t border-dashed border-zinc-200 pt-3 mx-3">
                        {cat.subcategories?.map((sub: SanityCategory) => (
                            <button 
                              key={sub._id} 
                              onClick={() => handleFilter(sub.Name)} 
                              className={`w-full text-left py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                                activeCategory === sub.Name ? "text-orange-600 bg-white shadow-sm border border-orange-100" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                              }`}
                            >
                                <span>{sub.Name}</span>
                                {activeCategory === sub.Name && <Check size={14} className="text-orange-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full relative z-40">
      
      {/* --- DESKTOP VERTICAL SIDEBAR --- */}
      <div className="hidden lg:flex flex-col bg-zinc-50/50 border border-zinc-200 rounded-4xl p-5 shadow-sm w-full sticky top-32">
        <div className="flex items-center gap-3 mb-6 px-2">
          <FilterIcon size={18} className="text-zinc-900" />
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Categories</h3>
        </div>
        {renderCategoryList()}
      </div>

      {/* --- MOBILE TRIGGER --- */}
      <div className="lg:hidden sticky top-4 z-40 flex items-center gap-4 mb-8">
        <button onClick={() => setMobileMenuOpen(true)} className="flex-1 flex items-center justify-between bg-zinc-950 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
            <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"><FilterIcon size={16} /> Filters</span>
            <span className="flex items-center gap-2 text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full text-white line-clamp-1 max-w-30">{activeCategory}</span>
        </button>
      </div>

      {/* --- MOBILE DRAWER --- */}
      <div ref={mobileMenuRef} className="fixed inset-y-0 right-0 z-150 w-full max-w-sm bg-zinc-50 shadow-2xl transform translate-x-full lg:hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-white">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><FilterIcon size={16} className="text-orange-600" /> Filters</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {renderCategoryList()}
        </div>
        
        <div className="p-6 border-t border-zinc-200 bg-white">
            <button onClick={() => setMobileMenuOpen(false)} className="w-full py-5 bg-zinc-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">View {activeCategory}</button>
        </div>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-140 bg-zinc-950/60 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
}