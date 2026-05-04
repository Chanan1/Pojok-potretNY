"use client";

import { useMemo, useState, useEffect } from "react";
import { FilterBar } from "@/components/explore/FilterBar";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { FeaturedCard } from "@/components/explore/FeaturedCard";
import { Sidebar } from "@/components/explore/Sidebar";
import { TemplateCard } from "@/components/explore/TemplateCard";
import { UserProfileCard } from "@/components/explore/UserProfileCard";
import type { TemplateItem } from "@/lib/api-client";

const categories = ["Semua", "Cute", "Vintage", "Minimal", "Couple", "Fun", "Dark"];
const frameCounts = ["Semua Frame", "2 Frame", "3 Frame", "4 Frame", "6 Frame", "8 Frame"];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedFrame, setSelectedFrame] = useState("Semua Frame");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // API State
  const [apiTemplates, setApiTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      setIsLoading(true);
      setError(null);
      try {
        const { fetchTemplates } = await import("@/lib/api-client");
        const frameCount = selectedFrame !== "Semua Frame" ? parseInt(selectedFrame) : undefined;

        const res = await fetchTemplates({
          category: selectedCategory !== "Semua" ? selectedCategory : undefined,
          frameCount,
          search: searchQuery || undefined,
          limit: 50,
        });

        if (res.success && res.data) {
          setApiTemplates(res.data);
        } else {
          console.error("Failed to load templates from API", res.error || res);
          setApiTemplates([]);
          setError(res.error || "Gagal memuat template dari server.");
        }
      } catch (err) {
        console.error("Failed to load templates from API", err);
        setApiTemplates([]);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat template.");
      } finally {
        setIsLoading(false);
      }
    }
    
    // Add a small debounce for search
    const timer = setTimeout(() => {
      loadTemplates();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedFrame, searchQuery]);

  // Use the fetched templates and apply local filter controls for category, frame count, and search.
  const filteredTemplates = useMemo(() => {
    return apiTemplates.filter((template) => {
      const categoryMatch = selectedCategory === "Semua" || template.category.toLowerCase() === selectedCategory.toLowerCase();
      const frameMatch = selectedFrame === "Semua Frame" || template.frameCount === parseInt(selectedFrame);
      const searchMatch = searchQuery === "" || template.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && frameMatch && searchMatch;
    });
  }, [apiTemplates, selectedCategory, selectedFrame, searchQuery]);

  const featuredTemplate = apiTemplates.length > 0 ? (apiTemplates.find((t) => t.id === "t12" || t.id?.includes('12')) ?? apiTemplates[0]) : null;

  return (
    <div className="min-h-screen bg-[#fdf6f9]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Left Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar active="Eksplor" />
              <div className="mt-6">
                <UserProfileCard />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 space-y-7">
            {/* Header with Search */}
            <ExploreHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Filters */}
            <div className="rounded-[24px] border border-pink-50 bg-white p-5 shadow-[0_4px_20px_rgba(250,182,210,0.1)]">
              <FilterBar
                categories={categories}
                frameCounts={frameCounts}
                selectedCategory={selectedCategory}
                selectedFrame={selectedFrame}
                onCategoryChange={setSelectedCategory}
                onFrameChange={setSelectedFrame}
              />

              {/* Info row */}
              <div className="mt-5 flex items-center justify-between border-t border-pink-50 pt-4">
                <p className="text-sm text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-600">{filteredTemplates.length}</span> template
                </p>
                <div className="flex items-center gap-3">
                  <select className="rounded-lg border border-pink-100 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none transition focus:border-pink-300">
                    <option>Terbaru</option>
                    <option>Terpopuler</option>
                    <option>Rating</option>
                  </select>
                  <div className="flex gap-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-100 bg-white text-slate-400 transition hover:text-slate-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured / Trending */}
            {featuredTemplate ? (
              <FeaturedCard template={featuredTemplate} />
            ) : (
              !isLoading && !error && (
                <div className="rounded-[28px] border border-pink-50 bg-white p-6 text-center text-slate-600 shadow-sm">
                  <p className="text-lg font-semibold">Belum ada template unggulan.</p>
                  <p className="mt-2 text-sm text-slate-400">Template akan muncul di sini setelah data berhasil dimuat.</p>
                </div>
              )
            )}

            {/* Template Grid */}
            <section className="space-y-6">
              {error && (
                <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700 shadow-sm">
                  <p className="font-semibold">Gagal memuat template</p>
                  <p className="mt-2">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="rounded-[24px] border border-pink-50 bg-white p-12 text-center shadow-sm">
                  <p className="text-base text-slate-500">Memuat template...</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        id={template.id}
                        name={template.name}
                        src={template.src}
                        category={template.category}
                        frameCount={template.frameCount}
                        likes={template.likes}
                        creator={template.creator}
                      />
                    ))}
                  </div>

                  {filteredTemplates.length === 0 && !error && (
                    <div className="rounded-[24px] border border-pink-50 bg-white p-12 text-center shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-700">Belum ada template</h3>
                      <p className="mt-3 text-sm text-slate-500">Saat ini belum ada template yang tersedia untuk kategori atau filter ini.</p>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    {filteredTemplates.length > 0 && (
                      <button 
                        onClick={() => {
                          setIsLoadingMore(true);
                          setTimeout(() => {
                            setIsLoadingMore(false);
                            alert('Semua template sudah dimuat!');
                          }, 1000);
                        }}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 rounded-full border border-pink-200 bg-white px-8 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-md disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isLoadingMore ? "Memuat..." : "Muat lebih banyak"}
                        {!isLoadingMore && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-[0_8px_24px_rgba(236,72,153,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:shadow-[0_12px_32px_rgba(236,72,153,0.45)]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
