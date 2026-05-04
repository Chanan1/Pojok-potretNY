"use client";

import Link from "next/link";
import Image from "next/image";
import { useCreatorStore } from "@/store/useCreatorStore";
import { Logo } from "@/components/ui/Logo";

export function CreatorNavbar() {
  const { user } = useCreatorStore();

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Logo />

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Beranda
          </Link>
          <Link href="/explore" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Eksplor
          </Link>
          <Link href="/capture" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Buat
          </Link>
          {/* Active Link */}
          <Link href="/creator" className="flex items-center gap-2 text-sm font-bold text-pink-500 relative h-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Creator
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-t-full"></div>
          </Link>
          <Link href="/tentang" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Tentang
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-100 group-hover:border-pink-300 transition-colors">
              <Image src={user?.avatar || "/placeholder-avatar.png"} alt={user?.name || "User"} fill className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{user?.name || "Loading..."}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600 transition-colors"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

      </div>
    </header>
  );
}
