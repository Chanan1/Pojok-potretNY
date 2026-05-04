"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { FilterType } from "@/store/useAppStore";

const filterCSS: Record<FilterType, string> = {
  normal: "none",
  bw: "grayscale(100%)",
  warm: "sepia(40%) saturate(1.3) brightness(1.05)",
  cool: "saturate(0.8) brightness(1.1) hue-rotate(15deg)",
};

export function CameraPanel() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const {
    selectedTimer,
    selectedFilter,
    selectedLayout,
    isMirror,
    isCapturing,
    photos,
    totalFrames,
    currentIndex,
    setIsCapturing,
    addPhoto,
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const allFilled = photos.every((p) => p !== null);
  const filledCount = photos.filter((p) => p !== null).length;

  // Start webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError(true);
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isCapturing || allFilled) return;

    setIsCapturing(true);
    setCountdown(selectedTimer);

    let currentCount = selectedTimer;
    const interval = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(interval);

        const canvas = canvasRef.current!;
        const video = videoRef.current!;
        const ctx = canvas.getContext("2d")!;

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const targetAR = selectedLayout === "portrait" ? 3 / 4 : 4 / 3;
        const videoAR = vw / vh;

        let cropW, cropH;
        if (videoAR > targetAR) {
          cropH = vh;
          cropW = vh * targetAR;
        } else {
          cropW = vw;
          cropH = vw / targetAR;
        }

        const offsetX = (vw - cropW) / 2;
        const offsetY = (vh - cropH) / 2;

        const sourceW = cropW / zoom;
        const sourceH = cropH / zoom;
        const sourceX = offsetX + (cropW - sourceW) / 2;
        const sourceY = offsetY + (cropH - sourceH) / 2;

        canvas.width = cropW;
        canvas.height = cropH;

        ctx.save();
        if (isMirror) {
          ctx.scale(-1, 1);
          ctx.drawImage(video, sourceX, sourceY, sourceW, sourceH, -cropW, 0, cropW, cropH);
        } else {
          ctx.drawImage(video, sourceX, sourceY, sourceW, sourceH, 0, 0, cropW, cropH);
        }
        ctx.restore();

        // Apply filter via canvas
        if (selectedFilter !== "normal") {
          ctx.filter = filterCSS[selectedFilter];
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
        }

        const photoData = canvas.toDataURL("image/jpeg", 0.92);
        addPhoto(photoData);
        setIsCapturing(false);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
      }
    }, 1000);
  }, [isCapturing, allFilled, selectedTimer, isMirror, selectedFilter, addPhoto, setIsCapturing, selectedLayout, zoom]);

  const aspectClass = selectedLayout === "portrait"
    ? "aspect-[3/4] h-auto max-h-[65vh] w-auto lg:max-h-full lg:h-full lg:max-w-[480px]"
    : "aspect-[4/3] h-auto max-h-[55vh] w-auto lg:max-h-full lg:h-full lg:max-w-[800px]";

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Camera viewport */}
      <div className="flex flex-1 items-center justify-center bg-[#fdf6f9] p-3 md:p-5 min-h-0">
        <div className={`relative overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.15)] ring-4 ring-white/60 transition-all duration-500 ${aspectClass}`}>
          {/* Flash Effect */}
          <div className={`pointer-events-none absolute inset-0 z-50 bg-white transition-opacity duration-300 ${showFlash ? "opacity-100" : "opacity-0"}`} />

          {/* Camera Error Fallback */}
          {cameraError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-900 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/20 text-4xl">📷</div>
              <h3 className="text-lg font-bold text-white">Akses Kamera Ditolak</h3>
              <p className="max-w-xs text-sm text-slate-400">Izinkan akses kamera di browser untuk memulai sesi foto. Klik ikon 🔒 di address bar untuk mengubah izin.</p>
              <button onClick={() => window.location.reload()} className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600 transition">Coba Lagi</button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{
                  transform: `${isMirror ? "scaleX(-1)" : "scaleX(1)"} scale(${zoom})`,
                  filter: `${filterCSS[selectedFilter]}${flashOn ? ' brightness(1.15)' : ''}`,
                  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease",
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}

          {/* Grid overlay */}
          {showGrid && (
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="grid h-full w-full grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20 transition-colors" />
                ))}
              </div>
            </div>
          )}

          {/* Countdown */}
          {countdown > 0 && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300">
              <div key={countdown} className="flex h-36 w-36 animate-[pulse_1s_ease-in-out_infinite] items-center justify-center rounded-full bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md">
                <span className="text-8xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">{countdown}</span>
              </div>
            </div>
          )}

          {/* Top-left: Flash */}
          <button onClick={() => setFlashOn(!flashOn)} className={`absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-base shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${flashOn ? 'bg-yellow-400 text-white' : 'bg-white/80 hover:bg-white'}`}>⚡</button>

          {/* Top-right: Flip */}
          <button onClick={() => useAppStore.getState().setIsMirror(!isMirror)} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-base shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95">🔄</button>

          {/* Bottom bar controls */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent px-5 pb-6 pt-12">
            {/* Grid toggle */}
            <button onClick={() => setShowGrid(!showGrid)} className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${showGrid ? "bg-white/95 text-slate-800" : "bg-white/40 text-white"}`}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16M8 4v16M16 4v16" /></svg>
              Grid
            </button>

            {/* Capture button */}
            <button
              onClick={capturePhoto}
              disabled={isCapturing || allFilled || !isStreaming}
              className={`group flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-500 hover:scale-105 active:scale-95 ${
                isCapturing
                  ? "border-red-400 bg-red-500 shadow-[0_0_32px_rgba(239,68,68,0.5)] animate-pulse"
                  : allFilled
                  ? "border-green-400 bg-green-500 shadow-[0_0_32px_rgba(34,197,94,0.5)]"
                  : "border-white/90 bg-pink-500 shadow-[0_12px_36px_rgba(236,72,153,0.5)] hover:bg-pink-600 hover:border-white"
              }`}
            >
              {!isCapturing && !allFilled && (
                <svg className="h-8 w-8 text-white transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {isCapturing && <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />}
              {allFilled && (
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              )}
            </button>

            {/* Zoom */}
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold shadow-lg backdrop-blur-md">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-slate-200 active:scale-90"><span className="text-slate-700">−</span></button>
              <span className="min-w-[36px] text-center text-slate-700">{(zoom).toFixed(1)}x</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-slate-200 active:scale-90"><span className="text-slate-700">+</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom instruction bar */}
      <div className="flex items-center justify-between border-t border-pink-50 bg-white px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-sm">📷</div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {allFilled ? "Semua foto selesai! 🎉" : `Ambil foto ${filledCount + 1} dari ${totalFrames}`}
            </p>
            <p className="text-[11px] text-slate-400">
              {allFilled ? 'Klik "Edit Foto" untuk melanjutkan.' : "Posisikan wajahmu di dalam frame dan klik tombol kamera atau tunggu timer."}
            </p>
          </div>
        </div>
        <button onClick={() => { if (confirm('Lewati sesi dan lanjut ke editor? Foto yang belum diambil akan kosong.')) { window.location.href = '/editor'; }}} className="text-xs font-semibold text-slate-400 transition hover:text-pink-500">Lewati ›</button>
      </div>
    </div>
  );
}
