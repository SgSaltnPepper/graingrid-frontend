"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Globe, TrendingUp, Sparkles, Handshake, ShieldCheck, Users, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OurStory() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(".story-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo(".story-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2 }, "-=0.6")
      .fromTo(".story-content", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1 }, "-=0.8");

    gsap.from(".impact-pillar", {
      scrollTrigger: {
        trigger: ".impact-pillar-grid",
        start: "top 85%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });

    gsap.from(".impact-box", {
      scrollTrigger: {
        trigger: ".impact-box",
        start: "top 85%",
      },
      scale: 0.95,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out"
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative pt-32 pb-24 px-6 lg:px-12 bg-white min-h-screen overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/4 -z-10" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* --- SECTION 1: THE MISSION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <div>
            <span className="story-badge inline-block text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-8">
              Our Story & Purpose
            </span>
            <h1 className="story-title text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85] mb-8">
              Trade With <br />
              <span className="text-orange-600 underline decoration-zinc-200 underline-offset-8">Purpose</span>
            </h1>
            <p className="story-title text-2xl font-bold text-zinc-900 italic mb-6">
              Assalamu Alaikum – Peace be upon you.
            </p>
          </div>

          <div className="story-content space-y-6 text-xl text-zinc-500 leading-relaxed border-l-2 border-zinc-100 pl-8">
            <p>
              Welcome to <span className="text-zinc-950 font-bold">Grain Grid</span>. While we are dedicated to excellence in global trade, delivering quality goods across borders, our foundation is built on a deeper purpose.
            </p>
            <p className="text-zinc-950 font-medium">
              Ours is a simple vision: to transform economic activity into community dignity. We believe that true empowerment doesn&apos;t come from charity, but from opportunity.
            </p>
          </div>
        </div>

        {/* --- SECTION 2: THE PHILOSOPHY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-40">
          <div className="lg:col-span-2 bg-zinc-950 p-12 md:p-20 rounded-[3rem] text-white relative overflow-hidden group">
            <TrendingUp className="absolute right-[-5%] bottom-[-5%] text-zinc-800 w-64 h-64 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            <h2 className="text-4xl font-black uppercase mb-8 relative z-10">The Philosophy of <br/>Economic Strength</h2>
            <div className="space-y-6 text-zinc-400 relative z-10 text-lg">
              <p>
                We believe that in the modern world, influence is defined by economic capability. For too long, voice without economic backing has gone unheard.
              </p>
              <p>
                We are prioritizing industry and trade to turn <span className="text-orange-400 font-bold italic">&quot;job seekers&quot;</span> into <span className="text-orange-400 font-bold italic">&quot;value creators.&quot;</span> Our goal is to ensure the youth are empowered to run their own brands and businesses.
              </p>
            </div>
          </div>

          <div className="impact-box bg-orange-600 p-12 rounded-[3rem] text-white flex flex-col justify-center">
            <Heart className="mb-6 animate-pulse" size={48} />
            <h3 className="text-2xl font-black uppercase mb-4">The Cycle of Empowerment</h3>
            <p className="text-orange-100 leading-relaxed">
              A significant portion of our profits is reinvested directly into establishing local startups and small businesses for those who struggle to find work.
            </p>
          </div>
        </div>

        {/* --- SECTION 3: IMPACT PILLARS (The New Static Section) --- */}
        <div className="mb-40">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 mb-6">
              Our Engine for <span className="text-orange-600">Independence</span>
            </h2>
            <p className="text-xl text-zinc-500">
              We established this export house to be more than just a supply chain; we are an engine for economic independence and community growth.
            </p>
          </div>

          <div className="impact-pillar-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="impact-pillar p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 group hover:bg-orange-600 transition-colors duration-500">
              <Users className="text-orange-600 mb-6 group-hover:text-white transition-colors" size={40} />
              <h4 className="text-xl font-black uppercase mb-4 group-hover:text-white transition-colors">Economic Agency</h4>
              <p className="text-zinc-500 group-hover:text-orange-100 transition-colors">
                We bridge the gap between global markets and local talent, creating a platform where our youth lead instead of follow.
              </p>
            </div>

            <div className="impact-pillar p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 group hover:bg-orange-600 transition-colors duration-500">
              <ShieldCheck className="text-orange-600 mb-6 group-hover:text-white transition-colors" size={40} />
              <h4 className="text-xl font-black uppercase mb-4 group-hover:text-white transition-colors">Dignified Labor</h4>
              <p className="text-zinc-500 group-hover:text-orange-100 transition-colors">
                True empowerment comes from meaningful work. We ensure every link in our chain upholds the dignity of the person behind it.
              </p>
            </div>

            <div className="impact-pillar p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 group hover:bg-orange-600 transition-colors duration-500">
              <Zap className="text-orange-600 mb-6 group-hover:text-white transition-colors" size={40} />
              <h4 className="text-xl font-black uppercase mb-4 group-hover:text-white transition-colors">Future Focused</h4>
              <p className="text-zinc-500 group-hover:text-orange-100 transition-colors">
                Our profits aren&apos;t just numbers; they are seeds for the next generation of factories and community-led startups.
              </p>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: CALL TO ACTION --- */}
        <div className="bg-zinc-50 rounded-[4rem] p-12 md:p-24 text-center border border-zinc-100 relative overflow-hidden">
          <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-200/30 w-150 h-150 -z-10" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 mb-8">
            Partner With Us
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-zinc-600 mb-12 leading-relaxed">
            By choosing Grain Grid, you are helping us prove that economic power creates a lasting impact. Together, let’s build a future that is self-sustaining, prosperous, and just.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-zinc-900 border border-zinc-100">
              <Sparkles size={16} className="text-orange-500" /> Quality Excellence
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-zinc-900 border border-zinc-100">
              <Handshake size={16} className="text-orange-500" /> Sustainable Impact
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}