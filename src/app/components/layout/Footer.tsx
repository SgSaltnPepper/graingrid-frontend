"use client";

import Link from "next/link";
import { MoveUpRight, ArrowUp } from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Featured Collection", href: "/products?category=Featured" },
    { label: "New Arrivals", href: "/products?category=New" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sustainability", href: "/about#eco" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-light-300 bg-white pt-24 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* TOP SECTION: BIG CTA */}
        <div className="mb-24 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-dark-900 sm:text-7xl">
              Elevate Your <span className="text-orange-600">Standard.</span>
            </h2>
            <p className="mt-6 text-lg font-medium text-dark-500">
              Experience the intersection of nature's purity and modern curation. 
              Join our community for a first look at limited harvests.
            </p>
          </div>
          <button 
            onClick={scrollToTop}
            className="group flex h-20 w-20 items-center justify-center rounded-full border border-dark-900 transition-all hover:bg-dark-900"
          >
            <ArrowUp className="h-6 w-6 text-dark-900 transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-6">
              <span className="text-3xl font-black uppercase tracking-tighter text-dark-900">
                Grain<span className="text-orange-600">Grid.</span>
              </span>
              <p className="max-w-xs text-sm font-medium leading-relaxed text-dark-500">
                Based in the heart of authentic sourcing, we deliver premium harvests
                worldwide. Quality isn't a goal; it's our baseline.
              </p>
              <div className="flex gap-6">
                {["Instagram", "LinkedIn", "Twitter"].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-400 hover:text-orange-600 transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark-900">Collection</h3>
              <ul className="mt-8 space-y-4">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group flex items-center gap-2 text-sm font-medium text-dark-500 transition-colors hover:text-dark-900">
                      {link.label}
                      <MoveUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark-900">Experience</h3>
              <ul className="mt-8 space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group flex items-center gap-2 text-sm font-medium text-dark-500 transition-colors hover:text-dark-900">
                      {link.label}
                      <MoveUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark-900">Newsletter</h3>
            <form className="mt-8">
              <div className="group relative">
                <input
                  type="email"
                  placeholder="JOIN THE ARCHIVE"
                  className="w-full border-b border-light-300 bg-transparent py-3 text-[11px] font-bold uppercase tracking-widest text-dark-900 focus:border-orange-600 focus:outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-3 text-[10px] font-black uppercase tracking-widest text-dark-900 hover:text-orange-600"
                >
                  Sub.
                </button>
              </div>
            </form>
            <p className="mt-4 text-[10px] font-medium leading-relaxed text-dark-400">
              *By subscribing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>

        {/* BACKGROUND DECORATIVE TEXT */}
        <div className="pointer-events-none absolute -bottom-10 left-0 w-full select-none opacity-[0.08]">
          <span className="whitespace-nowrap text-[15rem] font-black uppercase tracking-tighter text-dark-900">
            Harvest Grain
          </span>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-32 border-t border-light-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-400">
            © {currentYear} GrainGrid. Built for the modern palate.
          </p>
          <div className="flex gap-8">
            {FOOTER_LINKS.legal.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-400 hover:text-dark-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}