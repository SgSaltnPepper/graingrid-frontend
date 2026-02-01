"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Quote, Wheat, Wind, Anchor } from "lucide-react";

export default function ChairmansMessage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Text Entry Animation (Staggered)
    tl.fromTo(".anim-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.2 }
    );

    // 2. Quote Line Animation
    tl.fromTo(".quote-border", 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 1, ease: "expo.out" }, 
        "-=0.5"
    );

    // 3. Floating Icons Animation (Continuous)
    gsap.to(".float-icon", {
      y: -20,
      rotation: 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative pt-32 pb-24 px-6 lg:px-12 bg-white min-h-screen overflow-hidden">
      
      {/* --- DECORATIVE FLOATING BACKGROUNDS --- */}
      <div className="absolute top-20 right-[-10%] md:right-[-5%] text-orange-50 opacity-60 float-icon pointer-events-none select-none">
        <Wheat size={400} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-40 left-[-10%] md:left-[-5%] text-zinc-50 opacity-80 float-icon pointer-events-none select-none">
        <Wind size={300} strokeWidth={0.5} />
      </div>
      <div className="absolute top-1/2 right-[10%] text-zinc-50 opacity-50 float-icon pointer-events-none select-none blur-sm">
        <Anchor size={150} strokeWidth={0.5} />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="anim-text mb-12">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6">
              Leadership
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.9]">
              Chairman&apos;s <br/><span className="text-zinc-300">Message</span>
            </h1>
        </div>

        {/* Body Text */}
        <div className="prose prose-lg prose-zinc text-zinc-500 md:text-xl leading-relaxed max-w-none">
            
            <h3 className="anim-text text-2xl md:text-3xl font-bold text-zinc-900 mb-8">
                Building the Future of Food Trade
            </h3>

            <p className="anim-text mb-6">
                At <span className="font-bold text-zinc-900">Grain Grid PVT LTD</span>, our foundation is built on a steadfast commitment to innovation and quality. Since our inception, we have strived to go beyond simple trade; we provide integrated solutions that secure the supply of essential commodities. Our goal is not just to meet client needs, but to exceed them, cementing our position as a trusted strategic partner in the global food supply chain.
            </p>

            <p className="anim-text mb-10">
                We believe that true success is never a matter of chance—it is the result of clear vision and relentless execution. This philosophy is best captured by our guiding principle:
            </p>

            {/* Featured Quote Section */}
            <div className="anim-text relative py-4 my-12">
                <div className="quote-border absolute left-0 top-0 bottom-0 w-1 bg-orange-500 origin-top" />
                <div className="pl-8 md:pl-12 relative">
                    <Quote className="absolute -top-6 left-6 text-orange-100 fill-orange-50 -z-10" size={80} />
                    <p className="text-3xl md:text-4xl font-black italic text-zinc-800 leading-tight">
                        &quot;The winds blow as our ship desires—we are the winds, the sea, and the ships.&quot;
                    </p>
                </div>
            </div>

            <p className="anim-text mb-6">
                With this spirit, we sail confidently. We do not just adapt to market changes; we drive them. Our commitment to sustainability and social responsibility ensures that as we grow, we nurture our community and protect our environment.
            </p>

            <p className="anim-text mb-16">
                To our clients, partners, and exceptional team: you are the cornerstone of our achievements. Thank you for your trust. Together, we look forward to a future defined by transparency, collaboration, and shared success.
            </p>

            {/* Signature Block */}
            <div className="anim-text pt-10 border-t border-zinc-100">
                <p className="text-lg font-medium text-zinc-400 mb-6">Best regards,</p>
                <div>
                    {/* You can replace this with an actual image signature if available */}
                    <div className="font-handwriting text-4xl text-zinc-900 mb-2 font-black italic">
                        The Chairman
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                        Grain Grid PVT LTD
                    </p>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}