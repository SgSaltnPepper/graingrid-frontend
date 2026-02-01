import React from "react";

export default function GeneralMessages() {
  return (
    <main className="pt-32 pb-24 px-6 lg:px-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          About Us
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950 mt-6 mb-12">
          General Managers Massage
        </h1>
        
        <div className="prose prose-lg text-zinc-500">
          <p>
            This is where you write the static content for the Company Overview.
            You can add images, paragraphs, and lists here.
          </p>
          <p>
            GrainGrid has been a leader in the agricultural export industry...
          </p>
        </div>
      </div>
    </main>
  );
}