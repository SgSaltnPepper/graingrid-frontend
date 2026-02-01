import React from "react";
import RecentProduct from "../components/layout/RecentProduct";
import Hero from "../components/layout/Hero";
import Portfolio from "../components/layout/Portfolio";
import TestimonialsSection from "../components/layout/TestimonialsSection";
import FeaturesBar from "../components/layout/FeaturesBar";

export const dynamic = 'force-static';

const Home = async () => {
  return (
    <main className="w-full flex flex-col overflow-hidden">
      <Hero />
      <FeaturesBar/>
      <RecentProduct />
      <Portfolio />
      <TestimonialsSection />
    </main>
  );
};

export default Home;