"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { LayoutOrientation, FilterType } from "@/store/useAppStore";

const frameOptions = [2, 3, 4, 6, 8];
const timerOptions = [3, 5, 10];

const filterOptions: { name: string; value: FilterType; emoji: string }[] = [
  { name: "Normal", value: "normal", emoji: "🎨" },
  { name: "B&W", value: "bw", emoji: "🖤" },
  { name: "Warm", value: "warm", emoji: "🌅" },
  { name: "Cool", value: "cool", emoji: "❄️" },
];

export function SettingsPanel() {
  const [mounted, setMounted] = useState(false);
  const {
    selectedLayout,
    totalFrames,
    selectedTimer,
    selectedFilter,
    isMirror,
    photos,
    setSelectedLayout,
    setTotalFrames,
    setSelectedTimer,
    setSelectedFilter,
    setIsMirror,
    addPhoto,
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasEmptySlot = photos.some((p) => p === null);

  const [openSection, setOpenSection] = useState<string | null>("layout");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!mounted) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      addPhoto(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
        Pengaturan Sesi
      </h3>

      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {/* ══════ LAYOUT ══════ */}
        <div className="rounded-xl border border-pink-50 bg-white transition-all duration-300">
          <button onClick={() => toggleSection("layout")} className="flex w-full items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-sm">📐</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">Layout</p>
                <p className="text-[11px] text-pink-500">{totalFrames} Frame {selectedLayout === "portrait" ? "Portrait" : "Landscape"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex gap-0.5 rounded border border-pink-200 bg-pink-50 p-0.5 ${selectedLayout === "portrait" ? "h-8 w-6 flex-col" : "h-6 w-8 flex-row"}`}>
                {Array.from({ length: Math.min(totalFrames, 4) }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[2px] bg-pink-300" />
                ))}
              </div>
              <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${openSection === "layout" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>
          {openSection === "layout" && (
            <div className="space-y-3 border-t border-pink-50 px-3.5 pb-3.5">
              {/* Orientation */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["portrait", "landscape"] as LayoutOrientation[]).map((o) => (
                  <button key={o} onClick={() => setSelectedLayout(o)} className={`rounded-lg border py-2 text-center text-xs font-semibold capitalize transition-all duration-300 ${selectedLayout === o ? "border-pink-400 bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]" : "border-pink-100 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50"}`}>
                    {o === "portrait" ? "Portrait ▯" : "Landscape ▭"}
                  </button>
                ))}
              </div>
              {/* Frame count */}
              <div className="grid grid-cols-5 gap-1.5">
                {frameOptions.map((f) => (
                  <button key={f} onClick={() => setTotalFrames(f)} className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all duration-300 ${totalFrames === f ? "border-pink-400 bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]" : "border-pink-100 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══════ TIMER ══════ */}
        <div className="rounded-xl border border-pink-50 bg-white transition-all duration-300">
          <button onClick={() => toggleSection("timer")} className="flex w-full items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-sm">⏱</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">Timer Otomatis</p>
                <p className="text-[11px] text-pink-500">{selectedTimer} detik</p>
              </div>
            </div>
            <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${openSection === "timer" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {openSection === "timer" && (
            <div className="border-t border-pink-50 px-3.5 pb-3.5">
              <div className="mt-3 grid grid-cols-3 gap-2">
                {timerOptions.map((t) => (
                  <button key={t} onClick={() => setSelectedTimer(t)} className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all duration-300 ${selectedTimer === t ? "border-pink-400 bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]" : "border-pink-100 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50"}`}>
                    {t}s
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══════ FILTER ══════ */}
        <div className="rounded-xl border border-pink-50 bg-white transition-all duration-300">
          <button onClick={() => toggleSection("filter")} className="flex w-full items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-sm">✨</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">Filter</p>
                <p className="text-[11px] text-pink-500">{filterOptions.find((f) => f.value === selectedFilter)?.name}</p>
              </div>
            </div>
            <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${openSection === "filter" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {openSection === "filter" && (
            <div className="border-t border-pink-50 px-3.5 pb-3.5">
              <div className="mt-3 grid grid-cols-4 gap-2">
                {filterOptions.map((filter) => (
                  <button key={filter.value} onClick={() => setSelectedFilter(filter.value)} className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg transition-all duration-300 ${selectedFilter === filter.value ? "border-pink-400 bg-pink-50 shadow-[0_4px_12px_rgba(236,72,153,0.2)]" : "border-pink-100 bg-white hover:border-pink-200"}`}>
                      {filter.emoji}
                    </div>
                    <span className={`text-[10px] font-medium ${selectedFilter === filter.value ? "text-pink-600" : "text-slate-500"}`}>{filter.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══════ CERMIN KAMERA ══════ */}
        <div className="rounded-xl border border-pink-50 bg-white p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-sm">🔄</span>
              <p className="text-sm font-semibold text-slate-800">Cermin Kamera</p>
            </div>
            <button onClick={() => setIsMirror(!isMirror)} className={`relative h-6 w-11 rounded-full transition-all duration-300 ${isMirror ? "bg-pink-500" : "bg-slate-200"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isMirror ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* ══════ UPLOAD ══════ */}
        <button
          onClick={() => hasEmptySlot && fileInputRef.current?.click()}
          disabled={!hasEmptySlot}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-pink-200 bg-pink-50/50 p-3.5 transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-sm">📤</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">Upload Foto</p>
            <p className="text-[11px] text-slate-400">Pilih dari perangkatmu</p>
          </div>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        {/* ══════ TIPS ══════ */}
        <div className="rounded-xl border border-pink-50 bg-gradient-to-br from-pink-50/80 to-white p-3.5">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>✨</span> Tips Foto
          </h4>
          <ul className="space-y-1 text-[11px] text-slate-500">
            <li className="flex items-start gap-1.5"><span className="mt-0.5 text-pink-400">•</span>Pastikan wajah berada di dalam frame</li>
            <li className="flex items-start gap-1.5"><span className="mt-0.5 text-pink-400">•</span>Gunakan pencahayaan yang cukup</li>
            <li className="flex items-start gap-1.5"><span className="mt-0.5 text-pink-400">•</span>Lihat ke arah kamera</li>
            <li className="flex items-start gap-1.5"><span className="mt-0.5 text-pink-400">•</span>Tersenyumlah! 😊</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
