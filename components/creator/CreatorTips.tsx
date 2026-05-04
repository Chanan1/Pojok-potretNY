"use client";

import { motion } from "framer-motion";

export function CreatorTips() {
  const tips = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
      desc: "Gunakan resolusi tinggi (min. 1080px) agar hasil template lebih tajam."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      desc: "Pastikan area foto tidak tertutup elemen penting."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
      desc: "Buat tema yang konsisten dan unik."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
      desc: "Lihat panduan lengkap membuat template.",
      isLink: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[17px] font-bold text-slate-800">Tips Creator</h2>
        <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 border border-slate-200 rounded-full transition">Lihat Semua</button>
      </div>

      <div className="space-y-6 flex-1">
        {tips.map((tip, idx) => (
          <div key={idx} className={`flex gap-4 items-start transition ${tip.isLink ? 'cursor-pointer group' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center shrink-0 border border-rose-100/50 mt-1">
              {tip.icon}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <p className={`text-[12px] leading-relaxed ${tip.isLink ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                {tip.desc}
              </p>
              {tip.isLink && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400 group-hover:translate-x-1 transition-transform ml-2"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
