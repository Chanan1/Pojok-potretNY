type StepCardProps = {
  index: number;
  title: string;
  description: string;
};

const stepIcons = ["📷", "📸", "✏️"];

export function StepCard({ index, title, description }: StepCardProps) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-pink-50 bg-white p-5 shadow-[0_4px_20px_rgba(250,182,210,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(250,182,210,0.18)]">
      {/* Step number badge */}
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]">
          {index}
        </div>
      </div>

      {/* Icon + Content */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{stepIcons[index - 1] || "📷"}</span>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}
