import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-emerald-100 text-emerald-700",
  accent: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
  info: "bg-blue-100 text-blue-700",
  live: "bg-red-500 text-white animate-pulse",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
