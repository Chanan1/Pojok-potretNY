"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <NavBar />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumb */}
        <div className="pt-6 text-sm text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-600 transition">Beranda</Link>
          <span>›</span>
          <span className="text-slate-600 font-medium">Tentang</span>
        </div>

        {/* === 1. HERO === */}
        <section className="py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div {...fadeUp} className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 px-4 py-1.5 rounded-full text-xs font-bold border border-pink-100">❤️ Tentang Kami</span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
              Tentang <span className="text-pink-500">Pojok•Potret</span> <span className="text-pink-400">✦</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">Mengabadikan momen estetik, dengan cara yang lebih personal</p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">Pojok•Potret adalah platform photobooth digital yang memudahkan kamu membuat foto estetik dengan template unik, editor modern, dan pengalaman yang menyenangkan.</p>
            <Link href="/capture" className="inline-flex items-center gap-2 px-6 py-3.5 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition hover:-translate-y-0.5">
              <span>✦</span> Mulai Buat Sekarang
            </Link>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex-1 relative hidden lg:flex justify-center items-center h-[400px]">
            <HeroIllustration />
          </motion.div>
        </section>
      </div>

      {/* === 2. KISAH === */}
      <section className="bg-slate-50/50 py-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <motion.div {...fadeUp} className="flex-1 space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-[11px] font-bold border border-pink-100">❤️ Kisah Kami</span>
            <h2 className="text-3xl font-black text-slate-800">Berawal dari keinginan <span className="text-pink-500">sederhana</span> <span className="text-pink-400">✦</span></h2>
            <p className="text-sm text-slate-500 leading-relaxed">Kami percaya setiap momen berharga layak untuk diabadikan dengan cara yang istimewa.</p>
            <p className="text-sm text-slate-500 leading-relaxed">Berawal dari kecintaan kami pada photobooth dan desain estetik, kami ingin menciptakan platform yang mudah digunakan, bebas berkreasi, dan bisa dinikmati oleh siapa saja.</p>
            <p className="text-sm text-slate-500 leading-relaxed">Kini, Pojok•Potret hadir untuk menjadi bagian dari momen terbaikmu, kapan pun dan di mana pun.</p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex-1 rounded-[32px] overflow-hidden shadow-xl bg-pink-100 aspect-[4/3] relative">
            <Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="Story" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* === 3. VISI & MISI === */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-[11px] font-bold border border-pink-100 mb-4">❤️ Visi & Misi</span>
            <h2 className="text-3xl font-black text-slate-800">Apa yang ingin kami capai <span className="text-pink-400">✦</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center"><span className="text-2xl">🎯</span></div>
                <h3 className="text-xl font-bold text-pink-500">Visi</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Menjadi platform photobooth digital paling estetik, mudah digunakan, dan menginspirasi kreativitas tanpa batas.</p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center"><span className="text-2xl">🚀</span></div>
                <h3 className="text-xl font-bold text-pink-500">Misi</h3>
              </div>
              <ul className="space-y-3">
                {["Memberikan pengalaman photobooth yang menyenangkan dan mudah untuk semua orang.", "Menyediakan template estetik dan tools kreatif yang selalu berkembang.", "Mendukung kreator untuk berbagi karya dan menginspirasi komunitas."].map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>{m}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === 4. VALUES === */}
      <section className="bg-slate-50/50 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-[11px] font-bold border border-pink-100 mb-4">❤️ Kenapa Memilih Pojok•Potret?</span>
            <h2 className="text-3xl font-black text-slate-800">Pengalaman <span className="text-pink-500">terbaik</span> untuk kamu <span className="text-pink-400">✦</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🖱️", title: "Mudah Digunakan", desc: "Antarmuka yang simpel dan intuitif, bisa digunakan siapa saja." },
              { icon: "🎨", title: "Template Estetik", desc: "Ratusan template unik yang selalu diperbarui setiap minggunya." },
              { icon: "⭐", title: "Editor Lengkap", desc: "Edit foto, tambahkan filter, stiker, teks, dan dekorasi sesuai gayamu." },
              { icon: "⬇️", title: "Hasil Berkualitas", desc: "Unduh foto beresolusi tinggi dan bagikan ke media sosial favoritmu." },
            ].map((v, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-white rounded-[24px] p-6 text-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">{v.icon}</span></div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 5. CREATOR CTA === */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div {...fadeUp} className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-[32px] p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative shadow-2xl shadow-pink-200">
            <div className="absolute top-8 right-8 text-white/20 text-6xl">✦</div>
            <div className="absolute bottom-4 left-16 text-white/10 text-4xl">❤️</div>
            <div className="flex-1 relative z-10">
              <div className="w-full max-w-[360px] aspect-[4/3] bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center p-4">
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  <div className="bg-white/20 rounded-xl"></div>
                  <div className="bg-white/20 rounded-xl"></div>
                  <div className="bg-white/30 rounded-xl col-span-2"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-5 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm">☆ Dibuat untuk Kreator</span>
              <h2 className="text-3xl font-black text-white leading-tight">Ekspresikan <span className="text-pink-200">kreativitasmu</span> dan inspirasi semua orang</h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-md">Buat template photobooth-mu sendiri dan bagikan ke komunitas Pojok•Potret. Karyamu bisa menjadi bagian dari momen berharga banyak orang.</p>
              <Link href="/creator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-xl text-sm font-bold hover:bg-pink-50 transition shadow-md">
                Mulai Jadi Creator <span>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === 6. FINAL CTA === */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800">Siap mengabadikan momen terbaikmu?</h2>
            <p className="text-sm text-slate-500">Buat, edit, dan bagikan fotomu sekarang juga →</p>
          </div>
          <Link href="/capture" className="px-8 py-3.5 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition hover:-translate-y-0.5 flex items-center gap-2 shrink-0">
            Mulai Buat Sekarang <span>→</span>
          </Link>
        </div>
      </section>

      {/* === 7. FOOTER === */}
      <Footer />
    </div>
  );
}

/* ---- Sub Components ---- */

function NavBar() {
  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {[{ href: "/", label: "Beranda" }, { href: "/explore", label: "Eksplor" }, { href: "/capture", label: "Buat" }, { href: "/creator", label: "Creator" }].map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">{l.label}</Link>
          ))}
          <Link href="/tentang" className="text-sm font-bold text-pink-500">Tentang</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/creator/settings" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition hidden sm:block">Dinda A.</Link>
        </div>
      </div>
    </header>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-8 w-28 h-48 bg-white rounded-xl shadow-xl transform rotate-6 p-1.5 pb-4 border border-slate-100 flex flex-col gap-1.5 z-10">
        <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
        <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
        <div className="flex-1 bg-pink-100 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="strip" fill className="object-cover" /></div>
      </div>
      <div className="absolute top-12 left-8 w-24 h-40 bg-white rounded-xl shadow-lg transform -rotate-12 p-1.5 pb-3 border border-slate-100 flex flex-col gap-1 z-20">
        <div className="flex-1 bg-slate-200 rounded relative overflow-hidden"><Image src="/templates/4 Foto/Black and White Vintage Photostrip Template.png" alt="strip" fill className="object-cover opacity-80" /></div>
        <div className="flex-1 bg-slate-200 rounded relative overflow-hidden"><Image src="/templates/4 Foto/Black and White Vintage Photostrip Template.png" alt="strip" fill className="object-cover opacity-80" /></div>
      </div>
      <div className="absolute bottom-8 right-1/4 w-32 h-52 bg-white rounded-xl shadow-2xl transform -rotate-3 p-2 pb-5 border border-slate-100 flex flex-col gap-1.5 z-30">
                <div className="flex-1 bg-rose-50 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Colorful Cute Retro Groovy Love My Buddie PhotoStrip.png" alt="strip" fill className="object-cover" /></div>
                <div className="flex-1 bg-rose-50 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Colorful Cute Retro Groovy Love My Buddie PhotoStrip.png" alt="strip" fill className="object-cover" /></div>
        <div className="flex-1 bg-rose-50 rounded-lg relative overflow-hidden"><Image src="/templates/4 Foto/Colorful Cute Retro Groovy Love My Buddie PhotoStrip.png" alt="strip" fill className="object-cover" /></div>
      </div>
      <div className="absolute top-2 left-1/2 text-pink-300 text-3xl opacity-60 animate-pulse">🌸</div>
      <div className="absolute bottom-4 right-4 text-pink-300 text-2xl opacity-50">✨</div>
      <div className="absolute top-1/2 right-2 text-pink-200 text-xl opacity-40">❤️</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-14 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Mengabadikan momen estetik, dengan cara yang lebih personal ✨</p>
            <div className="flex gap-2">
              {["ig", "tt", "yt", "mail"].map(s => <div key={s} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-pink-50 hover:text-pink-500 transition cursor-pointer text-xs">●</div>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Platform</h4>
            <ul className="space-y-2">{["Beranda", "Eksplor", "Buat", "Creator"].map(l => <li key={l}><Link href="/" className="text-xs text-slate-500 hover:text-pink-500 transition">{l}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Informasi</h4>
            <ul className="space-y-2">{["Tentang Kami", "Kebijakan Privasi", "Syarat & Ketentuan", "FAQ"].map(l => <li key={l}><span className={`text-xs ${l === "Tentang Kami" ? "text-pink-500 font-bold" : "text-slate-500"}`}>{l}</span></li>)}</ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Dukungan</h4>
            <ul className="space-y-2">{["Bantuan", "Hubungi Kami", "Laporkan Konten"].map(l => <li key={l}><span className="text-xs text-slate-500">{l}</span></li>)}</ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Newsletter</h4>
            <p className="text-[11px] text-slate-500 mb-3">Dapatkan update terbaru & template estetik setiap minggunya!</p>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden pr-1">
              <input placeholder="Masukkan email kamu" className="flex-1 px-3 py-2 bg-transparent text-xs outline-none" />
              <button className="w-8 h-8 bg-pink-500 text-white rounded-lg flex items-center justify-center shrink-0 hover:bg-pink-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-6 text-center">
          <p className="text-[11px] text-slate-400">© 2025 Pojok•Potret. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
