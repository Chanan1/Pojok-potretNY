"use client";

import { motion } from "framer-motion";
import { FeaturePill } from "@/components/landing/feature-pill";
import { StepCard } from "@/components/landing/step-card";
import { TemplateCard } from "@/components/landing/template-card";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useCreatorStore } from "@/store/useCreatorStore";
import { useAppStore } from "@/store/useAppStore";

const heroFeatures = ["HD Photo", "Timer Otomatis", "Template Eksklusif", "Filter Estetik", "Stiker Lucu"];

const stats = [
  { value: "1M+", label: "Foto Tersimpan", icon: "📸" },
  { value: "20K+", label: "Template Estetik", icon: "💎" },
  { value: "10K+", label: "Creator Aktif", icon: "🎨" },
  { value: "4.9/5", label: "Rating Pengguna", icon: "⭐" },
];

const exploreCards = [
  { title: "Cherry Pop", count: "1.2K", src: "/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" },
  { title: "Classic", count: "856", src: "/templates/4 Foto/Black and White Vintage Photostrip Template.png" },
  { title: "Weekend", count: "1.5K", src: "/templates/3 Foto/Beige Modern Fashion Playlist Cover Photostrip.png" },
  { title: "Sweet Time", count: "932", src: "/templates/3 Foto/Blue Yellow and Pink Illustrative Birthday Photo Strip.png" },
  { title: "Flower Bride", count: "743", src: "/templates/2 Foto/Pink and White Fun Friendship Photostrip Bookmark.png" },
  { title: "Cloud Alice", count: "964", src: "/templates/6 Foto/Minimalist Aesthetic Photo Collage Polaroid Frame Instagram Story.png" },
];

const templatePicks = [
  { title: "Pink Blossom", description: "3 Foto", label: "Premium", stat: "Top", src: "/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" },
  { title: "Minimal Beige", description: "4 Foto", label: "Premium", stat: "Best", src: "/templates/4 Foto/White and Grey Minimalist Photostrip.png" },
  { title: "Vintage Film", description: "3 Foto", label: "Premium", stat: "Hot", src: "/templates/4 Foto/Black and White Vintage Photostrip Template.png" },
  { title: "Blue Sky", description: "4 Foto", label: "Premium", stat: "New", src: "/templates/3 Foto/Blue and White Bright Sky Cloud Style Summer Photo Studio Photostrip.png" },
  { title: "Y2K Vibes", description: "2 Foto", label: "Premium", stat: "Cool", src: "/templates/2 Foto/White and Red Modern Friends Photostrip Bookmark (1).png" },
  { title: "Cute Diary", description: "3 Foto", label: "Premium", stat: "Cute", src: "/templates/3 Foto/Black and Beige Retro Portraits Photo Booth Bookmark.png" },
];

const steps = [
  { title: "Pilih Template", description: "Pilih template favoritmu dari berbagai kategori." },
  { title: "Ambil Foto", description: "Ambil foto dengan timer otomatis atau upload fotomu." },
  { title: "Edit & Simpan", description: "Tambahkan filter, stiker, dan teks. Simpan & bagikan hasilnya!" },
];

const testimonials = [
  { quote: "Template-nya lucu dan estetik banget! Gampang dipakai juga.", name: "Dinda A.", role: "Pengguna" },
  { quote: "Hasil fotonya HD dan editnya super lengkap. Wajib banget dicoba!", name: "Rizky F.", role: "Pengguna" },
  { quote: "Aku suka banget fitur stikernya, lengkap dan gemesin!", name: "Salsa N.", role: "Pengguna" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function LandingPage() {
  const router = useRouter();
  const { user } = useCreatorStore();
  const { clearSession } = useAppStore();

  const handleStartCapture = () => {
    clearSession();
    router.push("/capture");
  };

  return (
    <div className="min-h-screen bg-[#fdf6f9] text-slate-900 relative overflow-hidden">
      {/* Floating petals */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-[8%] text-3xl opacity-15 animate-bounce">🌸</div>
        <div className="absolute top-52 right-[12%] text-2xl opacity-10 animate-pulse">🌸</div>
        <div className="absolute bottom-60 left-[15%] text-xl opacity-10 animate-bounce" style={{ animationDelay: "1.5s" }}>🌸</div>
        <div className="absolute top-[70%] right-[8%] text-2xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}>🌸</div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        {/* ═══════════════ NAVBAR ═══════════════ */}
        <header className="flex items-center justify-between rounded-2xl">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex">
            <Link href="/" className="font-semibold text-pink-600">Beranda</Link>
            <Link href="/explore" className="transition hover:text-slate-800">Eksplor</Link>
            <Link href="/capture" className="transition hover:text-slate-800">Buat</Link>
            <Link href="/creator" className="transition hover:text-slate-800">Creator</Link>
            <Link href="/tentang" className="transition hover:text-slate-800">Tentang</Link>
          </nav>
          <div className="flex items-center gap-3">
            {(user && (user.username !== "demo" || user.email !== "demo@pojokpotret.id")) ? (
              <Link href="/creator" className="flex items-center gap-2 pr-1 group">
                <div className="hidden sm:block text-right">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[9px] text-slate-400 leading-tight">{user.username}</p>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden relative group-hover:border-pink-200 transition-colors">
                  <Image src={user.avatar || "/placeholder-avatar.png"} alt={user.name} fill className="object-cover" />
                </div>
              </Link>
            ) : (
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Masuk</Link>
            )}
            <button onClick={handleStartCapture} className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600">
              Siap Mulai →
            </button>
          </div>
        </header>

        {/* ═══════════════ HERO ═══════════════ */}
        <motion.section id="home" className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]" variants={stagger} initial="hidden" animate="visible">
          <div className="max-w-xl space-y-6">
            <motion.div className="inline-flex rounded-full bg-pink-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-pink-600 shadow-sm" variants={fadeUp}>
              ✦ Photo Booth Digital #1
            </motion.div>
            <motion.div className="space-y-4" variants={fadeUp}>
              <h1 className="text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl leading-[1.15]">
                Abadikan Momen{" "}<br />
                <span className="italic text-pink-500 font-script">Estetik</span> Bersama
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                Ambil foto terbaikmu dengan berbagai mode, template eksklusif, dan edit semudah sentuhan jari.
              </p>
            </motion.div>
            <motion.div className="flex flex-wrap items-center gap-3" variants={fadeUp}>
              <button onClick={handleStartCapture} className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600">
                Mulai Buat Sekarang →
              </button>
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">▶</span>
                Lihat Demo
              </button>
            </motion.div>
            <motion.div className="flex flex-wrap items-center gap-x-5 gap-y-2" variants={fadeUp}>
              {heroFeatures.map((f) => <FeaturePill key={f} label={f} />)}
            </motion.div>
          </div>

          {/* Hero photo strip mockup */}
          <motion.div className="relative flex justify-center lg:justify-end" variants={fadeUp}>
            <div className="relative w-full max-w-[340px]">
              <div className="overflow-hidden rounded-[32px] border border-pink-100/60 bg-white/80 p-4 shadow-[0_24px_64px_rgba(250,182,210,0.22)] backdrop-blur-sm">
                <div className="rounded-[26px] border border-pink-100/50 bg-pink-50/60 p-4">
                  <p className="mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">Today is a good day <span className="text-pink-400">💖</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {["/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png", "/templates/3 Foto/Beige Modern Fashion Playlist Cover Photostrip.png", "/templates/4 Foto/Colorful Cute Summer Photostrip.png", "/templates/2 Foto/Pink and White Fun Friendship Photostrip Bookmark.png"].map((src, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-2xl border border-pink-50 bg-pink-50 shadow-inner">
                        <Image src={src} alt={`preview-${i}`} fill sizes="150px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-2.5 text-sm shadow-sm">
                  <span className="text-slate-500">Good vibes <span className="text-pink-400">💕</span></span>
                  <span className="text-xs text-slate-400">00:24</span>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -right-4 bottom-16 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lg shadow-md">😊</div>
              <div className="absolute -left-3 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-base shadow-md">🌸</div>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <motion.section className="mt-14 rounded-2xl border border-pink-50 bg-white px-6 py-6 shadow-[0_4px_20px_rgba(250,182,210,0.1)]" variants={stagger} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="flex items-center gap-3" variants={fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xl">{stat.icon}</div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════ EKSPLOR TEMPLATE ═══════════════ */}
        <motion.section id="explore" className="mt-16" variants={stagger} initial="hidden" animate="visible">
          <motion.div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" variants={fadeUp}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">✦ Temukan inspirasi terbaik ✦</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Eksplor Template & Hasil <span className="font-script italic text-pink-500">Terbaik</span>
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">Ribuan template estetik dan hasil kreatif dari komunitas Pojok-Potret.</p>
            </div>
            <Link href="/explore" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-semibold text-pink-600 transition hover:bg-pink-50">
              Lihat Semua →
            </Link>
          </motion.div>

          <motion.div className="relative mt-8" variants={fadeUp}>
            {/* Navigation arrows */}
            <button className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-pink-100 bg-white/90 p-2 text-pink-400 shadow-md backdrop-blur-sm transition hover:bg-pink-50 lg:flex">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-pink-100 bg-white/90 p-2 text-pink-400 shadow-md backdrop-blur-sm transition hover:bg-pink-50 lg:flex">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex w-max gap-4">
                {exploreCards.map((item, i) => (
                  <motion.div key={item.title} className="group w-[160px] shrink-0 cursor-pointer" variants={fadeUp} transition={{ delay: i * 0.06 }}>
                    <div className="relative aspect-[3/4.5] overflow-hidden rounded-2xl border border-pink-100/60 bg-pink-50/40 shadow-[0_2px_12px_rgba(250,182,210,0.1)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(236,72,153,0.15)]">
                      <Image src={item.src} alt={item.title} fill sizes="160px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-pink-600">{item.title} 🌸</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">♥ {item.count}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════════════ CARA KERJA ═══════════════ */}
        <motion.section id="workflow" className="mt-16" variants={stagger} initial="hidden" animate="visible">
          <motion.div className="mb-8 text-center" variants={fadeUp}>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cara Kerja <span className="text-pink-400">✦</span></h2>
          </motion.div>
          <motion.div className="grid gap-4 sm:grid-cols-3" variants={fadeUp}>
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <StepCard index={i + 1} title={step.title} description={step.description} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════ TEMPLATE PILIHAN ═══════════════ */}
        <motion.section id="template" className="mt-16" variants={stagger} initial="hidden" animate="visible">
          <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" variants={fadeUp}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">✦ Pilihan Terfavorit ✦</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Template Pilihan</h2>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-pink-500 transition hover:text-pink-600">Lihat semua →</Link>
          </motion.div>
          <motion.div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" variants={fadeUp}>
            {templatePicks.map((t, i) => (
              <motion.div key={t.title} variants={fadeUp} transition={{ delay: i * 0.06 }}>
                <TemplateCard title={t.title} description={t.description} stat={t.stat} label={t.label} src={t.src} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════ CREATOR CTA ═══════════════ */}
        <motion.section id="creator" className="mt-16 overflow-hidden rounded-[28px] border border-pink-100/60 bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-[0_8px_32px_rgba(250,182,210,0.15)]" variants={stagger} initial="hidden" animate="visible">
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[0.4fr_1fr]">
            {/* Left image collage */}
            <motion.div className="relative hidden h-full min-h-[200px] overflow-hidden rounded-2xl lg:block" variants={fadeUp}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500 text-2xl text-white shadow-lg">👑</div>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <div className="relative h-24 w-20 overflow-hidden rounded-xl border border-pink-100 shadow-sm">
                  <Image src="/templates/4 Foto/Pink and White Fun Cute Grand Opening Photo Studio Photostrip.png" alt="creator1" fill sizes="80px" className="object-cover" />
                </div>
                <div className="relative h-24 w-20 overflow-hidden rounded-xl border border-pink-100 shadow-sm">
                  <Image src="/templates/3 Foto/Beige Modern Fashion Playlist Cover Photostrip.png" alt="creator2" fill sizes="80px" className="object-cover" />
                </div>
              </div>
            </motion.div>

            {/* Right content */}
            <motion.div className="space-y-4" variants={fadeUp}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">✦ Jadilah bagian dari komunitas kreatif</p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Jadi Creator Templaia</h2>
              <p className="text-sm text-slate-500">Tunjukkan karyamu ke ribuan pengguna!</p>
              <div className="flex flex-wrap gap-3">
                {["Upload template karyamu", "Dapatkan exposure & pengikut", "Kesempatan jadi creator populer"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="text-pink-400">✦</span>{t}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button onClick={() => router.push("/creator/upload")} className="rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600">
                  Mulai Upload →
                </button>
                <span className="text-xs text-pink-500 cursor-pointer hover:underline">Pelajari lebih lanjut</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <motion.section id="testimonials" className="mt-16" variants={stagger} initial="hidden" animate="visible">
          <motion.div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" variants={fadeUp}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">✦ Apa Kata Mereka ✦</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Pengguna Bahagia</h2>
            </div>
            <a href="#" className="text-xs font-semibold text-pink-500 transition hover:text-pink-600">Lihat semua ulasan →</a>
          </motion.div>
          <motion.div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={fadeUp}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} transition={{ delay: i * 0.08 }}>
                <TestimonialCard quote={t.quote} name={t.name} role={t.role} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer id="footer" className="mt-16 rounded-[24px] bg-white border border-pink-50 px-6 py-10 shadow-[0_4px_20px_rgba(250,182,210,0.08)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-sm text-white shadow-sm">✦</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Pojok-Potret</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Photo Booth Digital</p>
                </div>
              </div>
              <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-slate-400">Abadikan momen terbaikmu dengan photobooth digital paling estetik.</p>
              <div className="mt-4 flex gap-2.5 text-slate-400">
                {["📷", "🎵", "🐦", "▶️"].map((ic, i) => (
                  <span key={i} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-pink-50 bg-pink-50/50 text-sm transition hover:bg-pink-100">{ic}</span>
                ))}
              </div>
            </div>
            {[
              { title: "Produk", items: ["Fitur", "Template", "Harga"] },
              { title: "Komunitas", items: ["Creator", "Leaderboard", "Event"] },
              { title: "Bantuan", items: ["Pusat Bantuan", "Panduan", "Kontak"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">{col.title}</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  {col.items.map((item) => <li key={item} className="cursor-pointer transition hover:text-pink-500">{item}</li>)}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">Dapatkan Update Terbaru</p>
              <p className="text-xs leading-relaxed text-slate-400">Template baru, fitur menarik, dan event seru langsung di email kamu.</p>
              <div className="mt-3 flex gap-2">
                <input type="email" placeholder="Masukkan email kamu" className="flex-1 rounded-lg border border-pink-100 bg-pink-50/50 px-3 py-2 text-xs text-slate-600 outline-none transition focus:border-pink-300 focus:ring-1 focus:ring-pink-200" />
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm transition hover:bg-pink-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-pink-50 pt-5 text-center text-[11px] text-slate-400">
            © 2026 Pojok-Potret. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
