"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import {
  Users,
  Briefcase,
  Plus,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  FileText,
  Rocket
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard-actions";
import { useUser } from "@clerk/nextjs";

interface DashboardStats {
  stats: {
    candidates: number;
    activeJobs: number;
    employees: number;
  };
  recentCandidates: Array<{
    id: string;
    name: string;
    email: string;
    position: string;
    appliedAt: Date;
    status: string;
    avatar: string;
  }>;
  userName: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await getDashboardStats();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // Empty State: if no data exists at all
  const isEmpty = !data?.stats.candidates && !data?.stats.activeJobs && !data?.stats.employees;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 border-dashed">
        <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <Rocket className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Welcome to OrbitHR, {user?.firstName}!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
          You're all set to get started. Post your first job opening or add employees to begin managing your organization.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/jobs/new">
            <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </Link>
          <Link href="/dashboard/employees/new">
            <Button size="lg" variant="outline" className="border-zinc-200 dark:border-zinc-800">
              <Users className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { stats, recentCandidates, userName } = data!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Welcome back, {userName || "there"}
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
          <Link href="/dashboard/jobs/new">
            <Button size="sm" className="h-8 text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Post Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Jobs */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Active Jobs
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Open
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.activeJobs}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            positions currently hiring
          </div>
        </div>

        {/* Total Candidates */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Candidates
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.candidates}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            across all jobs
          </div>
        </div>

        {/* Total Employees */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Employees
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {stats.employees}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            active team members
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
          {recentCandidates.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              No candidates application received yet.
            </div>
          ) : (
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
                          candidate.status === "INTERVIEW_SCHEDULED"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                            : candidate.status === "AI_SCREENED"
                            ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                            : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {candidate.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(candidate.appliedAt).toLocaleDateString()}
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
          )}
        </div>
      </div>
    </div>
  );
}