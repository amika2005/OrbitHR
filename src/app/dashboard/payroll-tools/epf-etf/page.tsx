"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Calculator, 
  User, 
  Building2, 
  Wallet,
  Info 
} from "lucide-react";
import Link from "next/link";

export default function EPFETFCalculatorPage() {
  const [basicSalary, setBasicSalary] = useState<string>("");

  // Calculations
  const salary = parseFloat(basicSalary) || 0;
  const employeeEPF = salary * 0.08; // 8%
  const employerEPF = salary * 0.12; // 12%
  const employerETF = salary * 0.03; // 3%
  const totalEmployerCost = employerEPF + employerETF; // 15%
  const netSalary = salary - employeeEPF; // 92%

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/payroll-tools">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            EPF/ETF Calculator
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate EPF, ETF, and net salary for Sri Lanka (2025 rates)
          </p>
        </div>
      </div>

      {/* Calculator Card */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            <Calculator className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Calculate Contributions
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="basicSalary" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
              Monthly Income (LKR)
              <Info className="h-3.5 w-3.5 text-zinc-400" />
            </Label>
            <Input
              id="basicSalary"
              type="number"
              placeholder="Enter your monthly income"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Results */}
          {salary > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {/* Employee Contribution */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Employee EPF (8%)
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(employeeEPF)}
                </div>
              </div>

              {/* Employer EPF */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Employer EPF (12%)
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(employerEPF)}
                </div>
              </div>

              {/* Employer ETF */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Employer ETF (3%)
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(employerETF)}
                </div>
              </div>

              {/* Total Employer Cost */}
              <div className="border-2 border-zinc-900 dark:border-white rounded-lg p-4 bg-zinc-900 dark:bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-white dark:text-zinc-900" />
                    <span className="text-xs font-medium text-zinc-300 dark:text-zinc-600 uppercase tracking-wider">
                      Total Employer Cost (15%)
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-white dark:text-zinc-900">
                  {formatCurrency(totalEmployerCost)}
                </div>
              </div>

              {/* Net Salary */}
              <div className="border-2 border-zinc-900 dark:border-white rounded-lg p-4 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-zinc-900 dark:text-white" />
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Net Salary (Take Home)
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(netSalary)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
          About EPF/ETF Contributions
        </h3>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            <strong className="text-zinc-900 dark:text-white">EPF (Employees' Provident Fund):</strong> A retirement savings scheme where both employee and employer contribute.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-white">ETF (Employees' Trust Fund):</strong> An additional contribution made solely by the employer for employee welfare.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Employee EPF: 8% of basic salary</li>
            <li>Employer EPF: 12% of basic salary</li>
            <li>Employer ETF: 3% of basic salary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
