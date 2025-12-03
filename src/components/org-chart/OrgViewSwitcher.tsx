"use client";

import { useState } from "react";
import { OrgChart } from "./OrgChart";
import { OrgListView } from "./OrgListView";
import { LayoutList, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  email: string;
  department?: string;
  managerId?: string;
}

interface OrgViewSwitcherProps {
  employees: Employee[];
}

export function OrgViewSwitcher({ employees }: OrgViewSwitcherProps) {
  const [view, setView] = useState<"chart" | "list">("chart");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 inline-flex">
          <Button
            variant={view === "chart" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("chart")}
            className={`gap-2 ${view === "chart" ? "bg-olive-100 text-olive-700 dark:bg-olive-900/30 dark:text-olive-400" : ""}`}
          >
            <Network className="w-4 h-4" />
            Chart View
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className={`gap-2 ${view === "list" ? "bg-olive-100 text-olive-700 dark:bg-olive-900/30 dark:text-olive-400" : ""}`}
          >
            <LayoutList className="w-4 h-4" />
            List View
          </Button>
        </div>
      </div>

      {view === "chart" ? (
        <OrgChart employees={employees} />
      ) : (
        <OrgListView employees={employees} />
      )}
    </div>
  );
}
