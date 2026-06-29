import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface FloatingButtonsProps {
  phoneNumber?: string;
  whatsappNumber?: string;
}

export default function FloatingButtons({
  phoneNumber = "+919876543210",
  whatsappNumber = "+919876543210",
}: FloatingButtonsProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hello%20The%20Empire%2C%20I%20want%20to%20inquire%20about%20a%20table%20reservation%20or%20menu%20order!`;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Call Button */}
      <motion.a
        id="floating-call-btn"
        href={`tel:${phoneNumber}`}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-colors border border-amber-400 group relative"
        title="Call The Empire"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-16 bg-slate-900 text-amber-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
          Call: {phoneNumber}
        </span>
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-colors border border-emerald-400 group relative"
        title="WhatsApp The Empire"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-16 bg-slate-900 text-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
          WhatsApp Us
        </span>
      </motion.a>
    </div>
  );
}
