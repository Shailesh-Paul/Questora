import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, QrCode, ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_SANDBOX_MESSAGE } from "../config";

export default function WhatsAppScanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_SANDBOX_MESSAGE)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappUrl)}&color=0F172A&bgcolor=FFFFFF&margin=10`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        {/* QR Code Section */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-[2.5rem] blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
          <div className="relative bg-white p-4 rounded-[2rem] shadow-xl border border-emerald-100">
            <img 
              src={qrCodeUrl} 
              alt="WhatsApp QR Code" 
              className="w-32 h-32 md:w-40 md:h-40"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
              <QrCode size={20} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-4">
            <MessageSquare size={12} />
            Instant WhatsApp Assistant
          </div>
          
          <h3 className="font-display font-bold text-2xl text-slate-900 mb-3">
            Elevate Your Travel Experience
          </h3>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-md">
            Scan this code to activate your personalized <span className="font-bold text-emerald-600">AI Travel Assistant</span> on WhatsApp. 
            Get instant updates, real-time tracking, and 24/7 support right at your fingertips.
          </p>

          <div className="bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 inline-block">
            <p className="text-xs text-slate-400 mb-1 font-medium">Send this default message:</p>
            <div className="flex items-center gap-3">
              <code className="text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {WHATSAPP_SANDBOX_MESSAGE}
              </code>
              <ArrowRight size={16} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
