type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#e8eeeb] bg-white px-6 py-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        {value}
      </p>
    </div>
  );
}
