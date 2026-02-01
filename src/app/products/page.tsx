import React from "react";
import Card from "@/app/components/ui/Card";
import Filter from "@/app/components/ui/Filter";
import { getAllProducts, getStrapiMedia, type StrapiProduct } from "@/lib/strapi";

// 1. Force dynamic rendering so filtering works instantly on every request
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AllProductsPage({ searchParams }: ProductsPageProps) {
  // Await the search params (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const categoryFilter = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;

  // 2. Fetch products filtered by the category in the URL
  // We pass 'categoryFilter' to our API function
  const products = await getAllProducts(100, categoryFilter);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 max-w-2xl">
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

        <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Sidebar / Filter Section */}
            <aside className="lg:w-1/4 lg:sticky lg:top-32 h-fit z-30">
                <Filter />
            </aside>

            {/* Product Grid Section */}
            <div className="lg:w-3/4">
                {products && products.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p: StrapiProduct) => {
                    // Extract Category
                    const categoryName = p.categories && p.categories.length > 0 
                        ? (p.categories[0].Name || "Exclusive")
                        : "Exclusive";

                    // Get Main Image
                    const mainImageUrl = getStrapiMedia(p.Image);

                    // Parse Description
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
                <div className="py-32 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-zinc-300">
                        <span className="text-2xl">🌾</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">No products found</p>
                    <p className="text-zinc-400 text-sm">Try selecting a different category.</p>
                </div>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}
