"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function UploadHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/creator"
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            Upload Template <span className="text-pink-500 text-xl">✨</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Bagikan desain terbaikmu ke komunitas</p>
        </div>
      </div>
      
      <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2 w-max">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        Butuh bantuan?
      </button>
    </div>
  );
}
