import React from "react";
import Card from "@/app/components/ui/Card";
import Filter from "@/app/components/ui/Filter";
import Search from "@/app/components/ui/Search";
import { getProducts } from "@/sanity/lib/queries"; 

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type BadgeTone = "orange" | "green" | "red" | "blue" | "purple";

export interface SanityCategory {
  _id: string;
  Name: string;
}

export interface SanityBadge {
  _id: string;
  label: string;
  tone: BadgeTone; 
  isActive: boolean;
}

export interface SanityVariant {
  _key: string;
  Type: string;
  Label?: string;
  Value?: string;
  Description?: string;
}

export interface SanityProduct {
  _id: string;
  Name: string;
  Price: number;
  Image?: string; 
  Description?: string | Record<string, unknown>[]; 
  categories?: SanityCategory[];
  badges?: SanityBadge[];
  variants?: SanityVariant[];
}

export default async function AllProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  
  const categoryFilter = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const searchFilter = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;

  const products = await getProducts(100, categoryFilter, searchFilter);

  return (
    <main className="min-h-screen bg-white pt-24 pb-32">
      {/* Full Width Container */}
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header - Centered */}
        <div className="mb-12 text-center flex flex-col items-center">
           <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
              {categoryFilter ? categoryFilter : "Full Catalogue"}
           </span>
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950">
             The <span className="text-zinc-300">Collection</span>
           </h1>
        </div>

        {/* Layout Split: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          
          {/* Left Sidebar (Sticky Filter) */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <Filter />
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Centered, Elongated Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
               <Search />
            </div>

            {/* Product Grid Section */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                {products.map((p: SanityProduct) => {
                  const primaryCategory = p.categories && p.categories.length > 0 ? p.categories[0].Name : "Exclusive";
                  const mainImageUrl = p.Image || "/placeholder-product.jpg";

                  let descText = "";
                  const rawDescription = p.Description;
                  
                  if (typeof rawDescription === 'string') {
                      descText = rawDescription;
                  } else if (Array.isArray(rawDescription)) {
                      descText = rawDescription
                      .map((block) => {
                          const children = block.children as { text?: string }[] | undefined;
                          if (children && Array.isArray(children)) {
                              return children.map((child) => child.text || "").join("");
                          }
                          return "";
                      })
                      .filter(Boolean)
                      .join(" ");
                  }
                  const shortDesc = descText.length > 60 ? descText.substring(0, 60) + "..." : descText;

                  // Map Sanity's ID keys to the 'id' property the Card expects.
                  const mappedBadges = p.badges?.map(b => ({ ...b, id: b._id as unknown as number }));
                  const mappedVariants = p.variants?.map(v => ({ ...v, id: v._key as unknown as number }));

                  return (
                    <div key={p._id} className="group relative">
                      <Card
                          title={p.Name}
                          subtitle={primaryCategory} 
                          description={shortDesc}
                          imageSrc={mainImageUrl}
                          price={p.Price}
                          href={`/products/${p._id}`}
                          imageAlt={p.Name}
                          badges={mappedBadges} 
                          variants={mappedVariants} 
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
      </div>
    </main>
  );
}