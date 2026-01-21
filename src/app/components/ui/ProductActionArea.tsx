"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModel";

export default function ProductActionArea({ productName }: { productName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contactMessage = encodeURIComponent(`Hi! I'm interested in the ${productName}. Could you provide more details?`);

  return (
    <div className="pt-6">
      <p className="mb-4 text-sm text-zinc-500 italic">
        Interested in this product? Contact us for a custom quote or viewing.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* WhatsApp Option */}
        <a 
          href={`https://wa.me/YOUR_PHONE_NUMBER?text=${contactMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-green-600 py-4 text-center text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-95"
        >
          WhatsApp Inquiry
        </a>

        {/* NEW Professional Modal Option */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 rounded-xl bg-zinc-900 py-4 text-center text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95"
        >
          Email Inquiry
        </button>
      </div>

      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={productName} 
      />
    </div>
  );
}