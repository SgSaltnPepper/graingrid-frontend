"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { getCategories, type StrapiCategory } from "@/lib/strapi";
import { ChevronDown, Filter as FilterIcon, X, Check } from "lucide-react";
import gsap from "gsap";
import Search from "./Search";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dbCategories, setDbCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for desktop hover dropdowns
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  
  // State for mobile accordions
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
    
    params.delete("page"); 
    
    setMobileMenuOpen(false);
    setHoveredCat(null); 
    startTransition(() => { router.replace(`/products?${params.toString()}`, { scroll: false }); });
  }

  const toggleAccordion = (id: number) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const isCategoryActive = (cat: StrapiCategory) => activeCategory === cat.Name || cat.subcategories?.some(sub => sub.Name === activeCategory);

  const topLevelCategories = dbCategories.filter(cat => !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name));

  return (
    <div className="w-full mb-10 relative z-40">
      
      {/* --- DESKTOP HORIZONTAL FULL WIDTH BAR --- */}
      <div className="hidden lg:flex items-center justify-between bg-white border border-zinc-200 rounded-4xl p-2 shadow-sm w-full relative z-40">
        
        {/* Left: Horizontal Category Links */}
        <div className="flex flex-wrap items-center gap-1 pl-2">
            <button 
                onClick={() => handleFilter("All")} 
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === "All" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
            >
                All Products
            </button>

            {topLevelCategories.map(cat => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isActive = isCategoryActive(cat);

                return (
                    <div 
                        key={cat.id} 
                        className="relative group"
                        onMouseEnter={() => hasSubs && setHoveredCat(cat.id)}
                        onMouseLeave={() => hasSubs && setHoveredCat(null)}
                    >
                        <button 
                            onClick={() => handleFilter(cat.Name)} 
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                isActive ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            }`}
                        >
                            {cat.Name}
                            {hasSubs && <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredCat === cat.id ? "rotate-180" : ""}`} />}
                        </button>

                        {/* Dropdown for Subcategories */}
                        {hasSubs && (
                            <div 
                                className={`absolute top-full left-0 pt-4 w-56 transition-all duration-300 ease-out z-50 ${
                                    hoveredCat === cat.id ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
                                }`}
                            >
                                <div className="bg-white border border-zinc-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl p-3 flex flex-col gap-1">
                                    {cat.subcategories?.map(sub => (
                                        <button 
                                            key={sub.id} 
                                            onClick={() => handleFilter(sub.Name)} 
                                            className={`text-left px-5 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between ${
                                                activeCategory === sub.Name ? "bg-orange-50 text-orange-600 pl-6" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:pl-6"
                                            }`}
                                        >
                                            {sub.Name}
                                            {activeCategory === sub.Name && <Check size={12} className="text-orange-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>

        {/* Right: Search Bar Integration */}
        <div className="w-75 shrink-0 pr-2">
            <Search isPending={isPending} />
        </div>
      </div>

      {/* --- MOBILE TRIGGER --- */}
      <div className="lg:hidden sticky top-4 z-40 flex items-center gap-4">
        <button onClick={() => setMobileMenuOpen(true)} className="flex-1 flex items-center justify-between bg-zinc-900 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
            <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"><FilterIcon size={16} /> Filters</span>
            <span className="flex items-center gap-2 text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full text-white">{activeCategory}</span>
        </button>
      </div>

      {/* --- MOBILE DRAWER --- */}
      <div ref={mobileMenuRef} className="fixed inset-y-0 right-0 z-150 w-full max-w-sm bg-white shadow-2xl transform translate-x-full lg:hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><FilterIcon size={16} className="text-orange-600" /> Filters</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
            <Search isPending={isPending} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <button onClick={() => handleFilter("All")} className={`w-full text-left p-5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${activeCategory === "All" ? "border-zinc-900 bg-zinc-900 text-white shadow-lg" : "border-zinc-100 text-zinc-500 hover:border-zinc-300"}`}>View All</button>
            {topLevelCategories.map(cat => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isActive = isCategoryActive(cat);
                const isExpanded = expandedCats.includes(cat.id);
                return (
                    <div key={cat.id} className={`rounded-2xl border transition-all ${isActive ? "border-orange-200 bg-orange-50/30" : "border-zinc-100 hover:border-zinc-300"}`}>
                        <div className="flex items-center p-2">
                            <button onClick={() => handleFilter(cat.Name)} className={`flex-1 text-left p-3 text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? "text-orange-600" : "text-zinc-900"}`}>{cat.Name}</button>
                            {hasSubs && <button onClick={(e) => { e.stopPropagation(); toggleAccordion(cat.id); }} className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"><ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-orange-600" : "text-zinc-400"}`} /></button>}
                        </div>
                        {hasSubs && isExpanded && (
                            <div className="px-3 pb-4 space-y-2 border-t border-dashed border-orange-200/50 pt-3 mx-2">
                                {cat.subcategories?.map(sub => (
                                    <button key={sub.id} onClick={() => handleFilter(sub.Name)} className={`w-full text-left py-4 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-between transition-all ${activeCategory === sub.Name ? "text-orange-600 bg-white shadow-sm border border-orange-100" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"}`}>
                                        <span>{sub.Name}</span>
                                        {activeCategory === sub.Name && <Check size={14} className="text-orange-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        <div className="p-6 border-t border-zinc-100 bg-white">
            <button onClick={() => setMobileMenuOpen(false)} className="w-full py-5 bg-zinc-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">View {activeCategory}</button>
        </div>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-140 bg-zinc-950/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
}