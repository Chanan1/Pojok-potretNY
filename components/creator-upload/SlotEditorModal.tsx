"use client";

import { useUploadStore } from "@/store/useUploadStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

export function SlotEditorModal() {
  const {
    isSlotEditorOpen, setIsSlotEditorOpen,
    previewUrl, slots, updateSlot, addSlot, templateDimensions, updatePreviewUrl
  } = useUploadStore();

  const [isMagicWandActive, setIsMagicWandActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(32); // Color tolerance 0-255
  const [undoStack, setUndoStack] = useState<string[]>([]); // Stack of previous image URLs

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Load image into the canvas
  useEffect(() => {
    if (!isSlotEditorOpen || !previewUrl || !templateDimensions) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setCanvasReady(true);
    };
    img.src = previewUrl;
  }, [isSlotEditorOpen, previewUrl, templateDimensions]);

  // Adobe-style Color-Based Flood Fill
  const runColorMagicWand = useCallback((startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !templateDimensions) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setIsProcessing(true);

    // Save undo state BEFORE modification
    setUndoStack(prev => [...prev, canvas.toDataURL("image/png")]);

    setTimeout(() => {
      const { width, height } = { width: canvas.width, height: canvas.height };
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // 1. Read the target color of the clicked pixel
      const startIdx = (startY * width + startX) * 4;
      const targetR = data[startIdx];
      const targetG = data[startIdx + 1];
      const targetB = data[startIdx + 2];
      const targetA = data[startIdx + 3];

      // Track visited pixels
      const visited = new Uint8Array(width * height);

      // Bounding box
      let minX = width, maxX = 0, minY = height, maxY = 0;
      let pixelsModified = 0;

      // Color match check with tolerance
      const isColorMatch = (idx: number): boolean => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        return (
          Math.abs(r - targetR) <= tolerance &&
          Math.abs(g - targetG) <= tolerance &&
          Math.abs(b - targetB) <= tolerance &&
          Math.abs(a - targetA) <= tolerance
        );
      };

      // BFS Flood Fill using a queue (more memory-friendly than recursion)
      const queue: number[] = [];
      const startLinear = startY * width + startX;
      queue.push(startLinear);
      visited[startLinear] = 1;

      while (queue.length > 0) {
        const linear = queue.shift()!;
        const x = linear % width;
        const y = Math.floor(linear / width);
        const pixelIdx = linear * 4;

        if (isColorMatch(pixelIdx)) {
          // Make pixel transparent!
          data[pixelIdx + 3] = 0; // Set alpha to 0
          pixelsModified++;

          // Update bounding box
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          // Check 4 neighbors
          const neighbors = [
            linear - 1,       // left
            linear + 1,       // right
            linear - width,   // up
            linear + width,   // down
          ];

          for (const neighbor of neighbors) {
            const nx = neighbor % width;
            const ny = Math.floor(neighbor / width);
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[neighbor]) {
              // Prevent wrapping: left neighbor should be on the same row or one less
              if (neighbor === linear - 1 && nx > x) continue;
              if (neighbor === linear + 1 && nx < x) continue;
              visited[neighbor] = 1;
              queue.push(neighbor);
            }
          }
        }
      }

      if (pixelsModified > 100) {
        // 2. Put modified image data back
        ctx.putImageData(imageData, 0, 0);

        // 3. Export modified canvas as new PNG
        const newDataUrl = canvas.toDataURL("image/png");
        updatePreviewUrl(newDataUrl);

        // 4. Create the slot from bounding box (as percentages)
        const pctX = (minX / width) * 100;
        const pctY = (minY / height) * 100;
        const pctWidth = ((maxX - minX + 1) / width) * 100;
        const pctHeight = ((maxY - minY + 1) / height) * 100;

        if (pctWidth > 1 && pctHeight > 1) {
          addSlot({ x: pctX, y: pctY, width: pctWidth, height: pctHeight });
        }
      } else {
        // Revert undo stack since nothing meaningful happened
        setUndoStack(prev => prev.slice(0, -1));
        alert("Area yang diklik terlalu kecil atau warnanya tidak cukup seragam. Coba naikkan toleransi.");
      }

      setIsProcessing(false);
    }, 50);
  }, [templateDimensions, tolerance, addSlot, updatePreviewUrl]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastUrl = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    updatePreviewUrl(lastUrl);

    // Remove the last slot
    const currentSlots = useUploadStore.getState().slots;
    if (currentSlots.length > 0) {
      useUploadStore.getState().setSlots(currentSlots.slice(0, -1));
    }

    // Reload the canvas with the previous image
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastUrl;
  }, [undoStack, updatePreviewUrl]);

  // Handle click on the canvas display
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMagicWandActive || isProcessing || !canvasReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = Math.floor((e.clientX - rect.left) * scaleX);
    const clickY = Math.floor((e.clientY - rect.top) * scaleY);

    if (clickX >= 0 && clickX < canvas.width && clickY >= 0 && clickY < canvas.height) {
      runColorMagicWand(clickX, clickY);
    }
  }, [isMagicWandActive, isProcessing, canvasReady, runColorMagicWand]);

  if (!isSlotEditorOpen || !previewUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-5xl h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-lg font-black text-slate-800">Magic Wand Editor</h2>
              <p className="text-[11px] text-slate-500">Klik area berwarna pada template untuk menghapusnya menjadi transparan.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Undo Button */}
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${undoStack.length > 0 ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                title="Undo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>

              {/* Magic Wand Toggle */}
              <button
                onClick={() => setIsMagicWandActive(!isMagicWandActive)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition ${isMagicWandActive ? 'bg-pink-100 text-pink-600 border-2 border-pink-500' : 'bg-slate-100 text-slate-500 border-2 border-transparent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                {isMagicWandActive ? 'Magic Wand Aktif' : 'Magic Wand Off'}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsSlotEditorOpen(false)}
                className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-rose-100 hover:text-rose-500 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 relative">

            {isProcessing && (
              <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg font-bold text-pink-500 flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Menghapus warna & membuat slot...
                </div>
              </div>
            )}

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative" style={{ background: 'repeating-conic-gradient(#f1f5f9 0% 25%, #fff 0% 50%) 50% / 20px 20px' }}>
              <div ref={displayRef} className="relative shadow-2xl">
                {/* The actual canvas - visible and clickable */}
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`max-w-full max-h-[60vh] ${isMagicWandActive ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ imageRendering: 'auto' }}
                />

                {/* Slot overlays on top of canvas */}
                {slots.map((slot, i) => (
                  <div
                    key={slot.id}
                    className="absolute border-2 border-dashed border-emerald-500 bg-emerald-500/15 flex items-center justify-center pointer-events-none"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `${slot.width}%`,
                      height: `${slot.height}%`,
                    }}
                  >
                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">
                      Slot {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-[320px] bg-white border-l border-slate-100 p-6 overflow-y-auto shrink-0 flex flex-col">

              {/* Magic Wand Instruction */}
              {isMagicWandActive && (
                <div className="bg-pink-50 border border-pink-100 p-3 rounded-xl mb-4 flex gap-3">
                  <div className="text-pink-500 mt-0.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  <p className="text-[11px] text-pink-700 font-medium leading-relaxed">
                    <strong>Cara pakai:</strong> Klik pada area berwarna solid (misal: kotak putih, abu-abu, hijau) di gambar. Warna tersebut akan <strong>dihapus menjadi transparan</strong> dan otomatis membuat slot foto.
                  </p>
                </div>
              )}

              {/* Tolerance Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">Toleransi Warna</label>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="5" max="100"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Naikkan jika warna tidak seragam sempurna (JPEG artifact, gradien, dll).</p>
              </div>

              {/* Slots List */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Slot Terdeteksi ({slots.length})</h3>
                <button
                  onClick={() => addSlot({ x: 10, y: 10, width: 80, height: 20 })}
                  className="text-[10px] font-bold text-slate-500 hover:text-pink-500 transition px-2 py-1 border border-slate-200 hover:border-pink-200 rounded-lg"
                >
                  + Manual
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {slots.map((slot, i) => (
                  <div key={slot.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative group">
                    <button
                      onClick={() => {
                        const newSlots = slots.filter(s => s.id !== slot.id);
                        useUploadStore.getState().setSlots(newSlots);
                      }}
                      className="absolute top-2 right-2 w-5 h-5 text-slate-400 hover:text-red-500 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                      <span className="text-[11px] font-bold text-slate-700">Slot {i + 1}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block">X</label>
                        <input type="number" value={Math.round(slot.x)} onChange={(e) => updateSlot(slot.id, { x: Number(e.target.value) })} className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[10px] outline-none focus:border-pink-500 text-center" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block">Y</label>
                        <input type="number" value={Math.round(slot.y)} onChange={(e) => updateSlot(slot.id, { y: Number(e.target.value) })} className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[10px] outline-none focus:border-pink-500 text-center" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block">W</label>
                        <input type="number" value={Math.round(slot.width)} onChange={(e) => updateSlot(slot.id, { width: Number(e.target.value) })} className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[10px] outline-none focus:border-pink-500 text-center" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 block">H</label>
                        <input type="number" value={Math.round(slot.height)} onChange={(e) => updateSlot(slot.id, { height: Number(e.target.value) })} className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[10px] outline-none focus:border-pink-500 text-center" />
                      </div>
                    </div>
                  </div>
                ))}

                {slots.length === 0 && (
                  <div className="text-center py-10 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-slate-300"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                    <p className="text-xs font-medium text-slate-400">Belum ada slot.</p>
                    <p className="text-[10px] text-slate-400">Klik area berwarna di gambar.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsSlotEditorOpen(false)}
                  className="w-full py-3 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition hover:-translate-y-0.5"
                >
                  Selesai Edit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
