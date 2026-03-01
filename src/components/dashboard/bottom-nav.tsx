"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  PlusCircle,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { href: "/social", label: "Feed", icon: Home },
  { href: "/tournaments", label: "Torneios", icon: Trophy },
  { href: "/tournaments/create", label: "Criar", icon: PlusCircle, isAction: true },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 transition-colors",
                isActive ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <Icon
                className={cn("w-[22px] h-[22px]", isActive && "stroke-[2.5]")}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-bold"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
