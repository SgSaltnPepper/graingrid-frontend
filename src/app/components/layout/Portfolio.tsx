"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, Wheat, Shovel, Sprout, Nut, Apple, Leaf, ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "@/sanity/lib/queries";
import { motion, PanInfo, AnimatePresence } from "framer-motion";

export interface SanityCategory {
  _id: string;
  Name: string;
  CatImage?: string;
}

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("rice")) return <Wheat className="w-5 h-5" />;
  if (n.includes("spice")) return <Shovel className="w-5 h-5 rotate-45" />;
  if (n.includes("pulse")) return <Sprout className="w-5 h-5" />;
  if (n.includes("cereal")) return <Nut className="w-5 h-5" />;
  if (n.includes("fruit")) return <Apple className="w-5 h-5" />;
  if (n.includes("bakery") || n.includes("bread")) return <Wheat className="w-5 h-5" />;
  if (n.includes("meat") || n.includes("seafood")) return <Leaf className="w-5 h-5" />;
  return <Leaf className="w-5 h-5" />;
};

export default function Portfolio() {
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const data = await getCategories();
        if (isMounted) {
          const topLevel = (Array.isArray(data) ? data : []).filter(
              (cat: SanityCategory) => !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name)
          );
          setCategories(topLevel);
        }
      } catch (error) {
        console.error("Portfolio fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // --- Carousel Navigation Logic ---
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Drag interaction for touch devices
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Determine styling based on distance from the active item
  const getCardStyles = (index: number) => {
    const offset = index - activeIndex;
    const total = categories.length;
    
    // Normalize offset for infinite looping feel
    let normalizedOffset = offset;
    if (offset > Math.floor(total / 2)) normalizedOffset -= total;
    if (offset < -Math.floor(total / 2)) normalizedOffset += total;

    const absOffset = Math.abs(normalizedOffset);
    const isVisible = absOffset <= 2; // Only render the active card + 2 on each side

    return {
      x: `calc(${normalizedOffset * 65}% + ${normalizedOffset * 10}px)`,
      scale: 1 - absOffset * 0.15,
      zIndex: 40 - absOffset,
      opacity: isVisible ? 1 - absOffset * 0.3 : 0,
      rotateY: normalizedOffset * -10, // 3D Tilt effect
      pointerEvents: isVisible ? "auto" as const : "none" as const,
    };
  };

  return (
    <section className="py-24 lg:py-32 bg-zinc-50 overflow-hidden border-t border-zinc-100">
      <div className="mx-auto max-w-400 px-6 lg:px-12">
        
        {/* --- HEADER & NAVIGATION SECTION --- */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 border border-orange-200 text-orange-600">
                  <Sparkles size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Explore Categories</span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85]">
              Harvesting <span className="text-orange-600 italic font-serif lowercase pr-2">the</span> <br /> 
              Best <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-800">Collections</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                className="h-14 w-14 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95 shadow-sm"
                aria-label="Previous Category"
              >
                <ChevronLeft size={24} strokeWidth={2} />
              </button>
              <button 
                onClick={handleNext}
                className="h-14 w-14 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95 shadow-sm"
                aria-label="Next Category"
              >
                <ChevronRight size={24} strokeWidth={2} />
              </button>
            </div>

            <Link href="/products" className="group relative overflow-hidden rounded-full bg-zinc-950 px-8 py-4 lg:px-10 lg:py-5 transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/20 active:scale-95 w-full sm:w-auto text-center shrink-0">
              <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white">
                View All Catalog <MoveRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- 3D STACKING CAROUSEL SECTION --- */}
      <div className="relative w-full flex justify-center items-center h-125 lg:h-150 mt-10 perspective-distant overflow-hidden">
        {loading ? (
          <div className="absolute w-[85vw] sm:w-100 md:w-112.5 h-100 lg:h-125 bg-zinc-200 rounded-[2.5rem] animate-pulse shadow-xl" />
        ) : (
          <AnimatePresence initial={false}>
            {categories.map((cat, idx) => {
              const styles = getCardStyles(idx);
              const isActive = idx === activeIndex;

              return (
                <motion.div 
                  key={cat._id} 
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    x: styles.x, 
                    scale: styles.scale, 
                    zIndex: styles.zIndex, 
                    opacity: styles.opacity,
                    rotateY: styles.rotateY
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
                  className="absolute w-[80vw] sm:w-100 md:w-112.5 h-100 lg:h-125 rounded-[2.5rem] cursor-grab active:cursor-grabbing origin-center"
                >
                  <Link 
                    href={`/products?category=${encodeURIComponent(cat.Name)}`} 
                    onClick={(e) => {
                      // If the card is not active, prevent navigation and pull it to the front instead
                      if (!isActive) {
                        e.preventDefault();
                        setActiveIndex(idx);
                      }
                    }}
                    className={`group relative block w-full h-full overflow-hidden rounded-[2.5rem] bg-zinc-900 shadow-2xl transition-all duration-500 isolate ${isActive ? 'ring-4 ring-white ring-offset-4 ring-offset-zinc-50' : ''}`}
                  >
                    <Image 
                      src={cat.CatImage || "/placeholder-category.jpg"} 
                      alt={cat.Name} 
                      fill
                      sizes="(max-width: 640px) 85vw, 450px"
                      className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 pointer-events-none" 
                    />
                    
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80" />
                    
                    <div className={`absolute inset-0 p-8 flex flex-col justify-between z-20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                      
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-orange-600 group-hover:border-orange-500 group-hover:scale-110 group-hover:-rotate-12 shadow-lg">
                          {getIcon(cat.Name)}
                        </div>
                        {isActive && (
                          <div className="h-12 w-12 rounded-full bg-white text-zinc-900 flex items-center justify-center transition-transform duration-500 ease-out shadow-xl">
                            <ArrowUpRight size={20} />
                          </div>
                        )}
                      </div>

                      <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                        <h4 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-3 leading-none drop-shadow-md">
                          {cat.Name}
                        </h4>
                        
                        <div className={`flex items-center gap-3 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="h-0.5 w-8 bg-orange-500" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400">
                            Explore Collection
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}