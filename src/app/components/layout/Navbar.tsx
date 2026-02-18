"use client";

import LinkNext from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCategories, type StrapiCategory } from "@/lib/strapi";
import { Menu, X, ChevronRight, ArrowRight } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa6";
import gsap from "gsap";

const ABOUT_DROPDOWN = [
  { label: "Company Overview", href: "/about/company-overview" },
  { label: "Our Story", href: "/about/our-story" },
  { label: "Chairman's Message", href: "/about/chairmans-message" },
  { label: "General Manager's Message", href: "/about/gm-message" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Dropdown states
  const [productsHover, setProductsHover] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  
  // Mobile accordion states
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const pathname = usePathname();
  const mobileOverlayRef = useRef<HTMLDivElement>(null);

  // Fetch only top-level categories
  useEffect(() => {
    async function loadData() {
      try {
        const catData = await getCategories();
        // Since getCategories already filters by parent=null, these are the main ones
        setCategories(catData || []);
      } catch (error) {
        console.error("Navbar data fetch failed:", error);
      }
    }
    loadData();
  }, []);

  // Handle Scroll state for glassy pill effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile Menu GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        gsap.to(mobileOverlayRef.current, { clipPath: "circle(150% at 100% 0%)", duration: 1, ease: "power4.inOut", pointerEvents: "auto" });
        gsap.fromTo(".mobile-li", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.4 });
      } else {
        document.body.style.overflow = "";
        gsap.to(mobileOverlayRef.current, { clipPath: "circle(0% at 92% 5%)", duration: 0.8, ease: "power4.inOut", pointerEvents: "none" });
      }
    });
    return () => ctx.revert();
  }, [open]);

  // Close menus on route change
  useEffect(() => { 
    setOpen(false); 
    setProductsHover(false);
    setAboutHover(false);
    setMobileProductsOpen(false);
    setMobileAboutOpen(false);
  }, [pathname]);

  return (
    <>
      {/* --- DESKTOP FLOATING NAVBAR --- */}
      <div className="fixed top-0 inset-x-0 z-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pointer-events-none">
        <header 
          className={`mx-auto max-w-360 pointer-events-auto transition-all duration-500 rounded-4xl lg:rounded-full backdrop-blur-2xl border ${
            scrolled 
              ? "bg-white/80 border-white/50 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] py-3" 
              : "bg-white/50 border-white/20 shadow-sm py-4 lg:py-5"
          }`}
        >
          <nav className="flex w-full items-center justify-between px-6 lg:px-8 relative">
            
            {/* Logo */}
            <LinkNext href="/" className="group flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-950 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-md">
                <span className="text-white font-black text-xl italic tracking-tighter">G</span>
              </div>
              <span className="text-xl font-black uppercase tracking-tighter transition-colors duration-500 text-zinc-950">
                raingrid
              </span>
            </LinkNext>

            {/* Main Links */}
            <div className="hidden lg:flex items-center gap-10">
               <ul className="flex items-center gap-10">
                  
                  {/* Home */}
                  <li className="relative py-2">
                      <LinkNext href="/" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname === '/' ? "text-orange-600" : "text-zinc-600"}`}>
                        Home
                      </LinkNext>
                  </li>

                  {/* Products (Hover Trigger) */}
                  <li 
                    className="relative py-2 group"
                    onMouseEnter={() => setProductsHover(true)}
                    onMouseLeave={() => setProductsHover(false)}
                  >
                      <LinkNext 
                          href="/products" 
                          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname.startsWith('/products') ? "text-orange-600" : "text-zinc-600"}`}
                      >
                        Products
                      </LinkNext>

                      {/* Dropdown Card */}
                      <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          productsHover ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-4 scale-95"
                        }`}
                      >
                        <div className="w-125 bg-white border border-zinc-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-3xl p-8 overflow-hidden relative">
                          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-orange-400 to-amber-500"></div>
                          
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 border-b border-zinc-100 pb-3">Main Categories</h3>
                          
                          {/* Only Main Categories */}
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {categories.map((cat) => (
                                  <LinkNext 
                                      key={cat.id}
                                      href={`/products?category=${cat.Name}`}
                                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-colors"
                                  >
                                      <span className="text-sm font-bold tracking-wide text-zinc-800 group-hover:text-orange-600 transition-colors">
                                        {cat.Name}
                                      </span>
                                      <ArrowRight size={14} className="opacity-0 -translate-x-2 text-orange-600 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                  </LinkNext>
                              ))}
                          </div>
                        </div>
                      </div>
                  </li>

                  {/* About Us (Hover Trigger) */}
                  <li 
                    className="relative py-2 group"
                    onMouseEnter={() => setAboutHover(true)}
                    onMouseLeave={() => setAboutHover(false)}
                  >
                      <button className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname.startsWith('/about') ? "text-orange-600" : "text-zinc-600"}`}>
                        About Us
                      </button>

                      {/* Dropdown Card */}
                      <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          aboutHover ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-4 scale-95"
                        }`}
                      >
                        <div className="w-64 bg-white border border-zinc-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-3xl p-3 overflow-hidden relative">
                          <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900"></div>
                          {ABOUT_DROPDOWN.map((item) => (
                            <LinkNext 
                              key={item.href}
                              href={item.href}
                              className="block px-5 py-4 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-2xl transition-colors"
                            >
                              {item.label}
                            </LinkNext>
                          ))}
                        </div>
                      </div>
                  </li>

                  {/* Contact */}
                  <li className="relative py-2">
                      <LinkNext href="/contact" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname === '/contact' ? "text-orange-600" : "text-zinc-600"}`}>
                        Contact
                      </LinkNext>
                  </li>
               </ul>
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <LinkNext href="/contact" className="hidden lg:block rounded-full bg-zinc-950 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-orange-500/30">
                Get Quote
              </LinkNext>
              
              <button 
                type="button" 
                className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 lg:hidden shadow-sm ${open ? "bg-zinc-100 text-zinc-950 rotate-90" : "bg-white text-zinc-950 border border-zinc-200"}`} 
                onClick={() => setOpen(!open)}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </nav>
        </header>
      </div>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      <div ref={mobileOverlayRef} className="fixed inset-0 z-90 flex flex-col bg-zinc-950 px-8 pt-40 pb-12 overflow-y-auto" style={{ clipPath: "circle(0% at 92% 5%)", pointerEvents: "none" }}>
        <div className="flex flex-col h-full justify-between max-w-lg mx-auto w-full">
          <div className="space-y-12">
            <div className="mobile-li">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-8 border-b border-zinc-800 pb-4">Menu</p>
              <div className="flex flex-col gap-8">
                
                <LinkNext href="/" className="text-4xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors">
                  Home
                </LinkNext>

                {/* Mobile Products Accordion */}
                <div>
                  <button 
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="flex items-center justify-between w-full text-4xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors"
                  >
                    Products
                    <ChevronRight size={28} className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-90 text-orange-500" : ""}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mobileProductsOpen ? "max-h-200 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-6 pl-4 border-l-2 border-zinc-800 py-2">
                        {categories.map((cat) => (
                            <LinkNext 
                                key={cat.id}
                                href={`/products?category=${cat.Name}`}
                                className="text-xl font-bold uppercase tracking-tight text-zinc-400 hover:text-white transition-colors"
                            >
                                {cat.Name}
                            </LinkNext>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Mobile About Accordion */}
                <div>
                  <button 
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="flex items-center justify-between w-full text-4xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors"
                  >
                    About Us
                    <ChevronRight size={28} className={`transition-transform duration-300 ${mobileAboutOpen ? "rotate-90 text-orange-500" : ""}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mobileAboutOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-5 pl-4 border-l-2 border-zinc-800 py-2">
                      {ABOUT_DROPDOWN.map((item) => (
                        <LinkNext 
                          key={item.href} 
                          href={item.href}
                          className="text-xl font-bold text-zinc-400 hover:text-white transition-colors"
                        >
                          {item.label}
                        </LinkNext>
                      ))}
                    </div>
                  </div>
                </div>

                <LinkNext href="/contact" className="text-4xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors">
                  Contact
                </LinkNext>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mobile-li flex flex-col gap-8 pt-12 border-t border-zinc-800 mt-12">
            <div className="flex gap-8">
              <FaInstagram className="text-zinc-400 hover:text-white cursor-pointer transition-colors text-3xl" />
              <FaTwitter className="text-zinc-400 hover:text-white cursor-pointer transition-colors text-3xl" />
              <FaLinkedin className="text-zinc-400 hover:text-white cursor-pointer transition-colors text-3xl" />
            </div>
            <LinkNext href="/contact" className="group flex items-center justify-center w-full py-4 rounded-full bg-orange-600 text-white gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              Request Quotation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </LinkNext>
          </div>
        </div>
      </div>
    </>
  );
}