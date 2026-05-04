"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import type { TemplateItem } from "@/lib/api-client";

interface FeaturedCardProps {
  template: TemplateItem;
}

export function FeaturedCard({ template }: FeaturedCardProps) {
  const router = useRouter();
  const setTotalFrames = useAppStore((state) => state.setTotalFrames);

  const handleUseTemplate = () => {
    setTotalFrames(template.frameCount);
    router.push(`/capture?template=${template.id}&frame=${template.frameCount}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-pink-100/60 bg-gradient-to-br from-pink-50 via-white to-pink-50/80 shadow-[0_16px_48px_rgba(250,182,210,0.2)]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-pink-100/50 blur-3xl" />

      <div className="relative grid gap-6 p-6 sm:grid-cols-[1fr_1.2fr] sm:p-8">
        {/* Left — Info */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-pink-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
            <span>🔥</span> Trending Hari Ini
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {template.name} <span className="text-pink-400">✿</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              {template.description || `Template ${template.category} dengan ${template.frameCount} frame yang siap dipakai.`}
            </p>
          </div>

          <button
            onClick={handleUseTemplate}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-[0_12px_32px_rgba(236,72,153,0.4)]"
          >
            Gunakan Template →
          </button>
        </div>

        {/* Right — Template previews */}
        <div className="flex items-center gap-3">
          {/* Carousel left arrow */}
          <button className="hidden shrink-0 items-center justify-center rounded-full border border-pink-200 bg-white/80 p-2 text-pink-400 shadow-sm backdrop-blur-sm transition hover:bg-pink-50 hover:text-pink-600 sm:flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex min-h-[260px] flex-1 items-stretch gap-3 overflow-hidden">
            {/* Main template image */}
            <div className="relative w-[40%] shrink-0 overflow-hidden rounded-2xl border border-pink-100/60 shadow-md">
              <Image
                src={template.src}
                alt={template.name}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Secondary preview images */}
            <div className="flex w-[60%] gap-2">
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-pink-100/40 bg-pink-50 shadow-sm">
                <Image
                  src={template.src}
                  alt="Preview 2"
                  fill
                  sizes="120px"
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-pink-100/40 bg-pink-50 shadow-sm">
                <Image
                  src={template.src}
                  alt="Preview 3"
                  fill
                  sizes="120px"
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Carousel right arrow */}
          <button className="hidden shrink-0 items-center justify-center rounded-full border border-pink-200 bg-white/80 p-2 text-pink-400 shadow-sm backdrop-blur-sm transition hover:bg-pink-50 hover:text-pink-600 sm:flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom right — Stats */}
      <div className="absolute bottom-4 right-6 hidden items-center gap-4 sm:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white shadow-sm">
            {template.creator.charAt(0)}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-700">Dibuat oleh</p>
            <p className="text-slate-500">{template.creator} <span className="text-blue-500">✓</span></p>
          </div>
        </div>
        <div className="h-8 w-px bg-pink-100" />
        <div className="text-xs text-center">
          <p className="font-bold text-slate-700">❤️ {template.likes.toLocaleString('id-ID')}</p>
          <p className="text-slate-400">Digunakan</p>
        </div>
        <div className="h-8 w-px bg-pink-100" />
        <div className="text-xs text-center">
          <p className="font-bold text-slate-700">⭐ 4.8</p>
          <p className="text-slate-400">Rating</p>
        </div>
      </div>
    </div>
  );
}
