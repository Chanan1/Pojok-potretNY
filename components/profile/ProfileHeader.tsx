"use client";

import Image from "next/image";
import Link from "next/link";
import { CreatorUser } from "@/store/useCreatorStore";

interface ProfileHeaderProps {
  user: CreatorUser;
  isOwner: boolean;
}

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const socials = [
    { key: "instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, value: user.socials.instagram, color: "text-pink-500 bg-pink-50" },
    { key: "tiktok", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9a6.34 6.34 0 1 0 5.42 6.28V9.41a8.16 8.16 0 0 0 4.8 1.56v-3.5a4.85 4.85 0 0 1-1-.78z"/></svg>, value: user.socials.tiktok, color: "text-slate-700 bg-slate-50" },
    { key: "twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, value: user.socials.twitter, color: "text-sky-500 bg-sky-50" },
    { key: "website", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, value: user.socials.website, color: "text-emerald-500 bg-emerald-50" },
  ].filter(s => s.value);

  return (
    <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

        {/* Avatar */}
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-visible shrink-0 mx-auto md:mx-0">
          <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-pink-100 shadow-lg bg-white">
            <Image src={user.avatar || "/placeholder-avatar.png"} alt={user.name} fill className="object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 mb-1">{user.name}</h1>
          <p className="text-sm text-slate-500 mb-3">{user.username}</p>

          <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 text-[11px] px-3 py-1.5 rounded-full font-bold border border-pink-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Creator Level {user.level}
          </div>

          {user.bio && (
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mb-4">{user.bio}</p>
          )}

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {socials.map((social) => (
                <span
                  key={social.key}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-100 ${social.color}`}
                >
                  {social.icon}
                  {social.value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {isOwner && (
          <div className="shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            <Link
              href="/creator"
              className="px-6 py-3 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              Edit Profil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
