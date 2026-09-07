"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type BadgeTone = "orange" | "green" | "red" | "blue" | "purple";

// 1. Updated Interfaces for Sanity
export interface SanityBadge {
  id?: string | number;
  _id?: string;
  label: string;
  tone?: BadgeTone | string;
  isActive?: boolean;
}

export interface SanityVariant {
  id?: string | number;
  _key?: string;
  type?: string; 
  Type?: string; 
  Description?: string;
  variantImage?: string; 
}

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string; 
  imageAlt?: string;
  href?: string;
  price?: number | null;
  badges?: SanityBadge[];
  variants?: SanityVariant[];
  className?: string;
}

const toneClasses: Record<string, string> = {
  orange: "bg-orange-50 text-orange-600 ring-orange-200",
  green: "bg-green-50 text-green-600 ring-green-200",
  red: "bg-red-50 text-red-600 ring-red-200",
  blue: "bg-blue-50 text-blue-600 ring-blue-200",
  purple: "bg-purple-50 text-purple-600 ring-purple-200",
};

export default function Card({
  title,
  subtitle,
  imageSrc,
  imageAlt = title,
  href,
  price,
  badges = [],
  variants = [],
  className = "",
}: CardProps) {
  const [activeVariant, setActiveVariant] = useState<SanityVariant | null>(
    variants && variants.length > 0 ? variants[0] : null
  );
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const getVariantName = (v: SanityVariant | null) => {
    if (!v) return "";
    return v.Type || v.type || "";
  };

  useGSAP(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, filter: "blur(4px)" }, 
        { opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
      );
    }
  }, { dependencies: [activeVariant], scope: containerRef });

  const variantName = getVariantName(activeVariant);
  const displayTitle = variantName ? `${title} - ${variantName}` : title;

  // 2. Strict Fallback Handling: Ensure `displayImage` is NEVER empty or undefined.
  const rawImage = activeVariant?.variantImage || imageSrc;
  const displayImage = typeof rawImage === "string" && rawImage.trim() !== "" ? rawImage : "/placeholder-product.jpg";

  return (
    <article 
      ref={containerRef}
      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-zinc-100 transition-all duration-500 hover:shadow-xl ${className}`}
    >
      <Link href={href || "#"} className="relative aspect-square overflow-hidden bg-zinc-50 block">
        <div ref={imageRef} className="w-full h-full relative">
          <Image
            src={displayImage}
            alt={imageAlt || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {badges?.filter(b => b.isActive !== false).map((badge, idx) => {
            const toneKey = badge.tone || "orange";
            const toneClass = toneClasses[toneKey] || toneClasses.orange;
            return (
              <span 
                key={badge.id || badge._id || idx} 
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ring-1 ring-inset backdrop-blur-md ${toneClass}`}
              >
                {badge.label}
              </span>
            );
          })}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {variants && variants.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {variants.map((v) => {
              const vImg = typeof v.variantImage === "string" && v.variantImage.trim() !== "" ? v.variantImage : null;
              const vName = getVariantName(v);
              const vId = v.id || v._key;
              return (
                <button
                  key={vId}
                  onClick={(e) => { e.preventDefault(); setActiveVariant(v); }}
                  className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                    activeVariant?.id === v.id || activeVariant?._key === v._key ? "border-orange-600 ring-2 ring-orange-100" : "border-zinc-200"
                  }`}
                >
                  {vImg ? (
                    <Image src={vImg} alt={vName || "Variant image"} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-500 uppercase">
                      {vName.substring(0, 2)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mb-1">
          <Link href={href || "#"}>
            <h3 className="text-base font-black tracking-tight text-zinc-900 group-hover:text-orange-600 transition-colors uppercase leading-tight min-h-10 flex items-center">
              {displayTitle}
            </h3>
          </Link>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
             {price ? `$${price}` : (subtitle || "GLOBAL EXPORT")}
          </div>
          <Link href={href || "#"} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-orange-600 transition-all">
            View Details <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}