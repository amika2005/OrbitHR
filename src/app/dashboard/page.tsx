"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Briefcase,
  FileText,
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  
  // Mock data
  const stats = {
    totalCandidates: 156,
    candidatesGrowth: "+12%",
    activeJobs: 8,
    jobsChange: "+2",
    newApplications: 12,
    applicationsGrowth: "+25%",
    totalEmployees: 45,
    employeesGrowth: "+3",
  };

  const recentCandidates = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      position: "Senior Frontend Developer",
      appliedAt: "2h ago",
      status: "Interviewing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "2",
      name: "Michael Johnson",
      email: "m.johnson@email.com",
      position: "Backend Engineer",
      appliedAt: "5h ago",
      status: "Screening",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "3",
      name: "Yuki Tanaka",
      email: "yuki.t@email.com",
      position: "Product Manager",
      appliedAt: "1d ago",
      status: "Interviewing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    },
    {
      id: "4",
      name: "Alex Rivera",
      email: "alex.r@email.com",
      position: "UX Designer",
      appliedAt: "2d ago",
      status: "Screening",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      id: "5",
      name: "Emma Watson",
      email: "e.watson@email.com",
      position: "Senior Developer",
      appliedAt: "2d ago",
      status: "Offer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Welcome back, {user?.firstName || "there"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here's what's happening with your hiring today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Schedule
          </Button>
          <Button size="sm" className="h-8 text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Candidates
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.candidatesGrowth}
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.totalCandidates}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            from last month
          </div>
          <div className="absolute bottom-0 right-0 opacity-30">
            <Sparkline data={[20, 35, 25, 45, 30, 50, 40, 60]} color="emerald" />
          </div>
        </div>

        {/* Active Jobs */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Active Jobs
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {stats.jobsChange} new
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.activeJobs}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            this week
          </div>
          <div className="absolute bottom-0 right-0 opacity-30">
            <Sparkline data={[5, 6, 5, 7, 6, 8, 7, 8]} color="blue" />
          </div>
        </div>

        {/* New Applications */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              New Applications
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.applicationsGrowth}
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.newApplications}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            this week
          </div>
          <div className="absolute bottom-0 right-0 opacity-30">
            <Sparkline data={[8, 10, 7, 12, 9, 15, 11, 12]} color="emerald" />
          </div>
        </div>

        {/* Total Employees */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Employees
            </span>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {stats.employeesGrowth}
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.totalEmployees}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            active now
          </div>
          <div className="absolute bottom-0 right-0 opacity-30">
            <Sparkline data={[40, 41, 42, 42, 43, 44, 44, 45]} color="zinc" />
          </div>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Recent Candidates
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Latest candidate submissions
              </p>
            </div>
            <Link
              href="/dashboard/pipeline"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-900 dark:text-white">
                      {candidate.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        candidate.status === "Interviewing"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          : candidate.status === "Screening"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                          : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                    {candidate.appliedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}