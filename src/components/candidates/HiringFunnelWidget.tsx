"use client";

import { useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

export function HiringFunnelWidget() {
  const [isVisible, setIsVisible] = useState(true);

  const stages: FunnelStage[] = [
    { label: "Views", count: 272, color: "bg-zinc-200 dark:bg-zinc-700" },
    { label: "Applied", count: 193, color: "bg-zinc-300 dark:bg-zinc-600" },
    { label: "Screened", count: 45, color: "bg-zinc-400 dark:bg-zinc-500" },
    { label: "Hired", count: 12, color: "bg-emerald-500 dark:bg-emerald-600" },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count));
  const conversionRate = ((stages[3].count / stages[0].count) * 100).toFixed(1);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
            Hiring Funnel
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-zinc-600"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Chart */}
      <div className="p-4 space-y-3">
        {stages.map((stage, index) => {
          const percentage = ((stage.count / maxCount) * 100).toFixed(0);
          const conversionFromPrevious =
            index > 0
              ? ((stage.count / stages[index - 1].count) * 100).toFixed(1)
              : null;

          return (
            <div key={stage.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {stage.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {stage.count}
                  </span>
                  {conversionFromPrevious && (
                    <span className="text-zinc-500 dark:text-zinc-400">
                      ({conversionFromPrevious}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
                >
                  {parseInt(percentage) > 20 && (
                    <span className="text-[10px] font-semibold text-white">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 rounded-b-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-600 dark:text-zinc-400">
            Overall Conversion
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {conversionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
