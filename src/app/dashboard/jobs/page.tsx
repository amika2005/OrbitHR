import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getJobs } from "@/actions/job-actions";
import { Plus, Briefcase, MapPin, DollarSign, Users, TrendingUp, FileText } from "lucide-react";
import { JobStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const result = await getJobs();
  const jobs = result.success ? result.data : [];

  const statusColors: Record<JobStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    OPEN: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
    CLOSED: "bg-coral-100 text-coral-700 border-coral-200 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral-800",
    ARCHIVED: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Postings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your open positions and recruitment pipeline
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-700 dark:hover:bg-brand-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-brand-600 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-brand-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Jobs
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{jobs?.length || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All job postings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Open Positions
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {jobs?.filter((j) => j.status === "OPEN").length || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Actively recruiting</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Draft
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {jobs?.filter((j) => j.status === "DRAFT").length || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not yet published</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-coral-500 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-coral-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Applications
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-coral-600 dark:text-coral-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-coral-600 dark:text-coral-400">
              {jobs?.reduce((sum, j) => sum + (j._count?.applications || 0), 0) || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-2 border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-3 text-gray-900 dark:text-white">{job.title}</CardTitle>
                      <Badge className={`${statusColors[job.status]} border`}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-brand-600 dark:text-brand-400" />
                    {job.location}, {job.country}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                    {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
                      <span className="text-lg font-bold text-coral-600 dark:text-coral-400">
                        {job._count?.applications || 0}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Not published"}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                  <Briefcase className="h-10 w-10 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                  Create your first job posting to start recruiting top talent for your organization
                </p>
                <Link href="/dashboard/jobs/new">
                  <Button className="bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-700 dark:hover:bg-brand-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
