import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-red-100 text-red-700",
  "bg-cyan-100 text-cyan-700",
];

function getColorFromName(name?: string) {
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colorClass = getColorFromName(name);

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-white",
        sizeClasses[size],
        !src && colorClass,
        className
      )}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      ) : initials ? (
        <span className="font-bold">{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
