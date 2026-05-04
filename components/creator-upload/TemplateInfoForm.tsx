"use client";

import { useUploadStore } from "@/store/useUploadStore";

const CATEGORIES = ["Cute", "Minimal", "Vintage", "Elegant", "Fun", "Y2K", "Dark", "Birthday"];
const FRAME_COUNTS = [2, 3, 4, 6, 8];

export function TemplateInfoForm() {
  const { 
    name, setName, 
    categories, toggleCategory, 
    frameCount, setFrameCount, 
    description, setDescription 
  } = useUploadStore();

  return (
    <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 font-bold flex items-center justify-center text-sm">2</div>
        <h2 className="text-[17px] font-bold text-slate-800">Informasi Template</h2>
      </div>

      <div className="space-y-6">
        {/* Nama Template */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Nama Template <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Pink Coquette Ribbon"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    isSelected 
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-200 border-transparent' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-pink-300 hover:text-pink-500'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jumlah Frame */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Jumlah Frame <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {FRAME_COUNTS.map((count) => {
              const isSelected = frameCount === count;
              return (
                <button
                  key={count}
                  onClick={() => setFrameCount(count)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                    isSelected 
                      ? 'bg-pink-50 border-2 border-pink-500 text-pink-600' 
                      : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-pink-300'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Mengubah jumlah frame akan me-reset konfigurasi slot pada panel Auto Detect.</p>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi (Opsional)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan sedikit tentang template ini..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
