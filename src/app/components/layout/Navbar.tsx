"use client";

import LinkNext from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCategories, getPremiumProduct, getStrapiMedia, type StrapiCategory, type StrapiProduct } from "@/lib/strapi";
import { ChevronRight, Menu, X, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [premiumProduct, setPremiumProduct] = useState<StrapiProduct | null>(null);
  
  const pathname = usePathname();
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const desktopMegaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [catData, premiumData] = await Promise.all([
          getCategories(),
          getPremiumProduct()
        ]);
        setCategories(catData || []);
        setPremiumProduct(premiumData);
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

  // GSAP Liquid Mobile Menu Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        gsap.to(mobileOverlayRef.current, { 
          clipPath: "circle(150% at 100% 0%)", 
          duration: 1, 
          ease: "power4.inOut",
          pointerEvents: "auto"
        });
        gsap.fromTo(".mobile-li", 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.4 }
        );
      } else {
        document.body.style.overflow = "";
        gsap.to(mobileOverlayRef.current, { 
          clipPath: "circle(0% at 92% 5%)", 
          duration: 0.8, 
          ease: "power4.inOut",
          pointerEvents: "none"
        });
      }
    });
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (showMega) {
        gsap.to(desktopMegaRef.current, { y: 0, opacity: 1, display: "block", duration: 0.6, ease: "expo.out" });
      } else {
        gsap.to(desktopMegaRef.current, { y: -20, opacity: 0, display: "none", duration: 0.4, ease: "expo.in" });
      }
    });
    return () => ctx.revert();
  }, [showMega]);

  useEffect(() => { setOpen(false); setShowMega(false); }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 z-100 w-full transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}>
        <nav className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 rounded-full border border-zinc-200/50 ${scrolled ? "bg-white/80 backdrop-blur-2xl shadow-2xl py-3 mx-4 lg:mx-auto" : "bg-white py-5 mx-6 lg:mx-auto"}`}>
          <LinkNext href="/" className="group flex items-center gap-2 pl-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-zinc-950 flex items-center justify-center transition-all group-hover:rotate-15 group-hover:scale-110">
              <span className="text-white font-black text-xl italic tracking-tighter">G</span>
            </div>
            <span className={`text-xl font-black uppercase tracking-tighter transition-colors duration-500 ${open ? "text-white lg:text-zinc-950" : "text-zinc-950"}`}>
              raingrid
            </span>
          </LinkNext>

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href} onMouseEnter={() => l.label === "Products" && setShowMega(true)} className="relative py-2">
                <LinkNext href={l.href} className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-orange-600 ${pathname === l.href ? "text-orange-600" : "text-zinc-500"}`}>
                  {l.label}
                </LinkNext>
                {pathname === l.href && <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-600 rounded-full" />}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 pr-2">
            <LinkNext href="/contact" className="hidden lg:block rounded-full bg-zinc-950 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20">
              Get Quote
            </LinkNext>
            
            {/* TOGGLE BUTTON: High Z-Index to stay above overlay */}
            <button 
              type="button" 
              className={`relative z-110 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 lg:hidden ${open ? "bg-white text-zinc-950 rotate-90" : "bg-zinc-950 text-white"}`} 
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Desktop Mega Menu */}
        <div ref={desktopMegaRef} onMouseLeave={() => setShowMega(false)} className="hidden absolute left-0 top-0 -z-10 w-full bg-white border-b-2 border-zinc-100 pt-32 pb-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
          <div className="mx-auto max-w-7xl px-12 grid grid-cols-12 gap-16">
            <div className="col-span-4 border-r border-zinc-100 pr-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-10">Our Collections</p>
              <div className="flex flex-col gap-6">
                {categories.map((cat) => (
                  <LinkNext key={cat.documentId || cat.id} href={`/products?category=${cat.Name}`} className="group flex items-center justify-between text-2xl font-black uppercase tracking-tighter text-zinc-900 hover:text-orange-600 transition-all">
                    {cat.Name} <ChevronRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </LinkNext>
                ))}
              </div>
            </div>
            <div className="col-span-8 bg-zinc-50 rounded-4xl p-10 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-zinc-400">Featured Spotlight</p>
              {premiumProduct && (
                <LinkNext href={`/products/${premiumProduct.documentId || premiumProduct.id}`} className="group flex gap-10 items-center">
                  <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-3xl bg-white shadow-xl border border-zinc-100">
                    <img src={getStrapiMedia(premiumProduct.Image)} alt={premiumProduct.Name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[9px] font-black uppercase text-orange-700 tracking-widest mb-4">Limited Release</span>
                    <h4 className="text-4xl font-black text-zinc-950 uppercase leading-none tracking-tighter mb-6">{premiumProduct.Name}</h4>
                    <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 group-hover:text-orange-600 transition-colors">
                      View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </LinkNext>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Amazing Mobile Overlay */}
      <div 
        ref={mobileOverlayRef} 
        className="fixed inset-0 z-90 flex flex-col bg-zinc-950 px-8 pt-40 pb-12 overflow-y-auto"
        style={{ clipPath: "circle(0% at 92% 5%)", pointerEvents: "none" }}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-12">
            <div className="mobile-li">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-8">Main Navigation</p>
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <LinkNext key={link.href} href={link.href} className="text-6xl font-black uppercase tracking-tighter text-white hover:text-orange-500 transition-colors">
                    {link.label}
                  </LinkNext>
                ))}
              </div>
            </div>

            <div className="mobile-li pt-12 border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Our Specialties</p>
              <div className="grid grid-cols-1 gap-6">
                {categories.map((cat) => (
                  <LinkNext key={cat.id} href={`/products?category=${cat.Name}`} className="flex items-center justify-between text-xl font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
                    {cat.Name}
                    <ArrowRight size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </LinkNext>
                ))}
              </div>
            </div>
          </div>

          <div className="mobile-li flex items-center justify-between pt-12 border-t border-white/10 mt-12">
            <div className="flex gap-8">
              <Instagram className="text-white hover:text-orange-500 cursor-pointer transition-colors" size={24} />
              <Twitter className="text-white hover:text-orange-500 cursor-pointer transition-colors" size={24} />
              <Linkedin className="text-white hover:text-orange-500 cursor-pointer transition-colors" size={24} />
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