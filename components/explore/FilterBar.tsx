"use client";

interface FilterBarProps {
  categories: string[];
  frameCounts: string[];
  selectedCategory: string;
  selectedFrame: string;
  onCategoryChange: (category: string) => void;
  onFrameChange: (frame: string) => void;
}

const categoryIcons: Record<string, string> = {
  Semua: "✦",
  Cute: "🎀",
  Vintage: "📷",
  Minimal: "▢",
  Couple: "💕",
  Fun: "🎉",
  Dark: "🌙",
};

const frameIcons: Record<string, string> = {
  "Semua Frame": "",
  "2 Frame": "▯",
  "3 Frame": "▯▯",
  "4 Frame": "▯▯",
  "6 Frame": "▯▯",
  "8 Frame": "▯▯",
};

export function FilterBar({
  categories,
  frameCounts,
  selectedCategory,
  selectedFrame,
  onCategoryChange,
  onFrameChange,
}: FilterBarProps) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">Pilih Kategori</p>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
                    : "border border-pink-100 bg-white text-slate-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <span className="text-xs">{categoryIcons[category] || "•"}</span>
                <span>{category}</span>
              </button>
            );
          })}
          {/* Scroll hint arrow */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-100 bg-white text-pink-400 transition hover:bg-pink-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Frame Count Filter */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">Jumlah Frame</p>
        <div className="flex flex-wrap gap-2.5">
          {frameCounts.map((frame) => {
            const isActive = selectedFrame === frame;
            return (
              <button
                key={frame}
                onClick={() => onFrameChange(frame)}
                className={`group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
                    : "border border-pink-100 bg-white text-slate-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {frameIcons[frame] && (
                  <span className={`text-[10px] ${isActive ? "text-white/80" : "text-slate-400"}`}>
                    {frameIcons[frame]}
                  </span>
                )}
                <span>{frame}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
