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
  
  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const activeCategory = searchParams.get("category") || "All";
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Categories
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getCategories();
        if (isMounted) {
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

  // Mobile Drawer Animation
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
    
    if (categoryName === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    
    // Close menus
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  }

  // --- Helper to check if a category or its children are active ---
  const isCategoryActive = (cat: StrapiCategory) => {
    if (activeCategory === cat.Name) return true;
    if (cat.subcategories?.some(sub => sub.Name === activeCategory)) return true;
    return false;
  };

  return (
    <div className="relative mb-10 z-30">
      {/* --- DESKTOP BAR --- */}
      <div className="hidden lg:flex items-center justify-between bg-white rounded-full border border-zinc-100 p-2 shadow-sm">
        
        {/* Label */}
        <div className="flex items-center gap-3 px-4 border-r border-zinc-100">
          <FilterIcon size={14} className="text-zinc-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Filter Collection
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 px-4" ref={dropdownRef}>
          {/* ALL Button */}
          <button
            onClick={() => handleFilter("All")}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
              activeCategory === "All" 
                ? "bg-zinc-900 text-white" 
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            All
          </button>

          {/* Categories Mapped */}
          {dbCategories.map((cat) => {
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            const isActive = isCategoryActive(cat);

            return (
              <div key={cat.id} className="relative">
                <button
                  onClick={() => {
                    if (hasSubs) {
                        setActiveDropdown(activeDropdown === cat.id ? null : cat.id);
                    } else {
                        handleFilter(cat.Name);
                    }
                  }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                    isActive
                      ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" 
                      : "text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  {cat.Name}
                  {hasSubs && <ChevronDown size={14} className={`transition-transform ${activeDropdown === cat.id ? "rotate-180" : ""}`} />}
                </button>

                {/* Dropdown for Subcategories */}
                {hasSubs && activeDropdown === cat.id && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <button
                        onClick={() => handleFilter(cat.Name)}
                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-900 hover:bg-zinc-50 flex items-center justify-between"
                    >
                        All {cat.Name}
                        {activeCategory === cat.Name && <Check size={14} className="text-orange-600" />}
                    </button>
                    <div className="h-px bg-zinc-50 my-1"></div>
                    {cat.subcategories?.map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => handleFilter(sub.Name)}
                            className="w-full text-left px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between"
                        >
                            {sub.Name}
                            {activeCategory === sub.Name && <Check size={14} className="text-orange-600" />}
                        </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Indicator */}
        <div className="px-4">
            {isPending && <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></div>}
        </div>
      </div>


      {/* --- MOBILE TRIGGER --- */}
      <div className="lg:hidden">
        <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-2xl shadow-lg"
        >
            <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                <FilterIcon size={16} /> Filters
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded text-white">
                {activeCategory}
            </span>
        </button>
      </div>


      {/* --- MOBILE SIDEPANEL (DRAWER) --- */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-y-0 right-0 z-150 w-full max-w-sm bg-white shadow-2xl transform translate-x-full lg:hidden"
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                <h2 className="text-xl font-black uppercase tracking-tighter">Filter Collection</h2>
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <button
                    onClick={() => handleFilter("All")}
                    className={`w-full text-left p-4 rounded-xl text-sm font-bold uppercase tracking-widest border transition-all ${
                        activeCategory === "All" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-100 text-zinc-500"
                    }`}
                >
                    View All
                </button>

                {dbCategories.map(cat => {
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    const isActive = isCategoryActive(cat);

                    return (
                        <div key={cat.id} className={`rounded-xl border transition-all ${isActive ? "border-orange-200 bg-orange-50/50" : "border-zinc-100"}`}>
                            {/* Parent Button */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleFilter(cat.Name)}
                                    className={`flex-1 text-left p-4 text-sm font-bold uppercase tracking-widest ${
                                        activeCategory === cat.Name ? "text-orange-600" : "text-zinc-900"
                                    }`}
                                >
                                    {cat.Name}
                                </button>
                            </div>

                            {/* Subcategories List */}
                            {hasSubs && (
                                <div className="px-4 pb-4 space-y-1 border-t border-dashed border-orange-200/50 pt-2 -mt-1.25">
                                    {cat.subcategories?.map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleFilter(sub.Name)}
                                            className={`w-full text-left py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                                                activeCategory === sub.Name 
                                                ? "text-orange-600 bg-white shadow-sm" 
                                                : "text-zinc-400 hover:text-zinc-900"
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${activeCategory === sub.Name ? "bg-orange-500" : "bg-zinc-300"}`}></span>
                                            {sub.Name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
                >
                    Show Results
                </button>
            </div>
        </div>
      </div>
      
      {/* Overlay for Mobile */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 z-140 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}