"use client";

import { useUploadStore } from "@/store/useUploadStore";

const PRESET_COLORS = ["transparent", "#ffffff", "#000000", "#fdf2f8", "#f0fdf4", "#eff6ff", "#fef3c7"];

export function TemplateSettings() {
  const { 
    backgroundColor, setBackgroundColor,
    margin, setMargin,
    borderRadius, setBorderRadius,
    isPublic, setIsPublic
  } = useUploadStore();

  return (
    <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 font-bold flex items-center justify-center text-sm">3</div>
        <h2 className="text-[17px] font-bold text-slate-800">Pengaturan Template</h2>
      </div>

      <div className="space-y-6">
        {/* Background Color */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Background Color</label>
          <div className="flex flex-wrap gap-2 items-center">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  backgroundColor === color ? 'border-pink-500 scale-110' : 'border-slate-200 hover:scale-105'
                } ${color === 'transparent' ? 'bg-[url("/checkerboard.png")] bg-center bg-cover' : ''}`}
                style={color !== 'transparent' ? { backgroundColor: color } : {}}
                title={color}
              />
            ))}
            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
            <div className="relative">
              <input 
                type="color" 
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
              />
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Margin */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700">Margin</label>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{margin}px</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        {/* Border Radius */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700">Border Radius (Frame)</label>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{borderRadius}px</span>
          </div>
          <input 
            type="range" 
            min="0" max="50" 
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className="h-[1px] bg-slate-100 w-full my-4"></div>

        {/* Template Publik Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Template Publik</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Izinkan pengguna lain memakai template ini</p>
          </div>
          <button 
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isPublic ? 'bg-pink-500' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
}
