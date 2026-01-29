"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCircle2, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Text Animation
      gsap.from(".contact-header-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15,
        delay: 0.2
      });

      // Contact Info Stagger
      gsap.from(".contact-info-item", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.8
      });

      // Form Reveal
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const payload = {
      data: {
        Name: `${formData.get("first-name")} ${formData.get("last-name")}`,
        Email: formData.get("email"),
        Whatsapp: formData.get("whatsapp"), // Added WhatsApp
        Subject: formData.get("subject"),
        Message: formData.get("message"),
      },
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={containerRef} className="relative min-h-screen bg-zinc-50 overflow-hidden">
        {/* Background Texture (Optional for portfolio feel) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="mx-auto max-w-7xl px-6 py-32 lg:py-48 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-start">
          
          {/* Left Side: Contact Information */}
          <div className="flex flex-col justify-between h-full space-y-16">
            <div>
              <div className="overflow-hidden">
                 <span className="contact-header-text inline-block text-xs font-black uppercase tracking-[0.3em] text-orange-600 mb-6 bg-orange-100 px-3 py-1 rounded-full">
                    Contact Us
                 </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.85] mb-8">
                <span className="contact-header-text block">Let’s Start</span>
                <span className="contact-header-text block text-zinc-300">Something</span>
                <span className="contact-header-text block">Real.</span>
              </h1>
              <div className="overflow-hidden">
                <p className="contact-header-text mt-6 text-lg lg:text-xl font-medium leading-relaxed text-zinc-500 max-w-md">
                    Interested in a particular piece or a bulk inquiry? Reach out 
                    and we’ll get back to you within 24 hours.
                </p>
              </div>
            </div>

            <div className="space-y-10 border-l-2 border-zinc-200 pl-8 lg:pl-12">
              <div className="contact-info-item group cursor-pointer">
                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-orange-600 transition-colors">
                    <Mail size={14} /> Email
                </h3>
                <a href="mailto:hello@graingrid.com" className="mt-2 block text-2xl lg:text-3xl font-bold text-zinc-900 group-hover:translate-x-2 transition-transform duration-300">
                  hello@graingrid.com
                </a>
              </div>
              
              <div className="contact-info-item group cursor-pointer">
                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-orange-600 transition-colors">
                    <MapPin size={14} /> Visit Our Studio
                </h3>
                <p className="mt-2 text-xl font-bold text-zinc-900 leading-tight group-hover:translate-x-2 transition-transform duration-300">
                  123 Harvest Lane, <br />
                  Agriculture District, CA 90210
                </p>
              </div>

               <div className="contact-info-item group cursor-pointer">
                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-orange-600 transition-colors">
                    <Phone size={14} /> Call Us
                </h3>
                <p className="mt-2 text-xl font-bold text-zinc-900 group-hover:translate-x-2 transition-transform duration-300">
                  +1 (555) 000-0000
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Modern Form */}
          <div className="relative">
            {/* Decorative Element behind form */}
            <div className="absolute -inset-4 bg-linear-to-br from-orange-100 to-transparent rounded-[2.5rem] -z-10 blur-2xl opacity-50"></div>

            <div className="rounded-[2.5rem] bg-white p-8 lg:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-zinc-100">
              {!submitted ? (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="group">
                      <label htmlFor="first-name" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                        First name
                      </label>
                      <input
                        required
                        name="first-name"
                        type="text"
                        placeholder="John"
                        className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 placeholder-zinc-300 focus:border-orange-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="last-name" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                        Last name
                      </label>
                      <input
                        required
                        name="last-name"
                        type="text"
                        placeholder="Doe"
                        className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 placeholder-zinc-300 focus:border-orange-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="group">
                        <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                        Email address
                        </label>
                        <input
                        required
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 placeholder-zinc-300 focus:border-orange-600 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="whatsapp" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                        WhatsApp No.
                        </label>
                        <input
                        required
                        name="whatsapp"
                        type="tel"
                        placeholder="+1 234..."
                        className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 placeholder-zinc-300 focus:border-orange-600 focus:outline-none transition-colors"
                        />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                      Subject
                    </label>
                    <select
                      name="subject"
                      className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 focus:border-orange-600 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option>Product Inquiry</option>
                      <option>Partnership</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-orange-600 transition-colors">
                      Message
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="How can we help you?"
                      className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-sm font-bold text-zinc-900 placeholder-zinc-300 focus:border-orange-600 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {error && <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>}

                  <button
                    disabled={loading}
                    type="submit"
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-zinc-950 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? "Processing..." : (
                        <>
                            Send Inquiry 
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                        )}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600 mb-8 animate-in zoom-in duration-500">
                    <CheckCircle2 className="h-10 w-10" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-100 animate-ping"></div>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Message Sent
                  </h2>
                  <p className="mt-4 text-zinc-500 font-medium max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    Thank you for reaching out. Our team will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-10 group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-orange-600 transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-1" /> Send another
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}