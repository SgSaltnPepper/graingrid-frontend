"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { getStrapiMedia, getProductById, StrapiVariant, StrapiFAQ } from "@/lib/strapi";
import Link from "next/link";
import gsap from "gsap";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariant | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Helper to parse the Label/Value strings from your JSON into a table
  const renderSpecs = (variant: StrapiVariant) => {
    if (!variant.Label || !variant.Value) return null;
    const labels = variant.Label.split('\n');
    const values = variant.Value.split('\n');
    
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {labels.map((label, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                <td className="w-1/3 bg-slate-50/30 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-600">
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
              <Image 
                src={selectedVariant?.variantImage ? getStrapiMedia(selectedVariant.variantImage) : getStrapiMedia(product.Image)} 
                alt={product.Name} fill unoptimized className="object-cover" priority
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-none mb-6">
              {product.Name}
            </h1>

            {/* Variant Selector */}
            <div className="mb-10">
              <p className="mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Processing Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v: StrapiVariant) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-xl border-2 px-6 py-3 text-[10px] font-bold uppercase transition-all ${
                      selectedVariant?.id === v.id ? "border-orange-600 bg-white text-orange-600 shadow-md" : "border-slate-100 bg-slate-50 text-slate-400"
                    }`}
                  >
                    {v.Type}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Description & Specs */}
            <div className="mb-12">
              <p className="mb-3 text-[9px] font-black uppercase tracking-widest text-orange-600">Overview</p>
              <p className="text-base leading-relaxed text-slate-600 border-l-2 border-orange-100 pl-5">
                {selectedVariant?.Description || product.Description}
              </p>
              {selectedVariant && renderSpecs(selectedVariant)}
            </div>

            {/* Product FAQs Section */}
            {product.FAQs?.length > 0 && (
              <div className="mt-12 border-t border-slate-100 pt-12">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-8">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {product.FAQs.map((faq: StrapiFAQ) => (
                    <div key={faq.id} className="group">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2">Q: {faq.Ques}</h4>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed pl-4 border-l border-slate-200">{faq.Ans}</p>
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