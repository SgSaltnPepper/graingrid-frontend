"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900">
          <X className="h-6 w-6" />
        </button>

        {!sent ? (
          <>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
              Enquire About <span className="text-orange-600">{productName}</span>
            </h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input required name="name" type="text" placeholder="YOUR NAME" className="w-full border-b border-zinc-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-600" />
              <input required name="email" type="email" placeholder="YOUR EMAIL" className="w-full border-b border-zinc-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-600" />
              <textarea required name="message" rows={4} placeholder="YOUR MESSAGE..." className="w-full border-b border-zinc-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-600 resize-none" />
              <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-orange-600 disabled:opacity-50">
                {loading ? "SENDING..." : <>SEND INQUIRY <Send className="h-3 w-3" /></>}
              </button>
            </form>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Send className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Message Received</h2>
            <p className="mt-4 text-sm font-medium text-zinc-500">We will get back to you regarding {productName} shortly.</p>
            <button onClick={onClose} className="mt-8 text-[10px] font-black uppercase tracking-widest text-orange-600">Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
}