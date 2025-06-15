"use client";

interface Props {
  value: number;
}

export function CoverageIndicator({ value }: Props) {
  const level = Math.max(0, Math.min(4, Math.ceil((value / 31) * 4)));

  const color =
    level <= 1 ? "bg-red-500" : level === 2 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-sm ${level >= bar ? color : "bg-muted"}`}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
}
