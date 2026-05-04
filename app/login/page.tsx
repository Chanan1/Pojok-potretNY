"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      // Success, redirect to creator hub
      window.location.href = "/creator";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center overflow-hidden p-4">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-pink-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-rose-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-violet-200/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
          
          {/* Top Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
              {isLogin ? "Selamat Datang Kembali" : "Mulai Berkarya"}
            </h1>
            <p className="text-sm text-slate-500">
              {isLogin 
                ? "Masuk untuk menyimpan karyamu dan menjelajahi template eksklusif." 
                : "Daftar sekarang untuk menjadi creator di Pojok•Potret."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 pl-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Luna Creative" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all placeholder:text-slate-400"
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 pl-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="lunacreative" 
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all placeholder:text-slate-400"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 pl-1">Email</label>
              <input 
                type="email" 
                placeholder="halo@pojokpotret.id" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1 pr-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {isLogin && (
                  <Link href="#" className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition">Lupa Password?</Link>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-2 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-[0_8px_24px_rgba(236,72,153,0.25)] hover:bg-pink-600 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {isLogin ? "Masuk Sekarang" : "Daftar Sekarang"}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atau</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-bold text-slate-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.0001 2.00018C6.47727 2.00018 2.00012 6.47734 2.00012 12.0002C2.00012 16.9912 5.65706 21.1284 10.4376 21.8853V14.8908H7.89856V12.0002H10.4376V9.79724C10.4376 7.29112 11.9306 5.90709 14.2148 5.90709C15.3089 5.90709 16.4533 6.10265 16.4533 6.10265V8.5619H15.1923C13.95 8.5619 13.5626 9.33324 13.5626 10.1245V12.0002H16.336L15.8927 14.8908H13.5626V21.8853C18.3432 21.1284 22.0001 16.9912 22.0001 12.0002C22.0001 6.47734 17.523 2.00018 12.0001 2.00018Z" fill="#1877F2"/>
                    <path d="M15.8927 14.8908L16.336 12.0002H13.5626V10.1245C13.5626 9.33324 13.95 8.5619 15.1923 8.5619H16.4533V6.10265C16.4533 6.10265 15.3089 5.90709 14.2148 5.90709C10.4376 5.90709 10.4376 7.29112 10.4376 9.79724V12.0002H7.89856V14.8908H10.4376V21.8853C10.9525 21.9642 11.4727 22.0028 12.0001 22.0028C12.5275 22.0028 13.0478 21.9642 13.5626 21.8853V14.8908H15.8927Z" fill="white"/>
                  </svg>
                  <span className="text-xs font-bold text-slate-700">Facebook</span>
                </button>
              </div>
            </>
          )}

          <p className="text-center text-[13px] text-slate-500 mt-6">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-pink-500 font-bold hover:underline"
            >
              {isLogin ? "Daftar Sekarang" : "Masuk di sini"}
            </button>
          </p>

        </div>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          Dengan {isLogin ? "masuk" : "mendaftar"}, kamu menyetujui Syarat Ketentuan & Kebijakan Privasi kami.
        </p>
      </motion.div>
    </div>
  );
}
