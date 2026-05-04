type FeaturePillProps = {
  label: string;
};

export function FeaturePill({ label }: FeaturePillProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
