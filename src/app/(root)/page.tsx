import React from "react";
import RecentProduct from "../components/layout/RecentProduct";
import Hero from "../components/layout/Hero";
import Portfolio from "../components/layout/Portfolio";
import TestimonialsSection from "../components/layout/TestimonialsSection";

// Force static generation for best performance on homepage
export const dynamic = 'force-static';

const Home = async () => {
  return (
    // UPDATED: Removed 'max-w-7xl mx-auto px-4' constraints.
    // Now using 'w-full' to allow Hero to go full width.
    <main className="w-full flex flex-col overflow-hidden">
      <Hero />
      <RecentProduct />
      <Portfolio />
      <TestimonialsSection />
    </main>
  );
};

export default Home;