type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div className="relative rounded-2xl border border-pink-50 bg-white p-6 shadow-[0_4px_20px_rgba(250,182,210,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(250,182,210,0.18)]">
      {/* Quote mark */}
      <div className="absolute right-5 top-4 text-2xl text-pink-200 font-serif">❝</div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-sm font-bold text-white shadow-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{name}</p>
          {/* Stars */}
          <div className="flex gap-0.5 text-xs text-amber-400">
            {"★★★★★"}
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="mt-4 text-sm leading-relaxed text-slate-500">{quote}</p>
    </div>
  );
}
