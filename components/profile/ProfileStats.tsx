"use client";

import { CreatorStats } from "@/store/useCreatorStore";

interface ProfileStatsProps {
  stats: CreatorStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    {
      label: "Template",
      value: stats.totalTemplates.toLocaleString(),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
      iconBg: "bg-rose-50 text-rose-500",
    },
    {
      label: "Digunakan",
      value: stats.totalUses >= 1000 ? (stats.totalUses / 1000).toFixed(1) + "K" : stats.totalUses.toString(),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
      iconBg: "bg-pink-50 text-pink-500",
    },
    {
      label: "Disukai",
      value: stats.totalLikes >= 1000 ? (stats.totalLikes / 1000).toFixed(1) + "K" : stats.totalLikes.toString(),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      iconBg: "bg-amber-50 text-amber-500",
    },
    {
      label: "Download",
      value: stats.totalDownloads >= 1000 ? (stats.totalDownloads / 1000).toFixed(1) + "K" : stats.totalDownloads.toString(),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
      iconBg: "bg-indigo-50 text-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4 hover:border-pink-200 transition-colors group"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${item.iconBg}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{item.value}</p>
            <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
