"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppStore } from "@/store/useAppStore";
import { CameraPanel } from "@/components/capture/CameraPanel";
import { SettingsPanel } from "@/components/capture/SettingsPanel";
import { ProgressPanel } from "@/components/capture/ProgressPanel";
import { Logo } from "@/components/ui/Logo";

export default function CapturePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#fdf6f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
          <p className="text-sm text-slate-400">Memuat sesi...</p>
        </div>
      </div>
    }>
      <CapturePageContent />
    </Suspense>
  );
}

function CapturePageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const setSelectedTemplateId = useAppStore((state) => state.setSelectedTemplateId);

  useEffect(() => {
    if (templateId) {
      setSelectedTemplateId(templateId);
      
      // Track usage when a template is selected for a session
      const trackTemplateUsage = async () => {
        try {
          const { trackUsage } = await import("@/lib/api-client");
          await trackUsage(templateId);
        } catch (err) {
          console.error("Failed to track template usage:", err);
        }
      };
      
      trackTemplateUsage();
    }
  }, [templateId, setSelectedTemplateId]);

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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(236,72,153,0.3)]">2</div>
            <span className="text-[11px] font-bold text-pink-600">Atur Sesi</span>
          </div>
          <div className="h-px w-10 bg-pink-100" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-400">3</div>
            <span className="text-[11px] text-slate-400">Edit & Hias</span>
          </div>
        </div>

        {/* Back */}
        <Link href="/" className="rounded-full border border-pink-100 bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
          ← Kembali ke Pilih Mode
        </Link>
      </header>

      {/* ═══════════════ TITLE ═══════════════ */}
      <div className="shrink-0 border-b border-pink-50 bg-white px-5 py-3 text-center">
        <h1 className="text-lg font-bold text-slate-900">
          Siap untuk sesi fotomu? <span className="text-pink-400">✨</span>
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-400">Atur kamera, timer, dan ambil fotomu dengan mudah.</p>
      </div>

      {/* ═══════════════ MAIN 3-PANEL ═══════════════ */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* LEFT — Settings */}
        <div className="w-full shrink-0 border-b border-pink-50 bg-white p-3.5 lg:w-[270px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <SettingsPanel />
        </div>

        {/* CENTER — Camera */}
        <div className="flex min-h-[600px] min-w-0 flex-1 flex-col lg:min-h-0">
          <CameraPanel />
        </div>

        {/* RIGHT — Preview */}
        <div className="w-full shrink-0 border-t border-pink-50 bg-white p-3.5 lg:w-[240px] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <ProgressPanel />
        </div>
      </div>
    </div>
  );
}
