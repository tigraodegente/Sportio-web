"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Target,
  MessageSquare,
  User,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { href: "/social", label: "Feed", icon: Home },
  { href: "/tournaments", label: "Torneios", icon: Trophy },
  { href: "/challenges", label: "Desafios", icon: Target },
  { href: "/bets", label: "Apostas", icon: Coins },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 lg:hidden safe-area-bottom">
      <div className="grid grid-cols-6 px-1 h-16">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 transition-colors relative",
                isActive ? "text-blue-600" : "text-slate-400"
              )}
            >
              <Icon
                className={cn("w-[20px] h-[20px]", isActive && "stroke-[2.5]")}
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
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
