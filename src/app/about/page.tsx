import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* 1. Hero Section: The "Big Picture" */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Established 2024
            </span>
            <h1 className="mt-6 text-5xl font-black uppercase tracking-tighter text-dark-900 sm:text-7xl lg:text-8xl">
              Rooted in <br />
              <span className="text-light-400">Quality.</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-dark-600 lg:text-2xl">
              We started GrainGrid with a simple mission: to bridge the gap between 
              the earth’s finest harvests and your kitchen, focusing on the beauty of 
              raw, natural products.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Visual Split Section: Images speak louder than words */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
        <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-light-100">
          <Image
            src="/about-1.jpg" // Add your own image here
            alt="Our process"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-light-100">
          <Image
            src="/about-2.jpg" // Add your own image here
            alt="The harvest"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* 3. The Philosophy: 3-Column Values */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div>
              <span className="text-4xl font-black text-orange-600">01</span>
              <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-dark-900">
                Ethical Sourcing
              </h3>
              <p className="mt-4 text-dark-600 leading-relaxed">
                We work directly with local farmers to ensure every grain and pulse 
                is grown with respect for the land and the hands that harvest it.
              </p>
            </div>
            <div>
              <span className="text-4xl font-black text-orange-600">02</span>
              <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-dark-900">
                Uncompromising Quality
              </h3>
              <p className="mt-4 text-dark-600 leading-relaxed">
                Every product in our showcase is hand-selected. If it doesn't meet 
                our standard for color, texture, and taste, it doesn't make the grid.
              </p>
            </div>
            <div>
              <span className="text-4xl font-black text-orange-600">03</span>
              <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-dark-900">
                Direct Connection
              </h3>
              <p className="mt-4 text-dark-600 leading-relaxed">
                As a showcase-first platform, we value conversation over carts. 
                We are here to tell the story of the product before it reaches you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Quote / Founder Section */}
      <section className="bg-dark-900 py-24 text-white lg:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <blockquote className="max-w-4xl mx-auto">
            <p className="text-3xl font-medium italic leading-snug sm:text-5xl">
              "We believe the most beautiful things in the world aren't manufactured; 
              they are grown."
            </p>
            <footer className="mt-10">
              <span className="block text-lg font-bold uppercase tracking-widest text-orange-500">
                — The GrainGrid Team
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 5. Final CTA: Send them back to the products or contact */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-black uppercase text-dark-900">
          Ready to see the collection?
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/products"
            className="rounded-full bg-dark-900 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-orange-600"
          >
            Explore Gallery
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-dark-300 px-10 py-4 text-sm font-bold uppercase tracking-widest text-dark-900 transition-all hover:bg-light-100"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}