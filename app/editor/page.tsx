"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useEditorStore } from "@/store/useEditorStore";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorPreview } from "@/components/editor/EditorPreview";
import { EditorRightPanel } from "@/components/editor/EditorRightPanel";
import { EditorBottomBar } from "@/components/editor/EditorBottomBar";
import { Logo } from "@/components/ui/Logo";
import { useEffect } from "react";

export default function EditorPage() {
  const router = useRouter();
  const { photos, selectedTemplateId } = useAppStore();
  const { setPhotos, setTemplate, resetEditor } = useEditorStore();

  useEffect(() => {
    // Session cleanup when leaving the editor
    return () => {
      resetEditor();
    };
  }, [resetEditor]);

  useEffect(() => {
    // Only pass captured photos (filter out nulls)
    const validPhotos = photos.filter((p) => p !== null) as string[];
    setPhotos(validPhotos);
  }, [photos, setPhotos]);

  useEffect(() => {
    // Sync template from Capture if exists
    async function syncTemplate() {
      if (!selectedTemplateId) return;

      // 1. Always try API first (source of truth)
      let apiTemplateData = null;
      try {
        const { fetchTemplate } = await import("@/lib/api-client");
        const res = await fetchTemplate(selectedTemplateId);
        if (res.success && res.data) {
          apiTemplateData = res.data;
        }
      } catch (err) {
        console.error("Failed to fetch template from API:", err);
      }

      // 2. Load PREDEFINED_TEMPLATES for matching or fallback
      let predefined = null;
      try {
        const { PREDEFINED_TEMPLATES } = await import("@/lib/templates");
        predefined = PREDEFINED_TEMPLATES.find(t => 
          t.id === selectedTemplateId || 
          (apiTemplateData && t.src === apiTemplateData.src)
        );
      } catch (err) {
        console.error("Failed to load predefined templates:", err);
      }

      // 3. Assemble the template object
      if (apiTemplateData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t: any = apiTemplateData;
        const apiSlots = typeof t.slots === 'string' ? JSON.parse(t.slots) : (t.slots || []);
        
        // If API has no slots, but we found a predefined match with slots, use those
        const finalSlots = (Array.isArray(apiSlots) && apiSlots.length > 0) 
          ? apiSlots 
          : (predefined?.slots || []);

        setTemplate({
          id: t.id,
          name: t.name,
          src: t.src,
          frameCount: t.frameCount,
          slots: finalSlots,
        });
      } else if (predefined) {
        setTemplate(predefined);
      }
    }
    
    syncTemplate();
  }, [selectedTemplateId, setTemplate]);

  return (
    <div className="flex h-screen flex-col bg-[#fdf6f9]">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header className="flex shrink-0 items-center justify-between border-b border-pink-50 bg-white px-5 py-2.5">
        {/* Logo */}
        <Logo />

        {/* Stepper */}
        <div className="hidden items-center gap-2.5 md:flex">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-[10px] font-bold text-pink-500">1</div>
            <span className="text-[11px] text-slate-400">Pilih Mode</span>
          </div>
          <div className="h-px w-10 bg-pink-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-[10px] font-bold text-pink-500">2</div>
            <span className="text-[11px] text-slate-400">Atur Sesi</span>
          </div>
          <div className="h-px w-10 bg-pink-100" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(236,72,153,0.3)]">3</div>
            <span className="text-[11px] font-bold text-pink-600">Edit & Hias</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/capture")} className="rounded-full border border-pink-100 bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
            ← Kembali ke Atur Sesi
          </button>
        </div>
      </header>

      {/* ═══════════════ TITLE ═══════════════ */}
      <div className="shrink-0 border-b border-pink-50 bg-white px-5 py-3 text-center">
        <h1 className="text-lg font-bold text-slate-900">
          Edit & Hias Fotomu <span className="text-pink-400">✨</span>
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-400">Atur setiap detail fotomu sesuai keinginan. Tambahkan warna, teks, stiker, dan template untuk hasil yang lebih personal.</p>
      </div>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* LEFT — Sidebar Tools */}
        <div className="w-full shrink-0 border-b border-pink-50 lg:h-full lg:w-[260px] lg:border-b-0 lg:border-r">
          <EditorSidebar />
        </div>

        {/* CENTER — Preview */}
        <div className="flex min-h-[600px] min-w-0 flex-1 flex-col lg:min-h-0">
          <EditorPreview />
        </div>

        {/* RIGHT — Dynamic Panel */}
        <div className="w-full shrink-0 border-t border-pink-50 lg:h-full lg:w-[320px] lg:border-l lg:border-t-0">
          <EditorRightPanel />
        </div>
      </div>

      {/* ═══════════════ BOTTOM BAR ═══════════════ */}
      <EditorBottomBar />
    </div>
  );
}
