import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Clock, TrendingUp, User, FolderOpen } from "lucide-react";
import Link from "next/link";

async function DashboardContent() {
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

  // Get pending leave requests
  const pendingLeaves = await db.leaveRequest.findMany({
    where: {
      userId: user.id,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get recent payroll records
  const payrollRecords = await db.payrollRecord.findMany({
    where: {
      employeeId: user.id,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Calculate total leave balance
  const totalLeaveBalance = leaveBalances.reduce(
    (sum, balance) => sum + Number(balance.remainingDays),
    0
  );

  // Get latest payroll
  const latestPayroll = payrollRecords[0];

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-portal-primary to-portal-400 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-portal-50">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-portal-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Leave Balance
            </CardTitle>
            <Calendar className="h-4 w-4 text-portal-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portal-primary">
              {totalLeaveBalance} days
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available this year
            </p>
          </CardContent>
        </Card>

        <Card className="border-portal-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-portal-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portal-accent">
              {pendingLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-portal-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Latest Payslip
            </CardTitle>
            <FileText className="h-4 w-4 text-portal-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {latestPayroll
                ? `${latestPayroll.month}/${latestPayroll.year}`
                : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {latestPayroll
                ? `$${Number(latestPayroll.netSalary).toLocaleString()}`
                : "No payslips yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-portal-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Department
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-portal-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {user.department || "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {user.position || "Employee"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLeaves.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No pending leave requests
              </p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-portal-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {request.leaveType.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            {payrollRecords.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No payslips available
              </p>
            ) : (
              <div className="space-y-3">
                {payrollRecords.map((payroll) => (
                  <div
                    key={payroll.id}
                    className="flex items-center justify-between p-3 bg-portal-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {payroll.month}/{payroll.year}
                      </p>
                      <p className="text-xs text-gray-500">
                        Net: ${Number(payroll.netSalary).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        payroll.isProcessed
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {payroll.isProcessed ? "Paid" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/portal/leave"
              className="flex flex-col items-center justify-center p-4 bg-portal-light hover:bg-portal-100 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="h-8 w-8 text-portal-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Request Leave
              </span>
            </Link>
            <Link
              href="/portal/payslips"
              className="flex flex-col items-center justify-center p-4 bg-portal-light hover:bg-portal-100 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="h-8 w-8 text-portal-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">
                View Payslips
              </span>
            </Link>
            <Link
              href="/portal/profile"
              className="flex flex-col items-center justify-center p-4 bg-portal-light hover:bg-portal-100 rounded-lg transition-colors cursor-pointer"
            >
              <User className="h-8 w-8 text-portal-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">
                My Profile
              </span>
            </Link>
            <Link
              href="/portal/documents"
              className="flex flex-col items-center justify-center p-4 bg-portal-light hover:bg-portal-100 rounded-lg transition-colors cursor-pointer"
            >
              <FolderOpen className="h-8 w-8 text-portal-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Documents
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PortalDashboardPage() {
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
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
