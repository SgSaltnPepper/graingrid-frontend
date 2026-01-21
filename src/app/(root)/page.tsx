import React from "react";
import Card from "../components/ui/Card";
import RecentProduct from "../components/layout/RecentProduct";
import Hero from "../components/layout/Hero";
export const dynamic = 'force-static';

const Home = async () => {

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Hero/>
      <RecentProduct />
    </main>
  );
};

export default Home;
