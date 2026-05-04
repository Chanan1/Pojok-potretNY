"use client";

import { useUploadStore } from "@/store/useUploadStore";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export function UploadPreviewPanel() {
  const { previewUrl, slots, backgroundColor, margin, borderRadius } = useUploadStore();
  const [zoom, setZoom] = useState(1);

  if (!previewUrl) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-8 text-center sticky top-24">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Preview Template</h3>
        <p className="text-sm text-slate-500 max-w-[250px]">Upload file PNG di panel sebelah kiri untuk melihat preview real-time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] lg:h-[calc(100vh-140px)] rounded-[32px] bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col sticky top-24">
      {/* Header Controls */}
      <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-20 relative">
        <h3 className="text-sm font-bold text-slate-800">Preview</h3>
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
          </button>
          <span className="text-xs font-bold w-10 text-center text-slate-600">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-50/50 bg-[url('/checkerboard.png')] bg-center overflow-auto flex items-center justify-center p-8 relative">
        <motion.div 
          className="relative shadow-2xl transition-all duration-300 ease-out"
          style={{ 
            scale: zoom,
            backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
            padding: `${margin}px`,
            borderRadius: `${borderRadius}px`,
            width: '240px', // base aspect ratio 2:3 approx
            height: '360px',
          }}
        >
          {/* Dummy Photos matching slots */}
          {slots.map((slot, index) => (
            <div 
              key={slot.id}
              className="absolute bg-slate-200 overflow-hidden"
              style={{
                left: `calc(${margin}px + ${slot.x}% * ((100% - ${margin*2}px) / 100))`,
                top: `calc(${margin}px + ${slot.y}% * ((100% - ${margin*2}px) / 100))`,
                width: `calc(${slot.width}% * ((100% - ${margin*2}px) / 100))`,
                height: `calc(${slot.height}% * ((100% - ${margin*2}px) / 100))`,
              }}
            >
              <Image 
                src={`https://i.pravatar.cc/300?u=photo${index}`} 
                alt={`dummy ${index}`} 
                fill 
                className="object-cover"
              />
            </div>
          ))}

          {/* Foreground Template Image */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{ padding: `${margin}px` }}>
             <Image 
               src={previewUrl} 
               alt="Template" 
               fill 
               className="object-fill rounded-sm"
               style={{ padding: `${margin}px` }}
             />
          </div>
        </motion.div>
      </div>
      
      {/* Footer Info */}
      <div className="h-12 bg-white border-t border-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-400">
        Live Preview Mode • {slots.length} Frame Detected
      </div>
    </div>
  );
}
