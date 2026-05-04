"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { motion } from "framer-motion";

export function StatsCard() {
  const { stats } = useCreatorStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-slate-800">Ringkasan Karyamu</h2>
        <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 border border-slate-200 rounded-full transition">Lihat Semua</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Total Template */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 hover:border-pink-200 transition-colors group">
          <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{stats.totalTemplates.toLocaleString()}</p>
            <p className="text-[10px] font-medium text-slate-500">Total Template</p>
          </div>
        </div>
        
        {/* Total Digunakan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 hover:border-pink-200 transition-colors group">
          <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{(stats.totalUses / 1000).toFixed(1)}K</p>
            <p className="text-[10px] font-medium text-slate-500">Total Digunakan</p>
          </div>
        </div>
        
        {/* Total Likes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 hover:border-pink-200 transition-colors group">
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{(stats.totalLikes / 1000).toFixed(1)}K</p>
            <p className="text-[10px] font-medium text-slate-500">Total Likes</p>
          </div>
        </div>
        
        {/* Total Download */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 hover:border-pink-200 transition-colors group">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{(stats.totalDownloads / 1000).toFixed(1)}K</p>
            <p className="text-[10px] font-medium text-slate-500">Total Download</p>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-auto bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <div className="w-8 h-8 bg-pink-50 text-pink-500 rounded-lg flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
         </div>
         <p className="text-[11px] text-slate-600 leading-relaxed">
           <span className="font-bold text-slate-800">Terus berkarya!</span> Template kamu sudah digunakan <span className="font-bold text-slate-800">{stats.totalUses.toLocaleString()} kali</span> 🎉
         </p>
      </div>
    </motion.div>
  );
}
