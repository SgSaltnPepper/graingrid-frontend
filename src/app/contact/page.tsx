"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Construct the data object exactly as Strapi expects it
    const payload = {
      data: {
        Name: `${formData.get("first-name")} ${formData.get("last-name")}`,
        Email: formData.get("email"),
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
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2">
          
          {/* Left Side: Contact Information */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                Contact Us
              </span>
              <h1 className="mt-6 text-5xl font-black uppercase tracking-tighter text-dark-900 sm:text-7xl">
                Let’s Start a <br />
                <span className="text-zinc-400">Conversation.</span>
              </h1>
              <p className="mt-8 text-lg leading-relaxed text-dark-600">
                Interested in a particular piece or a bulk inquiry? Reach out 
                and we’ll get back to you within 24 hours.
              </p>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-dark-400">Email</h3>
                  <a href="mailto:hello@graingrid.com" className="mt-2 block text-xl font-medium text-dark-900 hover:text-orange-600 transition-colors">
                    hello@graingrid.com
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-dark-400">Visit Our Studio</h3>
                  <p className="mt-2 text-xl font-medium text-dark-900">
                    123 Harvest Lane, <br />
                    Agriculture District, CA 90210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Minimalist Form */}
          <div className="rounded-3xl bg-zinc-50 p-8 lg:p-12 border border-zinc-100 shadow-sm transition-all">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-xs font-bold uppercase tracking-widest text-dark-400">
                      First name
                    </label>
                    <input
                      required
                      name="first-name"
                      type="text"
                      id="first-name"
                      className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-dark-900 focus:border-orange-600 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-xs font-bold uppercase tracking-widest text-dark-400">
                      Last name
                    </label>
                    <input
                      required
                      name="last-name"
                      type="text"
                      id="last-name"
                      className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-dark-900 focus:border-orange-600 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-dark-400">
                    Email address
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    id="email"
                    className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-dark-900 focus:border-orange-600 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-widest text-dark-400">
                    Subject
                  </label>
                  <select
                    name="subject"
                    id="subject"
                    className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-dark-900 focus:border-orange-600 focus:outline-none transition-colors appearance-none"
                  >
                    <option>Product Inquiry</option>
                    <option>Partnership</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-dark-400">
                    Message
                  </label>
                  <textarea
                    required
                    name="message"
                    id="message"
                    rows={4}
                    className="mt-2 w-full border-b border-zinc-200 bg-transparent py-3 text-dark-900 focus:border-orange-600 focus:outline-none transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {error && <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>}

                <button
                  disabled={loading}
                  type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-dark-900 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : (
                    <>
                      Send Inquiry 
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-8 text-3xl font-black uppercase tracking-tighter text-dark-900">
                  Message Sent
                </h2>
                <p className="mt-4 text-dark-500 font-medium">
                  Thank you for reaching out. <br /> Our team will contact you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 hover:text-dark-900 transition-colors"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}