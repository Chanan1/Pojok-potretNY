"use client";

import Image from "next/image";
import Link from "next/link";
import { CreatorTemplate } from "@/store/useCreatorStore";
import { motion } from "framer-motion";

interface ProfileTemplateGridProps {
  templates: CreatorTemplate[];
  creatorName: string;
}

export function ProfileTemplateGrid({ templates, creatorName }: ProfileTemplateGridProps) {
  const published = templates.filter((t) => t.status === "Dipublikasi");

  return (
    <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
          <button className="px-5 py-2 bg-white text-sm font-bold text-slate-800 rounded-lg shadow-sm border border-slate-100">
            Semua Template
          </button>
          <button className="px-5 py-2 text-sm font-medium text-slate-400 rounded-lg hover:text-slate-600 transition">
            Trending
          </button>
        </div>

        <p className="text-xs font-medium text-slate-500">
          {published.length} template dipublikasikan
        </p>
      </div>

      {/* Grid */}
      {published.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {published.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href="/capture" className="group block">
                <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src={template.previewSrc}
                    alt={template.title}
                    fill
                    className="object-cover p-2 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Bottom Info (appears on hover) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs font-bold truncate">{template.title}</p>
                    <p className="text-white/70 text-[10px]">by {creatorName}</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-3 px-1">
                  <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-pink-500 transition-colors">{template.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    {template.frameCount && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        {template.frameCount} frame
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      {template.likes >= 1000 ? (template.likes / 1000).toFixed(1) + "K" : template.likes}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Belum ada template</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Creator ini belum mempublikasikan template apapun.</p>
        </div>
      )}
    </div>
  );
}
