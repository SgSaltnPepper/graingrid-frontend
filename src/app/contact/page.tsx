"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  FileText,
  Globe,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 1. IMPORT PHONE INPUT & STYLES
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Data Constants ---
const RICE_VARIETIES = [
  "1121 White Sella",
  "1121 Golden Sella",
  "1121 Steam",
  "Traditional Raw",
  "Pusa",
  "Non-Basmati (Parmal/PR)",
  "Other",
];

const QUANTITIES = [
  "1 Container (25 MT)",
  "2-5 Containers",
  "5-10 Containers",
  "Break Bulk (>500 MT)",
];

const PACKAGING = [
  "50kg PP Bag",
  "40kg Jute Bag",
  "10kg BOPP Bag",
  "5kg Non-Woven Bag",
  "Private Label / Custom",
];

// --- ✨ PREMIUM CUSTOM SELECT COMPONENT ---
const ModernSelect = ({
  name,
  options,
  placeholder,
  required,
}: {
  name: string;
  options: string[];
  placeholder: string;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hidden input to ensure form submission works perfectly */}
      <input type="hidden" name={name} value={selected} required={required} />

      {/* Custom Trigger Box */}
      <div
        className={`input-field flex items-center justify-between cursor-pointer transition-all duration-300 ${isOpen ? "border-orange-600" : "hover:border-zinc-300"
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "text-zinc-900" : "text-zinc-300"}>
          {selected || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform duration-500 ease-out ${isOpen ? "rotate-180 text-orange-600" : ""
            }`}
        />
      </div>

      {/* Animated Dropdown Menu (Solid White & Black Text) */}
      <div
        className={`absolute left-0 top-[calc(100%+8px)] w-full bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-200 overflow-hidden origin-top transition-all duration-300 ease-out ${isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-y-95 pointer-events-none -translate-y-2"
          }`}
        style={{ zIndex: 9999 }} // Forcing extreme z-index on the menu itself
      >
        <div className="max-h-60 overflow-y-auto p-2 scrollbar-hide flex flex-col gap-1">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-4 py-3 text-sm font-bold rounded-xl cursor-pointer transition-all duration-200 ${selected === opt
                  ? "bg-orange-50 text-orange-600 pl-5"
                  : "text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 hover:pl-5"
                }`}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // STATE FOR PHONE NUMBER
  const [phoneValue, setPhoneValue] = useState<string | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // --- Premium Animations ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".anim-hero",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 }
      );

      gsap.fromTo(
        ".anim-form-container",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.3 }
      );

      gsap.fromTo(
        ".form-field-anim",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const whatsappNumber = phoneValue || "";

    const rfqDetails = `
      === RFQ SPECIFICATIONS ===
      Company: ${formData.get("company")}
      Country: ${formData.get("country")}
      Port: ${formData.get("port")}
      Variety: ${formData.get("variety")}
      Quantity: ${formData.get("quantity")}
      Packaging: ${formData.get("packaging")}
      
      === ADDITIONAL NOTES ===
      ${formData.get("message")}
    `;

    const payload = {
      data: {
        Name: `${formData.get("first-name")} ${formData.get("last-name")}`,
        Email: formData.get("email"),
        Whatsapp: whatsappNumber,
        Subject: `RFQ: ${formData.get("variety")} - ${formData.get(
          "quantity"
        )}`,
        Message: rfqDetails,
      },
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL ||
        "https://graingrid-backend.onrender.com"
        }/api/enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-zinc-50 overflow-hidden selection:bg-orange-100 selection:text-orange-900"
    >
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-orange-200/20 rounded-full blur-[150px] pointer-events-none" />

      {/* --- ULTRA WIDE CONTAINER --- */}
      <div className="w-400 max-w-440 mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24 items-start">
          {/* --- LEFT COLUMN: Brand Narrative --- */}
          <div className="xl:col-span-4 flex flex-col h-full xl:sticky xl:top-32 gap-12">
            <div>
              <span className="anim-hero inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-8 bg-white border border-orange-100 px-4 py-2 rounded-full shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                Partnership Inquiry
              </span>

              <h1 className="anim-hero text-5xl lg:text-6xl xl:text-7xl font-black text-zinc-900 leading-[0.9] mb-8 tracking-tighter">
                Let’s Build <br />
                <p>
                  <span className="text-zinc-300">Global</span>{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600">
                    Impact.
                  </span>
                </p>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600"></span>
              </h1>

              <div className="anim-hero border-l-4 border-orange-500/20 pl-8 py-2">
                <p className="text-lg font-medium leading-relaxed text-zinc-600">
                  More than just trade. When you partner with GrainGrid, your
                  business becomes a catalyst for economic change. Together, we
                  prove that commerce can cure poverty and transform lives.
                </p>
              </div>
            </div>

            {/* Contact Details Cards */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: "Export Sales",
                  value: "export@graingrid.com",
                  href: "mailto:export@graingrid.com",
                },
                {
                  icon: Phone,
                  label: "WhatsApp / Phone",
                  value: "+91 987 654 3210",
                  href: "tel:+919876543210",
                },
                {
                  icon: MapPin,
                  label: "Headquarters",
                  value: "123 Agri Business Park, New Delhi",
                  href: "#",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="anim-hero group flex items-center gap-6 p-5 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:border-orange-100 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="h-10 w-12 shrink-0 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 group-hover:text-orange-600 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-zinc-900">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: The Form --- */}
          <div className="xl:col-span-8 anim-form-container">
            <div className="relative rounded-[3rem] bg-white p-8 md:p-16 lg:p-20 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-zinc-100 ring-1 ring-zinc-50 overflow-visible">
              <div className="absolute top-0 right-0 w-32 h-22 bg-orange-50 rounded-bl-[100px] z-0 opacity-50"></div>

              {!submitted ? (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="relative z-10 space-y-12"
                >
                  {/* --- GROUP 1: IDENTITY --- */}
                  <div className="space-y-1 relative z-40">
                    <h4 className="form-field-anim flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500">
                        <FileText size={14} />
                      </span>
                      Identity & Contact
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                      <div className="form-field-anim group">
                        <input
                          required
                          name="first-name"
                          type="text"
                          placeholder="First Name"
                          className="input-field"
                        />
                      </div>
                      <div className="form-field-anim group">
                        <input
                          required
                          name="last-name"
                          type="text"
                          placeholder="Last Name"
                          className="input-field"
                        />
                      </div>
                      <div className="form-field-anim group md:col-span-2">
                        <label className="label-text">Company Name *</label>
                        <input
                          required
                          name="company"
                          type="text"
                          placeholder="Global Foods Ltd."
                          className="input-field"
                        />
                      </div>
                      <div className="form-field-anim group">
                        <label className="label-text">Official Email *</label>
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          className="input-field"
                        />
                      </div>
                      <div className="form-field-anim group">
                        <label className="label-text">Phone / WhatsApp *</label>
                        <div className="custom-phone-container">
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            value={phoneValue}
                            onChange={setPhoneValue}
                            placeholder="Enter phone number"
                            className="input-field-phone"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- GROUP 2: LOGISTICS (Z-Index Hierarchy Fixes Transparency Bug) --- */}
                  <div className="space-y-1 pt-8 border-t border-dashed border-zinc-200 relative z-30">
                    <h4 className="form-field-anim flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500">
                        <Globe size={14} />
                      </span>
                      Logistics & Requirements
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                      <div className="form-field-anim group relative z-10">
                        <label className="label-text">
                          Destination Country *
                        </label>
                        <input
                          required
                          name="country"
                          type="text"
                          placeholder="e.g. Saudi Arabia"
                          className="input-field"
                        />
                      </div>
                      <div className="form-field-anim group relative z-10">
                        <label className="label-text">Target Port *</label>
                        <input
                          required
                          name="port"
                          type="text"
                          placeholder="e.g. Jeddah Islamic Port"
                          className="input-field"
                        />
                      </div>

                      {/* Z-INDEX 50: Ensures dropdown opens ABOVE packaging */}
                      <div className="form-field-anim group relative z-50">
                        <label className="label-text">Rice Variety *</label>
                        <ModernSelect
                          name="variety"
                          options={RICE_VARIETIES}
                          placeholder="Select Variety..."
                          required
                        />
                      </div>

                      {/* Z-INDEX 40: Ensures dropdown opens ABOVE packaging */}
                      <div className="form-field-anim group relative z-40">
                        <label className="label-text">Quantity *</label>
                        <ModernSelect
                          name="quantity"
                          options={QUANTITIES}
                          placeholder="Select Volume..."
                          required
                        />
                      </div>

                      {/* Z-INDEX 30: Ensures dropdown opens ABOVE the message field below */}
                      <div className="form-field-anim group md:col-span-2 relative z-30">
                        <label className="label-text">
                          Packaging Preference *
                        </label>
                        <ModernSelect
                          name="packaging"
                          options={PACKAGING}
                          placeholder="Select Packaging..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- GROUP 3: MESSAGE --- */}
                  <div
                    className="space-y-1
               pt-8 border-t border-dashed border-zinc-200 relative z-10"
                  >
                    <h4 className="form-field-anim flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500">
                        <MessageSquare size={14} />
                      </span>
                      Specific Details
                    </h4>

                    <div className="form-field-anim group w-full">
                      <label className="label-text">
                        Additional Notes / Specifications
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Tell us about payment terms (LC/TT), specific quality parameters, private labeling needs, or any other requirements..."
                        className="input-field resize-none h-40 leading-relaxed w-full"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-widest">
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="form-field-anim pt-4">
                    <button
                      disabled={loading}
                      type="submit"
                      className="group relative w-full overflow-hidden rounded-2xl bg-zinc-900 py-6 px-10 transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.3)] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-4">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
                          {loading ? "Processing..." : "Initiate Request"}
                        </span>
                        {!loading && (
                          <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-2" />
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-green-50 text-green-600 mb-10 animate-in zoom-in duration-500">
                    <CheckCircle2 className="h-16 w-16" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-100/50 animate-ping"></div>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
                    Request Received
                  </h2>
                  <p className="text-lg text-zinc-500 font-medium max-w-md mx-auto leading-relaxed mb-12">
                    Your details are securely with us. Our export division will
                    analyze your requirements and issue a formal proforma or
                    quotation within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-orange-600 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-2" />
                    Submit New Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- STYLES --- */}
      <style jsx global>{`
        /* Hide scrollbar for custom dropdowns */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .label-text {
          display: block;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #a1a1aa;
          margin-bottom: 0;
          margin-left: 0.1rem;
          transition: color 0.3s;
        }
        .group:focus-within .label-text {
          color: #ea580c;
        }
        .input-field {
          width: 100%;
          border-bottom-width: 2px;
          border-color: #f4f4f5;
          background-color: transparent;
          padding-left: 0;
          padding-right: 0;
          padding-top: 0.25rem;
          padding-bottom: 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #18181b;
          transition: all 0.3s;
          border-radius: 0;
          outline: none !important;
          box-shadow: none !important;
        }
        .input-field:focus,
        .input-field:focus-within {
          border-color: #ea580c;
        }
        .input-field::placeholder {
          color: #d4d4d8;
          font-weight: 600;
        }
        .input-field:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #18181b !important;
        }

        /* --- PHONE INPUT CUSTOM STYLES --- */
        .custom-phone-container {
          width: 100%;
        }
        .PhoneInput {
          display: flex;
          align-items: center;
          border-bottom: 2px solid #f4f4f5;
          transition: border-color 0.3s;
          padding-top: 0.25rem;
        }
        .group:focus-within .PhoneInput {
          border-color: #ea580c;
        }
        .PhoneInputInput {
          background: transparent;
          border: none;
          outline: none;
          font-size: 1.125rem;
          font-weight: 700;
          color: #18181b;
          padding: 0.5rem 0;
          width: 100%;
        }
        .PhoneInputInput::placeholder {
          color: #d4d4d8;
          font-weight: 600;
        }
        .PhoneInputCountry {
          margin-right: 1rem;
        }
        .PhoneInputCountrySelect {
          display: none;
        }
      `}</style>
    </main>
  );
}
