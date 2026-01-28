"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, Wheat, Shovel, Sprout, Nut, Apple, Leaf, ArrowUpRight } from "lucide-react";
import { getCategories, getStrapiMedia, type StrapiCategory } from "@/lib/strapi";

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("rice")) return <Wheat className="w-6 h-6" />;
  if (n.includes("spice")) return <Shovel className="w-6 h-6 rotate-45" />;
  if (n.includes("pulse")) return <Sprout className="w-6 h-6" />;
  if (n.includes("cereal")) return <Nut className="w-6 h-6" />;
  if (n.includes("fruit")) return <Apple className="w-6 h-6" />;
  return <Leaf className="w-6 h-6" />;
};

const Portfolio = () => {
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Portfolio fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="py-32 bg-zinc-50 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-700">Explore Categories</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85]">
              Harvesting <span className="text-orange-600 italic font-serif lowercase">the</span> <br /> 
              Best <span className="text-zinc-400 underline decoration-orange-500/30 underline-offset-8">Collections</span>
            </h2>
          </div>
          
          <Link href="/products" className="group relative overflow-hidden rounded-full bg-zinc-950 px-10 py-5 transition-all hover:bg-orange-600">
            <span className="relative z-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white">
              View All Products <MoveRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-200 rounded-3xl h-112.5 animate-pulse" />
            ))
          ) : (
            categories.map((cat, idx) => (
              <Link 
                key={cat.documentId || cat.id} 
                href={`/products?category=${encodeURIComponent(cat.Name)}`} 
                className={`group relative overflow-hidden rounded-[2.5rem] bg-white h-112.5 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                  idx === 0 ? "lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={getStrapiMedia(cat.CatImage)} 
                    alt={cat.Name} 
                    fill 
                    className="object-cover transition-all duration-1000 group-hover:scale-110" 
                  />
                  {/* Sophisticated Gradient Mask */}
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 p-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-orange-600 group-hover:border-orange-500 group-hover:rotate-360">
                      {getIcon(cat.Name)}
                    </div>
                    <div className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center text-white opacity-0 -translate-y-4 hover:text-black hover:bg-amber-700 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-2 leading-none">
                      {cat.Name}
                    </h4>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="h-0.5 w-0 bg-orange-500 transition-all duration-700 group-hover:w-12" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700">
                        Discover Collection
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;