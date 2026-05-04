"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

interface SidebarProps {
  active: string;
}

const menuItems = [
  { label: "Beranda", icon: "🏠", href: "/" },
  { label: "Eksplor", icon: "🧭", href: "/explore" },
  { label: "Buat", icon: "✨", href: "/capture" },
  { label: "Creator", icon: "👤", href: "/creator" },
  { label: "Tentang", icon: "📄", href: "/tentang" },
];

export function Sidebar({ active }: SidebarProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-pink-50 bg-white p-5 shadow-[0_8px_32px_rgba(250,182,210,0.12)]">
        <div className="mb-8">
          <Logo />
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = active === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-pink-50 text-pink-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-[24px] border border-pink-100/60 bg-gradient-to-br from-pink-50 via-white to-pink-50/50 p-5 shadow-[0_8px_32px_rgba(250,182,210,0.12)]">
        <h3 className="text-base font-bold text-slate-800">
          Buat Karyamu <span className="text-pink-400">✨</span>
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Pilih template favoritmu dan mulai buat momen estetikmu
        </p>
        <Link
          href="/capture"
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600"
        >
          Mulai Buat →
        </Link>
      </div>
    </div>
  );
}
