"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { EditorTemplate } from "@/store/useEditorStore";
import { useState, useRef, useEffect } from "react";
import { MagicWandEditor } from "./MagicWandEditor";

const COLORS = ["#ffffff", "#fdf6f9", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#1e293b", "#0f172a"];

export function EditorRightPanel() {
  const { 
    activeEditorTab, setActiveEditorTab,
    template, setTemplate,
    backgroundColor, setBackgroundColor,
    photos,
    slots, updateSlotFilter,
    activeElementId,
    addText, updateText, addSticker,
    removeText, removeSticker,
    texts, stickers,
    setCustomSlots
  } = useEditorStore();

  const [textInput, setTextInput] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadedTemplateSrc, setUploadedTemplateSrc] = useState<string | null>(null);
  const [uploadFileKey, setUploadFileKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeEditorTab) return null;

  const renderContent = () => {
    switch (activeEditorTab) {
      case "layout":
        if (template) {
          return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Layout dikendalikan oleh template (Frame Mode). Hapus template untuk menggunakan grid/strip otomatis.</p>
              <button 
                onClick={() => setTemplate(null)}
                className="mt-3 text-xs font-bold text-pink-500 hover:underline"
              >
                Kembali ke Free Mode
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Pilih susunan grid untuk mode bebas.</p>
            {/* Simulation of layout changes by just resetting fallback slots */}
            <button className="w-full rounded border p-3 text-sm font-bold bg-pink-50 text-pink-600 border-pink-200">Strip Layout</button>
          </div>
        );

      case "warna":
        if (template) {
          return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Warna background disembunyikan karena kamu sedang menggunakan sebuah template PNG.</p>
            </div>
          );
        }
        return (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2">Warna Cepat</p>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBackgroundColor(c)}
                    className={`h-10 w-full rounded-xl border-2 transition-all ${backgroundColor === c ? "border-pink-500 scale-105 shadow-md" : "border-slate-100 hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Custom Color Picker for Background */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2">🎨 Warna Kustom</p>
              <div className="relative overflow-hidden rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 via-blue-200 to-purple-200 p-[2px] transition hover:shadow-lg hover:shadow-pink-100">
                <div className="flex items-center gap-3 rounded-[14px] bg-white px-3 py-2.5">
                  <div
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-slate-200 shadow-inner"
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700">Pilih Warna Bebas</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{backgroundColor}</p>
                  </div>
                  <span className="text-lg">🌈</span>
                </div>
                <input
                  type="color"
                  value={backgroundColor.startsWith('#') ? backgroundColor : '#ffffff'}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        );

      case "filter":
        const activeSlotIndex = activeElementId?.startsWith('slot-') ? parseInt(activeElementId.replace('slot-', '')) : null;
        
        if (activeSlotIndex !== null && slots[activeSlotIndex]) {
          const filter = slots[activeSlotIndex].filter;
          const photoSrc = photos[slots[activeSlotIndex].photoIndex];
          
          const PRESETS = [
            { name: "Normal", filter: { brightness: 100, contrast: 100, saturation: 100, sharpness: 0, sepia: 0, blur: 0 } },
            { name: "Bright", filter: { brightness: 115, contrast: 105, saturation: 110, sharpness: 0, sepia: 0, blur: 0 } },
            { name: "Warm", filter: { brightness: 105, contrast: 100, saturation: 110, sharpness: 0, sepia: 30, blur: 0 } },
            { name: "Soft", filter: { brightness: 110, contrast: 90, saturation: 90, sharpness: 0, sepia: 0, blur: 0.5 } },
            { name: "Vintage", filter: { brightness: 90, contrast: 110, saturation: 70, sharpness: 0, sepia: 50, blur: 0 } },
            { name: "B&W", filter: { brightness: 100, contrast: 120, saturation: 0, sharpness: 0, sepia: 0, blur: 0 } },
            { name: "Moody", filter: { brightness: 80, contrast: 120, saturation: 80, sharpness: 0, sepia: 0, blur: 0 } },
            { name: "Dreamy", filter: { brightness: 120, contrast: 90, saturation: 110, sharpness: 0, sepia: 0, blur: 1 } },
          ];

          return (
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <h4 className="font-bold text-slate-800 text-base mb-3 font-serif tracking-wide">Filters</h4>
                <div className="grid grid-cols-4 gap-3">
                  {PRESETS.map((p) => {
                    // Check if current filter approximately matches this preset (simple logic)
                    const isActive = 
                      Math.abs(filter.brightness - p.filter.brightness) < 5 &&
                      Math.abs(filter.contrast - p.filter.contrast) < 5 &&
                      Math.abs(filter.saturation - p.filter.saturation) < 5 &&
                      Math.abs(filter.sepia - p.filter.sepia) < 5;

                    return (
                      <button
                        key={p.name}
                        onClick={() => updateSlotFilter(activeSlotIndex, p.filter)}
                        className="flex flex-col items-center gap-1.5 transition group"
                      >
                        <div className={`aspect-square w-full rounded-2xl p-0.5 transition-all ${isActive ? "bg-gradient-to-tr from-pink-400 to-pink-600" : "bg-transparent group-hover:bg-pink-200"}`}>
                          <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={photoSrc} 
                              alt={p.name} 
                              className="w-full h-full object-cover"
                              style={{ 
                                filter: `brightness(${p.filter.brightness}%) contrast(${p.filter.contrast}%) saturate(${p.filter.saturation}%) sepia(${p.filter.sepia}%) blur(${p.filter.blur}px)` 
                              }}
                            />
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold ${isActive ? "text-pink-500" : "text-slate-500"}`}>{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="h-px w-full bg-slate-100" />

              {/* Edit Dasar */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">Edit Dasar</h4>
                  <button 
                    onClick={() => updateSlotFilter(activeSlotIndex, PRESETS[0].filter)}
                    className="text-[11px] font-bold text-slate-500 hover:text-pink-500 transition"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Brightness */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Kecerahan</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="50" max="150" value={filter.brightness} onChange={(e) => updateSlotFilter(activeSlotIndex, { brightness: Number(e.target.value) })} className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {filter.brightness - 100}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contrast */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Kontras</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="50" max="150" value={filter.contrast} onChange={(e) => updateSlotFilter(activeSlotIndex, { contrast: Number(e.target.value) })} className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {filter.contrast - 100}
                      </div>
                    </div>
                  </div>
                  
                  {/* Saturation */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Saturasi</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="200" value={filter.saturation} onChange={(e) => updateSlotFilter(activeSlotIndex, { saturation: Number(e.target.value) })} className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {filter.saturation - 100}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sharpness */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Ketajaman</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" value={filter.sharpness} onChange={(e) => updateSlotFilter(activeSlotIndex, { sharpness: Number(e.target.value) })} className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {filter.sharpness}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed text-slate-400">
                Filter hanya memengaruhi foto di dalam frame. Background template, warna canvas, teks, dan stiker tetap aman.
              </p>

              <div className="h-px w-full bg-slate-100" />

              {/* Swap Photo Section */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 font-serif tracking-wide">Tukar Posisi Foto</h4>
                <div className="space-y-2">
                  {slots.map((slot, i) => {
                    const pSrc = photos[slot.photoIndex];
                    const isCurrent = i === activeSlotIndex;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition ${isCurrent ? 'border-pink-400 bg-pink-50' : 'border-slate-100 bg-white hover:border-pink-200'}`}
                      >
                        {/* Photo thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {pSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pSrc} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300">?</div>
                          )}
                        </div>
                        
                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-bold ${isCurrent ? 'text-pink-600' : 'text-slate-600'}`}>
                            Frame {i + 1}
                          </p>
                          <p className="text-[9px] text-slate-400">Foto #{slot.photoIndex + 1}</p>
                        </div>

                        {/* Swap button */}
                        {!isCurrent && (
                          <button
                            onClick={() => useEditorStore.getState().swapSlotPhotos(activeSlotIndex, i)}
                            className="px-2.5 py-1.5 bg-pink-50 border border-pink-200 text-pink-600 rounded-lg text-[10px] font-bold hover:bg-pink-100 transition flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                            Tukar
                          </button>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-bold text-pink-500 px-2">Aktif</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-400">Pilih salah satu foto di area preview untuk mengatur filternya secara individual.</p>
          </div>
        );

      case "template":
        return <TemplatePicker photos={photos} template={template} setTemplate={setTemplate} />;

      case "upload":
        // If we have an uploaded image pending magic wand editing
        if (uploadedTemplateSrc) {
          return (
            <MagicWandEditor
              imageSrc={uploadedTemplateSrc}
              onApply={async (editedSrc) => {
                // Auto-detect transparent regions as slots
                const { detectTransparentSlots } = await import("@/lib/detect-slots");
                const detectedSlots = await detectTransparentSlots(editedSrc, photos.length || 8);
                
                // Create custom template
                const customTemplate = {
                  id: `custom-${Date.now()}`,
                  name: "Template Kustom",
                  src: editedSrc,
                  frameCount: detectedSlots.length || photos.length,
                  slots: detectedSlots.length > 0
                    ? detectedSlots
                    : (() => {
                        // Fallback: generate evenly spaced slots if detection fails
                        const ph = photos.length || 4;
                        const hPerSlot = Math.min(80 / ph, 30);
                        const fallback = [];
                        for (let i = 0; i < ph; i++) {
                          fallback.push({ x: 20, y: 10 + i * (hPerSlot + 2), width: 60, height: hPerSlot });
                        }
                        return fallback;
                      })(),
                };
                
                setTemplate(customTemplate);
                setUploadedTemplateSrc(null);
              }}
              onCancel={() => setUploadedTemplateSrc(null)}
            />
          );
        }

        return (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">Upload Template</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Unggah template PNG/WEBP kustom dan gunakan Magic Wand untuk menghapus area frame menjadi transparan.</p>
            </div>

            {/* Upload Zone */}
            <div className="relative rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 p-6 text-center hover:border-pink-400 hover:bg-pink-50 transition group">
              <input
                key={uploadFileKey}
                type="file"
                accept="image/png,image/webp,image/jpeg"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (typeof ev.target?.result === 'string') {
                      setUploadedTemplateSrc(ev.target.result);
                    }
                  };
                  reader.readAsDataURL(file);
                  setUploadFileKey(k => k + 1);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="mb-3 text-3xl group-hover:-translate-y-1 transition-transform">📤</div>
              <p className="text-sm font-bold text-slate-700">Unggah Template</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG / WEBP / JPG • Ukuran bebas</p>
              <div className="mt-3 inline-block px-5 py-2 bg-pink-500 text-white rounded-full text-xs font-bold shadow-md">
                Pilih File
              </div>
            </div>

            {/* Current custom template info */}
            {template?.id?.startsWith('custom') && (
              <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-xl bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/8px_8px] overflow-hidden border border-pink-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={template.src} alt="Custom template" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">Template Kustom</p>
                    <p className="text-[10px] text-slate-400">Sedang digunakan</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUploadedTemplateSrc(template.src);
                    }}
                    className="flex-1 py-2 bg-white border border-pink-200 text-pink-600 rounded-xl font-bold text-xs hover:bg-pink-50 transition flex items-center justify-center gap-1.5"
                  >
                    ✨ Edit Magic Wand
                  </button>
                  <button
                    onClick={() => setTemplate(null)}
                    className="flex-1 py-2 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition flex items-center justify-center gap-1.5"
                  >
                    🗑️ Hapus Template
                  </button>
                </div>
              </div>
            )}

            <div className="h-px w-full bg-slate-100" />

            {/* How it works */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-600">Cara Kerja</p>
              <div className="space-y-2">
                {[
                  { icon: "1️⃣", text: "Upload template berupa gambar frame" },
                  { icon: "2️⃣", text: "Gunakan Magic Wand untuk klik & hapus area berwarna" },
                  { icon: "3️⃣", text: "Area transparan akan menjadi slot untuk foto" },
                  { icon: "4️⃣", text: "Klik 'Terapkan Template' jika sudah selesai" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                    <span className="text-sm">{step.icon}</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Template kustom bersifat sementara dan akan hilang saat halaman di-refresh. Tidak disimpan di server.
              </p>
            </div>
          </div>
        );

      case "teks":
        const activeTextId = activeElementId?.startsWith('text-') ? activeElementId.replace('text-', '') : null;
        
        if (activeTextId) {
          const textElement = texts.find(t => t.id === activeTextId);
          if (textElement) {
            return (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">Edit Teks</h4>
                  <button onClick={() => removeText(activeTextId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Teks</label>
                    <input 
                      type="text" 
                      value={textElement.text} 
                      onChange={(e) => updateText(activeTextId, { text: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                      placeholder="Masukkan teks..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Gaya Font</label>
                    <select 
                      value={textElement.fontFamily}
                      onChange={(e) => updateText(activeTextId, { fontFamily: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-pink-400 transition"
                    >
                      <option value="sans-serif">Modern (Sans)</option>
                      <option value="serif">Klasik (Serif)</option>
                      <option value="monospace">Mesin Tik</option>
                      <option value="'Comic Sans MS', cursive, sans-serif">Kartun (Comic)</option>
                      <option value="'Brush Script MT', cursive">Tulisan Tangan</option>
                      <option value="Impact, fantasy">Tebal (Impact)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Warna Cepat</label>
                    <div className="flex flex-wrap gap-2">
                      {["#0f172a", "#ffffff", "#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateText(activeTextId, { color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${textElement.color === color ? 'border-pink-500 scale-110 shadow-md' : 'border-slate-200'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Picker for Text */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">🎨 Warna Kustom</label>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 via-blue-200 to-purple-200 p-[2px] transition hover:shadow-lg hover:shadow-pink-100">
                      <div className="flex items-center gap-3 rounded-[14px] bg-white px-3 py-2">
                        <div
                          className="h-7 w-7 shrink-0 rounded-full border-2 border-slate-200 shadow-inner"
                          style={{ backgroundColor: textElement.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-700">Pilih Warna Bebas</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">{textElement.color}</p>
                        </div>
                        <span className="text-base">🌈</span>
                      </div>
                      <input
                        type="color"
                        value={textElement.color}
                        onChange={(e) => updateText(activeTextId, { color: e.target.value })}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Ukuran</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="5" 
                        step="0.1" 
                        value={textElement.scale} 
                        onChange={(e) => updateText(activeTextId, { scale: Number(e.target.value) })} 
                        className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {Math.round(textElement.scale * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500">Rotasi</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="-180" 
                        max="180" 
                        value={textElement.rotation} 
                        onChange={(e) => updateText(activeTextId, { rotation: Number(e.target.value) })} 
                        className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="w-10 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                        {textElement.rotation}°
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 text-base mb-3 font-serif tracking-wide">Elemen Teks</h4>
              <p className="text-xs text-slate-500 mb-4">Tambahkan teks ke hasil fotomu. Anda bisa menggeser teks langsung di area pratinjau.</p>
              
              <button 
                onClick={() => addText({ text: "Teks Baru", x: 50, y: 50, scale: 1, rotation: 0, color: "#ec4899", fontFamily: "sans-serif" })} 
                className="w-full py-3 bg-pink-50 border-2 border-dashed border-pink-300 text-pink-600 rounded-2xl font-bold text-sm hover:bg-pink-100 hover:border-pink-400 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                + Tambah Teks
              </button>
            </div>
            
            <div className="h-px w-full bg-slate-100" />
            
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-[11px] text-slate-400">Klik salah satu teks yang ada di area preview untuk mengubah gaya font, ukuran, dan warnanya.</p>
            </div>
          </div>
        );

      case "stiker":
        // Sticker categories and items from public/stiker
        const STICKER_CATEGORIES: Record<string, { label: string; stickers: { src: string; name: string }[] }> = {
          semua: { label: "Semua", stickers: [] },
          animals: { label: "Animals", stickers: [
            { src: "/stiker/Animals/bear.png", name: "Bear" },
            { src: "/stiker/Animals/rabbit.png", name: "Rabbit" },
            { src: "/stiker/Animals/panda-bear.png", name: "Panda" },
            { src: "/stiker/Animals/fox.png", name: "Fox" },
            { src: "/stiker/Animals/flamingo.png", name: "Flamingo" },
            { src: "/stiker/Animals/lion.png", name: "Lion" },
            { src: "/stiker/Animals/raccoon.png", name: "Raccoon" },
            { src: "/stiker/Animals/hedgehog.png", name: "Hedgehog" },
            { src: "/stiker/Animals/cow.png", name: "Cow" },
            { src: "/stiker/Animals/elephant.png", name: "Elephant" },
            { src: "/stiker/Animals/horse.png", name: "Horse" },
            { src: "/stiker/Animals/sheep.png", name: "Sheep" },
            { src: "/stiker/Animals/zebra.png", name: "Zebra" },
            { src: "/stiker/Animals/buffalo.png", name: "Buffalo" },
            { src: "/stiker/Animals/crocodile.png", name: "Crocodile" },
            { src: "/stiker/Animals/hippopotamus.png", name: "Hippo" },
          ]},
          love: { label: "Love", stickers: [
            { src: "/stiker/Love/love.png", name: "Love" },
            { src: "/stiker/Love/love-letter.png", name: "Love Letter" },
            { src: "/stiker/Love/love-message.png", name: "Love Msg" },
            { src: "/stiker/Love/i-love-you.png", name: "I Love You" },
            { src: "/stiker/Love/be-mine.png", name: "Be Mine" },
            { src: "/stiker/Love/coffee-cup.png", name: "Coffee" },
            { src: "/stiker/Love/chocolate-box.png", name: "Chocolate" },
            { src: "/stiker/Love/cookies.png", name: "Cookies" },
            { src: "/stiker/Love/cassette-tape.png", name: "Cassette" },
            { src: "/stiker/Love/stamp.png", name: "Stamp" },
            { src: "/stiker/Love/valentines-day.png", name: "Valentine" },
            { src: "/stiker/Love/you-have-the-key.png", name: "Key" },
            { src: "/stiker/Love/i-love-you (1).png", name: "Love 2" },
          ]},
          days: { label: "Days", stickers: [
            { src: "/stiker/Days/monday.png", name: "Monday" },
            { src: "/stiker/Days/tuesday.png", name: "Tuesday" },
            { src: "/stiker/Days/wednesday.png", name: "Wednesday" },
            { src: "/stiker/Days/thursday.png", name: "Thursday" },
            { src: "/stiker/Days/friday.png", name: "Friday" },
            { src: "/stiker/Days/saturday.png", name: "Saturday" },
            { src: "/stiker/Days/sunday.png", name: "Sunday" },
          ]},
          month: { label: "Month", stickers: [
            { src: "/stiker/Month/january.png", name: "January" },
            { src: "/stiker/Month/february.png", name: "February" },
            { src: "/stiker/Month/march.png", name: "March" },
            { src: "/stiker/Month/april.png", name: "April" },
            { src: "/stiker/Month/may.png", name: "May" },
            { src: "/stiker/Month/june.png", name: "June" },
            { src: "/stiker/Month/july.png", name: "July" },
            { src: "/stiker/Month/august.png", name: "August" },
            { src: "/stiker/Month/september.png", name: "September" },
            { src: "/stiker/Month/october.png", name: "October" },
            { src: "/stiker/Month/november.png", name: "November" },
            { src: "/stiker/Month/december.png", name: "December" },
          ]},
        };

        // Build "semua" from all categories
        STICKER_CATEGORIES.semua.stickers = [
          ...STICKER_CATEGORIES.love.stickers.slice(0, 4),
          ...STICKER_CATEGORIES.animals.stickers.slice(0, 4),
          ...STICKER_CATEGORIES.days.stickers.slice(0, 2),
          ...STICKER_CATEGORIES.month.stickers.slice(0, 2),
        ];

        const activeStickerRawId = activeElementId?.startsWith('sticker-') ? activeElementId.replace('sticker-', '') : null;
        const activeSticker = activeStickerRawId ? stickers.find(s => s.id === activeStickerRawId) : null;

        // If a sticker is selected, show the settings panel
        if (activeSticker && activeStickerRawId) {
          const stickerId = activeStickerRawId;
          const stickerName = activeSticker.name || activeSticker.src.split('/').pop()?.replace('.png', '') || 'Stiker';
          return (
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">Pengaturan Stiker</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Atur tampilan stiker yang dipilih</p>
              </div>

              {/* Sticker Preview Card */}
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl border border-pink-100">
                <div className="w-14 h-14 rounded-xl bg-white border border-pink-100 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeSticker.src} alt={stickerName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{stickerName}</p>
                  <p className="text-[10px] text-slate-400">Stiker</p>
                </div>
                <button 
                  onClick={() => removeSticker(stickerId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Hapus Stiker"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              {/* Ukuran */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500">Ukuran</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="20" max="300" 
                    value={Math.round(activeSticker.scale * 100)} 
                    onChange={(e) => useEditorStore.getState().updateSticker(stickerId, { scale: Number(e.target.value) / 100 })} 
                    className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="w-14 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                    {Math.round(activeSticker.scale * 100)}%
                  </div>
                </div>
              </div>

              {/* Rotasi */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500">Rotasi</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="-180" max="180" 
                    value={activeSticker.rotation} 
                    onChange={(e) => useEditorStore.getState().updateSticker(stickerId, { rotation: Number(e.target.value) })} 
                    className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="w-14 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                    {activeSticker.rotation}°
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500">Opacity</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="10" max="100" 
                    value={activeSticker.opacity ?? 100} 
                    onChange={(e) => useEditorStore.getState().updateSticker(stickerId, { opacity: Number(e.target.value) })} 
                    className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="w-14 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
                    {activeSticker.opacity ?? 100}%
                  </div>
                </div>
              </div>

              {/* Flip */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500">Flip</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => useEditorStore.getState().updateSticker(stickerId, { flipX: !activeSticker.flipX })}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition ${activeSticker.flipX ? 'bg-pink-50 border-pink-300 text-pink-600' : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 23 7 1"/><polyline points="21 12 17 8 17 16 21 12"/><polyline points="3 12 7 8 7 16 3 12"/></svg>
                    Horizontal
                  </button>
                  <button 
                    onClick={() => useEditorStore.getState().updateSticker(stickerId, { flipY: !activeSticker.flipY })}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition ${activeSticker.flipY ? 'bg-pink-50 border-pink-300 text-pink-600' : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:'rotate(90deg)'}}><polyline points="7 23 7 1"/><polyline points="21 12 17 8 17 16 21 12"/><polyline points="3 12 7 8 7 16 3 12"/></svg>
                    Vertical
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100" />

              {/* Delete Button */}
              <button 
                onClick={() => removeSticker(stickerId)}
                className="w-full py-3 bg-red-50 border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Hapus Stiker
              </button>

              {/* Tips */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2">
                <span className="text-base">🌿</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <strong>Tips:</strong> Klik stiker di area preview untuk memilihnya. Gunakan drag di sudut untuk memperbesar / memperkecil.
                </p>
              </div>
            </div>
          );
        }

        // Sticker browser view (no sticker selected)
        return (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">Stiker</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Tambahkan stiker untuk mempercantik fotomu</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 pb-2">
              {Object.entries(STICKER_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => useEditorStore.getState().setActiveElementId(`cat-${key}`)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                    (activeElementId === `cat-${key}` || (!activeElementId?.startsWith('cat-') && key === 'semua'))
                      ? 'bg-pink-500 text-white shadow-md' 
                      : 'bg-pink-50 text-slate-500 hover:bg-pink-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2">Stiker Bawaan</p>
              <div className="grid grid-cols-4 gap-2">
                {(() => {
                  const activeCategory = Object.keys(STICKER_CATEGORIES).find(k => activeElementId === `cat-${k}`);
                  const catKey = activeCategory || 'semua';
                  const stickerList = STICKER_CATEGORIES[catKey]?.stickers || [];
                  return stickerList.map((st, i) => (
                    <button
                      key={`${catKey}-${i}`}
                      onClick={() => addSticker({ src: st.src, name: st.name, x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, scale: 1, rotation: 0, opacity: 100, flipX: false, flipY: false })}
                      className="aspect-square rounded-2xl border border-slate-100 bg-white hover:border-pink-300 hover:shadow-md hover:scale-105 transition-all p-2 flex items-center justify-center group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={st.src} alt={st.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    </button>
                  ));
                })()}
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Upload Custom Sticker */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2">Upload Stiker Sendiri</p>
              <div className="relative rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 p-5 text-center hover:border-pink-400 hover:bg-pink-50 transition group">
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (typeof ev.target?.result === 'string') {
                        addSticker({ src: ev.target.result, name: file.name.replace(/\.\w+$/, ''), x: 50, y: 50, scale: 1, rotation: 0, opacity: 100, flipX: false, flipY: false });
                      }
                    };
                    reader.readAsDataURL(file);
                    setFileInputKey(k => k + 1);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="mb-2 text-2xl group-hover:-translate-y-1 transition-transform">✨</div>
                <p className="text-xs font-bold text-slate-700">Upload Stiker Sendiri</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG / WEBP dengan latar belakang transparan</p>
                <div className="mt-3 inline-block px-4 py-1.5 bg-pink-500 text-white rounded-full text-[11px] font-bold">
                  Pilih File
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-xs text-slate-400 text-center py-8">Pilih menu di samping.</p>;
    }
  };

  return (
    <div className="h-full w-full bg-white p-5 overflow-y-auto pb-24">
      <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pt-1 pb-3 border-b border-slate-100">
        <h3 className="text-lg font-bold capitalize text-slate-900">{activeEditorTab}</h3>
        <button onClick={() => setActiveEditorTab(null)} className="text-slate-400 hover:text-slate-700">✕</button>
      </div>
      {renderContent()}
    </div>
  );
}

/**
 * TemplatePicker — Fetches templates from the API and displays them in a grid.
 * Falls back to PREDEFINED_TEMPLATES if the API fails.
 */
function TemplatePicker({ photos, template, setTemplate }: {
  photos: string[];
  template: EditorTemplate | null;
  setTemplate: (t: EditorTemplate | null) => void;
}) {
  const [apiTemplates, setApiTemplates] = useState<EditorTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTemplates() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch from API
        const { fetchTemplates } = await import("@/lib/api-client");
        const res = await fetchTemplates({
          frameCount: photos.length || undefined,
          limit: 50,
        });

        if (res.success && res.data && isActive) {
          // Import predefined for fallback matching
          const { PREDEFINED_TEMPLATES } = await import("@/lib/templates");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = res.data.map((t: any) => {
            const apiSlots = typeof t.slots === "string" ? JSON.parse(t.slots) : (t.slots || []);
            
            // If API has no slots, try to find a match in our library by image path
            let finalSlots = apiSlots;
            if (!Array.isArray(apiSlots) || apiSlots.length === 0) {
              const match = PREDEFINED_TEMPLATES.find(pt => pt.src === t.src);
              if (match) finalSlots = match.slots;
            }

            return {
              id: t.id,
              name: t.name,
              src: t.src,
              frameCount: t.frameCount,
              slots: Array.isArray(finalSlots) ? finalSlots : [],
            };
          });
          setApiTemplates(mapped);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch templates from API:", err);
      }

      // 2. Fallback to predefined templates
      try {
        const { PREDEFINED_TEMPLATES } = await import("@/lib/templates");
        if (isActive) {
          const filtered = PREDEFINED_TEMPLATES.filter(t => t.frameCount === photos.length);
          setApiTemplates(filtered);
        }
      } catch (err) {
        if (isActive) setError("Gagal memuat template.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadTemplates();
    return () => { isActive = false; };
  }, [photos.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
        <p className="text-xs text-slate-400">Memuat template...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Pilih template untuk {photos.length} frame fotomu.</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTemplate(null)}
          className={`flex flex-col items-center gap-2 transition-all ${!template ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
        >
          <div className={`flex w-full aspect-[3/4] items-center justify-center rounded-2xl border-2 border-dashed bg-pink-50 ${!template ? "border-pink-500 text-pink-500" : "border-slate-200 text-slate-400 hover:border-pink-300"}`}>
            <span className="text-xs font-bold">Tanpa Template</span>
          </div>
        </button>

        {apiTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t)}
            className={`flex flex-col items-center gap-2 transition-all group ${template?.id === t.id ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
          >
            <div className={`relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-pink-50/50 p-2 transition-all ${template?.id === t.id ? "ring-2 ring-pink-500 ring-offset-2" : "group-hover:bg-pink-100/50"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt={t.name || 'template'} className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
            <p className={`text-[10px] text-center font-bold px-1 leading-tight ${template?.id === t.id ? "text-pink-600" : "text-slate-500 group-hover:text-slate-700"}`}>
              {t.name || `Template ${t.id}`}
            </p>
          </button>
        ))}
      </div>

      {apiTemplates.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-xs text-slate-400">Tidak ada template untuk {photos.length} frame.</p>
        </div>
      )}
    </div>
  );
}