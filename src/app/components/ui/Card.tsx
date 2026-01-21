"use client";

import Image from "next/image";
import Link from "next/link";

export type BadgeTone = "orange" | "green" | "red" | "blue" | "purple";

export interface Badge {
  label: string;
  tone?: BadgeTone;
  isActive?: boolean;
}

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  href?: string;
  badges?: Badge[];
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  orange: "bg-orange-50 text-orange-600 ring-orange-200",
  green: "bg-green-50 text-green-600 ring-green-200",
  red: "bg-red-50 text-red-600 ring-red-200",
  blue: "bg-blue-50 text-blue-600 ring-blue-200",
  purple: "bg-purple-50 text-purple-600 ring-purple-200",
};

export default function Card({
  title,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  href,
  badges = [],
  className = "",
}: CardProps) {
  
  const displayPrice = price !== undefined 
    ? typeof price === "number" 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
      : price
    : null;

  const content = (
    <article
      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-zinc-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-zinc-100">
        <Image
          src={imageSrc || "/placeholder-product.jpg"}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
        />
        
        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {badges
            .filter(b => b.isActive !== false) // Only show if isActive is true or undefined
            .map((badge, idx) => (
            <span 
              key={`${badge.label}-${idx}`}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ring-1 ring-inset backdrop-blur-md shadow-sm ${toneClasses[badge.tone || "orange"]}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          {displayPrice && (
            <span className="shrink-0 font-bold text-zinc-900 text-sm">{displayPrice}</span>
          )}
        </div>

        {subtitle && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="mb-4 text-xs leading-relaxed text-zinc-500 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer Area */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
          <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            {Array.isArray(meta) ? meta.join(" • ") : meta || "View Details"}
          </div>
          <div className="p-2 rounded-full bg-zinc-50 group-hover:bg-orange-50 transition-colors text-zinc-400 group-hover:text-orange-600">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-2xl">
      {content}
    </Link>
  ) : content;
}