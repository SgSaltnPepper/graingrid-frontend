import React from "react";
import Card from "@/app/components/ui/Card";
import Link from "next/link";
import { getRecentProducts, getStrapiMedia, type StrapiProduct } from "@/lib/strapi";
import { MoveRight } from "lucide-react";

const RecentProducts = async () => {
  // 1. Fetch products from Strapi (Fetching 8 items for a full grid)
  const products = await getRecentProducts(8); 

  // DEBUG LOG - Helpful for Vercel logs
  console.log(`[RecentProducts] Fetched ${products?.length || 0} items`);

  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-orange-600"></span>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">
                Fresh from the Studio
              </h2>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-zinc-950 sm:text-6xl italic leading-[0.9]">
              Latest <span className="text-orange-600 not-italic">Creations</span>
            </h3>
            <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-500 max-w-xl">
              The newest additions to our collection, featuring experimental designs and heritage craftsmanship sourced directly from the origin.
            </p>
          </div>

          <Link 
            href="/products" 
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-950 pb-2 border-b-2 border-zinc-950/10 hover:border-orange-600 transition-all"
          >
            Explore All Pieces
            <MoveRight size={16} className="group-hover:translate-x-2 transition-transform text-orange-600" />
          </Link>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p: StrapiProduct) => {
              // 1. Extract Category Name safely
              const categoryName = p.categories && p.categories.length > 0 
                ? (p.categories[0].Name || "Exclusive")
                : "Exclusive";

              // 2. Main Image - Uses our Cloudinary-safe helper
              const mainImageUrl = getStrapiMedia(p.Image);

              // 3. Description logic for Strapi 5 Blocks format
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
                    variants={p.variants} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State - Styled to look intentional */
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-zinc-50 py-32 text-center border-2 border-dashed border-zinc-200">
            <div className="mb-4 h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center animate-pulse">
                <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
              The Collection is Updating
            </p>
            <p className="text-zinc-500 text-sm">New harvests are being cataloged. Check back shortly.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentProducts;