"use client";

import Image from "next/image";

type TemplateCardProps = {
  title: string;
  description: string;
  stat: string;
  label?: string;
  accent?: string;
  src?: string;
};

export function TemplateCard({ title, description, stat, label, src }: TemplateCardProps) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-[0_2px_12px_rgba(250,182,210,0.1)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-[0_16px_40px_rgba(236,72,153,0.14)]">
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-pink-50/50">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 16vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100">
            <div className="grid grid-cols-2 gap-1.5 p-3">
              <div className="h-16 rounded-xl bg-gradient-to-br from-pink-100 via-white to-pink-200" />
              <div className="h-16 rounded-xl bg-gradient-to-br from-white via-pink-50 to-pink-100" />
              <div className="h-16 rounded-xl bg-gradient-to-br from-pink-200 via-pink-100 to-white" />
              <div className="h-16 rounded-xl bg-gradient-to-br from-white via-pink-50 to-pink-200" />
            </div>
          </div>
        )}

        {/* Premium badge */}
        <div className="absolute left-2.5 top-2.5">
          <span className="rounded-md bg-pink-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {label ?? "Premium"}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/15">
          <button className="translate-y-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-pink-600 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Gunakan →
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}
