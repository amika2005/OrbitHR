"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, Mail } from "lucide-react";
import { downloadPayslip, PayslipData } from "@/lib/payslipPDF";
import { toast } from "sonner";

interface PayslipViewerProps {
  payrollRecord: any;
  employee: any;
  company: any;
}

export function PayslipViewer({ payrollRecord, employee, company }: PayslipViewerProps) {
  const [open, setOpen] = useState(false);

  const payslipData: PayslipData = {
    employee: {
      name: `${employee.firstName} ${employee.lastName}`,
      employeeId: employee.employeeId || "N/A",
      department: employee.department || "N/A",
      position: employee.position || "Employee",
      joinDate: employee.hireDate
        ? new Date(employee.hireDate).toLocaleDateString()
        : "N/A",
    },
    company: {
      name: company.name,
      address: company.address,
    },
    payPeriod: {
      month: payrollRecord.month,
      year: payrollRecord.year,
    },
    earnings: {
      basicSalary: Number(payrollRecord.basicSalary),
      hra: Number(payrollRecord.allowances?.hra || 0),
      transportAllowance: Number(payrollRecord.allowances?.transport || 0),
      medicalAllowance: Number(payrollRecord.allowances?.medical || 0),
      specialAllowance: Number(payrollRecord.allowances?.special || 0),
      bonus: Number(payrollRecord.bonuses || 0),
      overtime: Number(payrollRecord.allowances?.overtime || 0),
    },
    deductions: {
      epf: Number(payrollRecord.employeePension),
      etf: Number(payrollRecord.employerETF),
      incomeTax: Number(payrollRecord.taxDeductions),
      professionalTax: 0,
      loan: Number(payrollRecord.otherDeductions?.loan || 0),
      advance: Number(payrollRecord.otherDeductions?.advance || 0),
      other: Number(payrollRecord.otherDeductions?.other || 0),
    },
    totals: {
      grossSalary:
        Number(payrollRecord.basicSalary) +
        Number(payrollRecord.allowances?.hra || 0) +
        Number(payrollRecord.allowances?.transport || 0) +
        Number(payrollRecord.allowances?.medical || 0) +
        Number(payrollRecord.allowances?.special || 0) +
        Number(payrollRecord.bonuses || 0),
      totalDeductions:
        Number(payrollRecord.employeePension) +
        Number(payrollRecord.employerETF) +
        Number(payrollRecord.taxDeductions),
      netSalary: Number(payrollRecord.netSalary),
    },
    currency: payrollRecord.currency || "USD",
  };

  const handleDownload = () => {
    try {
      downloadPayslip(payslipData);
      toast.success("Payslip downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download payslip");
    }
  };

  const handleEmail = async () => {
    toast.info("Email functionality will be implemented soon");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Payslip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payslip Preview</DialogTitle>
          <DialogDescription>
            {employee.firstName} {employee.lastName} - {payrollRecord.month}/
            {payrollRecord.year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="ml-2 font-medium">{payslipData.employee.name}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Employee ID:</span>
                <span className="ml-2 font-medium">{payslipData.employee.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Department:</span>
                <span className="ml-2 font-medium">{payslipData.employee.department}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Position:</span>
                <span className="ml-2 font-medium">{payslipData.employee.position}</span>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card className="border-brand-200 dark:border-brand-800">
            <CardHeader className="pb-3 bg-brand-50 dark:bg-brand-900/20">
              <CardTitle className="text-sm text-brand-700 dark:text-brand-400">
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span className="font-semibold">
                    ${payslipData.earnings.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span className="font-semibold">
                    ${payslipData.earnings.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Allowance</span>
                  <span className="font-semibold">
                    ${payslipData.earnings.transportAllowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Allowance</span>
                  <span className="font-semibold">
                    ${payslipData.earnings.medicalAllowance.toLocaleString()}
                  </span>
                </div>
                {payslipData.earnings.specialAllowance > 0 && (
                  <div className="flex justify-between">
                    <span>Special Allowance</span>
                    <span className="font-semibold">
                      ${payslipData.earnings.specialAllowance.toLocaleString()}
                    </span>
                  </div>
                )}
                {payslipData.earnings.bonus && payslipData.earnings.bonus > 0 && (
                  <div className="flex justify-between">
                    <span>Bonus</span>
                    <span className="font-semibold">
                      ${payslipData.earnings.bonus.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card className="border-roosterOrange-200 dark:border-roosterOrange-800">
            <CardHeader className="pb-3 bg-roosterOrange-50 dark:bg-roosterOrange-900/20">
              <CardTitle className="text-sm text-roosterOrange-700 dark:text-roosterOrange-400">
                Deductions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>EPF (12%)</span>
                  <span className="font-semibold text-roosterOrange-600">
                    -${payslipData.deductions.epf.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ETF (3%)</span>
                  <span className="font-semibold text-roosterOrange-600">
                    -${payslipData.deductions.etf.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span className="font-semibold text-roosterOrange-600">
                    -${payslipData.deductions.incomeTax.toLocaleString()}
                  </span>
                </div>
                {payslipData.deductions.loan && payslipData.deductions.loan > 0 && (
                  <div className="flex justify-between">
                    <span>Loan Deduction</span>
                    <span className="font-semibold text-roosterOrange-600">
                      -${payslipData.deductions.loan.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2 border-brand-300 dark:border-brand-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Gross Salary</span>
                  <span className="font-bold">
                    ${payslipData.totals.grossSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Deductions</span>
                  <span className="font-bold text-roosterOrange-600">
                    -${payslipData.totals.totalDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="border-t-2 border-brand-300 dark:border-brand-700 pt-3 flex justify-between text-xl">
                  <span className="font-bold">Net Salary</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    ${payslipData.totals.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email Payslip
            </Button>
            <Button className="bg-brand-600 hover:bg-brand-700" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
