"use client";

import React, { useState } from "react";
import { OrgChartNode } from "./OrgChartNode";

export interface EmployeeNode {
  id: string;
  firstName: string;
  lastName: string;
  position: string | null;
  department: string | null;
  imageUrl?: string;
  children: EmployeeNode[];
}

interface OrgChartTreeProps {
  data: EmployeeNode;
  isRoot?: boolean;
}

export function OrgChartTree({ data, isRoot = false }: OrgChartTreeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Current Node */}
      <div className="relative">
        <OrgChartNode
          employee={{
            ...data,
            directReportsCount: data.children.length,
          }}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          hasChildren={hasChildren}
        />
      </div>

      {/* Children Section */}
      {hasChildren && isExpanded && (
        <div className="relative mt-8">
          {/* Vertical connector from parent */}
          <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gray-300 dark:bg-gray-600 transform -translate-x-1/2" />
          
          {/* Horizontal line connecting all children */}
          {data.children.length > 1 && (
            <div 
              className="absolute top-0 h-0.5 bg-gray-300 dark:bg-gray-600"
              style={{
                left: '50%',
                right: '50%',
                transform: 'translateX(-50%)',
                width: `${(data.children.length - 1) * 280}px`,
              }}
            />
          )}

          {/* Children nodes in horizontal layout */}
          <div className="flex items-start justify-center gap-8">
            {data.children.map((child) => (
              <div key={child.id} className="relative">
                {/* Vertical line from horizontal connector to child */}
                <div className="absolute left-1/2 -top-0 w-0.5 h-8 bg-gray-300 dark:bg-gray-600 transform -translate-x-1/2 -translate-y-8" />
                
                {/* Recursive child rendering */}
                <OrgChartTree data={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
