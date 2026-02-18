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