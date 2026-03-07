"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, BarChart3, Trophy, Lock, Award, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "posts", label: "Posts", icon: FileText },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "torneios", label: "Torneios", icon: Trophy },
  { id: "exclusivo", label: "Exclusivo", icon: Lock },
  { id: "conquistas", label: "Conquistas", icon: Award },
  { id: "equipamento", label: "Equipamento", icon: ShoppingBag },
];

interface CreatorTabsProps {
  children: (tab: string) => React.ReactNode;
  className?: string;
}

export function CreatorTabs({ children, className }: CreatorTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className={className}>
      {/* Tab navigation */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="creator-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-6"
      >
        {children(activeTab)}
      </motion.div>
    </div>
  );
}
