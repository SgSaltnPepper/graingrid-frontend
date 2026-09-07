"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Globe, 
  FileText, 
  Server, 
  Cookie, 
  UserCheck 
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Progress Bar Logic
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animation Variants with explicit TypeScript type
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50 } 
    },
  };

  return (
    <main ref={containerRef} className="relative min-h-screen bg-zinc-50 overflow-hidden selection:bg-orange-100 selection:text-orange-900 pb-32">
      
      {/* --- READING PROGRESS BAR --- */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-orange-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-50/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pt-24 lg:pt-32">
        
        {/* Navigation & Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-orange-600 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white border border-zinc-100 shadow-sm">
                <ShieldCheck size={18} className="text-orange-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Data Protection
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">
                Privacy <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600">Policy</span>
              </h1>
            </div>
            
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Updated</p>
              <p className="text-lg font-serif italic text-zinc-900">February 18, 2026</p>
            </div>
          </div>
        </motion.div>

        {/* --- DOCUMENT CARD --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white/50 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] space-y-16"
        >
          
          {/* 1. Introduction */}
          <motion.section variants={itemVariants} className="prose-lg text-zinc-600 leading-relaxed">
            <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 text-sm">01</span>
              Introduction
            </h3>
            <p className="mb-4">
              Welcome to <strong className="text-zinc-900">Grain Grid Company</strong> ("we," "us," or "our"). We deeply value the trust you place in us when trading agricultural products. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services.
            </p>
            <p>
              We are committed to protecting your personal data and ensuring transparency in how we handle your information, adhering to global best practices and applicable data protection laws.
            </p>
          </motion.section>

          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-200 to-transparent" />

          {/* 2. Information We Collect */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 text-sm">02</span>
              Information We Collect
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A */}
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 hover:border-orange-200 transition-colors">
                <div className="mb-4 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-2">Personal Information</h4>
                <p className="text-sm text-zinc-500 mb-4">Voluntarily provided when quoting or ordering.</p>
                <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
                  <li><strong>Identity:</strong> Name, job title, company name.</li>
                  <li><strong>Contact:</strong> Email, phone, billing/shipping address.</li>
                  <li><strong>Trade:</strong> Product interests & volume requirements.</li>
                </ul>
              </div>

              {/* Card B */}
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 hover:border-orange-200 transition-colors">
                <div className="mb-4 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-2">Payment Information</h4>
                <p className="text-sm text-zinc-500 mb-4">Processed securely via third-party gateways.</p>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
                  Note: We do not directly store your credit card or sensitive banking credentials on our servers.
                </div>
              </div>

              {/* Card C */}
              <div className="md:col-span-2 bg-zinc-50 rounded-3xl p-8 border border-zinc-100 hover:border-orange-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Server size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 mb-2">Technical & Usage Data</h4>
                    <p className="text-sm text-zinc-600">
                      Standard technical data collected automatically: IP address, browser type, device info, pages visited, and referring URLs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-200 to-transparent" />

          {/* 3. How We Use Your Information */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 text-sm">03</span>
              How We Use Your Data
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Order Fulfillment", desc: "Processing transactions & logistics." },
                { title: "Communication", desc: "Responding to inquiries & updates." },
                { title: "Improvement", desc: "Analyzing traffic & optimizing offers." },
                { title: "Marketing (Optional)", desc: "Newsletters on market trends." },
                { title: "Legal Compliance", desc: "Export regulations & tax laws." },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <span className="block text-sm font-bold text-zinc-900">{item.title}</span>
                    <span className="text-xs text-zinc-500">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* 4. Disclosure */}
          <motion.section variants={itemVariants} className="bg-zinc-900 text-zinc-300 rounded-4xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none" />
            
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-white text-sm">04</span>
              Disclosure of Information
            </h3>
            <p className="mb-6 relative z-10">
              We do not sell, trade, or rent your personal information. We only share data in strict circumstances:
            </p>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                <p><strong className="text-white">Service Providers:</strong> Trusted third parties (freight, IT, payment) under strict confidentiality contracts.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                <p><strong className="text-white">Legal Requirements:</strong> If required by law, court order, or customs authorities.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                <p><strong className="text-white">Business Transfers:</strong> In events like mergers or sales, user info may be transferred.</p>
              </div>
            </div>
          </motion.section>

          {/* 5. International Transfers */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-3">
              <Globe className="text-zinc-400" /> 
              International Data Transfers
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              As an export-oriented business, Grain Grid Company deals with clients globally. Your information may be transferred to—and maintained on—computers located outside of your state, province, or country where data protection laws may differ. We take all reasonable steps to ensure your data is treated securely and in accordance with this policy during such transfers.
            </p>
          </motion.section>

          {/* 6. Security */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-3">
              <Lock className="text-zinc-400" />
              Security of Your Data
            </h3>
            <p className="text-zinc-600 mb-4">We utilize robust security measures including:</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {["SSL Encryption", "Access Controls", "Vendor Vetting"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-100">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-400 italic">
              Disclaimer: While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet is 100% secure.
            </p>
          </motion.section>

          {/* 7. Cookies */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-3">
              <Cookie className="text-zinc-400" />
              Cookies & Tracking
            </h3>
            <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
              <ul className="space-y-2 text-sm text-zinc-700">
                <li>🍪 <strong>Functional Cookies:</strong> Essential for site operation.</li>
                <li>📊 <strong>Analytics Cookies:</strong> Help us understand visitor interaction.</li>
                <li>⚙️ <strong>Control:</strong> You can disable cookies via browser settings.</li>
              </ul>
            </div>
          </motion.section>

          {/* 8. Your Rights */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-3">
              <UserCheck className="text-zinc-400" />
              Your Data Rights
            </h3>
            <p className="text-zinc-600 mb-4">Regardless of location, you are entitled to:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Access', 'Correction', 'Deletion'].map((right) => (
                <div key={right} className="text-center p-4 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-800">
                  {right}
                </div>
              ))}
            </div>
          </motion.section>

        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-400 text-sm">
            Questions? Contact us at <a href="mailto:info@graingrid.com" className="text-orange-600 hover:underline">info@graingrid.com</a>
          </p>
        </motion.div>

      </div>
    </main>
  );
}