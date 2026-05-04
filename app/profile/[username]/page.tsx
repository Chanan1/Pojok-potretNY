"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTemplateGrid } from "@/components/profile/ProfileTemplateGrid";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { Logo } from "@/components/ui/Logo";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = use(params);
  const { user, stats, templates, fetchProfile } = useCreatorStore();
  const [isLoading, setIsLoading] = useState(true);
  const profileUsername = unwrappedParams.username?.replace("@", "");

  useEffect(() => {
    let isActive = true;
    const username = unwrappedParams.username?.replace("@", "");

    async function loadProfile() {
      if (!username) return;
      setIsLoading(true);
      try {
        await fetchProfile(username);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [unwrappedParams.username, fetchProfile]);

  const cleanUsername = user?.username?.replace("@", "") || "";
  const isOwner = cleanUsername === profileUsername;

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Top Nav Bar (minimal) */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Beranda</Link>
            <Link href="/creator" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Creator Hub</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        {isLoading ? (
          <div className="rounded-[32px] border border-pink-100 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Memuat profil kreator...</p>
            <p className="mt-2 text-sm text-slate-500">Tunggu sebentar, data profil sedang diambil dari database.</p>
          </div>
        ) : (
          <>
            {/* Back Button */}
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
            >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Kembali ke Creator Hub
        </Link>

        {/* Profile Header */}
        {user && <ProfileHeader user={user} isOwner={isOwner} />}

        {/* Stats */}
        <ProfileStats stats={stats} />

        {/* Template Grid */}
        <ProfileTemplateGrid templates={templates} creatorName={user?.name || "Kreator"} />
          </>
        )}
      </div>
    </div>
  );
}
