"use client";

import { motion } from "framer-motion";

export function TemplateManagerCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="bg-purple-50/40 rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-purple-100/60 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)] transition-all duration-300 group overflow-hidden relative"
    >
      <h2 className="text-[17px] font-bold text-purple-700 mb-1 z-10">Kelola Karya Saya</h2>
      <p className="text-xs text-purple-600/70 mb-auto max-w-[150px] leading-relaxed z-10">Lihat, edit, dan kelola semua template yang sudah kamu buat.</p>
      
      {/* Decorative CSS Folder Illustration */}
      <div className="absolute right-0 bottom-12 w-32 h-28 transform translate-x-4 translate-y-4 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
         <div className="absolute bottom-0 right-0 w-24 h-16 bg-purple-300 rounded-xl rounded-tr-sm"></div>
         <div className="absolute top-2 right-4 w-16 h-20 bg-white rounded-lg shadow-sm border border-purple-100 p-1.5 transform -rotate-6">
            <div className="w-full h-10 bg-purple-100 rounded flex items-center justify-center mb-1.5"><span className="text-[14px]">🐶</span></div>
            <div className="w-full h-1 bg-purple-50 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-purple-50 rounded-full"></div>
         </div>
         <div className="absolute bottom-0 right-0 w-[110px] h-[60px] bg-gradient-to-tr from-purple-500 to-purple-400 rounded-xl rounded-tl-sm shadow-md transform rotate-2 origin-bottom-right z-10 flex flex-col items-center justify-center gap-1.5">
             <div className="w-8 h-1 bg-white/40 rounded-full"></div>
             <div className="w-4 h-1 bg-white/40 rounded-full"></div>
         </div>
      </div>
      
      <button className="mt-12 w-max px-6 py-2.5 bg-purple-100/80 text-purple-600 rounded-xl font-bold text-sm text-center hover:bg-purple-200 hover:-translate-y-0.5 transition-all duration-300 z-10 flex items-center gap-2">
        Lihat Karya Saya <span className="text-lg leading-none mt-[-2px]">→</span>
      </button>
    </motion.div>
  );
}
