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
    <div className={cn(
      "relative bg-white rounded-xl border border-slate-100 p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-200 group",
      className
    )}>
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-500 leading-tight">{title}</span>
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-transform group-hover:scale-110",
            changeType === "positive" && "bg-blue-50 text-blue-600",
            changeType === "negative" && "bg-red-50 text-red-500",
            changeType === "neutral" && "bg-slate-50 text-slate-500"
          )}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      {change && (
        <p className={cn(
          "text-[11px] sm:text-xs mt-1 font-medium",
          changeType === "positive" && "text-blue-600",
          changeType === "negative" && "text-red-500",
          changeType === "neutral" && "text-slate-400"
        )}>
          {change}
        </p>
      )}
    </div>
  );
}
