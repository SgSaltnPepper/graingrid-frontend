"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import { MoveRight, Play } from "lucide-react";
import gsap from "gsap";

export default function HeroSlider({ products }: { products: any[] }) {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length]);

  // Handle slide transitions with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate current slide text
      gsap.fromTo(
        ".hero-title",
        { y: 100, opacity: 0, skewY: 7 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: "expo.out", delay: 0.2 }
      );
      
      gsap.fromTo(
        ".hero-desc",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );

      gsap.fromTo(
        ".hero-btn",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.8, stagger: 0.1 }
      );

      // Progress bar animation
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 6, ease: "none" }
      );
    }, sliderRef);

    return () => ctx.revert();
  }, [current]);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  if (!products?.length) return null;

  return (
    <section ref={sliderRef} className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden bg-zinc-950">
      {/* Noise Texture Overlay for Premium Feel */}
      <div className="pointer-events-none absolute inset-0 z-40 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {products.map((item, index) => {
        const imageUrl = getStrapiMedia(item.Image);
        const isActive = index === current;
        const descriptionText = typeof item.Description === 'string' 
          ? item.Description 
          : item.Description?.[0]?.children?.[0]?.text || "";

        return (
          <div
            key={item.documentId || item.id}
            className={`absolute inset-0 flex items-center transition-all duration-1000 ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* BACKGROUND WITH DUAL OVERLAY */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={item.Name}
                fill
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-6000 ease-out ${
                  isActive ? "scale-110 rotate-1" : "scale-125"
                }`}
              />
              <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent z-10" />
            </div>

            {/* CONTENT CONTAINER */}
            <div className="container relative z-20 mx-auto px-6 lg:px-12">
              <div className="max-w-4xl">
                <div className="mb-6 flex items-center gap-4 overflow-hidden">
                  <div className="h-px w-12 bg-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500">
                    {item.categories?.[0]?.Name || "Featured"}
                  </span>
                </div>

                <h1 className="hero-title text-6xl font-black uppercase tracking-tighter text-white sm:text-8xl lg:text-[7vw] leading-[0.85]">
                  {item.Name.split(' ').map((word: string, i: number) => (
                    <span key={i} className="inline-block mr-4">
                      {word === "Premium" ? <span className="text-orange-600 italic font-serif lowercase">{word}</span> : word}
                    </span>
                  ))}
                </h1>

                <p className="hero-desc mt-8 max-w-xl text-lg font-medium leading-relaxed text-zinc-400">
                  {descriptionText}
                </p>

                <div className="mt-12 flex flex-wrap gap-5">
                  <Link
                    href={`/products/${item.documentId || item.id}`}
                    className="hero-btn group relative flex items-center gap-3 overflow-hidden rounded-full bg-orange-600 px-10 py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-orange-600"
                  >
                    Explore Product <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* BOTTOM NAV & PROGRESS */}
      <div className="absolute bottom-12 left-6 right-6 z-30 flex flex-col md:flex-row items-end md:items-center justify-between gap-8 lg:px-12">
        <div className="flex items-center gap-4">
          <div className="relative h-px w-40 bg-white/20 overflow-hidden">
            <div ref={progressRef} className="absolute inset-0 bg-orange-500 origin-left scale-x-0" />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            0{current + 1} / 0{products.length}
          </span>
        </div>

        <div className="flex gap-4">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                i === current ? "w-12 bg-orange-600" : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}