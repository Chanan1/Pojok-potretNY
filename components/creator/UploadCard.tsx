"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function UploadCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(236,72,153,0.08)] transition-all duration-300 group"
    >
      <h2 className="text-[17px] font-bold text-pink-600 mb-1">Buat Template Baru</h2>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">Upload desain template photobooth kamu<br/>dan bagikan ke semua pengguna.</p>
      
      <div className="flex-1 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/50 flex flex-col items-center justify-center p-6 mb-5 relative overflow-hidden group-hover:bg-pink-50 transition-colors">
        <div className="flex items-center gap-3 relative z-10 group-hover:scale-105 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
          <div className="text-left">
            <p className="font-bold text-pink-500 text-sm">Upload Template</p>
            <p className="text-[11px] text-pink-400/80">PNG, max 10MB</p>
          </div>
        </div>
        
        {/* Transparent link over the dashed area */}
        <Link href="/creator/upload" className="absolute inset-0 z-20" aria-label="Upload Template"></Link>
      </div>
      
      <Link 
        href="/creator/upload"
        className="w-full py-3.5 bg-pink-500 text-white rounded-xl font-bold text-sm text-center shadow-[0_8px_20px_rgba(236,72,153,0.25)] hover:bg-pink-600 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Mulai Buat Template <span className="text-lg leading-none mt-[-2px]">→</span>
      </Link>
    </motion.div>
  );
}
