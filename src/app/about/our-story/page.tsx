"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight, Wheat, Sprout, Nut, Apple, Waves, Quote, Target, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.from(".about-hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });

      // Reveal animations for sections
      const sections = gsap.utils.toArray(".reveal-section");
      sections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Image Parallax
      gsap.to(".parallax-img", {
        scrollTrigger: {
          trigger: ".parallax-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        y: -100,
        ease: "none"
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const tradeItems = [
    { title: "Rice", desc: "Aromatic Basmati and premium long-grain varieties.", icon: <Wheat className="w-6 h-6" /> },
    { title: "Spices", desc: "Authentic whole and ground spices capturing heritage.", icon: <Waves className="w-6 h-6 rotate-90" /> },
    { title: "Pulses", desc: "High-protein staples essential for global security.", icon: <Sprout className="w-6 h-6" /> },
    { title: "Cereals", desc: "Wholesome grains processed to retain natural goodness.", icon: <Nut className="w-6 h-6" /> },
    { title: "Fruits", desc: "Farm-fresh seasonal fruits, handled with precision.", icon: <Apple className="w-6 h-6" /> },
  ];

  return (
    <main ref={mainRef} className="bg-white text-zinc-950 font-sans selection:bg-orange-600 selection:text-white">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-zinc-50">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl">
            <div className="about-hero-text inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-600/10 text-orange-700 text-[10px] font-black uppercase tracking-widest mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
              </span>
              Assalamu Alaikum – Peace be upon you
            </div>
            
            <h1 className="about-hero-text text-[12vw] lg:text-[10vw] font-black uppercase tracking-tighter leading-[0.8] mb-12">
              Trade with <br />
              <span className="text-orange-600 italic font-serif lowercase">Purpose.</span>
            </h1>

            <div className="about-hero-text grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <p className="text-xl lg:text-2xl text-zinc-600 leading-relaxed font-medium">
                Welcome to GrainGrid. While we are dedicated to excellence in global trade, 
                our foundation is built on a deeper purpose: transforming commerce into community dignity.
              </p>
              <div className="flex flex-col gap-4">
                <div className="h-px w-full bg-zinc-200" />
                <p className="text-sm uppercase tracking-[0.2em] font-black text-zinc-400">Founded on Integrity • 2026</p>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Branding Text */}
        <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none pointer-events-none">
          <span className="text-[30vw] font-black leading-none uppercase">STORY</span>
        </div>
      </section>

      {/* 2. THE MISSION: SPLIT REVEAL */}
      <section className="reveal-section py-32 lg:py-48 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 parallax-container relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-4xl shadow-2xl">
                <Image 
                  src="/mission-visual.jpg" 
                  alt="Impact" 
                  fill 
                  className="parallax-img object-cover scale-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-zinc-950 text-white p-10 rounded-3xl shadow-2xl">
                <Target className="text-orange-600 mb-4" size={40} />
                <p className="text-2xl font-black uppercase leading-tight tracking-tighter">100% Purpose <br />Driven Model.</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600">Our Core Mission</h2>
              <h3 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                Commerce as <br /><span className="text-zinc-400">a Catalyst</span>
              </h3>
              <div className="space-y-8 text-xl text-zinc-600 leading-relaxed max-w-2xl">
                <p>
                  Every business begins with a vision. Ours is simple: to transform economic activity into community dignity. 
                  We believe that true empowerment doesn&apos;t come from charity, but from <strong>opportunity.</strong>
                </p>
                <div className="bg-zinc-50 border-l-4 border-orange-600 p-8 rounded-r-2xl italic text-zinc-900 font-serif text-2xl">
                  &quot;We reinvest profits to establish factories for those who struggle to find work.&quot;
                </div>
                <p>
                  We established this export house to be an engine for economic independence. When you build a relationship with us, 
                  you are fueling a cycle of employment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PHILOSOPHY: DARK CONTRAST */}
      <section className="reveal-section bg-zinc-950 py-32 lg:py-56 text-white relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-20">
          <Image src="/farm.jpg" alt="Background" fill className="object-cover grayscale" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <Heart className="text-orange-600 mb-8 animate-pulse" size={48} />
            <h2 className="text-4xl lg:text-[5vw] font-black uppercase tracking-tighter leading-none mb-12">
              Voice without economic <br /> 
              <span className="text-orange-600">backing</span> is often unheard.
            </h2>
            <p className="text-xl lg:text-2xl text-zinc-400 leading-relaxed mb-16 max-w-2xl">
              By prioritizing industry and trade, we turn &quot;job seekers&quot; into &quot;value creators.&quot; 
              Our goal is to ensure our youth are empowered to run their own brands.
            </p>
            <Link href="/contact" className="group flex items-center gap-6 bg-white text-zinc-950 px-10 py-6 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-orange-600 hover:text-white">
              Partner with our vision <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO GRID: MODERN CARDS */}
      <section className="reveal-section py-32 lg:py-48 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600 mb-6">Our Portfolio</h2>
              <h3 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Quality That Empowers</h3>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-zinc-950 pb-2 transition-all hover:border-orange-600">
              View Full Collection <MoveRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tradeItems.map((item, index) => (
              <div key={index} className="group p-10 rounded-[2.5rem] bg-zinc-50 hover:bg-zinc-950 transition-all duration-500 border border-zinc-100 hover:border-zinc-950">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-orange-600 mb-10 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h4 className="text-3xl font-black uppercase mb-4 tracking-tighter group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-zinc-500 text-lg leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</p>
              </div>
            ))}
            
            {/* CTA CARD */}
            <div className="p-10 rounded-[2.5rem] bg-orange-600 text-white flex flex-col justify-between overflow-hidden relative">
              <Quote className="absolute -top-4 -right-4 opacity-20 rotate-12" size={120} />
              <div className="relative z-10">
                <h4 className="text-3xl font-black uppercase mb-4 tracking-tighter italic">And more...</h4>
                <p className="text-orange-100 text-lg leading-relaxed mb-8">
                  We are constantly expanding our reach to include the best of nature&apos;s harvest.
                </p>
              </div>
              <Link href="/contact" className="relative z-10 w-full py-4 bg-white text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all hover:bg-zinc-950 hover:text-white">
                Request Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IMPACT BANNER */}
      <section className="reveal-section py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-zinc-950 p-12 lg:p-32 text-center text-white relative overflow-hidden">
          {/* Animated Background Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/20 blur-[120px] rounded-full" />
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              Every Order <br /> <span className="text-orange-600 italic">Creates Impact</span>
            </h2>
            <p className="text-xl lg:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              When you source from us, you aren&apos;t just filling a container; you are fueling a 
              supply chain that provides dignity, work, and a future.
            </p>
            <div className="pt-8">
              <Link href="/contact" className="inline-block px-12 py-6 bg-orange-600 text-white rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-600/30">
                Let&apos;s build a future together
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}