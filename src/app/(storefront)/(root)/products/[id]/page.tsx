"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { getProductById } from "@/sanity/lib/queries";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingBag } from "lucide-react"; 

export interface SanityVariant {
  _key: string;
  Type: string;
  Label?: string;
  Value?: string;
  Description?: string;
  variantImage?: string; 
}

export interface SanityFAQ {
  _key: string;
  Ques: string;
  Ans: string;
}

export interface SanityProduct {
  _id: string;
  Name: string;
  Price: number;
  Image?: string;
  Description?: string | Record<string, unknown>[];
  categories?: { _id: string; Name: string }[];
  variants?: SanityVariant[];
  FAQs?: SanityFAQ[];
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<SanityProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<SanityVariant | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

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

  const handleVariantChange = (variant: SanityVariant) => {
    if (selectedVariant?._key !== variant._key) {
      setSelectedVariant(variant);
    }
  };

  const toggleFaq = (faqId: string) => {
    setOpenFaqId(prevId => (prevId === faqId ? null : faqId));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center uppercase text-xs font-black tracking-widest animate-pulse text-zinc-400">Loading Product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  const categoryName = product.categories && product.categories.length > 0 
    ? product.categories[0].Name 
    : "Premium Collection";

  // Descriptions
  const mainProductDescription = typeof product.Description === 'string'
    ? product.Description
    : Array.isArray(product.Description)
        ? product.Description.map((block) => {
            const children = block.children as { text?: string }[] | undefined;
            return children && Array.isArray(children) ? children.map(c => c.text || "").join("") : "";
          }).filter(Boolean).join(" ")
        : "Exquisitely crafted to meet the highest standards of quality and flavor.";

  const shortMainDescription = mainProductDescription.length > 180 
    ? mainProductDescription.substring(0, 180) + "..." 
    : mainProductDescription;

  const variantDescription = selectedVariant?.Description || "Explore this specific variation's unique characteristics and details.";

  // Spec Grid mapping
  const labels = selectedVariant?.Label ? selectedVariant.Label.split('\n') : [];
  const values = selectedVariant?.Value ? selectedVariant.Value.split('\n') : [];

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24 pt-24 lg:pt-32 overflow-hidden">
      <div className="w-full max-w-425 mx-auto px-6 lg:px-10 xl:px-12">
        
        {/* --- MAIN HERO SECTION (3/5/4 Split) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[75vh]">
          
          {/* LEFT COLUMN: Title, Main Desc & STATIC Main Price (Col-Span 3) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1 flex flex-col justify-center relative z-20"
          >
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              {categoryName}
            </span>
            
            <h1 className="text-5xl sm:text-6xl xl:text-[4vw] font-black uppercase tracking-tighter text-zinc-950 leading-[0.9] mb-6">
              {product.Name}
            </h1>
            
            <p className="text-zinc-500 leading-relaxed font-medium mb-8 text-sm xl:text-base pr-4">
              {shortMainDescription}
            </p>

            <div className="flex items-center gap-5 mb-10">
              <span className="w-10 h-0.5 bg-zinc-900" />
              {/* STATIC Main Product Price */}
              <span className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900">
                ₹{product.Price}
              </span>
            </div>

            <button className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-600/20 active:scale-95 w-max">
              <ShoppingBag size={18} />
              Order Now
            </button>
          </motion.div>

          {/* CENTER COLUMN: Contained Floating Image (Col-Span 5) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-4 xl:col-span-5 order-1 lg:order-2 relative h-[50vh] sm:h-[60vh] lg:h-[80vh] w-full flex items-center justify-center"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-orange-100),transparent_60%)] opacity-60 mix-blend-multiply" />
             
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
               className="relative w-full max-w-sm md:max-w-md lg:max-w-lg h-full max-h-175 z-10 drop-shadow-2xl flex items-center justify-center p-4 lg:p-8"
             >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVariant?._key || "default"}
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <Image 
                      src={selectedVariant?.variantImage || product.Image || "/placeholder-product.jpg"} 
                      alt={product.Name} 
                      fill 
                      unoptimized 
                      className="object-contain object-center p-2" 
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
             </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Variant Details, Variant Specs & Buttons (Col-Span 4) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-4 xl:col-span-4 order-3 flex flex-col justify-center relative z-20"
          >
             <h3 className="text-2xl font-serif italic text-zinc-900 mb-4">Variant Details</h3>
             
             {/* 1. Variant Description */}
             <div className="min-h-20">
               <AnimatePresence mode="wait">
                 <motion.p 
                   key={selectedVariant?._key || "desc"}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.3, ease: "easeOut" }}
                   className="text-zinc-500 text-sm xl:text-base leading-relaxed mb-6 pr-4"
                 >
                   {variantDescription}
                 </motion.p>
               </AnimatePresence>
             </div>

             {/* 2. Variant Specs (Moved perfectly into the viewport on the right!) */}
             <div className="min-h-17.5 mb-8">
               <AnimatePresence mode="wait">
                 {labels.length > 0 && (
                   <motion.div 
                     key={selectedVariant?._key || "specs"}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.3 }}
                     className="flex flex-wrap gap-x-8 gap-y-4 p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm"
                   >
                     {labels.map((label: string, idx: number) => (
                       <div key={idx} className="flex flex-col">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
                           {label}
                         </span>
                         <span className="text-lg font-black tracking-tight text-zinc-900">
                           {values[idx] || "N/A"}
                         </span>
                       </div>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             {/* 3. Variant Cards (Stripped of redundant prices) */}
             {product.variants && product.variants.length > 0 && (
               <div>
                 <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Variations</p>
                 <div className="flex flex-col gap-3">
                   {product.variants.map((v: SanityVariant) => {
                     const isSelected = selectedVariant?._key === v._key;
                     // Strips out prices like "- 70" or "- ₹90" if typed accidentally in the label
                     const cleanLabel = v.Label?.split('\n')[0]?.replace(/\s*-\s*₹?\d+$/, '') || '';

                     return (
                       <button 
                         key={v._key} 
                         onClick={() => handleVariantChange(v)}
                         className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                           isSelected 
                           ? "border-orange-200 bg-white shadow-lg scale-[1.02] z-10 ring-2 ring-orange-50" 
                           : "border-zinc-200/60 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 hover:shadow-md opacity-80 hover:opacity-100"
                         }`}
                       >
                         <div className="relative w-12 h-12 rounded-xl bg-white border border-zinc-100 overflow-hidden shrink-0 p-1">
                            <Image 
                              src={v.variantImage || product.Image || "/placeholder-product.jpg"}
                              alt={v.Type}
                              fill
                              className="object-contain"
                            />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isSelected ? 'text-orange-600' : 'text-zinc-900'}`}>
                             {v.Type}
                           </p>
                           <p className="text-xs font-semibold text-zinc-500 mt-1 truncate">
                             {cleanLabel}
                           </p>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               </div>
             )}
          </motion.div>

        </div>

        {/* --- FAQ SECTION --- */}
        {product.FAQs && product.FAQs.length > 0 && (
          <div className="mt-24 lg:mt-32 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-3">Support</span>
              <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-zinc-900">
                Frequently Asked Questions
              </h3>
            </div>
            
            <div className="space-y-4">
              {product.FAQs.map((faq: SanityFAQ) => (
                <div 
                  key={faq._key} 
                  className={`group rounded-3xl overflow-hidden transition-all duration-300 border ${
                    openFaqId === faq._key ? "border-orange-200 bg-orange-50/50 shadow-md" : "border-zinc-200 bg-white hover:border-orange-200"
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(faq._key)}
                    className="w-full flex items-center justify-between p-6 lg:p-8 text-left focus:outline-none"
                  >
                    <h4 className={`text-sm lg:text-base font-bold transition-colors pr-6 ${
                      openFaqId === faq._key ? "text-orange-600" : "text-zinc-900 group-hover:text-orange-600"
                    }`}>
                      {faq.Ques}
                    </h4>
                    
                    <div className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
                      openFaqId === faq._key ? "bg-orange-600 text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}>
                      <ChevronDown 
                        size={18} 
                        strokeWidth={2.5}
                        className={`transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                          openFaqId === faq._key ? "rotate-180" : ""
                        }`} 
                      />
                    </div>
                  </button>
                  
                  <div 
                    className={`transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] px-6 lg:px-8 overflow-hidden ${
                      openFaqId === faq._key ? "max-h-96 opacity-100 pb-8" : "max-h-0 opacity-0 pb-0"
                    }`}
                  >
                    <p className="text-sm lg:text-base text-zinc-500 leading-relaxed pt-4 border-t border-orange-200/50">
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
  );
}