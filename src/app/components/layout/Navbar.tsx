"use client";

import LinkNext from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCategories, type StrapiCategory } from "@/lib/strapi";
import { 
  ChevronDown, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight
} from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa6";
import gsap from "gsap";

// Define the sub-pages for the About section
const ABOUT_DROPDOWN = [
  { label: "Company Overview", href: "/about/company-overview" },
  { label: "Our Story", href: "/about/our-story" },
  { label: "Chairman's Message", href: "/about/chairmans-message" },
  { label: "General Manager's Message", href: "/about/gm-message" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State for dropdowns
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  
  // State for mobile accordions
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  
  const pathname = usePathname();
  const mobileOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (error) {
        console.error("Navbar data fetch failed:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations for Mobile Menu
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

  // Reset all states when route changes
  useEffect(() => { 
    setOpen(false); 
    setProductsDropdownOpen(false);
    setAboutDropdownOpen(false);
    setMobileProductsOpen(false);
    setMobileAboutOpen(false);
  }, [pathname]);

  // Filter: Keep standard categories, exclude the sub-rice types from the main list loop
  const topLevelCategories = categories.filter(cat => 
    !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name)
  );

  return (
    <>
      {/* FLOATING GLASS NAVBAR WRAPPER 
        Pointer events are none on the wrapper so you can click "through" the empty space around the navbar,
        but auto on the header itself.
      */}
      <div className="fixed top-0 inset-x-0 z-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pointer-events-none">
        <header 
          className={`mx-auto max-w-360 pointer-events-auto transition-all duration-500 rounded-4xl lg:rounded-full backdrop-blur-xl border ${
            scrolled 
              ? "bg-white/85 border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] py-3" 
              : "bg-white/60 border-white/20 shadow-sm py-4 lg:py-5"
          }`}
        >
          <nav className="flex w-full items-center justify-between px-4 lg:px-8">
            
            {/* Logo */}
            <LinkNext href="/" className="group flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-950 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-md">
                <span className="text-white font-black text-xl italic tracking-tighter">G</span>
              </div>
              <span className="text-xl font-black uppercase tracking-tighter transition-colors duration-500 text-zinc-950">
                raingrid
              </span>
            </LinkNext>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
               <ul className="flex items-center gap-8">
                  {/* 1. Home Link */}
                  <li className="relative py-2">
                      <LinkNext href="/" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname === '/' ? "text-orange-600" : "text-zinc-500"}`}>
                        Home
                      </LinkNext>
                  </li>

                  {/* 2. Products Dropdown */}
                  <li 
                    className="relative py-2 group"
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                      <LinkNext 
                          href="/products" 
                          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname.startsWith('/products') ? "text-orange-600" : "text-zinc-500"}`}
                      >
                        Products
                        <ChevronDown size={14} className={`transition-transform duration-300 ${productsDropdownOpen ? "rotate-180" : ""}`} />
                      </LinkNext>

                      {/* Glassy Floating Mega Menu */}
                      <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-400 ease-out ${
                          productsDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
                        }`}
                      >
                        <div className="w-150 bg-white/95 backdrop-blur-3xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 overflow-hidden">
                          <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                              {topLevelCategories.map((cat) => (
                                  <div key={cat.id} className="flex flex-col gap-3">
                                      <LinkNext 
                                          href={`/products?category=${cat.Name}`}
                                          className="text-sm font-black uppercase tracking-widest text-zinc-900 hover:text-orange-600 transition-colors"
                                      >
                                          {cat.Name}
                                      </LinkNext>
                                      
                                      {/* SPECIAL LOGIC FOR RICE SUB-CATEGORIES */}
                                      {cat.Name === "Rice" && (
                                          <div className="flex flex-col gap-2 pl-3 border-l-2 border-orange-500/20 mt-1">
                                              <LinkNext href="/products?category=Basmati Rice" className="text-xs font-bold text-zinc-500 hover:text-orange-600 transition-colors">Basmati Rice</LinkNext>
                                              <LinkNext href="/products?category=Non-Basmati Rice" className="text-xs font-bold text-zinc-500 hover:text-orange-600 transition-colors">Non-Basmati Rice</LinkNext>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                        </div>
                      </div>
                  </li>

                  {/* 3. About Us Dropdown */}
                  <li 
                    className="relative py-2 group"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                      <button className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname.startsWith('/about') ? "text-orange-600" : "text-zinc-500"}`}>
                        About Us
                        <ChevronDown size={14} className={`transition-transform duration-300 ${aboutDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Glassy Floating About Menu */}
                      <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-400 ease-out ${
                          aboutDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
                        }`}
                      >
                        <div className="w-64 bg-white/95 backdrop-blur-3xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-3 overflow-hidden">
                          {ABOUT_DROPDOWN.map((item) => (
                            <LinkNext 
                              key={item.href}
                              href={item.href}
                              className="block px-5 py-3.5 text-xs font-bold text-zinc-600 hover:text-orange-600 hover:bg-orange-50/50 rounded-2xl transition-colors"
                            >
                              {item.label}
                            </LinkNext>
                          ))}
                        </div>
                      </div>
                  </li>

                  {/* 4. Contact Link */}
                  <li className="relative py-2">
                      <LinkNext href="/contact" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname === '/contact' ? "text-orange-600" : "text-zinc-500"}`}>
                        Contact
                      </LinkNext>
                  </li>
               </ul>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <LinkNext href="/contact" className="hidden lg:block rounded-full bg-zinc-950 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-orange-500/30">
                Get Quote
              </LinkNext>
              
              {/* Mobile Menu Button */}
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

      {/* Mobile Overlay Menu */}
      <div ref={mobileOverlayRef} className="fixed inset-0 z-90 flex flex-col bg-zinc-950 px-8 pt-40 pb-12 overflow-y-auto" style={{ clipPath: "circle(0% at 92% 5%)", pointerEvents: "none" }}>
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-12">
            <div className="mobile-li">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-8">Main Navigation</p>
              <div className="flex flex-col gap-6">
                
                {/* 1. Home Link */}
                <LinkNext href="/" className="text-5xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors">
                  Home
                </LinkNext>

                {/* 2. Mobile Products Accordion */}
                <div>
                  <button 
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="flex items-center justify-between w-full text-5xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors"
                  >
                    Products
                    <ChevronRight size={32} className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-90 text-orange-500" : ""}`} />
                  </button>
                  
                  {/* Products Sub-menu */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mobileProductsOpen ? "max-h-200 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-6 pl-4 border-l-2 border-zinc-800">
                        {topLevelCategories.map((cat) => (
                            <div key={cat.id}>
                                <LinkNext 
                                    href={`/products?category=${cat.Name}`}
                                    className="text-2xl font-bold uppercase tracking-tight text-zinc-400 hover:text-white transition-colors"
                                >
                                    {cat.Name}
                                </LinkNext>
                                {/* Mobile Rice Sub-menu */}
                                {cat.Name === "Rice" && (
                                    <div className="flex flex-col gap-3 pl-4 mt-3 border-l border-zinc-700">
                                        <LinkNext href="/products?category=Basmati Rice" className="text-lg font-medium text-zinc-500 hover:text-orange-500 transition-colors">Basmati Rice</LinkNext>
                                        <LinkNext href="/products?category=Non-Basmati Rice" className="text-lg font-medium text-zinc-500 hover:text-orange-500 transition-colors">Non-Basmati Rice</LinkNext>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* 3. Mobile About Accordion */}
                <div>
                  <button 
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="flex items-center justify-between w-full text-5xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors"
                  >
                    About Us
                    <ChevronRight size={32} className={`transition-transform duration-300 ${mobileAboutOpen ? "rotate-90 text-orange-500" : ""}`} />
                  </button>
                  
                  {/* About Sub-menu */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mobileAboutOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-5 pl-4 border-l-2 border-zinc-800">
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

                {/* 4. Contact Link */}
                <LinkNext href="/contact" className="text-5xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors">
                  Contact
                </LinkNext>
              </div>
            </div>
          </div>

          <div className="mobile-li flex flex-col gap-8 pt-12 border-t border-white/10 mt-12">
            <div className="flex gap-8">
              <FaInstagram className="text-white hover:text-orange-500 cursor-pointer transition-colors text-3xl" />
              <FaTwitter className="text-white hover:text-orange-500 cursor-pointer transition-colors text-3xl" />
              <FaLinkedin className="text-white hover:text-orange-500 cursor-pointer transition-colors text-3xl" />
            </div>
            <LinkNext href="/contact" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
              Inquire Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </LinkNext>
          </div>
        </div>
      </div>
    </>
  );
}