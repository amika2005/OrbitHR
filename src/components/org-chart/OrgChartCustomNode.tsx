"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Users } from "lucide-react";

interface CustomNodeData {
  name: string;
  role: string;
  avatar?: string;
  directReports: number;
}

function OrgChartCustomNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <div className="relative">
      {/* Invisible Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0"
      />

      {/* Card */}
      <div className="w-64 bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-200">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {data.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 text-center mb-1">
          {data.name}
        </h3>

        {/* Role */}
        <p className="text-sm text-slate-500 text-center mb-3">
          {data.role}
        </p>

        {/* Direct Reports Badge */}
        {data.directReports > 0 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
              <Users className="w-3 h-3" />
              <span>{data.directReports} Direct Report{data.directReports !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OrgChartCustomNode);
