"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Minus, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrgChartNodeProps {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    position: string | null;
    department: string | null;
    imageUrl?: string;
    directReportsCount?: number;
  };
  isExpanded?: boolean;
  onToggle?: () => void;
  hasChildren?: boolean;
}

// Department color mapping
const getDepartmentColor = (department: string | null) => {
  if (!department) return "bg-gray-500";
  
  const colors: Record<string, string> = {
    "DEAN": "bg-blue-600",
    "AUXILIARY STAFF": "bg-orange-500",
    "DEAN'S OFFICE": "bg-blue-500",
    "COMMUNITY": "bg-blue-600",
    "GRADUATE STUDIES": "bg-blue-500",
    "PROGRAMS": "bg-blue-600",
    "ACADEMIC AFFAIRS": "bg-cyan-500",
    "DEVELOPMENT": "bg-cyan-500",
    "FACILITIES": "bg-blue-500",
    "FINANCE": "bg-cyan-500",
    "EXHIBITIONS": "bg-cyan-600",
    "PRESIDENT": "bg-green-500",
    "GROUNDS": "bg-green-600",
    "BUILDING SERVICES": "bg-green-600",
    "CONTROLLER": "bg-green-500",
    "FINANCE OFFICE": "bg-green-600",
  };
  
  return colors[department.toUpperCase()] || "bg-gray-500";
};

export function OrgChartNode({
  employee,
  isExpanded,
  onToggle,
  hasChildren,
}: OrgChartNodeProps) {
  const departmentColor = getDepartmentColor(employee.position);

  return (
    <div className="flex flex-col items-center">
      <Card className="w-48 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Department/Position Header */}
        <div className={cn("px-3 py-1.5 text-white text-xs font-semibold uppercase text-center", departmentColor)}>
          {employee.position || "No Position"}
        </div>

        {/* Employee Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900">
          <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0">
            <AvatarImage src={employee.imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {employee.firstName} {employee.lastName}
            </h3>
          </div>
        </div>
      </Card>

      {/* Expand/Collapse Button */}
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="mt-2 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center justify-center transition-colors shadow-sm"
        >
          {isExpanded ? (
            <Minus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      )}
    </div>
  );
}
