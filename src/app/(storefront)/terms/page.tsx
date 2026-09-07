"use client";

import React, { useRef } from "react";
import LinkNext from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ScrollText, Quote } from "lucide-react";

export default function TermsAndConditionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Background elements fade in
    tl.fromTo(".ambient-glow", 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 2 }
    );

    // Header reveal
    tl.fromTo(".anim-header",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
      "-=1.5"
    );

    // Document Card slide up
    tl.fromTo(".anim-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      "-=0.8"
    );

    // Paragraphs cascade in
    tl.fromTo(".anim-text",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen bg-zinc-50 overflow-hidden selection:bg-orange-100 selection:text-orange-900 pb-32">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
      <div className="ambient-glow absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-200/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="ambient-glow absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-100/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-32 lg:pt-40">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          <LinkNext 
            href="/" 
            className="anim-header group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-orange-600 transition-colors mb-10"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </LinkNext>

          <div className="anim-header flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white shadow-sm border border-zinc-100 text-orange-600">
              <ScrollText size={24} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
              Official Document
            </span>
          </div>
          
          <h1 className="anim-header text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-tight">
            Terms & <span className="text-zinc-400">Conditions</span>
          </h1>
        </div>

        {/* --- THE LETTER CARD --- */}
        <div className="anim-card relative bg-white rounded-4xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-zinc-100">
          
          {/* Decorative Gradient Top Border */}
          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-orange-400 via-amber-500 to-orange-600 rounded-t-4xl md:rounded-t-[3rem]"></div>
          
          {/* Decorative Quote Icon */}
          <div className="absolute top-10 right-10 md:top-16 md:right-16 text-zinc-100 opacity-50">
            <Quote size={64} className="rotate-180" />
          </div>

          <div className="relative z-10 space-y-8 text-base md:text-lg text-zinc-600 font-medium leading-relaxed">
            
            <p className="anim-text font-bold text-xl md:text-2xl text-zinc-900 mb-10">
              Dear Esteemed Guests,
            </p>

            <p className="anim-text">
              It is my pleasure to welcome you to this platform, which reflects our company’s vision and continuous efforts since its establishment in <span className="text-orange-600 font-bold">2026</span>.
            </p>

            <p className="anim-text">
              Grain Grid Company began as an ambitious idea aiming to provide exceptional services in the trade of food products and essential goods. Today, thanks to the wise vision of our leadership and the support of our partners and clients, the company has become a model of innovation and quality in this vital sector.
            </p>

            <div className="anim-text relative pl-6 py-2 my-10">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-400 to-amber-600 rounded-full"></div>
              <p className="text-xl md:text-2xl text-zinc-900 font-serif italic leading-snug">
                "As emphasized by Mr. Mohammad Abdullah, Chairman of the Board, commitment to quality and sustainability has been the foundation upon which the company was built since its inception."
              </p>
            </div>

            <p className="anim-text">
              These values are not merely slogans but are translated into action in every step we take. From the beginning, we have focused on building strong strategic partnerships and attending to every detail to ensure the provision of products that meet the needs of both local and global markets.
            </p>

            <p className="anim-text">
              Our vision for the future is centered on strengthening our position as a trusted partner in supplying essential food products, while continuing to implement the highest standards of quality and sustainable practices. We firmly believe that innovation is the key to growth, and we consistently strive to enhance our methods and operations to adapt to market changes and our clients' evolving needs.
            </p>

            <p className="anim-text">
              In conclusion, I would like to express our deep gratitude to our clients and partners who have always been an integral part of our success. We look forward to achieving more shared milestones, maintaining our commitment to the community and environment, and developing our business on the principles of collaboration and transparency.
            </p>

            {/* Signature Block */}
            <div className="anim-text pt-12 mt-12 border-t border-zinc-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  With sincere regards,
                </p>
                <p className="font-serif italic text-3xl text-zinc-900">
                  Leadership Team
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-orange-600 mt-2">
                  GrainGrid Company
                </p>
              </div>
              
              {/* Optional Stamp/Seal Graphic */}
              <div className="h-16 w-16 rounded-full border border-dashed border-orange-200 bg-orange-50 flex items-center justify-center shrink-0">
                 <span className="text-orange-400 font-bold text-[10px] tracking-widest uppercase">Seal</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}