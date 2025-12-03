import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayslipViewer } from "@/components/payroll/PayslipViewer";
import { FileText, Download } from "lucide-react";

async function PayslipsContent() {
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

  // Get payroll records
  const payrollRecords = await db.payrollRecord.findMany({
    where: {
      employeeId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get company info
  const company = await db.company.findUnique({
    where: { id: user.companyId },
    select: {
      name: true,
      currency: true,
    },
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Payslips</h1>
        <p className="text-gray-600 mt-2">
          View and download your salary payslips
        </p>
      </div>

      {/* Payslips Grid */}
      {payrollRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Payslips Available
              </h3>
              <p className="text-gray-500">
                Your payslips will appear here once they are processed
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payrollRecords.map((payroll) => (
            <Card
              key={payroll.id}
              className="border-portal-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-portal-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-portal-primary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {payroll.month}/{payroll.year}
                      </CardTitle>
                      <p className="text-xs text-gray-600">
                        {new Date(payroll.payDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gross Salary</span>
                    <span className="font-semibold text-gray-900">
                      $
                      {(
                        Number(payroll.basicSalary) +
                        Number(payroll.bonuses)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deductions</span>
                    <span className="font-semibold text-red-600">
                      -$
                      {(
                        Number(payroll.taxDeductions) +
                        Number(payroll.employeePension) +
                        Number(payroll.healthInsurance)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">
                      Net Salary
                    </span>
                    <span className="text-lg font-bold text-portal-primary">
                      ${Number(payroll.netSalary).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3">
                    <PayslipViewer
                      payrollRecord={payroll}
                      employee={user}
                      company={company}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payroll.isProcessed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payroll.isProcessed ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PayslipsPage() {
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
          <PayslipsContent />
        </Suspense>
      </div>
    </div>
  );
}
