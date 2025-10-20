"use client";

interface PeriodSelectorProps {
  period: "7d" | "30d" | "3m";
  onPeriodChange: (period: "7d" | "30d" | "3m") => void;
  disabled?: boolean;
}

export function PeriodSelector({ period, onPeriodChange, disabled }: PeriodSelectorProps) {
  return (
    <div className="flex rounded-lg border">
      {(["7d", "30d", "3m"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onPeriodChange(p)}
          disabled={disabled}
          className={`px-3 py-1 text-sm transition-colors ${
            period === p
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          } ${p === "7d" ? "rounded-l-md" : p === "3m" ? "rounded-r-md" : ""} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {p === "7d" ? "7日" : p === "30d" ? "30日" : "3ヶ月"}
        </button>
      ))}
    </div>
  );
}