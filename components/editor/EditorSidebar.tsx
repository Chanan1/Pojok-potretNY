"use client";

import { useEditorStore } from "@/store/useEditorStore";

const TABS: { id: string; label: string; desc: string; icon: string }[] = [
  { id: "layout", label: "Layout", desc: "Ubah susunan frame", icon: "📐" },
  { id: "warna", label: "Warna", desc: "Atur warna & background", icon: "🎨" },
  { id: "filter", label: "Filter", desc: "Tambahkan filter foto", icon: "✨" },
  { id: "teks", label: "Teks", desc: "Tambahkan caption", icon: "T" },
  { id: "template", label: "Template", desc: "Pilih template lainnya", icon: "🖼️" },
  { id: "stiker", label: "Stiker", desc: "Tambahkan stiker lucu", icon: "😊" },
  { id: "upload", label: "Upload", desc: "Unggah desain sendiri", icon: "📤" },
];

export function EditorSidebar() {
  const { activeEditorTab, setActiveEditorTab } = useEditorStore();

  return (
    <div className="flex h-full w-full shrink-0 flex-col bg-white p-4 overflow-y-auto">
      <div className="flex gap-2 lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {TABS.map((tab) => {
          const isActive = activeEditorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveEditorTab(tab.id)}
              className={`flex shrink-0 lg:w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-300 ${
                isActive
                  ? "bg-pink-50 shadow-sm ring-1 ring-pink-100"
                  : "bg-transparent hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                  isActive ? "bg-white text-pink-500 shadow-sm" : "bg-slate-50 text-slate-500"
                }`}
              >
                {tab.icon}
              </div>
              <div className="pr-2 lg:pr-0">
                <p className={`text-sm font-bold whitespace-nowrap ${isActive ? "text-pink-600" : "text-slate-700"}`}>
                  {tab.label}
                </p>
                <p className="hidden text-[10px] text-slate-400 lg:block">{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-pink-50 bg-pink-50/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>💾</span> Simpan sebagai template
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Simpan desain ini untuk digunakan lagi nanti.
          </p>
          <button className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:text-pink-500">
            ⭐ Simpan Template
          </button>
        </div>
      </div>
    </div>
  );
}
