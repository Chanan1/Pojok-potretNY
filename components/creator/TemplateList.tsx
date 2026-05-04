"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import Image from "next/image";
import { motion } from "framer-motion";

export function TemplateList() {
  const { templates } = useCreatorStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-slate-800">Template Terbaru</h2>
        <button className="text-[12px] font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors">
          Lihat Semua Template <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {templates.map((template, idx) => (
          <motion.div 
            key={template.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className="group relative"
          >
            <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-slate-100/80 shadow-sm group-hover:shadow-md transition duration-300">
              <Image 
                src={template.previewSrc} 
                alt={template.title} 
                fill 
                className="object-cover p-2 group-hover:scale-105 transition duration-500" 
              />
              
              {/* Top Left Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100/50">
                  <span className={`w-1.5 h-1.5 rounded-full ${template.status === "Dipublikasi" ? "bg-green-500" : "bg-slate-400"}`}></span>
                  {template.status}
                </span>
                {template.status === "Dipublikasi" && (
                  <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    {template.likes >= 1000 ? (template.likes/1000).toFixed(1) + 'K' : template.likes}
                  </span>
                )}
              </div>

              {/* Top Right Actions */}
              <div className="absolute top-3 right-3 z-10">
                <button className="w-6 h-6 bg-white/90 backdrop-blur-md text-slate-600 rounded-full flex items-center justify-center shadow-sm border border-slate-100/50 hover:bg-white hover:text-pink-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
