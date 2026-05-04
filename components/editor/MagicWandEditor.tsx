"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface MagicWandEditorProps {
  imageSrc: string;
  onApply: (editedSrc: string) => void;
  onCancel: () => void;
}

/**
 * Flood-fill algorithm to make clicked color region transparent.
 * Works like Photoshop's magic wand + delete.
 */
function floodFillTransparent(
  imageData: ImageData,
  startX: number,
  startY: number,
  tolerance: number
) {
  const { width, height, data } = imageData;
  const visited = new Uint8Array(width * height);

  const idx = (x: number, y: number) => (y * width + x) * 4;
  const si = idx(startX, startY);
  const targetR = data[si];
  const targetG = data[si + 1];
  const targetB = data[si + 2];
  const targetA = data[si + 3];

  // Don't fill if already transparent
  if (targetA === 0) return;

  const colorMatch = (i: number) => {
    const dr = Math.abs(data[i] - targetR);
    const dg = Math.abs(data[i + 1] - targetG);
    const db = Math.abs(data[i + 2] - targetB);
    const da = Math.abs(data[i + 3] - targetA);
    return dr + dg + db + da <= tolerance * 4;
  };

  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const pixelIdx = y * width + x;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (visited[pixelIdx]) continue;

    const i = pixelIdx * 4;
    if (!colorMatch(i)) continue;

    visited[pixelIdx] = 1;

    // Make transparent
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;

    stack.push([x + 1, y]);
    stack.push([x - 1, y]);
    stack.push([x, y + 1]);
    stack.push([x, y - 1]);
  }
}

export function MagicWandEditor({ imageSrc, onApply, onCancel }: MagicWandEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tolerance, setTolerance] = useState(32);
  const [isLoaded, setIsLoaded] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

  // Load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setIsLoaded(true);
      // Save initial state for undo
      setUndoStack([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle magic wand click
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

      // Save current state for undo
      const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prev) => [...prev, currentData]);

      // Perform flood fill
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFillTransparent(imageData, x, y, tolerance);
      ctx.putImageData(imageData, 0, 0);
    },
    [tolerance]
  );

  // Undo
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStack.length <= 1) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newStack = [...undoStack];
    newStack.pop(); // Remove current
    const previous = newStack[newStack.length - 1];
    ctx.putImageData(previous, 0, 0);
    setUndoStack(newStack);
  };

  // Apply: export canvas as PNG data URL
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onApply(dataUrl);
  };



  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h4 className="font-bold text-slate-800 text-base font-serif tracking-wide">✨ Magic Wand Editor</h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Klik pada area berwarna di template untuk menghapusnya menjadi transparan. Area transparan akan menjadi slot foto.
        </p>
      </div>

      {/* Canvas Preview */}
      <div className="relative rounded-2xl border-2 border-pink-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-auto block"
          style={{ cursor: "crosshair", maxHeight: "400px", objectFit: "contain" }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
        <span className="text-base">💡</span>
        <p className="text-[10px] text-amber-700 leading-relaxed">
          <strong>Cara Pakai:</strong> Klik langsung pada area berwarna yang ingin dijadikan slot foto. Warna yang serupa akan otomatis dihapus. Gunakan slider toleransi untuk mengatur sensitivitas.
        </p>
      </div>

      {/* Tolerance Slider */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500">Toleransi Warna</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="80"
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="flex-1 accent-pink-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="w-12 h-8 rounded-xl border border-pink-100 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white">
            {tolerance}
          </div>
        </div>
        <p className="text-[9px] text-slate-400">Semakin tinggi = semakin banyak warna serupa yang terhapus</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={undoStack.length <= 1}
          className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Undo
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
        >
          ✕ Batal
        </button>
      </div>

      <button
        onClick={handleApply}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-sm hover:from-pink-600 hover:to-rose-600 transition shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Terapkan Template
      </button>

      {/* Checkerboard Legend */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2">
        <span className="text-base">🧩</span>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          <strong>Keterangan:</strong> Area kotak-kotak abu menunjukkan bagian yang sudah transparan. Foto kamu akan mengisi area tersebut.
        </p>
      </div>
    </div>
  );
}
