"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { exportCanvas } from "@/lib/export-engine";

const TIPS = [
  "Gunakan kombinasi warna yang soft agar hasil fotomu semakin estetik ✨",
  "Coba filter 'Dreamy' untuk kesan foto ala studio Korea! 🇰🇷",
  "Kamu bisa geser stiker dan teks ke mana saja di area preview 🎯",
  "Upload template PNG kustom dan gunakan Magic Wand untuk hasil unik 🪄",
  "Gunakan fitur Tukar Posisi untuk mengatur urutan foto sesuai keinginan 🔄",
  "Atur opacity stiker agar terlihat lebih natural di atas foto 👻",
  "Tambahkan teks dengan warna dan font yang berbeda untuk personalisasi 🖋️",
  "Gunakan filter berbeda untuk setiap frame foto agar lebih kreatif 🎨",
];

export function EditorBottomBar() {
  const [currentTip, setCurrentTip] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "jpg">("png");
  const [exportQuality, setExportQuality] = useState<"1x" | "2x" | "3x">("2x");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setActiveElementId, template, backgroundColor } = useEditorStore();

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Download handler
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setActiveElementId(null);
    setShowDropdown(false);

    // Small delay to let selection borders disappear
    await new Promise((r) => setTimeout(r, 100));

    try {
      const scaleMultiplier = exportQuality === "1x" ? 1 : exportQuality === "2x" ? 2 : 3;
      const dataUrl = await exportCanvas(scaleMultiplier, exportFormat);

      const link = document.createElement("a");
      link.download = `pojok-potret.${exportFormat}`;
      link.href = dataUrl;
      link.click();

      // Save session to database (background, non-blocking)
      try {
        const { createProject } = await import("@/lib/api-client");
        const editorState = useEditorStore.getState();
        await createProject({
          templateId: editorState.template?.id || null,
          layout: "portrait",
          filter: "normal",
          photoCount: editorState.photos.length,
          metadata: {
            exportFormat,
            exportQuality,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (saveErr) {
        // Non-critical — don't block user experience
        console.error("Failed to save session to DB:", saveErr);
      }

    } catch (err) {
      console.error("Export failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Error tidak diketahui";
      alert(`❌ Gagal mengunduh foto:\n${errorMsg}`);
    } finally {
      setIsExporting(false);
    }
  }, [setActiveElementId, template, exportQuality, exportFormat]);

  // Preview handler
  const handlePreview = useCallback(async () => {
    setShowPreview(true);
    setActiveElementId(null);
  }, [setActiveElementId]);

  return (
    <>
      {/* Bottom Bar */}
      <div className="shrink-0 border-t border-pink-100 bg-white/95 backdrop-blur-sm px-5 py-2.5 flex items-center gap-4">
        {/* Tips Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg">
            💡
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-700">Tips Editor</p>
            <p className="text-[10px] text-slate-400 truncate transition-all duration-500">
              {TIPS[currentTip]}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Preview Button */}
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>

          {/* Download Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-l-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-[11px] font-bold text-white shadow-lg shadow-pink-200 transition hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] disabled:opacity-70"
              >
                {isExporting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                )}
                {isExporting ? "Mengunduh..." : "Unduh Foto"}
              </button>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center rounded-r-full bg-gradient-to-r from-rose-500 to-rose-600 px-2.5 py-2 text-white border-l border-white/20 transition hover:from-rose-600 hover:to-rose-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute bottom-full right-0 mb-2 w-56 rounded-2xl bg-white border border-pink-100 shadow-xl shadow-pink-100/50 p-4 space-y-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Format */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-2">Format</p>
                  <div className="flex gap-2">
                    {(["png", "jpg"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setExportFormat(f)}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition border ${
                          exportFormat === f
                            ? "bg-pink-50 border-pink-300 text-pink-600"
                            : "bg-white border-slate-200 text-slate-500 hover:border-pink-200"
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-2">Kualitas</p>
                  <div className="flex gap-2">
                    {(["1x", "2x", "3x"] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setExportQuality(q)}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition border ${
                          exportQuality === q
                            ? "bg-pink-50 border-pink-300 text-pink-600"
                            : "bg-white border-slate-200 text-slate-500 hover:border-pink-200"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">
                    {exportQuality === "1x" ? "Standard — cepat" : exportQuality === "2x" ? "High — rekomendasi" : "Ultra HD — file besar"}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                <button
                  onClick={handleExport}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-[11px] font-bold hover:from-pink-600 hover:to-rose-600 transition"
                >
                  Unduh {exportFormat.toUpperCase()} ({exportQuality})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg hover:bg-pink-50 hover:text-pink-600 transition"
            >
              ✕
            </button>

            {/* Preview content — clone of the preview canvas */}
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-3">
              <p className="text-center text-xs font-bold text-slate-600 mb-2">Preview Hasil</p>
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <PreviewCapture />
              </div>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => { setShowPreview(false); handleExport(); }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[11px] font-bold text-white shadow-md hover:from-pink-600 hover:to-rose-600 transition flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Unduh Foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * A read-only snapshot of the preview for the modal
 */
function PreviewCapture() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const capture = async () => {
      try {
        const dataUrl = await exportCanvas(1.5, "png");
        setImgSrc(dataUrl);
      } catch (err) {
        console.error("Preview capture failed:", err);
      }
    };

    // Small delay for deselection animation
    const timer = setTimeout(capture, 200);
    return () => clearTimeout(timer);
  }, []);

  if (!imgSrc) {
    return (
      <div className="flex h-64 w-96 items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgSrc} alt="Preview" className="max-w-[70vw] max-h-[70vh] object-contain" />
  );
}
