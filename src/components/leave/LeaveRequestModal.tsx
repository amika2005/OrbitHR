"use client";

import { useState } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createLeaveRequest } from "@/actions/leave-actions";
import { toast } from "sonner";

interface LeaveRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  balances: {
    annual: { remaining: number };
    casual: { remaining: number };
    shortLeave: { used: number; limit: number };
  };
}

export function LeaveRequestModal({ onClose, onSuccess, balances }: LeaveRequestModalProps) {
  const [leaveType, setLeaveType] = useState<"ANNUAL_LEAVE" | "CASUAL_LEAVE">("ANNUAL_LEAVE");
  const [casualSubType, setCasualSubType] = useState<"FULL_DAY" | "HALF_DAY" | "SICK_LEAVE" | "SHORT_LEAVE">("FULL_DAY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate deduction amount
  const getDeductionAmount = () => {
    if (leaveType === "ANNUAL_LEAVE") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (startDate && endDate && start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
      return 0;
    } else {
      if (casualSubType === "HALF_DAY") return 0.5;
      if (casualSubType === "SHORT_LEAVE") return 0; // Doesn't deduct
      return 1.0; // FULL_DAY or SICK_LEAVE
    }
  };

  const deductionAmount = getDeductionAmount();

  // Validation
  const canSubmit = () => {
    if (!startDate || !reason.trim()) return false;
    
    if (leaveType === "ANNUAL_LEAVE") {
      if (!endDate) return false;
      if (deductionAmount > balances.annual.remaining) return false;
    } else {
      if (casualSubType === "SHORT_LEAVE") {
        if (balances.shortLeave.used >= balances.shortLeave.limit) return false;
      } else {
        if (deductionAmount > balances.casual.remaining) return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setLoading(true);
    try {
      const result = await createLeaveRequest({
        leaveType,
        casualSubType: leaveType === "CASUAL_LEAVE" ? casualSubType : undefined,
        startDate,
        endDate: leaveType === "ANNUAL_LEAVE" ? endDate : startDate,
        isHalfDay: casualSubType === "HALF_DAY",
        isShortLeave: casualSubType === "SHORT_LEAVE",
        reason,
      });

      if (result.success) {
        toast.success("Leave request submitted successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to submit leave request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Request Time Off
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLeaveType("ANNUAL_LEAVE")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    leaveType === "ANNUAL_LEAVE"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="text-sm font-medium">Annual Leave</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {balances.annual.remaining} days left
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveType("CASUAL_LEAVE")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    leaveType === "CASUAL_LEAVE"
                      ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="text-sm font-medium">Casual Leave</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {balances.casual.remaining} days left
                  </div>
                </button>
              </div>
            </div>

            {/* Casual Sub-type (Conditional) */}
            {leaveType === "CASUAL_LEAVE" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["FULL_DAY", "HALF_DAY", "SICK_LEAVE", "SHORT_LEAVE"].map((type) => (
                    <label
                      key={type}
                      className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                        casualSubType === type
                          ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="casualSubType"
                        value={type}
                        checked={casualSubType === type}
                        onChange={(e) => setCasualSubType(e.target.value as any)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {leaveType === "ANNUAL_LEAVE" ? "Start Date" : "Date"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>
              {leaveType === "ANNUAL_LEAVE" && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Please provide a reason for your leave request..."
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white resize-none"
              />
            </div>

            {/* Deduction Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  {leaveType === "CASUAL_LEAVE" && casualSubType === "SHORT_LEAVE" ? (
                    <>
                      <strong>Using 1 short leave</strong> ({balances.shortLeave.used}/{balances.shortLeave.limit} used this month)
                    </>
                  ) : (
                    <>
                      <strong>Deducting {deductionAmount} day{deductionAmount !== 1 ? "s" : ""}</strong> from your {leaveType === "ANNUAL_LEAVE" ? "Annual" : "Casual"} leave balance
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {!canSubmit() && startDate && reason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-900 dark:text-red-100">
                    {leaveType === "CASUAL_LEAVE" && casualSubType === "SHORT_LEAVE" 
                      ? "You have reached the monthly short leave limit"
                      : "Insufficient leave balance"}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit() || loading}
                className="flex-1"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
