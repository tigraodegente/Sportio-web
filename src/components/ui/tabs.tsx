"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void; // eslint-disable-line no-unused-vars
  children: (tab: string) => React.ReactNode; // eslint-disable-line no-unused-vars
  className?: string;
  variant?: "light" | "dark";
}

export function Tabs({ tabs, defaultTab, onChange, children, className, variant = "light" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const isDark = variant === "dark";

  return (
    <div className={className}>
      <div className={cn("flex gap-1 p-1 rounded-xl overflow-x-auto", isDark ? "bg-slate-800/50" : "bg-slate-100")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200",
              activeTab === tab.id
                ? isDark
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-900 shadow-sm"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-5">{children(activeTab)}</div>
    </div>
  );
}
