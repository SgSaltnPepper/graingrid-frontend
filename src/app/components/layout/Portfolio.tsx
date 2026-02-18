"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, Wheat, Shovel, Sprout, Nut, Apple, Leaf, ArrowUpRight, Sparkles } from "lucide-react";
import { getCategories, getStrapiMedia, type StrapiCategory } from "@/lib/strapi";
import { motion, Variants } from "framer-motion";

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("rice")) return <Wheat className="w-5 h-5" />;
  if (n.includes("spice")) return <Shovel className="w-5 h-5 rotate-45" />;
  if (n.includes("pulse")) return <Sprout className="w-5 h-5" />;
  if (n.includes("cereal")) return <Nut className="w-5 h-5" />;
  if (n.includes("fruit")) return <Apple className="w-5 h-5" />;
  return <Leaf className="w-5 h-5" />;
};

// Dynamic Bento Grid Pattern Generator
const getGridClass = (index: number) => {
  const pattern = [
    "md:col-span-2 md:row-span-2", // 0: Large Square
    "md:col-span-1 md:row-span-1", // 1: Small Square
    "md:col-span-1 md:row-span-1", // 2: Small Square
    "md:col-span-2 md:row-span-1", // 3: Wide Rectangle
    "md:col-span-1 md:row-span-2", // 4: Tall Rectangle
    "md:col-span-1 md:row-span-1", // 5: Small Square
    "md:col-span-2 md:row-span-1", // 6: Wide Rectangle
  ];
  return pattern[index % pattern.length];
};

export default function Portfolio() {
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCategories();
        // Safety filter to ensure we only show main categories
        const topLevel = (Array.isArray(data) ? data : []).filter(
            cat => !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name)
        );
        setCategories(topLevel);
      } catch (error) {
        console.error("Portfolio fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Framer Motion Animations ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <section className="py-32 bg-white px-6 lg:px-12 overflow-hidden border-t border-zinc-100">
      <div className="mx-auto max-w-400">
        
        {/* --- HEADER SECTION --- */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 border border-orange-100 text-orange-600">
                  <Sparkles size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Explore Categories</span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85]">
              Harvesting <span className="text-orange-600 italic font-serif lowercase pr-2">the</span> <br /> 
              Best <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-800">Collections</span>
            </h2>
          </div>
          
          <Link href="/products" className="group relative overflow-hidden rounded-full bg-zinc-950 px-10 py-5 transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/20 active:scale-95">
            <span className="relative z-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white">
              View All Products <MoveRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>
        </motion.div>

        {/* --- BENTO GRID SECTION --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] lg:auto-rows-[350px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${getGridClass(i)} bg-zinc-100 rounded-[2.5rem] animate-pulse`} />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] lg:auto-rows-[350px]"
          >
            {categories.map((cat, idx) => {
              const gridClass = getGridClass(idx);
              const isLarge = gridClass.includes("col-span-2");

              return (
                <motion.div key={cat.documentId || cat.id} variants={itemVariants} className={gridClass}>
                  <Link 
                    href={`/products?category=${encodeURIComponent(cat.Name)}`} 
                    className="group relative block w-full h-full overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-700"
                  >
                    {/* Background Image */}
                    <Image 
                      src={getStrapiMedia(cat.CatImage)} 
                      alt={cat.Name} 
                      fill 
                      className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110" 
                    />
                    
                    {/* Elegant Gradient Overlays */}
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-20">
                      
                      {/* Top: Icon & Arrow */}
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-orange-600 group-hover:border-orange-500 group-hover:scale-110 group-hover:-rotate-12 shadow-lg">
                          {getIcon(cat.Name)}
                        </div>
                        <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                          <ArrowUpRight size={20} />
                        </div>
                      </div>

                      {/* Bottom: Text Content */}
                      <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                        <h4 className={`${isLarge ? 'text-5xl lg:text-6xl' : 'text-3xl lg:text-4xl'} font-black uppercase tracking-tighter text-white mb-3 leading-none drop-shadow-md`}>
                          {cat.Name}
                        </h4>
                        
                        {/* Hidden Reveal Link */}
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <div className="h-px w-8 bg-orange-500" />
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
          </motion.div>
        )}
      </div>
    </section>
  );
}