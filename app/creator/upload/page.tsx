"use client";

import { UploadHeader } from "@/components/creator-upload/UploadHeader";
import { UploadDropzone } from "@/components/creator-upload/UploadDropzone";
import { TemplateInfoForm } from "@/components/creator-upload/TemplateInfoForm";
import { TemplateSettings } from "@/components/creator-upload/TemplateSettings";
import { UploadPreviewPanel } from "@/components/creator-upload/UploadPreviewPanel";
import { SlotEditorModal } from "@/components/creator-upload/SlotEditorModal";
import { useUploadStore } from "@/store/useUploadStore";

export default function CreatorUploadPage() {
  const { file, name, categories, publishTemplate, isUploading } = useUploadStore();

  const handlePublish = async () => {
    if (!file || !name) {
      alert("Harap lengkapi file template dan nama template!");
      return;
    }

    if (categories.length === 0) {
      alert("Harap pilih setidaknya satu kategori!");
      return;
    }
    
    const success = await publishTemplate();
    if (success) {
      alert("Template berhasil dipublikasikan ke database!");
      // Here you would typically route them to the profile page or dashboard
    } else {
      alert("Gagal mempublikasikan template. Cek koneksi atau coba lagi.");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)] flex flex-col relative pb-32">
      <SlotEditorModal />
      
      <div className="mb-10">
        <UploadHeader />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* LEFT COLUMN: FORM */}
        <div className="flex-1 lg:max-w-[600px] xl:max-w-[700px] flex flex-col">
          <UploadDropzone />
          
          <div className={`transition-all duration-500 ${file ? 'opacity-100 max-h-[2000px]' : 'opacity-50 pointer-events-none max-h-0 overflow-hidden'}`}>
            <TemplateInfoForm />
            <TemplateSettings />
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="flex-1 hidden lg:block">
          <UploadPreviewPanel />
        </div>

      </div>

      {/* BOTTOM PUBLISH BAR */}
      {file && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 lg:px-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500 flex justify-center">
          <div className="max-w-[1400px] w-full flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Siap mempublikasikan karya?</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Pastikan detail informasi sudah benar sebelum upload.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                Simpan Draft
              </button>
              <button 
                onClick={handlePublish}
                disabled={isUploading}
                className={`px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-pink-200 transition flex items-center gap-2 ${
                  isUploading ? "bg-pink-300 text-white cursor-not-allowed" : "bg-pink-500 text-white hover:bg-pink-600 hover:-translate-y-0.5"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    Publikasikan Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Preview (Visible only on small screens below form) */}
      <div className="mt-8 lg:hidden block">
        {file && <UploadPreviewPanel />}
      </div>
      
    </div>
  );
}
