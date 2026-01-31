"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    image: "/person 2.jpg", 
    title: "Best Basmati Rice Supplier!",
    text: "As a local business in India, GrainGrid has been our go-to supplier for Basmati Rice exports. Their dedication to supporting local farmers, promoting sustainable practices, and delivering premium rice has made them the best in the industry.",
    author: "Priya",
    location: "India",
    accent: "orange", 
  },
  {
    image: "/person 1.jpg",
    title: "Unparalleled Customer Service",
    text: "GrainGrid goes above and beyond to ensure customer satisfaction. Their team is responsive, knowledgeable, and always ready to assist. Their commitment to customer service sets them apart in the industry.",
    author: "Michael",
    location: "Glasgow, Scotland",
    accent: "green",
  },
  {
    image: "/person 3.jpg",
    title: "Reliable Partner for Rice Exports",
    text: "We have been partnering with GrainGrid for our Basmati Rice imports, and they have never failed to deliver. Their commitment to on-time shipments, competitive pricing, and excellent customer support make them a reliable partner.",
    author: "Sarah",
    location: "UAE",
    accent: "blue",
  },
];

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize with empty array to avoid null errors
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // 1. Header Animation
    gsap.fromTo(".section-header", 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Trigger slightly earlier for better visibility
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );

    // 2. Cards Stagger Entrance - Using fromTo ensures final state is 100% visible
    gsap.fromTo(cardsRef.current, 
      { y: 100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2, 
        ease: "elastic.out(1, 0.75)", 
      }
    );
  }, { scope: containerRef });

  // Hover Effect: Float Up
  const handleMouseEnter = (index: number) => {
    if(!cardsRef.current[index]) return;
    gsap.to(cardsRef.current[index], {
      y: -15, 
      scale: 1.02,
      boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // Hover Effect: Reset
  const handleMouseLeave = (index: number) => {
    if(!cardsRef.current[index]) return;
    gsap.to(cardsRef.current[index], {
      y: 0,
      scale: 1,
      boxShadow: "0px 10px 15px rgba(0,0,0,0.05)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    // FIXED: changed 'bg-linear-to-b' to standard 'bg-gradient-to-b'
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-zinc-50 to-orange-50/50 overflow-hidden min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Title */}
        <div className="section-header flex flex-col items-center mb-24 text-center opacity-0 translate-y-10">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
            {/* FIXED: changed 'bg-linear-to-r' to 'bg-gradient-to-r' */}
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Stories</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-500 max-w-2xl">
            Real experiences from partners across the globe who trust us with their agricultural needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-10 mt-12">
          {testimonials.map((testimonial, index) => {
            
            const borderColor = 
              testimonial.accent === "orange" ? "border-orange-200 hover:border-orange-500" :
              testimonial.accent === "green" ? "border-green-200 hover:border-green-500" :
              "border-blue-200 hover:border-blue-500";
            
            const circleColor = 
              testimonial.accent === "orange" ? "bg-orange-500" :
              testimonial.accent === "green" ? "bg-green-600" :
              "bg-blue-600";

            return (
              <div
                key={index}
                // Ensure array index exists before assigning
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                // Added 'opacity-0' initially to match GSAP start state to prevent flash
                className={`group relative bg-white rounded-[2.5rem] border-2 ${borderColor} p-8 pt-20 text-center shadow-lg transition-colors duration-300 opacity-0`}
              >
                {/* Floating Avatar Section */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`relative p-2 rounded-full bg-white shadow-xl`}>
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center ${circleColor} relative overflow-hidden`}>
                      
                      <Quote className="absolute top-4 left-4 text-white/20 w-6 h-6 rotate-180" />
                      <Quote className="absolute bottom-4 right-4 text-white/20 w-6 h-6" />
                      
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border-4 border-white/30 relative z-20">
                         {/* Enabled Image */}
                         <Image
                           src={testimonial.image}
                           alt={testimonial.author}
                           fill
                           className="object-cover"
                           // Added unoptimized to prevent Vercel optimization issues on external images
                           unoptimized 
                         />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                        <div className={`w-4 h-4 rounded-full ${circleColor} animate-pulse`}></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-0">
                  <Quote className="w-10 h-10 text-zinc-100 mx-auto mb-4" />
                  
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 mb-4 leading-tight">
                    {testimonial.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="w-full h-px bg-zinc-100 mb-6 group-hover:bg-zinc-200 transition-colors"></div>

                  <div className="flex flex-col items-center">
                    <p className="font-black uppercase tracking-widest text-xs text-zinc-900">
                      {testimonial.author}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${testimonial.accent === 'orange' ? 'text-orange-600' : testimonial.accent === 'green' ? 'text-green-600' : 'text-blue-600'}`}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;