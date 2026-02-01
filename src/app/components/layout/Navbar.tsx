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

const NAV_LINKS = [
  { label: "Home", href: "/" },
  // Products is handled dynamically
  // About is handled statically
  { label: "Contact", href: "/contact" },
] as const;

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
  // We will manually add them under "Rice"
  const topLevelCategories = categories.filter(cat => 
    !['Basmati Rice', 'Non-Basmati Rice'].includes(cat.Name)
  );

  return (
    <>
      <header 
        className={`sticky top-0 z-100 w-full bg-white border-b border-zinc-100 transition-all duration-300 ${
          scrolled ? "shadow-md py-3" : "py-5"
        }`}
      >
        <nav className="mx-auto flex w-full items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <LinkNext href="/" className="group flex items-center gap-2 pl-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-zinc-950 flex items-center justify-center transition-all group-hover:rotate-15 group-hover:scale-110">
              <span className="text-white font-black text-xl italic tracking-tighter">G</span>
            </div>
            <span className={`text-xl font-black uppercase tracking-tighter transition-colors duration-500 text-zinc-950`}>
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

                {/* 2. Products Mega Menu */}
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

                    {/* Full Width Dropdown */}
                    <div 
                      className={`fixed left-0 w-full bg-white border-t border-zinc-100 shadow-xl transition-all duration-300 overflow-hidden ${
                        productsDropdownOpen ? "opacity-100 visible top-17.5 lg:top-21.25 max-h-125" : "opacity-0 invisible top-20 max-h-0"
                      }`}
                      style={{ zIndex: 90 }} // Ensure it sits below header but above page content
                    >
                      <div className="container mx-auto px-6 lg:px-12 py-8">
                        <div className="grid grid-cols-4 gap-8">
                            {/* "All Products" Column */}
                            <div className="col-span-1 border-r border-zinc-100 pr-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4">Our Catalogue</h3>
                                <LinkNext 
                                    href="/products"
                                    className="block py-2 text-zinc-500 hover:text-orange-600 transition-colors"
                                >
                                    View Full Catalogue →
                                </LinkNext>
                            </div>

                            {/* Categories Grid */}
                            <div className="col-span-3 grid grid-cols-3 gap-8">
                                {topLevelCategories.map((cat) => (
                                    <div key={cat.id} className="flex flex-col gap-2">
                                        <LinkNext 
                                            href={`/products?category=${cat.Name}`}
                                            className="text-sm font-bold uppercase tracking-wide text-zinc-800 hover:text-orange-600 transition-colors"
                                        >
                                            {cat.Name}
                                        </LinkNext>
                                        
                                        {/* SPECIAL LOGIC FOR RICE */}
                                        {cat.Name === "Rice" && (
                                            <div className="flex flex-col gap-1 pl-2 border-l border-zinc-200 mt-1">
                                                <LinkNext href="/products?category=Basmati Rice" className="text-xs text-zinc-500 hover:text-orange-600 transition-colors">Basmati Rice</LinkNext>
                                                <LinkNext href="/products?category=Non-Basmati Rice" className="text-xs text-zinc-500 hover:text-orange-600 transition-colors">Non-Basmati Rice</LinkNext>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
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

                    {/* About Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 transition-all duration-300 ${
                        aboutDropdownOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"
                      }`}
                    >
                      <div className="bg-white border border-zinc-100 shadow-xl rounded-2xl overflow-hidden p-2">
                        {ABOUT_DROPDOWN.map((item) => (
                          <LinkNext 
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-xs font-bold text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
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
          <div className="flex items-center gap-4 pr-2">
            <LinkNext href="/contact" className="hidden lg:block rounded-full bg-zinc-950 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20">
              Get Quote
            </LinkNext>
            
            <button 
              type="button" 
              className={`relative z-110 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 lg:hidden ${open ? "bg-zinc-100 text-zinc-950 rotate-90" : "bg-zinc-950 text-white"}`} 
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

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
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-zinc-800">
                        <LinkNext href="/products" className="text-xl font-bold text-white hover:text-orange-500 transition-colors">
                            View All Products
                        </LinkNext>
                        {topLevelCategories.map((cat) => (
                            <div key={cat.id}>
                                <LinkNext 
                                    href={`/products?category=${cat.Name}`}
                                    className="text-xl font-bold text-zinc-400 hover:text-white transition-colors"
                                >
                                    {cat.Name}
                                </LinkNext>
                                {/* Mobile Rice Sub-menu */}
                                {cat.Name === "Rice" && (
                                    <div className="flex flex-col gap-2 pl-4 mt-2 border-l border-zinc-700">
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
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-zinc-800">
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

          <div className="mobile-li flex items-center justify-between pt-12 border-t border-white/10 mt-12">
            <div className="flex gap-8">
              <FaInstagram className="text-white hover:text-orange-500 cursor-pointer transition-colors text-2xl" />
              <FaTwitter className="text-white hover:text-orange-500 cursor-pointer transition-colors text-2xl" />
              <FaLinkedin className="text-white hover:text-orange-500 cursor-pointer transition-colors text-2xl" />
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