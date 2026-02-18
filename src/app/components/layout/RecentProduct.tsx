import React from "react";
import Link from "next/link";
import { getRecentProducts } from "@/lib/strapi";
import { MoveRight, Sparkles } from "lucide-react";
import Reveal from "../ui/Reveal";
import RecentProductsGrid from "./RecentProductsGrid";

const RecentProducts = async () => {
  const products = await getRecentProducts(4); 

  return (
    <section className="relative bg-zinc-50 py-24 sm:py-32 overflow-hidden border-t border-zinc-200">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ✨ Updated max-w-[100rem] to max-w-400 */}
      <div className="relative mx-auto max-w-400 px-6 lg:px-12">
        
        <Reveal>
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Sparkles size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Fresh Arrivals
                </span>
              </div>
              {/* ✨ Updated bg-gradient-to-r to bg-linear-to-r */}
              <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">
                Latest <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">Harvests</span>
              </h3>
            </div>

            <Link 
              href="/products" 
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-xl hover:-translate-y-1"
            >
              View Full Catalogue
              <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {products && products.length > 0 ? (
            <RecentProductsGrid products={products} />
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white py-32 text-center border border-zinc-200 shadow-sm">
              <div className="mb-6 h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center text-3xl shadow-inner">
                🌾
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                Inventory Update
              </p>
              <p className="text-zinc-500 text-sm">New harvests are currently being cataloged.</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default RecentProducts;


// import React from "react";
// import Card from "@/app/components/ui/Card";
// import Link from "next/link";
// import { getRecentProducts, getStrapiMedia, type StrapiProduct } from "@/lib/strapi";
// import { MoveRight, Sparkles } from "lucide-react";
// import Reveal from "../ui/Reveal";// Import the Reveal component for animation

// const RecentProducts = async () => {
//   // 1. Fetch exactly 4 products for a single row on desktop
//   const products = await getRecentProducts(4); 

//   return (
//     <section className="relative bg-zinc-50 py-24 sm:py-32 overflow-hidden border-t border-zinc-200">
//       {/* Decorative Background Noise for Texture */}
//       <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

//       <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        
//         {/* Header Section with Reveal Animation */}
//         <Reveal>
//           <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
//             <div className="max-w-2xl">
//               <div className="inline-flex items-center gap-2 mb-4">
//                 <span className="h-px w-8 bg-orange-600"></span>
//                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 flex items-center gap-2">
//                   <Sparkles size={12} /> Fresh Arrivals
//                 </span>
//               </div>
//               <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.9]">
//                 Latest <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600">Harvests</span>
//               </h3>
//               <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-500 max-w-lg">
//                 Hand-picked selections straight from the origin. Experience the pinnacle of quality with our newest agricultural additions.
//               </p>
//             </div>

//             <Link 
//               href="/products" 
//               className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-950 hover:border-orange-600 hover:text-orange-600 transition-all shadow-sm hover:shadow-md"
//             >
//               View Full Catalogue
//               <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>
//         </Reveal>

//         {/* Product Grid with Staggered Animation */}
//         {products && products.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//             {products.map((p: StrapiProduct, index: number) => {
//               // Extract Category
//               const categoryName = p.categories && p.categories.length > 0 
//                 ? (p.categories[0].Name || "Premium")
//                 : "Premium";

//               // Extract Image
//               const mainImageUrl = getStrapiMedia(p.Image);

//               // Extract & Truncate Description
//               let descText = "";
//               const rawDescription = p.Description;
//               if (typeof rawDescription === 'string') {
//                 descText = rawDescription;
//               } else if (Array.isArray(rawDescription)) {
//                 descText = rawDescription
//                   .map((block: any) => block.children?.map((child: any) => child.text).join(""))
//                   .filter(Boolean)
//                   .join(" ");
//               }
//               const shortDesc = descText.length > 70 ? descText.substring(0, 70) + "..." : descText;

//               return (
//                 // Use the index to create a delay (0s, 0.1s, 0.2s, 0.3s)
//                 <Reveal key={p.documentId || p.id} delay={index * 0.1} className="h-full">
//                   <div className="h-full">
//                     <Card
//                       title={p.Name}
//                       subtitle={categoryName} 
//                       description={shortDesc}
//                       imageSrc={mainImageUrl}
//                       price={p.Price}
//                       href={`/products/${p.documentId || p.id}`}
//                       imageAlt={p.Name}
//                       badges={p.badges} 
//                       variants={p.variants} 
//                       className="h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
//                     />
//                   </div>
//                 </Reveal>
//               );
//             })}
//           </div>
//         ) : (
//           /* Empty State */
//           <Reveal>
//             <div className="flex flex-col items-center justify-center rounded-4xl bg-white py-24 text-center border-2 border-dashed border-zinc-200">
//               <div className="mb-4 h-14 w-14 rounded-full bg-zinc-100 flex items-center justify-center animate-pulse text-2xl">
//                 🌾
//               </div>
//               <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
//                 Inventory Update
//               </p>
//               <p className="text-zinc-500 text-sm">New harvests are currently being cataloged.</p>
//             </div>
//           </Reveal>
//         )}
//       </div>
//     </section>
//   );
// };

// export default RecentProducts;