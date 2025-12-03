"use client";

import { OrgChart } from "@/components/org-chart/OrgChart";
import { OrgNode } from "@/types/org-chart-types";

// Sample data - this will be replaced by bulk upload
const sampleOrgData: OrgNode = {
  id: "1",
  name: "John Doe",
  role: "CEO",
  email: "john@company.com",
  department: "Executive",
  children: [
    {
      id: "2",
      name: "Jane Smith",
      role: "CTO",
      email: "jane@company.com",
      department: "Technology",
      directReports: 2,
      children: [
        {
          id: "3",
          name: "Bob Johnson",
          role: "Engineering Manager",
          email: "bob@company.com",
          department: "Engineering",
          directReports: 3,
          children: [
            {
              id: "4",
              name: "Alice Williams",
              role: "Senior Developer",
              email: "alice@company.com",
              department: "Engineering",
              directReports: 0,
            },
            {
              id: "5",
              name: "Charlie Brown",
              role: "Developer",
              email: "charlie@company.com",
              department: "Engineering",
              directReports: 0,
            },
            {
              id: "6",
              name: "Diana Prince",
              role: "QA Engineer",
              email: "diana@company.com",
              department: "Engineering",
              directReports: 0,
            },
          ],
        },
        {
          id: "7",
          name: "Eve Davis",
          role: "Product Manager",
          email: "eve@company.com",
          department: "Product",
          directReports: 0,
        },
      ],
    },
    {
      id: "8",
      name: "Frank Miller",
      role: "CFO",
      email: "frank@company.com",
      department: "Finance",
      directReports: 1,
      children: [
        {
          id: "9",
          name: "Grace Lee",
          role: "Accountant",
          email: "grace@company.com",
          department: "Finance",
          directReports: 0,
        },
      ],
    },
    {
      id: "10",
      name: "Henry Wilson",
      role: "COO",
      email: "henry@company.com",
      department: "Operations",
      directReports: 2,
      children: [
        {
          id: "11",
          name: "Ivy Chen",
          role: "HR Manager",
          email: "ivy@company.com",
          department: "Human Resources",
          directReports: 0,
        },
        {
          id: "12",
          name: "Jack Taylor",
          role: "Operations Manager",
          email: "jack@company.com",
          department: "Operations",
          directReports: 0,
        },
      ],
    },
  ],
  directReports: 3,
};

export default function OrgChartPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Organization Chart
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Interactive hierarchical organization structure
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
        <OrgChart initialData={sampleOrgData} />
      </div>
    </div>
  );
}
