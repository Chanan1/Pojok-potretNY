"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export function ProgressPanel() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {
    photos,
    totalFrames,
    selectedLayout,
    currentIndex,
    removePhoto,
    resetPhotos,
    isAllSlotsFilled,
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const allFilled = isAllSlotsFilled();
  const filledCount = photos.filter((p) => p !== null).length;

  const handleGoToEditor = () => {
    router.push("/editor");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Preview Sesi
        </h3>
        <span className="rounded-full bg-pink-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          {totalFrames} Frame {selectedLayout === "portrait" ? "Portrait" : "Landscape"}
        </span>
      </div>

      {/* Photo slots */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {photos.map((photo, index) => {
          const isCaptured = photo !== null;
          const isActive = index === currentIndex && !allFilled;

          return (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${
                isCaptured
                  ? "border-pink-400 shadow-[0_4px_12px_rgba(236,72,153,0.15)]"
                  : isActive
                  ? "border-pink-500 bg-pink-50/80 shadow-[0_0_20px_rgba(236,72,153,0.3)] ring-4 ring-pink-500/30 scale-[1.02]"
                  : "border-pink-100 bg-pink-50/30"
              }`}
            >
              {isCaptured ? (
                <div className={`relative overflow-hidden ${selectedLayout === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <Image
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {/* Delete overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                    <button
                      onClick={() => removePhoto(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs text-red-500 shadow-md transition hover:bg-red-50"
                      title="Hapus foto"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Frame number badge */}
                  <div className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-sm">
                    {index + 1}
                  </div>
                </div>
              ) : (
                <div className={`flex items-center justify-center ${selectedLayout === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <span className={`text-lg font-semibold ${isActive ? "text-pink-400" : "text-pink-200"}`}>
                    {index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress text */}
      <p className="mt-3 text-center text-xs text-slate-400">
        {filledCount} / {totalFrames} foto selesai
      </p>

      {/* Action buttons */}
      <div className="mt-3 space-y-2">
        {allFilled ? (
          <button
            onClick={handleGoToEditor}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(236,72,153,0.3)] transition-all duration-300 hover:scale-[1.02] hover:bg-pink-600 hover:shadow-[0_12px_28px_rgba(236,72,153,0.4)] active:scale-95"
          >
            Edit Foto <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        ) : (
          <div className="rounded-xl border border-pink-50 bg-pink-50/50 p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-xs">📷</div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Ambil semua foto untuk melanjutkan ke tahap edit.
              </p>
            </div>
          </div>
        )}

        {filledCount > 0 && (
          <button
            onClick={resetPhotos}
            className="w-full rounded-xl border border-pink-100 bg-white py-2.5 text-xs font-bold text-slate-500 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
          >
            Reset Semua Foto
          </button>
        )}
      </div>
    </div>
  );
}
