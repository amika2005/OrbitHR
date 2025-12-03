import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalLeaveRequestForm } from "@/components/portal/PortalLeaveRequestForm";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { CancelLeaveButton } from "@/components/portal/CancelLeaveButton";

async function LeaveContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Get leave balances
  const leaveBalances = await db.leaveBalance.findMany({
    where: {
      userId: user.id,
      year: new Date().getFullYear(),
    },
  });

  // Get leave requests
  const leaveRequests = await db.leaveRequest.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600 mt-2">Request and manage your time off</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.length === 0 ? (
          <Card className="col-span-3">
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                No leave balances configured yet
              </p>
            </CardContent>
          </Card>
        ) : (
          leaveBalances.map((balance) => (
            <Card key={balance.id} className="border-portal-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {balance.leaveType.replace(/_/g, " ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-portal-primary">
                    {balance.remainingDays}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {balance.totalDays} days
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-portal-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(Number(balance.remainingDays) / Number(balance.totalDays)) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Leave Form */}
      <Card>
        <CardHeader>
          <CardTitle>Request Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <PortalLeaveRequestForm />
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No leave requests yet
            </p>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-portal-light flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-portal-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {request.leaveType.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.totalDays} day{request.totalDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {request.status === "APPROVED" && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Approved</span>
                      </div>
                    )}
                    {request.status === "REJECTED" && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                    )}
                    {request.status === "PENDING" && (
                      <>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                        <CancelLeaveButton requestId={request.id} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeavePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <div className="flex-1 lg:ml-64">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-portal-primary"></div>
            </div>
          }
        >
          <LeaveContent />
        </Suspense>
      </div>
    </div>
  );
}
