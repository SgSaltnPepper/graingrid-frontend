"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface MappedProduct {
  id: string | number;
  _id: string;
  Name: string;
  Price: number;
  Image?: string;
  variants?: { Description?: string }[];
  [key: string]: unknown;
}

// Strictly typed easing curve for Framer Motion to prevent TypeScript errors
const sliderEase: [number, number, number, number] = [0.76, 0, 0.24, 1];
const microEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function HeroSlider({ products = [] }: { products?: MappedProduct[] }) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Guard clause to prevent undefined length errors
  if (!products || products.length === 0) return null;

  const activeIndex = ((page % products.length) + products.length) % products.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // --- Animation Variants ---
  
  // Left Panel (Image): Moves DOWN when advancing
  const leftPanelVariants: Variants = {
    enter: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
    center: { y: "0%", zIndex: 1, transition: { duration: 1.2, ease: sliderEase } },
    exit: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", zIndex: 0, transition: { duration: 1.2, ease: sliderEase } })
  };

  // Right Panel (Text Container): Moves UP when advancing
  const rightPanelVariants: Variants = {
    enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
    center: { 
      y: "0%", 
      zIndex: 1,
      transition: { 
        duration: 1.2, 
        ease: sliderEase,
        staggerChildren: 0.1, 
        delayChildren: 0.3 
      }
    },
    exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", zIndex: 0, transition: { duration: 1.2, ease: sliderEase } })
  };

  // Staggered Text Micro-interactions
  const textChildVariants: Variants = {
    enter: { opacity: 0, y: 40, filter: "blur(8px)" },
    center: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: microEase }
    },
    exit: { opacity: 0, y: -20, filter: "blur(4px)", transition: { duration: 0.4 } }
  };

  // Image Parallax Scaling
  const imageVariants: Variants = {
    enter: (dir: number) => ({ scale: 1.3, y: dir > 0 ? "-10%" : "10%", opacity: 0 }),
    center: { 
      scale: 1, 
      y: "0%", 
      opacity: 1, 
      transition: { duration: 1.4, ease: microEase } 
    },
    exit: (dir: number) => ({ scale: 1.1, y: dir > 0 ? "10%" : "-10%", opacity: 0, transition: { duration: 0.8 } })
  };

  return (
    <section className="relative w-full h-[85vh] lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-zinc-950">
      
      {/* --- SPLIT LINE THUMBNAILS --- */}
      {/* Positioned exactly on the center line overlapping both halves */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex-col gap-5 mix-blend-normal">
        {products.map((p, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={p._id}
              onClick={() => {
                const newDir = idx > activeIndex ? 1 : -1;
                if (!isActive) setPage([idx, newDir]);
              }}
              className={`relative rounded-full transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] flex items-center justify-center
                ${isActive ? 'w-16 h-16 shadow-2xl' : 'w-10 h-10 opacity-50 hover:opacity-100 hover:scale-110 cursor-pointer shadow-md'}
              `}
            >
              {/* Active Outline Ring (Fixed Tailwind syntax) */}
              <div className={`absolute -inset-1.5 rounded-full border-2 border-orange-500 transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} />
              
              <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-white/80 bg-zinc-200">
                <Image 
                  src={p.Image || '/placeholder-product.jpg'} 
                  alt={p.Name} 
                  fill 
                  sizes="64px"
                  className="object-cover" 
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* --- LEFT SIDE: FULL VIEW IMAGE CONTAINER --- */}
      <div className="relative w-full lg:w-1/2 h-[45%] lg:h-full overflow-hidden bg-zinc-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={leftPanelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Full Bleed Image Container with Parallax */}
            <motion.div 
              variants={imageVariants}
              className="relative w-full h-full overflow-hidden"
            >
              <Image
                src={products[activeIndex].Image || "/placeholder-product.jpg"}
                alt={products[activeIndex].Name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center" 
                priority
              />
              {/* Subtle overlay to blend raw images seamlessly */}
              <div className="absolute inset-0 bg-zinc-950/20 mix-blend-multiply" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- RIGHT SIDE: TEXT CONTAINER (GrainGrid Theme) --- */}
      <div className="relative w-full lg:w-1/2 h-[55%] lg:h-full overflow-hidden bg-zinc-50">
        
        {/* Navigation Arrows */}
        <div className="absolute right-6 lg:right-12 bottom-6 lg:bottom-12 z-50 flex flex-col gap-3">
          <button 
            onClick={() => paginate(-1)} 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-90 shadow-sm"
          >
            <ArrowUp size={22} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => paginate(1)} 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-90 shadow-sm"
          >
            <ArrowDown size={22} strokeWidth={1.5} />
          </button>
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={rightPanelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:pl-32 lg:pr-40"
          >
            {/* Index Counter (Fixed Tailwind syntax) */}
            <motion.div variants={textChildVariants} className="flex items-center gap-3 mb-6 lg:mb-10 text-xs font-bold tracking-widest text-zinc-400">
              <span className="text-zinc-900">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="w-8 h-px bg-zinc-300 -rotate-45 origin-center" />
              <span>
                {String(products.length).padStart(2, '0')}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={textChildVariants} className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black uppercase tracking-tighter text-zinc-950 mb-6 leading-[0.95]">
              {products[activeIndex].Name}
            </motion.h1>

            {/* Description */}
            <motion.p variants={textChildVariants} className="text-zinc-500 leading-relaxed mb-10 max-w-md text-sm lg:text-base font-medium">
              {products[activeIndex].variants?.[0]?.Description || 
                "Our signature selection is meticulously sourced and processed to ensure the highest quality standards. Featuring distinct flavor profiles perfect for home consumption and global retail."}
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={textChildVariants}>
              <Link 
                href={`/products/${products[activeIndex]._id}`} 
                className="inline-flex items-center justify-center bg-zinc-950 hover:bg-orange-600 text-white px-8 lg:px-10 py-4 lg:py-5 text-[10px] lg:text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-600/20 active:scale-95"
              >
                Explore Details
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
    </section>
  );
}