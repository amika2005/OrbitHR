"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { useState } from "react";
import { OrgNode } from "@/types/org-chart-types";
import { getInitials } from "@/lib/org-chart-utils";

interface TreeNodeProps {
  node: OrgNode;
  isRoot?: boolean;
}

export function TreeNode({ node, isRoot = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 w-72 hover:border-olive-400 dark:hover:border-olive-600 group">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            {node.avatar ? (
              <div className="relative">
                <img
                  src={node.avatar}
                  alt={node.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-zinc-900"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-olive-500 via-olive-600 to-olive-700 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 shadow-md">
                  {getInitials(node.name)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-zinc-900"></div>
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1 group-hover:text-olive-600 dark:group-hover:text-olive-400 transition-colors">
              {node.name}
            </h3>
            <p className="text-sm font-medium text-olive-600 dark:text-olive-400 mb-1">
              {node.role}
            </p>
            {node.department && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 inline-block">
                {node.department}
              </p>
            )}
          </div>

          {/* Direct Reports Badge */}
          {hasChildren && (
            <div className="flex justify-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-olive-100 to-olive-50 dark:from-olive-900/30 dark:to-olive-900/20 text-olive-700 dark:text-olive-400 rounded-lg text-sm font-semibold shadow-sm">
                <Users className="w-4 h-4" />
                <span>{node.directReports || node.children!.length}</span>
                <span className="text-zinc-600 dark:text-zinc-400 font-normal">
                  {node.directReports === 1 ? "report" : "reports"}
                </span>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-olive-500 to-olive-600 border-4 border-white dark:border-zinc-900 rounded-full flex items-center justify-center hover:from-olive-600 hover:to-olive-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mt-16"
        >
          {/* Connector Lines Container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-0.5 h-16 bg-gradient-to-b from-olive-400 to-olive-500 dark:from-olive-600 dark:to-olive-700" />
          
          {/* Children Row */}
          <div className="flex gap-12 relative">
            {/* Horizontal Connector Line */}
            {node.children!.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full -translate-y-16 pointer-events-none"
                style={{ height: "64px" }}
              >
                <line
                  x1={`${(1 / (node.children!.length * 2)) * 100}%`}
                  y1="0"
                  x2={`${(1 - 1 / (node.children!.length * 2)) * 100}%`}
                  y2="0"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-olive-400 dark:text-olive-600"
                />
                {node.children!.map((_, index) => (
                  <line
                    key={index}
                    x1={`${((index + 0.5) / node.children!.length) * 100}%`}
                    y1="0"
                    x2={`${((index + 0.5) / node.children!.length) * 100}%`}
                    y2="64"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-olive-400 dark:text-olive-600"
                  />
                ))}
              </svg>
            )}

            {/* Render Children */}
            {node.children!.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TreeNode node={child} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
