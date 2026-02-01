"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 1. Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1, // Standard speed
    });

    // 3. Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Define the RAF function separately so we can remove it later
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    // 5. Add listener
    gsap.ticker.add(update);

    // 6. Disable lag smoothing for instant response
    gsap.ticker.lagSmoothing(0);

    // 7. Clean up on unmount
    return () => {
      gsap.ticker.remove(update); // Properly remove the specific function
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}