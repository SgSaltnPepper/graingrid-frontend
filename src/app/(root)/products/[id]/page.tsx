"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { getStrapiMedia, getProductById, StrapiVariant, StrapiFAQ } from "@/lib/strapi";
import gsap from "gsap";
import { ChevronDown } from "lucide-react"; // Import for FAQ Arrow

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariant | null>(null);
  
  // State for tracking the currently open FAQ
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
    if (selectedVariant?.id === variant.id) return;

    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        opacity: 0,
        y: -10,
        filter: "blur(5px)",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedVariant(variant);
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

  const toggleFaq = (faqId: number) => {
    setOpenFaqId(prevId => (prevId === faqId ? null : faqId));
  };

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

  // Extract Category Name safely (e.g., Basmati Rice)
  const categoryName = product.categories && product.categories.length > 0 
    ? product.categories[0].Name 
    : "Premium Collection";

  return (
    <div className="min-h-screen bg-white pb-24 pt-28">
      <div className="container mx-auto max-w-6xl px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* --- IMAGE SECTION --- */}
          {/* Removed 'lg:sticky lg:top-32' to stop it from following the scroll */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-50 shadow-xl border border-slate-100">
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

          {/* --- CONTENT SECTION --- */}
          <div className="lg:col-span-7 flex flex-col">
            
            <span className="mb-2 inline-block text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              {categoryName}
            </span>

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
              <div className="relative min-h-20">
                 <p className="text-base leading-relaxed text-slate-600 border-l-2 border-orange-100 pl-5 transition-all duration-300">
                    {selectedVariant?.Description || product.Description}
                 </p>
              </div>
              {selectedVariant && renderSpecs(selectedVariant)}
            </div>

            {/* --- NEW INTERACTIVE FAQ ACCORDION --- */}
            {product.FAQs?.length > 0 && (
              <div className="mt-12 border-t border-slate-100 pt-12">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-8">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {product.FAQs.map((faq: StrapiFAQ) => (
                    <div 
                      key={faq.id} 
                      className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${
                        openFaqId === faq.id ? "border-orange-200 bg-orange-50/30" : "border-slate-200 bg-white hover:border-orange-200"
                      }`}
                    >
                      {/* Accordion Header / Button */}
                      <button 
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <h4 className={`text-xs font-black uppercase tracking-widest transition-colors pr-6 ${
                          openFaqId === faq.id ? "text-orange-600" : "text-slate-900 group-hover:text-orange-600"
                        }`}>
                          {faq.Ques}
                        </h4>
                        
                        {/* Animated Arrow Icon */}
                        <div className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                          openFaqId === faq.id ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600"
                        }`}>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-300 ease-in-out ${
                              openFaqId === faq.id ? "rotate-180" : ""
                            }`} 
                          />
                        </div>
                      </button>
                      
                      {/* Accordion Body (Animated Height & Opacity) */}
                      <div 
                        className={`transition-all duration-300 ease-in-out px-6 overflow-hidden ${
                          openFaqId === faq.id ? "max-h-125 opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
                        }`}
                      >
                        <p className="text-sm font-medium text-slate-500 leading-relaxed pl-4 border-l-2 border-orange-200 mt-2">
                          {faq.Ans}
                        </p>
                      </div>
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