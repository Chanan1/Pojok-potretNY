type StatCardProps = {
  value: string;
  label: string;
  icon: string;
};

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[28px] border border-pink-100/70 bg-white/95 px-5 py-4 text-center shadow-[0_10px_30px_rgba(250,182,210,0.12)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-lg shadow-sm shadow-pink-100/70">
        {icon}
      </div>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
