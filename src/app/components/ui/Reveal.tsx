"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { 
        y: 50, 
        opacity: 0,
        filter: "blur(10px)"
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%", 
          end: "bottom 20%", 
          // This ensures it fades out when scrolling up (reverse)
          toggleActions: "play none none reverse", 
        },
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={`reveal-item ${className}`}>
      {children}
    </div>
  );
}