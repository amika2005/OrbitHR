import { getJob } from "@/actions/job-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Briefcase, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobActions } from "./JobActions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let job = null;
  let applications: any[] = [];

  try {
    const jobResult = await getJob(params.id);
    if (jobResult.success && jobResult.data) {
      job = jobResult.data;
      try {
        const { getApplicationsByJob } = await import("@/actions/application-actions");
      applications = [];
} catch (e) {
        console.error("getApplicationsByJob import/fetch failed:", e);
        applications = [];
      }
    }
  } catch (error) {
    console.error("Error fetching job:", error);
  }
  
  if (!job) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Job not found</h2>
        <p className="text-gray-500 mt-2">The job you are looking for does not exist or an error occurred.</p>
        <Link href="/dashboard/jobs">
          <Button variant="outline" className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
    ARCHIVED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}, {job.country}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {job.currency ?? ""} {(job.salaryMin != null ? Number(job.salaryMin).toLocaleString() : "-")} - {(job.salaryMax != null ? Number(job.salaryMax).toLocaleString() : "-")}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.employmentType}
                </div>
              </div>
            </div>
            <Badge className={statusColors[job.status]}>
              {job.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <JobActions jobId={job.id} status={job.status} />
        <Link href={`/dashboard/jobs/${job.id}/edit`}>
          <Button variant="outline">Edit Job</Button>
        </Link>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(job.keySkills ?? []).map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Department</div>
                <div className="font-medium">{job.department}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Employment Type</div>
                <div className="font-medium">{job.employmentType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posted Date</div>
                <div className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {job.postedAt
                    ? new Date(job.postedAt).toLocaleDateString()
                    : "Not published"}
                </div>
              </div>
              {job.closedAt && (
                <div>
                  <div className="text-sm text-gray-600">Closed Date</div>
                  <div className="font-medium">
                    {new Date(job.closedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="text-2xl font-bold">
                      {applications?.length || 0}
                    </span>
                  </div>
                  <Link href={`/dashboard/candidates?job=${job.id}`}>
                    <Button size="sm">View Pipeline</Button>
                  </Link>
                </div>
                
                {applications && applications.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Recent Applicants</div>
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">
                            {app.candidate?.firstName?.[0] ?? ""}
                            {app.candidate?.lastName?.[0] ?? ""}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {app.candidate?.firstName ?? ""} {app.candidate?.lastName ?? ""}
                          </div>
                          <div className="text-xs text-gray-500">
                            {app.status ? app.status.replace("_", " ") : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


