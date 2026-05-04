"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadStore } from "@/store/useUploadStore";

export function UploadDropzone() {
  const { file, setFile, frameCount, setIsSlotEditorOpen } = useUploadStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };


  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== "image/png") {
      alert("Hanya file PNG yang diperbolehkan.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB.");
      return;
    }
    
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile, url);

    // Detect image dimensions
    const img = new window.Image();
    img.onload = () => {
      useUploadStore.getState().setTemplateDimensions(img.naturalWidth, img.naturalHeight);
    };
    img.src = url;
  };

  return (
    <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 font-bold flex items-center justify-center text-sm">1</div>
        <h2 className="text-[17px] font-bold text-slate-800">Upload Template</h2>
      </div>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative w-full aspect-[2/1] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300
              ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-pink-300'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png" 
              className="hidden" 
            />
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-pink-100 text-pink-500' : 'bg-white text-slate-400 shadow-sm'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
            </div>
            
            <p className="text-sm font-bold text-slate-700 mb-1">Drag & drop file PNG di sini</p>
            <p className="text-[11px] text-slate-500 text-center">atau klik untuk memilih file dari komputer<br/>PNG max 10MB, disarankan 1080x1920px</p>
          </motion.div>
        ) : (
          <motion.div
            key="detected-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden"
          >
            {/* Success badge */}
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              Terdeteksi
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs mb-1">{file.name}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {useUploadStore.getState().templateDimensions && (
                    <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                      {useUploadStore.getState().templateDimensions?.width}x{useUploadStore.getState().templateDimensions?.height}px
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    {frameCount} Frame
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2"/></svg>
                    Portrait
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex gap-3">
              <button 
                onClick={() => setIsSlotEditorOpen(true)}
                className="flex-1 py-2.5 bg-pink-500 text-white rounded-xl text-xs font-bold hover:bg-pink-600 transition shadow-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                Edit Slot (Magic Wand)
              </button>
              <button 
                onClick={() => setFile(null, null)}
                className="px-4 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-slate-700 transition"
              >
                Ganti File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
