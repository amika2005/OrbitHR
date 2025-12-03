"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Award } from "lucide-react";
import Link from "next/link";

export default function GratuityCalculatorPage() {
  const [years, setYears] = useState<string>("");
  const [months, setMonths] = useState<string>("");
  const [lastSalary, setLastSalary] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  // Calculations
  const yearsNum = parseInt(years) || 0;
  const monthsNum = parseInt(months) || 0;
  const salary = parseFloat(lastSalary) || 0;
  
  const totalYears = yearsNum + (monthsNum / 12);
  const gratuity = (salary * totalYears) / 2;

  const handleCalculate = () => {
    if (salary > 0 && (yearsNum > 0 || monthsNum > 0)) {
      setCalculated(true);
    }
  };

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
            Gratuity Calculator
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate end-of-service gratuity payment (Sri Lankan labor law)
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            <Calculator className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Calculate Gratuity
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Years of Service
              </Label>
              <Input
                id="years"
                type="number"
                placeholder="Years"
                value={years}
                onChange={(e) => {
                  setYears(e.target.value);
                  setCalculated(false);
                }}
                className="h-10"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="months" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Additional Months
              </Label>
              <Input
                id="months"
                type="number"
                placeholder="Months"
                value={months}
                onChange={(e) => {
                  setMonths(e.target.value);
                  setCalculated(false);
                }}
                className="h-10"
                min="0"
                max="11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lastSalary" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Last Drawn Monthly Salary (LKR)
            </Label>
            <Input
              id="lastSalary"
              type="number"
              placeholder="Enter last salary"
              value={lastSalary}
              onChange={(e) => {
                setLastSalary(e.target.value);
                setCalculated(false);
              }}
              className="h-10"
            />
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!lastSalary || salary <= 0 || (yearsNum === 0 && monthsNum === 0)}
            className="w-full"
          >
            <Calculator className="h-3.5 w-3.5 mr-1.5" />
            Calculate Gratuity
          </Button>
        </div>
      </div>

      {/* Results */}
      {calculated && gratuity > 0 && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="border-2 border-zinc-900 dark:border-white rounded-lg p-8 bg-zinc-900 dark:bg-white text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="h-5 w-5 text-white dark:text-zinc-900" />
              <h3 className="text-sm font-medium text-zinc-300 dark:text-zinc-600 uppercase tracking-wider">
                Total Gratuity Payment
              </h3>
            </div>
            <p className="text-4xl font-bold text-white dark:text-zinc-900">
              {formatCurrency(gratuity)}
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-2">
              For {totalYears.toFixed(2)} years of service
            </p>
          </div>

          {/* Calculation Breakdown */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
              Calculation Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Last Drawn Salary</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(salary)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Years of Service</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {yearsNum} years {monthsNum > 0 && `${monthsNum} months`}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Years (decimal)</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {totalYears.toFixed(2)} years
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Formula</span>
                <span className="text-sm font-mono text-zinc-900 dark:text-white">
                  (Salary × Years) / 2
                </span>
              </div>
              <div className="flex justify-between py-3 bg-zinc-100 dark:bg-zinc-800 px-3 rounded-md">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Gratuity Amount
                </span>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  {formatCurrency(gratuity)}
                </span>
              </div>
            </div>
          </div>

          {/* Per Year Breakdown */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
              Per Year Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Gratuity per year of service</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(salary / 2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Gratuity per month of service</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(salary / 24)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
          About Gratuity in Sri Lanka
        </h3>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            <strong className="text-zinc-900 dark:text-white">Gratuity:</strong> A lump sum payment made to an employee at the end of their service as a token of appreciation.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-white">Eligibility:</strong> Employees who have completed 5 years of continuous service are eligible for gratuity.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-white">Formula:</strong> Gratuity = (Last Drawn Salary × Years of Service) / 2
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-white">Payment:</strong> Gratuity must be paid within 30 days of termination of employment.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-3">
            Note: This calculator provides an estimate. Actual gratuity may vary based on company policy and employment contract.
          </p>
        </div>
      </div>
    </div>
  );
}
