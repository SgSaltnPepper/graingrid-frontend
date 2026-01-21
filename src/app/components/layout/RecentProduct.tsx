import React from "react";
import Card from "@/app/components/ui/Card"; 
import Link from "next/link";
import { getRecentProducts, getStrapiMedia, StrapiProduct } from "@/lib/strapi";

const RecentProducts = async () => {
  // 1. Fetch data on the server
  const products: StrapiProduct[] = await getRecentProducts(8); 

  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4">
              Fresh from the Studio
            </h2>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 sm:text-6xl italic">
              Latest <span className="text-orange-600 not-italic">Creations</span>
            </h3>
            <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-500">
              The newest additions to our collection, featuring experimental designs and heritage craftsmanship.
            </p>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900/10 pb-1 hover:border-orange-600 transition-all"
          >
            Explore All Pieces
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p: StrapiProduct) => {
              // Extract Category
              const categoryName = p.categories && p.categories.length > 0 
                ? p.categories[0].Name 
                : "Collection";

              // Extract Image
              const mainImageUrl = getStrapiMedia(p.Image?.[0]?.url) || "/placeholder-product.jpg";

              return (
                <div key={p.documentId} className="group relative">
                  <Card
                    title={p.Name}
                    subtitle={categoryName} 
                    description={p.Description?.[0]?.children?.[0]?.text || ""}
                    imageSrc={mainImageUrl}
                    price={p.Price}
                    href={`/products/${p.documentId}`}
                    imageAlt={p.Image?.[0]?.alternativeText || p.Name}
                    // Passing the full badges array (Premium/Featured) to the UI Card
                    badges={p.badges} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-50 py-32 text-center border-2 border-dashed border-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              The workshop is currently quiet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentProducts;