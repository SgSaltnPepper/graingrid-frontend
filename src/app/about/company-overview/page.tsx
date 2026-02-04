import React from "react";
import { Globe, ShieldCheck, Zap, Truck } from "lucide-react";

export default function CompanyOverview() {
  return (
    <main className="relative pt-32 pb-24 px-6 lg:px-12 bg-white min-h-screen overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-150 h-150 bg-orange-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6">
            Our Identity
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.8] mb-8">
            Company <br />
            <span className="text-zinc-300">Overview</span>
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-900 font-light leading-tight tracking-tight">
            Headquartered in India, <span className="font-bold">Grain Grid</span> is a dynamic import-export and logistics powerhouse dedicated to bridging the gap between global markets and high-quality food sources.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-orange-200 transition-colors group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Global Sourcing</h3>
            <p className="text-zinc-600 leading-relaxed">
              We leverage deep-rooted connections across key food-producing nations, ensuring a seamless and diverse supply chain.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-orange-200 transition-colors group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Truck size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Integrated Logistics</h3>
            <p className="text-zinc-600 leading-relaxed">
              Our end-to-end solutions guarantee essential commodities reach the marketplace in optimal conditions and on schedule.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-orange-200 transition-colors group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Trusted Quality</h3>
            <p className="text-zinc-600 leading-relaxed">
              Driven by trust and performance, we have established a reputation for excellence in the complex international trade landscape.
            </p>
          </div>
        </div>

        {/* Bottom Narrative Section */}
        <div className="border-t border-zinc-100 pt-16 flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950 mb-6">
              Excellence in Motion
            </h2>
            <div className="prose prose-lg text-zinc-500">
              <p>
                At Grain Grid, we don't just move products; we cultivate partnerships. Our 
                specialization in premium agricultural products allows us to anticipate 
                market shifts and provide our clients with a competitive edge.
              </p>
              <p>
                By integrating sourcing and logistics, we minimize risk and maximize 
                efficiency, making us a vital link in the global food supply chain.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-orange-600 rounded-4xl p-10 text-white shadow-xl shadow-orange-200">
            <Zap className="mb-6 text-orange-200" size={40} fill="currentColor" />
            <div className="text-5xl font-black mb-2 italic">2026</div>
            <p className="text-orange-100 font-medium uppercase tracking-widest text-sm">
              Standardizing Excellence <br /> Since Inception
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}