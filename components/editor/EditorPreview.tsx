"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { exportCanvas } from "@/lib/export-engine";

export function EditorPreview() {
  const {
    template,
    photos,
    backgroundColor,
    slots,
    stickers,
    texts,
    activeElementId,
    setActiveElementId,
    updateSlotTransform,
    updateSticker,
    updateText
  } = useEditorStore();

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [templateDimensions, setTemplateDimensions] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(100);

  // Drag state
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Load template dimensions and fit to screen initially
  useEffect(() => {
    if (template) {
      const img = document.createElement('img');
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setTemplateDimensions({ width: w, height: h });
        
        // Auto fit on load
        if (containerRef.current) {
          const padding = 64;
          const cw = containerRef.current.clientWidth - padding;
          const ch = containerRef.current.clientHeight - padding;
          const scaleX = cw / w;
          const scaleY = ch / h;
          const scale = Math.min(scaleX, scaleY);
          const initialZoom = Math.max(10, Math.min(300, Math.floor(scale * 100)));
          setZoom(initialZoom);
        }
      };
      img.src = template.src;
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemplateDimensions(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZoom(100);
    }
  }, [template]);

  const handleZoomIn = () => setZoom(z => Math.min(300, z + 10));
  const handleZoomOut = () => setZoom(z => Math.max(10, z - 10));
  const handleFit = () => {
    if (!containerRef.current) return;
    const w = templateDimensions?.width || 320;
    const h = templateDimensions?.height || 960;
    const padding = 64;
    const cw = containerRef.current.clientWidth - padding;
    const ch = containerRef.current.clientHeight - padding;
    const scaleX = cw / w;
    const scaleY = ch / h;
    const scale = Math.min(scaleX, scaleY);
    setZoom(Math.max(10, Math.min(300, Math.floor(scale * 100))));
  };

  useEffect(() => {
    const handleDownload = async () => {
      if (isExporting) return;
      setIsExporting(true);
      setActiveElementId(null); // Deselect before export

      try {
        // Use our native canvas export engine
        const dataUrl = await exportCanvas(2, "png");
        
        // Convert Data URL to Blob for better browser compatibility
        const res = await fetch(dataUrl);
        const blob = await res.blob();

        if (!blob) {
          throw new Error("Gagal membuat file gambar");
        }

        // Create blob URL and download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Pojok-Potret-Result.png";
        
        // Attach to DOM for better browser compatibility
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Export failed:", err);
        alert(`❌ Gagal mengunduh foto: ${err instanceof Error ? err.message : "Error tidak diketahui"}`);
      } finally {
        setIsExporting(false);
      }
    };

    window.addEventListener("download-photostrip", handleDownload);
    return () => window.removeEventListener("download-photostrip", handleDownload);
  }, [backgroundColor, template, isExporting, setActiveElementId]);

  const handlePointerDown = (e: React.PointerEvent, id: string, initX: number, initY: number) => {
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}
    
    setActiveElementId(id);
    
    // Automatically switch to filter tab if a photo slot is clicked
    if (id.startsWith("slot-")) {
      useEditorStore.getState().setActiveEditorTab("filter");
    } else if (id.startsWith("text-")) {
      useEditorStore.getState().setActiveEditorTab("teks");
    } else if (id.startsWith("sticker-")) {
      useEditorStore.getState().setActiveEditorTab("stiker");
    }

    setDragging({ id, startX: e.clientX, startY: e.clientY, initX, initY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragging.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragging.startY) / rect.height) * 100;
    
    const newX = dragging.initX + dx;
    const newY = dragging.initY + dy;

    if (dragging.id.startsWith("slot-")) {
      const idx = parseInt(dragging.id.replace("slot-", ""));
      // Moving the photo INSIDE the slot
      updateSlotTransform(idx, { photoX: newX, photoY: newY });
    } else if (dragging.id.startsWith("sticker-")) {
      useEditorStore.getState().updateSticker(dragging.id.replace("sticker-", ""), { x: newX, y: newY });
    } else if (dragging.id.startsWith("text-")) {
      useEditorStore.getState().updateText(dragging.id.replace("text-", ""), { x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDragging(null);
    }
  };

  const handleWheel = (e: React.WheelEvent, id: string) => {
    if (id.startsWith("slot-")) {
      e.preventDefault();
      const idx = parseInt(id.replace("slot-", ""));
      const currentScale = slots[idx].photoScale || 1;
      const zoomSensitivity = 0.05;
      const newScale = e.deltaY < 0 ? currentScale + zoomSensitivity : Math.max(0.5, currentScale - zoomSensitivity);
      updateSlotTransform(idx, { photoScale: newScale });
    }
  };

  // Helper to construct filter string
  const getFilterStyle = (f: { brightness: number; contrast: number; saturation: number; sharpness: number; sepia?: number; blur?: number }) => {
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) sepia(${f.sepia || 0}%) blur(${f.blur || 0}px)`;
  };

  const baseWidth = templateDimensions ? templateDimensions.width : 320;
  const baseHeight = templateDimensions ? templateDimensions.height : 960;

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-auto bg-slate-200 relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          setActiveElementId(null);
        }
      }}
    >
      {/* Zoom Controls Overlay */}
      <div className="sticky top-[calc(100%-4.5rem)] left-[calc(100%-12rem)] flex justify-end px-6 z-50 pointer-events-none mb-6">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg shadow-pink-100/50 border border-slate-100 transition-all hover:shadow-xl hover:shadow-pink-100">
            <button onClick={handleZoomOut} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-pink-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span className="text-[11px] font-bold text-slate-700 w-10 text-center select-none">{zoom}%</span>
            <button onClick={handleZoomIn} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-pink-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <button 
            onClick={handleFit} 
            title="Fit to Screen"
            className="flex h-10 w-10 items-center justify-center bg-white/95 backdrop-blur-md rounded-full shadow-lg shadow-pink-100/50 border border-slate-100 text-slate-500 hover:text-pink-600 hover:bg-slate-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        </div>
      </div>

      <div 
        className="min-h-full min-w-full flex justify-center items-center p-8"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setActiveElementId(null);
          }
        }}
        style={{
          minWidth: `${baseWidth * (zoom / 100) + 64}px`,
          minHeight: `${baseHeight * (zoom / 100) + 64}px`
        }}
      >
        <div 
          ref={previewRef}
          key={template?.id || "no-template"}
          id="editor-preview-canvas"
          className={`relative shadow-2xl overflow-hidden ${isExporting ? 'ring-0' : 'ring-1 ring-slate-300'}`}
          style={{ 
            width: `${baseWidth}px`, 
            height: `${baseHeight}px`, 
            backgroundColor: template ? 'transparent' : backgroundColor,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center"
          }}
          onPointerDown={(e) => {
          // Clear active element if clicking the empty canvas area
          if (e.target === e.currentTarget) {
            setActiveElementId(null);
          }
        }}
      >
        {/* Render Slots (Photos) */}
        {slots.map((slot, i) => {
          const photoSrc = photos[slot.photoIndex];
          const isActive = activeElementId === `slot-${i}`;
          
          return (
            <div
              key={`${template?.id || 'none'}-slot-${i}`}
              onPointerDown={(e) => handlePointerDown(e, `slot-${i}`, slot.photoX || 0, slot.photoY || 0)}
              onWheel={(e) => handleWheel(e, `slot-${i}`)}
              className={`absolute cursor-move overflow-hidden ${isActive ? 'ring-2 ring-pink-500 z-40' : 'z-10'}`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
              }}
            >
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={photoSrc} 
                  alt={`Slot ${i}`} 
                  className="w-full h-full object-cover pointer-events-none origin-center"
                  style={{ 
                    filter: getFilterStyle(slot.filter),
                    transform: `translate(${slot.photoX || 0}%, ${slot.photoY || 0}%) scale(${slot.photoScale || 1}) rotate(${slot.photoRotation || 0}deg)`,
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs pointer-events-none">
                  Empty Slot
                </div>
              )}
            </div>
          );
        })}

        {/* Render Template Overlay (Frame Mode) */}
        {template && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={template.src} 
              alt="template" 
              className="w-full h-full block"
            />
          </div>
        )}

        {/* Render Stickers */}
        {stickers.map((st) => {
          const isActive = activeElementId === `sticker-${st.id}`;
          const flipScaleX = st.flipX ? -1 : 1;
          const flipScaleY = st.flipY ? -1 : 1;
          return (
            <div
              key={st.id}
              onPointerDown={(e) => handlePointerDown(e, `sticker-${st.id}`, st.x, st.y)}
              className={`absolute cursor-move z-50`}
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale * flipScaleX}, ${st.scale * flipScaleY})`,
                opacity: (st.opacity ?? 100) / 100,
              }}
            >
              {isActive && (
                <div className="absolute -inset-2 border-2 border-pink-500 border-dashed rounded pointer-events-none">
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-sm" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-sm" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-sm" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-sm" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={st.src} alt="sticker" className="w-20 h-20 object-contain pointer-events-none" />
            </div>
          );
        })}

        {/* Render Texts */}
        {texts.map((tx) => {
          const isActive = activeElementId === `text-${tx.id}`;
          return (
            <div
              key={tx.id}
              onPointerDown={(e) => handlePointerDown(e, `text-${tx.id}`, tx.x, tx.y)}
              className={`absolute cursor-move z-50 whitespace-nowrap ${isActive ? 'ring-2 ring-pink-500' : ''}`}
              style={{
                left: `${tx.x}%`,
                top: `${tx.y}%`,
                transform: `translate(-50%, -50%) rotate(${tx.rotation}deg) scale(${tx.scale})`,
                color: tx.color,
                fontFamily: tx.fontFamily,
                fontSize: '24px',
              }}
            >
              {tx.text}
            </div>
          );
        })}
      </div>
      </div>
      
      {isExporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
            <p className="mt-4 font-bold text-pink-500">Mengekspor Karyamu...</p>
          </div>
        </div>
      )}
    </div>
  );
}