import { getProductById, getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
// We'll use a Client Component for the interaction
import ProductActionArea from "@/app/components/ui/ProductActionArea";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex text-sm font-medium text-zinc-400">
        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-orange-600 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{product.Name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        
        {/* Left: High-Quality Product Showcase */}
        <div className="group relative aspect-4/5 overflow-hidden rounded-3xl bg-zinc-100 shadow-sm border border-zinc-200">
          <Image
            src={getStrapiMedia(product.Image?.[0]?.url)}
            alt={product.Image?.[0]?.alternativeText || product.Name}
            fill
            priority
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Right: Product Story & Contact */}
        <div className="flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl uppercase">
              {product.Name}
            </h1>
            {product.Price && (
              <p className="mt-4 text-2xl font-medium text-zinc-600">
                Price upon request — Starting from ${product.Price.toFixed(2)}
              </p>
            )}
          </header>

          <div className="space-y-6">
            <div className="prose prose-orange max-w-none text-lg leading-relaxed text-zinc-700">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                About this piece
              </h3>
              {product.Description?.map((block, index) => (
                <p key={index} className="mb-4">
                  {block.children?.map((child) => child.text).join("")}
                </p>
              ))}
            </div>

            {/* Features Bar */}
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-zinc-200">
              <div>
                <span className="block text-xs font-bold text-zinc-400 uppercase">Availability</span>
                <span className="text-zinc-900 font-medium italic">Premium Collection</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-zinc-400 uppercase">Sourcing</span>
                <span className="text-zinc-900 font-medium italic">Organic Certified</span>
              </div>
            </div>

            {/* INTERACTIVE AREA: Handled by Client Component */}
            <ProductActionArea productName={product.Name} />
          </div>
        </div>
      </div>
    </main>
  );
}