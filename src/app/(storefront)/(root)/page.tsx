import React from "react";
import RecentProducts from "@/app/components/layout/RecentProduct"; 
import Hero from "@/app/components/layout/Hero";
import Portfolio from "@/app/components/layout/Portfolio";
import TestimonialsSection from "@/app/components/layout/TestimonialsSection";
import FeaturesBar from "@/app/components/layout/FeaturesBar";
import Reveal from "@/app/components/ui/Reveal";
export const dynamic = 'force-static';

const Home = async () => {
  return (
    <main className="w-full flex flex-col overflow-hidden">
      <Hero />
      <Reveal>
        <FeaturesBar />
      </Reveal>

      <Reveal>
      <RecentProducts />
      </Reveal>

      <Reveal>
      <Portfolio />
      </Reveal>
      
      <Reveal>
      <TestimonialsSection />
      </Reveal>
    </main>
  );
};

export default Home;