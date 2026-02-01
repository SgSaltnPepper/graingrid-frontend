"use client";

import Link from "next/link";
import { 
  MoveUpRight, 
  ArrowUp, 
  Mail,
  ArrowRight
} from "lucide-react";
// Import Brand Icons from React Icons
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa6";

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

const SOCIAL_LINKS = [
  { icon: <FaInstagram size={18} />, href: "#", label: "Instagram" },
  { icon: <FaTwitter size={18} />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin size={18} />, href: "#", label: "LinkedIn" },
  { icon: <FaFacebook size={18} />, href: "#", label: "Facebook" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-zinc-950 pt-32 pb-12 overflow-hidden text-white">
      {/* Decorative Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[25vw] font-black uppercase leading-none -translate-y-1/2">
          GRAINGRID
        </h2>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        
        {/* TOP SECTION: BIG CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-32">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Let&apos;s build the <br /> 
              <span className="text-orange-600">Future</span> of Taste.
            </h2>
          </div>
          <button 
            onClick={scrollToTop}
            className="group relative flex h-24 w-24 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-orange-600 hover:bg-orange-600 active:scale-90"
          >
            <ArrowUp className="h-8 w-8 text-white transition-transform group-hover:-translate-y-2" />
            <span className="absolute -bottom-8 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Top</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12 pb-24">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center font-black italic text-xl">G</div>
              <span className="text-2xl font-black uppercase tracking-tighter">
                GrainGrid<span className="text-orange-600">.</span>
              </span>
            </div>
            <p className="max-w-sm text-zinc-400 text-lg leading-relaxed font-medium">
              Sourcing the finest organic harvests with a commitment to transparency and unmatched quality.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-600 hover:bg-orange-600 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">Shop</h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
                      <span className="text-lg font-bold uppercase tracking-tight">{link.label}</span>
                      <MoveUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">Company</h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
                      <span className="text-lg font-bold uppercase tracking-tight">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">Newsletter</h3>
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">Join for exclusive harvest updates.</p>
              <form className="relative group">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-white focus:ring-2 focus:ring-orange-600 transition-all outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center hover:bg-white hover:text-orange-600 transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              © {currentYear} GrainGrid International.
            </p>
            <div className="flex gap-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-600">
            <Mail size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">hello@graingrid.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}