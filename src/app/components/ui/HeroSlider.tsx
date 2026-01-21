"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { StrapiProduct, getStrapiMedia } from "@/lib/strapi";

export default function HeroSlider({ products }: { products: StrapiProduct[] }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, products.length]);

  if (!products?.length) return null;

  return (
    <section className="relative h-[85vh] min-h-150 w-full overflow-hidden bg-zinc-950">
      {products.map((product, index) => {
        const imageUrl = getStrapiMedia(product.Image?.[0]?.url);
        const isActive = index === current;
        const descriptionText = product.Description?.[0]?.children?.[0]?.text || "";
        const primaryCategory = product.categories?.[0]?.Name || "Exclusive Collection";

        return (
          <div
            key={product.documentId}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
            }`}
          >
            {/* CINEMATIC BACKGROUND */}
            {imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={imageUrl}
                  alt={product.Name}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover transition-transform duration-6000 ease-linear ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                />
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              </div>
            )}

            {/* CONTENT */}
            <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center text-white">
              <div className={`mb-6 flex flex-col items-center gap-4 transition-all duration-1000 delay-300 ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                <span className="text-sm font-black uppercase tracking-[0.5em] text-orange-500">
                  {primaryCategory}
                </span>
                
                <div className="flex gap-2">
                  {product.badges?.map((badge) => (
                    <span
                      key={badge.documentId}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md"
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className={`max-w-4xl text-5xl font-black uppercase tracking-tighter sm:text-7xl lg:text-8xl transition-all duration-1000 delay-500 ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                {product.Name}
              </h1>

              {descriptionText && (
                <p className={`mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-300 transition-all duration-1000 delay-700 ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}>
                  {descriptionText}
                </p>
              )}

              <div className={`mt-10 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-1000 ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                <Link
                  href={`/products/${product.documentId}`}
                  className="rounded-full bg-orange-600 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-orange-600"
                >
                  Discover Piece
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-white/30 bg-transparent px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* SIDE PROGRESS BAR */}
      <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-6">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group flex items-center justify-end gap-3"
          >
            <span className={`text-[10px] font-bold transition-all duration-300 ${
              i === current ? "text-orange-500 opacity-100" : "text-white opacity-0 group-hover:opacity-60"
            }`}>
              0{i + 1}
            </span>
            <div className={`h-10 w-0.5 transition-all duration-500 ${
              i === current ? "bg-orange-500 h-14" : "bg-white/20"
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
}