import React from "react";
import Card from "@/app/components/ui/Card";
import { getAllProducts, getStrapiMedia, type StrapiProduct } from "@/lib/strapi";

// 1. Force dynamic rendering so new products appear instantly
export const dynamic = 'force-dynamic';

export default async function AllProductsPage() {
  // 2. Fetch ALL products (limit set to 100 for now)
  const products = await getAllProducts(100);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-20 max-w-2xl">
           <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4 bg-orange-50 px-3 py-1 rounded-full">
              Full Catalogue
           </span>
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950 mb-6">
             The <span className="text-zinc-300">Collection</span>
           </h1>
           <p className="text-lg font-medium text-zinc-500 leading-relaxed">
             A complete archive of our premium agricultural exports. Meticulously processed and graded for the global market.
           </p>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p: StrapiProduct) => {
              // Extract Category
              const categoryName = p.categories && p.categories.length > 0 
                ? (p.categories[0].Name || "Exclusive")
                : "Exclusive";

              // Get Main Image
              const mainImageUrl = getStrapiMedia(p.Image);

              // Parse Description (Handle Strapi Blocks or String)
              let descText = "";
              const rawDescription = p.Description;
              if (typeof rawDescription === 'string') {
                descText = rawDescription;
              } else if (Array.isArray(rawDescription)) {
                descText = rawDescription
                  .map(block => block.children?.map((child: any) => child.text).join(""))
                  .filter(Boolean)
                  .join(" ");
              }
              const shortDesc = descText.length > 80 ? descText.substring(0, 80) + "..." : descText;

              return (
                <div key={p.documentId || p.id} className="group relative">
                  <Card
                    title={p.Name}
                    subtitle={categoryName} 
                    description={shortDesc}
                    imageSrc={mainImageUrl}
                    price={p.Price}
                    href={`/products/${p.documentId || p.id}`}
                    imageAlt={p.Name}
                    badges={p.badges} 
                    
                    // CRITICAL FIX: Pass ONLY the variants array. 
                    // This ensures only the 3 specific variants (Steam/Selha/Golden) 
                    // show up in the circles, effectively "removing" the main one.
                    variants={p.variants} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-zinc-100 rounded-[3rem]">
             <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No products found</p>
          </div>
        )}
      </div>
    </main>
  );
}
