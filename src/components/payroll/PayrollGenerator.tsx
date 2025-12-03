"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PayrollGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayrollData) => void;
}

interface PayrollData {
  employeeName: string;
  basicSalary: number;
  fixedAllowance: number;
  commission: number;
  epf: number;
  etf: number;
  netPay: number;
  status: string;
}

export function PayrollGenerator({ isOpen, onClose, onSubmit }: PayrollGeneratorProps) {
  const [formData, setFormData] = useState({
    employeeName: "",
    basicSalary: 0,
    fixedAllowance: 0,
    commission: 0,
  });

  if (!isOpen) return null;

  const calculateDeductions = () => {
    const basicSalary = Number(formData.basicSalary) || 0;
    const epf = basicSalary * 0.08; // 8% EPF
    const etf = basicSalary * 0.03; // 3% ETF
    return { epf, etf };
  };

  const calculateNetPay = () => {
    const basicSalary = Number(formData.basicSalary) || 0;
    const fixedAllowance = Number(formData.fixedAllowance) || 0;
    const commission = Number(formData.commission) || 0;
    const { epf, etf } = calculateDeductions();
    
    return basicSalary + fixedAllowance + commission - epf - etf;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { epf, etf } = calculateDeductions();
    const netPay = calculateNetPay();

    onSubmit({
      employeeName: formData.employeeName,
      basicSalary: Number(formData.basicSalary),
      fixedAllowance: Number(formData.fixedAllowance),
      commission: Number(formData.commission),
      epf,
      etf,
      netPay,
      status: "Pending",
    });

    // Reset form
    setFormData({
      employeeName: "",
      basicSalary: 0,
      fixedAllowance: 0,
      commission: 0,
    });
    onClose();
  };

  const { epf, etf } = calculateDeductions();
  const netPay = calculateNetPay();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Generate Payroll</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Employee Name *
            </label>
            <input
              type="text"
              required
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="Enter employee name"
            />
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Basic Salary *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.basicSalary || ""}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Fixed Allowance */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Fixed Allowance
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.fixedAllowance || ""}
              onChange={(e) => setFormData({ ...formData, fixedAllowance: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Commission
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.commission || ""}
              onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Calculated Fields */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Deductions & Net Pay</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  EPF (8%)
                </label>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Rs.{epf.toFixed(2)}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  ETF (3%)
                </label>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Rs.{etf.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-olive-50 dark:bg-olive-900/20 p-4 rounded-lg border border-olive-200 dark:border-olive-800">
              <label className="block text-xs font-medium text-olive-700 dark:text-olive-400 mb-1">
                Net Pay
              </label>
              <div className="text-2xl font-bold text-olive-900 dark:text-olive-300">
                Rs.{netPay.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Generate Payroll
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
