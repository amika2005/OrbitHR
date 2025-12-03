"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PayrollToolsPage() {
  const tools = [
    {
      title: "Salary Slip Generator",
      description: "Generate detailed salary slips with EPF, ETF, and tax calculations. Download as PDF.",
      icon: FileText,
      href: "/dashboard/payroll-tools/salary-slip",
      color: "bg-blue-500",
    },
    {
      title: "EPF/ETF Calculator",
      description: "Calculate employee and employer EPF/ETF contributions based on basic salary.",
      icon: Calculator,
      href: "/dashboard/payroll-tools/epf-etf",
      color: "bg-green-500",
    },
    {
      title: "Gratuity Calculator",
      description: "Calculate end-of-service gratuity payments based on years of service and salary.",
      icon: DollarSign,
      href: "/dashboard/payroll-tools/gratuity",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payroll Tools
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Sri Lankan payroll calculators for EPF, ETF, tax, and gratuity calculations
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-olive-500 h-full">
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-olive-600 dark:text-olive-400 font-medium text-sm">
                    Open Calculator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          About Sri Lankan Payroll
        </h3>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>
            <strong>EPF (Employee Provident Fund):</strong> Employee contributes 8%, Employer contributes 12%
          </p>
          <p>
            <strong>ETF (Employees' Trust Fund):</strong> Employer contributes 3%
          </p>
          <p>
            <strong>APIT (Advanced Personal Income Tax):</strong> Progressive tax based on monthly salary brackets
          </p>
          <p>
            <strong>Gratuity:</strong> Calculated as (Last Salary × Years of Service) / 2
          </p>
        </div>
      </div>
    </div>
  );
}
