"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia, type StrapiProduct } from "@/lib/strapi";
import { MoveRight } from "lucide-react";
import { motion, Variants } from "framer-motion"; // ✨ Imported Variants

export default function RecentProductsGrid({ products }: { products: StrapiProduct[] }) {
  if (!products || products.length === 0) return null;

  // ✨ Added : Variants to explicitly type the object for Framer Motion
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[350px]"
    >
      {products.map((p, index) => {
        const categoryName = p.categories?.[0]?.Name || "Premium";
        const mainImageUrl = getStrapiMedia(p.Image);
        
        let descText = typeof p.Description === 'string' 
            ? p.Description 
            : p.Description?.map((block: any) => block.children?.map((c: any) => c.text).join("")).join(" ") || "";
        const shortDesc = descText.length > 80 ? descText.substring(0, 80) + "..." : descText;

        let gridClass = "col-span-1 row-span-1"; 
        if (index === 0) gridClass = "md:col-span-2 md:row-span-2";
        else if (index === 1) gridClass = "md:col-span-2 md:row-span-1 lg:col-span-2";

        return (
          // ✨ Updated to rounded-4xl
          <motion.div key={p.id} variants={itemAnim} className={`${gridClass} relative group h-full w-full rounded-4xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-2xl transition-shadow duration-500`}>
            
            <Image 
                src={mainImageUrl} 
                alt={p.Name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* ✨ Updated bg-gradient-to-t to bg-linear-to-t */}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-4">
                        {categoryName}
                    </span>
                    <h3 className={`font-black uppercase tracking-tighter text-white leading-none mb-3 ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                        {p.Name}
                    </h3>
                    
                    <div className="h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-out">
                        <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-6 border-l-2 border-orange-500 pl-4">
                            {shortDesc}
                        </p>
                        <Link href={`/products/${p.documentId || p.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 hover:text-white transition-colors">
                            Discover Details <MoveRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}