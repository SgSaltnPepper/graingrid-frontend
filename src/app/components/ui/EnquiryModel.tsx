"use client";

import { useState } from "react";
import { X, Send, Phone } from "lucide-react";

export default function EnquiryModal({ 
  productName, 
  isOpen, 
  onClose 
}: { 
  productName: string; 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      data: {
        Name: formData.get("name"),
        Email: formData.get("email"),
        Whatsapp: formData.get("whatsapp"), // Added WhatsApp field
        Subject: `Inquiry about ${productName}`,
        Message: formData.get("message"),
      }
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) setSent(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 transition-all duration-500">
      <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-8 lg:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-all">
          <X className="h-5 w-5" />
        </button>

        {!sent ? (
          <>
            <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none mb-2">
              Enquire About
            </h2>
            <p className="text-orange-600 font-black uppercase tracking-tight text-xl lg:text-2xl mb-8">
              {productName}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input required name="name" type="text" placeholder="YOUR NAME" className="w-full border-b border-zinc-200 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-orange-600 transition-colors placeholder:text-zinc-300 text-zinc-900" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required name="email" type="email" placeholder="YOUR EMAIL" className="w-full border-b border-zinc-200 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-orange-600 transition-colors placeholder:text-zinc-300 text-zinc-900" />
                    
                    <div className="relative">
                        <input required name="whatsapp" type="tel" placeholder="WHATSAPP NO." className="w-full border-b border-zinc-200 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-orange-600 transition-colors placeholder:text-zinc-300 text-zinc-900" />
                        <Phone className="absolute right-0 top-3 h-4 w-4 text-zinc-300" />
                    </div>
                </div>

                <textarea required name="message" rows={3} placeholder="YOUR MESSAGE..." className="w-full border-b border-zinc-200 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-orange-600 transition-colors placeholder:text-zinc-300 text-zinc-900 resize-none" />
              </div>

              <button disabled={loading} type="submit" className="group flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-950 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                {loading ? "SENDING..." : <>SEND INQUIRY <Send className="h-3 w-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>}
              </button>
            </form>
          </>
        ) : (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 animate-in zoom-in duration-500">
              <Send className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900">Received</h2>
            <p className="mt-4 text-sm font-medium text-zinc-500 max-w-xs mx-auto">
                We have received your inquiry regarding {productName}. Our team will contact you shortly via WhatsApp or Email.
            </p>
            <button onClick={onClose} className="mt-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-600 transition-colors">Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
}
