"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import Image from "next/image";
import { useEffect } from "react";

export function UserProfileCard() {
  const { user, stats, checkAuth } = useCreatorStore();

  useEffect(() => {
    // Check auth on mount to get current user
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return (
      <div className="rounded-[24px] border border-pink-50 bg-white p-5 shadow-[0_8px_32px_rgba(250,182,210,0.12)] flex flex-col items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500 mb-4" />
        <p className="text-sm text-slate-400">Memeriksa sesi...</p>
      </div>
    );
  }
  const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="rounded-[24px] border border-pink-50 bg-white p-5 shadow-[0_8px_32px_rgba(250,182,210,0.12)]">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-base font-bold text-white shadow-sm flex items-center justify-center">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <p className="text-[11px] text-slate-400">{user.username}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-pink-400">⭐</span>
          <span>{stats.totalTemplates} Template</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-pink-400">❤️</span>
          <span>{stats.totalLikes >= 1000 ? `${(stats.totalLikes / 1000).toFixed(1)}K` : stats.totalLikes} Disukai</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-pink-400">👥</span>
          <span>{(stats.totalUses / 10).toFixed(1)}K Pengikut</span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-pink-50 pt-4">
        <span className="text-slate-400 transition hover:text-pink-500 cursor-pointer">📷</span>
        <span className="text-slate-400 transition hover:text-pink-500 cursor-pointer">🎵</span>
        <span className="text-slate-400 transition hover:text-pink-500 cursor-pointer">▶️</span>
      </div>
      <p className="mt-3 text-[10px] text-slate-300">© 2024 Pojok-Potret. All rights reserved.</p>
    </div>
  );
}
