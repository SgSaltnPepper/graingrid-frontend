import React from "react";
import Card from "@/app/components/ui/Card";
import Filter from "@/app/components/ui/Filter";
import { getAllProducts, getStrapiMedia, type StrapiProduct } from "@/lib/strapi";

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AllProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  
  const categoryFilter = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  // FIX: Properly extract the "search" parameter to pass to the backend
  const searchFilter = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;

  // Passing BOTH category and search to the backend
  const products = await getAllProducts(100, categoryFilter, searchFilter);

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      {/* Container widened to max-w-[100rem] to accommodate the new horizontal layout */}
      <div className="w-full max-w-400 mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
           <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4 bg-orange-50 px-4 py-2 rounded-full">
              {categoryFilter ? categoryFilter : "Full Catalogue"}
           </span>
           <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950">
             The <span className="text-zinc-300">Collection</span>
           </h1>
        </div>

        {/* Horizontal Filter Bar */}
        <Filter />

        {/* Product Grid Section (Now uses full width layout) */}
        <div className="w-full">
            {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8">
                {products.map((p: StrapiProduct) => {
                const primaryCategory = p.categories && p.categories.length > 0 ? p.categories[0].Name : "Exclusive";
                const mainImageUrl = getStrapiMedia(p.Image);

                let descText = "";
                const rawDescription = p.Description;
                if (typeof rawDescription === 'string') {
                    descText = rawDescription;
                } else if (Array.isArray(rawDescription)) {
                    descText = rawDescription
                    .map((block: any) => block.children?.map((child: any) => child.text).join(""))
                    .filter(Boolean)
                    .join(" ");
                }
                const shortDesc = descText.length > 60 ? descText.substring(0, 60) + "..." : descText;

                return (
                    <div key={p.documentId || p.id} className="group relative">
                    <Card
                        title={p.Name}
                        subtitle={primaryCategory} 
                        description={shortDesc}
                        imageSrc={mainImageUrl}
                        price={p.Price}
                        href={`/products/${p.documentId || p.id}`}
                        imageAlt={p.Name}
                        badges={p.badges} 
                        variants={p.variants} 
                        className="text-sm h-full"
                    />
                    </div>
                );
                })}
            </div>
            ) : (
            <div className="py-40 text-center border-2 border-dashed border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center bg-zinc-50/50">
                <div className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center mb-6 text-zinc-300">
                    <span className="text-4xl">🌾</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">No products found</p>
                <p className="text-zinc-500 text-base max-w-md">
                    {searchFilter 
                        ? `We couldn't find anything matching "${searchFilter}". Try a different keyword.`
                        : categoryFilter 
                            ? `We currently have no inventory for "${categoryFilter}".` 
                            : "Try selecting a different category."}
                </p>
            </div>
            )}
        </div>
      </div>
    </main>
  );
}