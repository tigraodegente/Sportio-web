"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full max-w-md mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className="flex items-center gap-1.5 sm:gap-2 flex-1">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                isCompleted
                  ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                  : isActive
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/20"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < totalSteps && (
              <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    isCompleted
                      ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                      : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
