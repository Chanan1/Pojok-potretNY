"use client";
import Link from "next/link";

interface ExploreHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ExploreHeader({ searchQuery, onSearchChange }: ExploreHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      {/* Title area */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          Eksplor{" "}
          <span className="font-script text-3xl italic text-pink-500 sm:text-4xl">
            Template
          </span>
          <span className="ml-1 text-pink-400">✦</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-slate-500">
          Temukan ribuan template estetik dari kreator berbakat
        </p>
      </div>

      {/* Right — Search + Upload + Actions */}
      <div className="flex items-center gap-3">
        <label className="relative block">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Cari template, style, atau kreator..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-56 rounded-full border border-pink-100 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:w-72 focus:border-pink-300 focus:ring-2 focus:ring-pink-200/40 lg:w-64 lg:focus:w-80"
          />
        </label>

        <Link href="/creator/upload" className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-[0_12px_32px_rgba(236,72,153,0.35)]">
          Upload Template
        </Link>

        {/* Notification bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-pink-200 hover:text-pink-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500" />
        </button>

        {/* User avatar */}
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-pink-200 bg-gradient-to-br from-pink-100 to-pink-200 shadow-sm">
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-pink-600">
            U
          </div>
        </div>
      </div>
    </div>
  );
}
