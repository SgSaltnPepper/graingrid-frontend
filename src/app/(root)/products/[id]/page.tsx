"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { getStrapiMedia, getProductById, StrapiVariant, StrapiFAQ } from "@/lib/strapi";
import gsap from "gsap";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariant | null>(null);
  
  // Ref for the image container to animate
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
        // Default to the first actual variant if available
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Initial Animation (Fade In on Load)
  useEffect(() => {
    if (imageContainerRef.current && !loading) {
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          filter: "blur(0px)", 
          duration: 0.6, 
          ease: "power3.out" 
        }
      );
    }
  }, [loading]);

  const handleVariantChange = (variant: StrapiVariant) => {
    // Prevent animation if clicking the same variant
    if (selectedVariant?.id === variant.id) return;

    if (imageContainerRef.current) {
      // 1. Animate OUT
      gsap.to(imageContainerRef.current, {
        opacity: 0,
        y: -10,
        filter: "blur(5px)",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // 2. Change State (Swap Image)
          setSelectedVariant(variant);
          
          // 3. Animate IN
          gsap.fromTo(imageContainerRef.current, {
             opacity: 0,
             y: 10,
             filter: "blur(5px)",
          }, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out"
          });
        }
      });
    } else {
      setSelectedVariant(variant);
    }
  };

  // Helper to parse the Label/Value strings into a table
  const renderSpecs = (variant: StrapiVariant) => {
    if (!variant.Label || !variant.Value) return null;
    const labels = variant.Label.split('\n');
    const values = variant.Value.split('\n');
    
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {labels.map((label, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                <td className="w-1/3 bg-slate-50/30 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-600 transition-colors">
                  {label}
                </td>
                <td className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-slate-700">
                  {values[idx] || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div className="py-40 text-center uppercase text-[10px] font-black tracking-widest animate-pulse">Loading Product...</div>;
  if (!product) return <div className="py-40 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-24 pt-28">
      <div className="container mx-auto max-w-6xl px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Image Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-50 shadow-xl border border-slate-100">
              {/* Wrapper div for GSAP Animation */}
              <div ref={imageContainerRef} className="relative w-full h-full">
                <Image 
                  src={selectedVariant?.variantImage ? getStrapiMedia(selectedVariant.variantImage) : getStrapiMedia(product.Image)} 
                  alt={product.Name} 
                  fill 
                  unoptimized 
                  className="object-cover" 
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-none mb-6">
              {product.Name}
            </h1>

            {/* Variant Selector Buttons */}
            <div className="mb-10">
              <p className="mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Processing Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v: StrapiVariant) => (
                  <button 
                    key={v.id} 
                    onClick={() => handleVariantChange(v)}
                    className={`rounded-xl border-2 px-6 py-3 text-[10px] font-bold uppercase transition-all duration-300 ${
                      selectedVariant?.id === v.id 
                      ? "border-orange-600 bg-white text-orange-600 shadow-md scale-105" 
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {v.Type}
                  </button>
                ))}
              </div>
            </div>

            {/* Description & Specs */}
            <div className="mb-12">
              <p className="mb-3 text-[9px] font-black uppercase tracking-widest text-orange-600">Overview</p>
              <div className="relative min-h-[80px]">
                 <p className="text-base leading-relaxed text-slate-600 border-l-2 border-orange-100 pl-5 transition-all duration-300">
                    {selectedVariant?.Description || product.Description}
                 </p>
              </div>
              {selectedVariant && renderSpecs(selectedVariant)}
            </div>

            {/* FAQs */}
            {product.FAQs?.length > 0 && (
              <div className="mt-12 border-t border-slate-100 pt-12">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-8">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {product.FAQs.map((faq: StrapiFAQ) => (
                    <div key={faq.id} className="group">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2 group-hover:text-slate-900 transition-colors">Q: {faq.Ques}</h4>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed pl-4 border-l border-slate-200 group-hover:border-orange-600 transition-colors">{faq.Ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
