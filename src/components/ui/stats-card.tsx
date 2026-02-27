import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon, className }: StatsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {change && (
        <p
          className={cn(
            "text-xs mt-1",
            changeType === "positive" && "text-green-600",
            changeType === "negative" && "text-red-600",
            changeType === "neutral" && "text-slate-500"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
