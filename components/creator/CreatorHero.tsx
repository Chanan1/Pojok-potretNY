"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CreatorHero() {
  const { user, stats, checkAuth } = useCreatorStore();

  useEffect(() => {
    // Check auth on mount
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return (
      <section className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-r from-pink-50/80 via-white to-pink-50/30 flex items-center justify-center p-10 lg:p-14 shadow-[0_4px_24px_rgba(250,182,210,0.15)] border border-pink-100/50 min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
          <p className="text-slate-500 font-medium">Memeriksa sesi Creator...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-r from-pink-50/80 via-white to-pink-50/30 flex flex-col lg:flex-row items-center justify-between p-10 lg:p-14 shadow-[0_4px_24px_rgba(250,182,210,0.15)] border border-pink-100/50">
      
      {/* Decorative sparkle icons */}
      <div className="absolute top-12 right-1/3 text-pink-300 opacity-60 text-2xl">✨</div>
      <div className="absolute bottom-16 left-1/4 text-pink-300 opacity-60 text-xl">✨</div>

      {/* LEFT: Title & Subtitle */}
      <div className="flex-1 space-y-6 z-10 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-[44px] font-black text-slate-800 tracking-tight leading-tight flex items-center gap-3"
        >
          Creator Hub <span className="text-pink-500">✦</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-base lg:text-lg max-w-sm leading-relaxed"
        >
          Berkreasilah, bagikan karyamu, dan jadi inspirasi untuk semua orang ✨
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-white/60 text-pink-600 px-4 py-2.5 rounded-full text-xs font-bold border border-pink-100 backdrop-blur-sm shadow-sm"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm">
            🎨
          </div>
          <span className="text-slate-600 font-medium">Kamu sudah membuat {stats.totalTemplates} template</span>
        </motion.div>
      </div>

      {/* CENTER: Illustration */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="hidden lg:flex flex-1 justify-center items-center relative h-[280px] z-10"
      >
        {/* Abstract Folder Illustration */}
        <div className="relative w-full max-w-[300px] h-[220px]">
          {/* Back of folder */}
          <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-pink-200 rounded-3xl transform -rotate-2 origin-bottom-left shadow-inner"></div>
          
          {/* Photostrips popping out */}
          <div className="absolute top-[-40px] left-[30px] w-20 h-44 bg-white p-1.5 pb-4 rounded-xl shadow-lg transform -rotate-12 border border-slate-100 flex flex-col gap-1.5 transition-transform hover:-translate-y-4 hover:rotate-[-5deg] duration-500 cursor-pointer">
            <div className="flex-1 bg-slate-200 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Black and White Vintage Photostrip Template.png" alt="strip" fill className="object-cover opacity-80" /></div>
            <div className="flex-1 bg-slate-200 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Black and White Vintage Photostrip Template.png" alt="strip" fill className="object-cover opacity-80" /></div>
            <div className="flex-1 bg-slate-200 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Black and White Vintage Photostrip Template.png" alt="strip" fill className="object-cover opacity-80" /></div>
          </div>

          <div className="absolute top-[-60px] right-[40px] w-24 h-52 bg-white p-2 pb-5 rounded-xl shadow-xl transform rotate-6 border border-slate-100 flex flex-col gap-2 transition-transform hover:-translate-y-4 hover:rotate-[-2deg] duration-500 cursor-pointer z-10">
            <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
            <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
            <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
          </div>
          
          {/* Front of folder */}
          <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-tr from-pink-400 to-pink-300 rounded-3xl transform rotate-2 origin-bottom-right shadow-[0_12px_32px_rgba(236,72,153,0.3)] z-20 flex items-start justify-center pt-4">
             <div className="w-16 h-2 bg-pink-500/30 rounded-full"></div>
          </div>

          {/* Flower decorative icon */}
          <div className="absolute -right-4 bottom-10 z-30 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
             <span className="text-3xl animate-pulse">🌸</span>
          </div>
        </div>
      </motion.div>

      {/* RIGHT: Profile Card */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white min-w-[300px] w-full lg:w-auto z-10 relative mt-8 lg:mt-0"
      >
        <p className="text-sm font-bold text-slate-800 mb-6">Creator Kamu</p>
        
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-visible mb-4">
            <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white">
              <Image src={user.avatar || "/placeholder-avatar.png"} alt={user.name} fill className="object-cover" />
            </div>
            {/* Edit pencil badge */}
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 cursor-pointer hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </div>
          </div>
          
          <h3 className="font-bold text-xl text-slate-800">{user.name}</h3>
          <p className="text-sm text-slate-500 mb-3">{user.username}</p>
          <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 text-[11px] px-3 py-1.5 rounded-full font-bold border border-pink-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Creator Level {user.level}
          </div>
        </div>
        
        <div className="relative w-full space-y-3">
          <Link 
            href="/creator/settings"
            className="w-full py-3.5 bg-pink-500 text-white text-sm font-bold rounded-xl hover:bg-pink-600 transition shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            Edit Akun →
          </Link>
          
          <Link href={`/profile/${user.username.replace('@', '')}`} className="w-full py-3.5 bg-slate-50/50 text-slate-400 text-sm font-bold rounded-xl border border-transparent hover:bg-slate-100 hover:text-slate-600 transition text-center block">
            Lihat Portofolio
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
