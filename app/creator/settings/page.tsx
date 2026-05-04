"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { key: "profil", label: "Profil", icon: "user" },
  { key: "keamanan", label: "Keamanan", icon: "shield" },
  { key: "notifikasi", label: "Notifikasi", icon: "bell" },
  { key: "pembayaran", label: "Pembayaran", icon: "credit" },
  { key: "subscription", label: "Subscription", icon: "crown" },
  { key: "privasi", label: "Privasi", icon: "heart" },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    user: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    shield: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    bell: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
    credit: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
    crown: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg>,
    heart: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  };
  return <>{icons[name]}</>;
}

export default function SettingsPage() {
  const { user, stats, saveProfile, checkAuth, logout } = useCreatorStore();
  const [activeTab, setActiveTab] = useState("profil");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    website: "",
  });

  const [modeCreator, setModeCreator] = useState(true);
  const [profilPublik, setProfilPublik] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || "",
        username: user.username?.replace("@", "") || "",
        bio: user.bio || "",
        email: user.email || "",
        instagram: user.socials?.instagram || "",
        tiktok: user.socials?.tiktok || "",
        youtube: user.socials?.youtube || "",
        twitter: user.socials?.twitter || "",
        website: user.socials?.website || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveProfile({
        name: formData.name,
        username: formData.username.replace("@", ""),
        bio: formData.bio,
        email: formData.email,
        socials: {
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          youtube: formData.youtube,
          twitter: formData.twitter,
          website: formData.website,
        },
      });
      alert("Perubahan berhasil disimpan ke database!");
    } catch (error) {
      alert("Gagal menyimpan perubahan. Cek koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { uploadFile } = await import("@/lib/api-client");
      const res = await uploadFile(file);
      
      if (res.success && res.data?.url) {
        await saveProfile({ avatar: res.data.url });
        alert("Foto profil berhasil diperbarui!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      alert("Gagal mengunggah foto profil.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500 mb-4" />
        <p className="text-slate-500 font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-6">
      {/* Back + Title */}
      <Link href="/creator" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Creator Hub
      </Link>
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">Pengaturan Akun <span className="text-pink-500">✦</span></h1>
        <p className="text-sm text-slate-500 mt-1">Kelola informasi profil dan preferensi akun kamu</p>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT: Sidebar Nav */}
        <div className="w-full lg:w-[220px] shrink-0">
          <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex gap-2 overflow-x-auto lg:flex-col lg:space-y-1 lg:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex-none w-auto lg:w-full flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-xl text-sm font-medium transition ${activeTab === item.key ? "bg-pink-50 text-pink-600 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                <div className="shrink-0"><NavIcon name={item.icon} /></div>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 border border-rose-200 bg-white hover:bg-rose-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar Akun
          </button>
        </div>

        {/* CENTER: Profile Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-center">
            <div className="relative w-28 h-28 rounded-full mx-auto mb-4 overflow-visible group">
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-pink-100 bg-white">
                <Image 
                  src={user.avatar || "/placeholder-avatar.png"} 
                  alt={user.name} 
                  fill 
                  className={`object-cover transition-opacity ${isUploading ? 'opacity-40' : 'opacity-100'}`} 
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center border-2 border-white z-10 cursor-pointer hover:scale-110 active:scale-95 transition shadow-sm"
              >
                <input 
                  type="file" 
                  id="avatar-upload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  disabled={isUploading}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </label>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
            <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-500 text-[10px] px-3 py-1 rounded-full font-bold border border-pink-100 mt-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Creator Level {user.level}
            </div>
            <p className="text-xs text-slate-500 mb-1">{user.username}</p>
            <p className="text-[11px] text-slate-400 mb-6">{user.email}</p>

            {/* Toggles */}
            <div className="space-y-3 mb-6">
              <ToggleRow label="Mode Creator" desc="Tampilkan profil kamu di direktori creator" value={modeCreator} onChange={setModeCreator} />
              <ToggleRow label="Profil Publik" desc="Profil dapat dilihat oleh semua orang" value={profilPublik} onChange={setProfilPublik} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox icon="📐" value={stats.totalTemplates.toString()} label="Template" />
              <StatBox icon="❤️" value={(stats.totalUses / 1000).toFixed(1) + "K"} label="Digunakan" />
              <StatBox icon="⭐" value={(stats.totalLikes / 1000).toFixed(1) + "K"} label="Like" />
              <StatBox icon="⬇️" value={(stats.totalDownloads / 1000).toFixed(1) + "K"} label="Download" />
            </div>

            {/* Quota */}
            <div className="bg-slate-50 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-pink-500">✦</span>
                <span className="text-sm font-bold text-slate-800">Quota Template</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-2"><span>Template kamu</span><span className="font-bold text-slate-700">{stats.totalTemplates} / Unlimited</span></div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: "60%" }}></div></div>
            </div>
            <button className="mt-4 w-full py-2.5 text-xs font-bold text-pink-500 border border-pink-200 rounded-xl hover:bg-pink-50 transition">Lihat Detail Quota</button>
          </div>
        </div>

        {/* RIGHT: Edit Form */}
        <div className="flex-1">
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <h2 className="text-lg font-bold text-slate-800">Informasi Profil</h2>
            </div>
            <p className="text-xs text-slate-500 mb-8 ml-11">Perbarui informasi profil yang akan ditampilkan ke publik</p>

            <div className="space-y-6">
              {/* Name + Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                  <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-dashed border-slate-200 text-sm outline-none focus:border-pink-500 transition" />
                  <p className="text-[10px] text-slate-400 mt-1">Username akan digunakan di URL profil kamu</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 200) })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition resize-none" />
                <p className="text-[10px] text-slate-400 mt-1">{formData.bio.length}/200 karakter</p>
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-3">Media Sosial</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SocialInput icon="ig" label="Instagram" value={formData.instagram} onChange={(v) => setFormData({ ...formData, instagram: v })} />
                  <SocialInput icon="tt" label="TikTok" value={formData.tiktok} onChange={(v) => setFormData({ ...formData, tiktok: v })} />
                  <SocialInput icon="yt" label="YouTube" value={formData.youtube} onChange={(v) => setFormData({ ...formData, youtube: v })} />
                  <SocialInput icon="tw" label="Twitter / X" value={formData.twitter} onChange={(v) => setFormData({ ...formData, twitter: v })} />
                  <SocialInput icon="web" label="Website" value={formData.website} onChange={(v) => setFormData({ ...formData, website: v })} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <input value={formData.email} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
                <p className="text-[10px] text-slate-400 mt-1">Email tidak dapat diubah</p>
              </div>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className={`w-full py-3.5 text-white rounded-xl text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 ${
                  isSaving ? 'bg-pink-300 shadow-pink-100 cursor-not-allowed' : 'bg-pink-500 shadow-pink-200 hover:bg-pink-600 hover:-translate-y-0.5'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Sub-components */
function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div><p className="text-xs font-bold text-slate-700">{label}</p><p className="text-[10px] text-slate-400">{desc}</p></div>
      </div>
      <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full p-0.5 transition ${value ? "bg-pink-500" : "bg-slate-200"}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition ${value ? "translate-x-5" : "translate-x-0"}`}></div>
      </button>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      <span className="text-sm">{icon}</span>
      <p className="text-lg font-black text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

function SocialInput({ icon, label, value, onChange }: { icon: string; label: string; value: string; onChange: (v: string) => void }) {
  const colors: Record<string, string> = { ig: "text-pink-500 bg-pink-50", tt: "text-slate-700 bg-slate-50", yt: "text-red-500 bg-red-50", tw: "text-sky-500 bg-sky-50", web: "text-emerald-500 bg-emerald-50" };
  return (
    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-pink-500 transition">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[icon] || "bg-slate-50"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-500">{label}</p>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={`username atau URL`} className="w-full text-sm outline-none text-slate-700 placeholder:text-slate-300" />
      </div>
    </div>
  );
}
