"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import { MoveRight } from "lucide-react";
import gsap from "gsap";

export default function HeroSlider({ products }: { products: any[] }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length, isAnimating]);

  // GSAP Cinematic Clip-Path Transitions
  useEffect(() => {
    setIsAnimating(true);
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".slide-container");
      const currentSlide = slides[current] as HTMLElement;
      
      // Reset all slides z-index
      gsap.set(slides, { zIndex: 0 });
      gsap.set(currentSlide, { zIndex: 10 });

      // 1. Cinematic Wipe (Curtain Reveal)
      gsap.fromTo(
        currentSlide,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        { 
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
          duration: 1.6, 
          ease: "power4.inOut" 
        }
      );

      // 2. Image Slow Zoom (Ken Burns effect)
      const img = currentSlide.querySelector(".slide-image");
      gsap.fromTo(
        img,
        { scale: 1.3 },
        { scale: 1, duration: 2, ease: "power3.out" }
      );

      // 3. Staggered Text Mask Reveal
      const textLines = currentSlide.querySelectorAll(".hero-text-line");
      gsap.fromTo(
        textLines,
        { y: 100, opacity: 0, rotateX: 15 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "expo.out", 
          delay: 0.6 
        }
      );

      // 4. Elements Fade In
      const elements = currentSlide.querySelectorAll(".hero-element");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out", delay: 1, onComplete: () => setIsAnimating(false) }
      );

      // 5. Progress Line
      gsap.fromTo(
        `.progress-line-${current}`,
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
    <section ref={sliderRef} className="relative h-[90vh] lg:h-[95vh] w-full bg-zinc-950 overflow-hidden">
      
      {products.map((item, index) => {
        const imageUrl = getStrapiMedia(item.Image);
        const descriptionText = typeof item.Description === 'string' 
          ? item.Description 
          : item.Description?.[0]?.children?.[0]?.text || "";

        return (
          <div
            key={item.documentId || item.id}
            className={`slide-container absolute inset-0 w-full h-full ${index === current ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{ clipPath: index === current ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
          >
            {/* Image & Overlays */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={item.Name}
                fill
                priority={index === 0}
                className="slide-image object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 w-full px-6 pb-24 lg:px-16 lg:pb-32 z-20">
              <div className="max-w-5xl">
                
                {/* Badge */}
                <div className="hero-element mb-8 flex items-center gap-4 overflow-hidden">
                  <div className="h-px w-16 bg-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full backdrop-blur-md border border-orange-500/20">
                    {item.categories?.[0]?.Name || "Featured"}
                  </span>
                </div>

                {/* Title (Masked lines for smooth reveal) */}
                <h1 className="flex flex-col gap-2 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl lg:text-[7vw] leading-[0.85] mb-8">
                  {item.Name.split(' ').map((word: string, i: number) => (
                    <div key={i} className="overflow-hidden py-1">
                      <span className="hero-text-line block">
                        {word === "Premium" ? <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-600 italic font-serif lowercase pr-4">{word}</span> : word}
                      </span>
                    </div>
                  ))}
                </h1>

                {/* Glassmorphism Info Box */}
                <div className="hero-element flex flex-col md:flex-row gap-8 items-start md:items-center bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-3xl">
                    <p className="text-sm md:text-base font-medium leading-relaxed text-zinc-300 flex-1">
                        {descriptionText.length > 120 ? descriptionText.substring(0, 120) + "..." : descriptionText}
                    </p>
                    <Link
                        href={`/products/${item.documentId || item.id}`}
                        className="group flex items-center gap-4 rounded-full bg-white px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-950 transition-all hover:bg-orange-600 hover:text-white shrink-0 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        Explore <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* --- PREMIUM SLIDER NAVIGATION --- */}
      <div className="absolute bottom-8 right-6 lg:right-16 z-30 flex items-center gap-6">
        {products.map((_, i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrent(i)}>
            <span className={`text-[10px] font-black transition-colors duration-300 ${i === current ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                0{i + 1}
            </span>
            <div className="relative h-px w-16 bg-white/20 overflow-hidden">
                <div className={`progress-line-${i} absolute inset-0 bg-orange-500 origin-left ${i === current ? 'scale-x-100' : 'scale-x-0'}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}