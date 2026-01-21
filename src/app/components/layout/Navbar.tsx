"use client";

import LinkNext from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCategories, getPremiumProduct, getStrapiMedia, StrapiCategory, StrapiProduct } from "@/lib/strapi";
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
  const mobileOverlayRef = useRef(null);
  const desktopMegaRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const [catData, premiumData] = await Promise.all([
        getCategories(),
        getPremiumProduct()
      ]);
      setCategories(catData);
      setPremiumProduct(premiumData);
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        gsap.to(mobileOverlayRef.current, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "expo.inOut" });
        gsap.fromTo(".mobile-li", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3 });
      } else {
        gsap.to(mobileOverlayRef.current, { clipPath: "circle(0% at 100% 0%)", duration: 0.6, ease: "expo.inOut" });
      }
    });
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (showMega) {
        gsap.to(desktopMegaRef.current, { y: 0, opacity: 1, display: "block", pointerEvents: "auto", duration: 0.5, ease: "expo.out" });
      } else {
        gsap.to(desktopMegaRef.current, { y: -10, opacity: 0, display: "none", pointerEvents: "none", duration: 0.3 });
      }
    });
    return () => ctx.revert();
  }, [showMega]);

  useEffect(() => { setOpen(false); setShowMega(false); }, [pathname]);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 transition-all duration-500 rounded-full border border-zinc-200/50 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-xl py-2" : "bg-white py-4"}`}>
        
        <LinkNext href="/" className="group flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-zinc-900 flex items-center justify-center transition-transform group-hover:rotate-12">
             <span className="text-white font-black text-lg italic">G</span>
          </div>
          <span className="text-lg font-black uppercase tracking-tighter text-zinc-900">raingrid</span>
        </LinkNext>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href} onMouseEnter={() => l.label === "Products" && setShowMega(true)} className="relative">
              <LinkNext href={l.href} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-orange-600 ${pathname === l.href ? "text-orange-600" : "text-zinc-900"}`}>
                {l.label}
              </LinkNext>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <LinkNext href="/contact" className="rounded-full bg-zinc-900 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-orange-600 transition-colors">
            Inquire
          </LinkNext>
        </div>

        <button type="button" className="relative z-60 flex h-10 w-10 flex-col items-center justify-center gap-1 md:hidden" onClick={() => setOpen(!open)}>
          <span className={`h-0.5 w-5 transition-all ${open ? "rotate-45 translate-y-1.5 bg-white" : "bg-zinc-900"}`} />
          <span className={`h-0.5 w-5 transition-all ${open ? "opacity-0" : "bg-zinc-900"}`} />
          <span className={`h-0.5 w-5 transition-all ${open ? "-rotate-45 -translate-y-1.5 bg-white" : "bg-zinc-900"}`} />
        </button>
      </nav>

      {/* DESKTOP MEGA MENU */}
      <div ref={desktopMegaRef} onMouseLeave={() => setShowMega(false)} className="hidden absolute left-0 top-0 -z-10 w-full bg-white border-b border-zinc-100 pt-28 pb-12 shadow-2xl opacity-0">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-12 gap-12">
          <div className="col-span-4 border-r border-zinc-100 pr-12">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-8">Collections</p>
             <div className="flex flex-col gap-5">
                {categories.map((cat) => (
                  <LinkNext key={cat.documentId} href={`/products?category=${cat.Name}`} className="text-xl font-bold uppercase tracking-tight text-zinc-900 hover:text-orange-600 transition-colors">
                    {cat.Name}
                  </LinkNext>
                ))}
             </div>
          </div>

          <div className="col-span-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]  mb-8 text-blue-600">Premium Selection</p>
            <div className="flex gap-8">
                {premiumProduct && (
                  <LinkNext href={`/products/${premiumProduct.documentId}`} className="group relative w-2/3 overflow-hidden rounded-2xl bg-zinc-50 p-6 flex gap-6 items-center border border-zinc-100 transition-hover hover:bg-blue-50/50">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                       <img src={getStrapiMedia(premiumProduct.Image?.[0]?.url)} alt={premiumProduct.Name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                       <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">Premium Collection</span>
                       <h4 className="mt-1 text-lg font-black text-zinc-900 uppercase">{premiumProduct.Name}</h4>
                       <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{premiumProduct.Description?.[0]?.children?.[0]?.text}</p>
                       <span className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-600 pb-1">Explore Piece</span>
                    </div>
                  </LinkNext>
                )}
                
                <div className="flex-1 flex flex-col justify-center rounded-2xl bg-zinc-900 p-8 text-center text-white">
                   <h4 className="text-xs font-bold uppercase tracking-widest">Gallery</h4>
                   <p className="mt-2 text-[10px] text-zinc-400">Total {categories.length} Categories</p>
                   <LinkNext href="/products" className="mt-6 rounded-full bg-orange-600 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all">Browse All</LinkNext>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={mobileOverlayRef} className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-zinc-950 pointer-events-none md:hidden" style={{ clipPath: "circle(0% at 100% 0%)", pointerEvents: open ? "auto" : "none" }}>
        <ul className="flex flex-col items-center gap-8 text-center">
          {NAV_LINKS.map((l) => (
            <li key={l.href} className="mobile-li"><LinkNext href={l.href} className="text-4xl font-black uppercase tracking-tighter text-white">{l.label}</LinkNext></li>
          ))}
        </ul>
      </div>
    </header>
  );
}