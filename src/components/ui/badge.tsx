import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/50",
  primary: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
  accent: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-200/50",
  success: "bg-green-50 text-green-700 ring-1 ring-green-200/50",
  info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
  live: "bg-red-500 text-white shadow-lg shadow-red-500/25 animate-pulse",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
