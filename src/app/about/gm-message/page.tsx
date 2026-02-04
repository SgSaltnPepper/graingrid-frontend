"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Handshake, Target, Star, Leaf } from "lucide-react";

export default function GeneralMessages() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Header and Badge entrance
    tl.fromTo(".anim-reveal", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 }
    );

    // Subtle fade for the side content
    tl.fromTo(".anim-fade", 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 1 }, 
      "-=0.8"
    );

    // Floating animation for conceptual icons
    gsap.to(".concept-icon", {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative pt-32 pb-24 px-6 lg:px-12 bg-zinc-50 min-h-screen overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-orange-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-zinc-200/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: Main Message */}
          <div className="lg:col-span-8">
            <div className="anim-reveal mb-8">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full mb-6">
                Executive Voice
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85] mb-12">
                GM&apos;s <br />
                <span className="text-orange-600">Perspective</span>
              </h1>
            </div>

            <div className="anim-reveal prose prose-xl prose-zinc max-w-none text-zinc-600 leading-relaxed">
              <p className="text-2xl font-medium text-zinc-900 leading-snug mb-8 border-l-4 border-orange-500 pl-6">
                Dear Esteemed Guests and Partners, it is my distinct privilege to welcome you to Grain Grid Company.
              </p>

              <p>
                Since our establishment in 2026, this platform has served as a testament to our unwavering vision: 
                to redefine the trade of essential food products through exceptional service and integrity.
              </p>

              <p>
                What began as a bold ambition has, under the strategic guidance of our leadership, evolved 
                into a benchmark for excellence in this vital sector. As our Chairman, 
                <span className="text-zinc-950 font-bold"> Mr. Mohammad Abdullah</span>, has emphasized, 
                our foundation rests on a steadfast commitment to quality and sustainability.
              </p>

              <p>
                For us, these are not merely ideals—they are the principles that govern every decision we make. 
                We translate these values into action by forging strong strategic partnerships and 
                meticulously attending to the details that matter.
              </p>

              <p>
                Looking ahead, our mission is clear: to solidify our position as your most trusted partner 
                in the supply chain. We believe that innovation is the engine of growth, and we remain 
                dedicated to refining our operations to anticipate market shifts and exceed client expectations.
              </p>

              <p className="mb-12">
                I extend my deepest gratitude to our clients and partners who are integral to our success. 
                We look forward to achieving new milestones together—grounded in transparency, collaboration, 
                and a shared vision for the future.
              </p>

              {/* Professional Sign-off */}
              <div className="mt-16 pt-10 border-t border-zinc-200 flex items-center gap-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  GM
                </div>
                <div>
                  <p className="text-zinc-900 font-black uppercase tracking-widest leading-none mb-1">
                    [Your Name]
                  </p>
                  <p className="text-sm text-zinc-500 uppercase tracking-tighter">
                    General Manager, Grain Grid Company
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Conceptual Visuals & Stats */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6 anim-fade">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 group hover:shadow-xl hover:shadow-orange-500/5 transition-all">
              <div className="concept-icon w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-2 italic">Unwavering Vision</h4>
              <p className="text-sm text-zinc-500">Redefining trade benchmarks through integrity and exceptional service standards.</p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-xl group hover:-translate-y-2 transition-transform">
              <div className="concept-icon w-12 h-12 bg-zinc-800 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                <Handshake size={24} />
              </div>
              <h4 className="text-lg font-bold mb-2 italic text-orange-400">Strategic Partnerships</h4>
              <p className="text-sm text-zinc-400">Forging global connections that ensure reliability in the essential food supply chain.</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 group hover:shadow-xl hover:shadow-orange-500/5 transition-all">
              <div className="concept-icon w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Leaf size={24} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-2 italic">Quality & Sustainability</h4>
              <p className="text-sm text-zinc-500">A steadfast commitment to delivering products that honor both the earth and the consumer.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}