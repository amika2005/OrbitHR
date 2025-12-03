"use client";

import { useState } from "react";
import { createLeaveRequest } from "@/actions/leave-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PortalLeaveRequestForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "ANNUAL_LEAVE",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createLeaveRequest(formData);

    if (result.success) {
      toast.success("Leave request submitted successfully!");
      setFormData({
        leaveType: "ANNUAL_LEAVE",
        startDate: "",
        endDate: "",
        isHalfDay: false,
        reason: "",
      });
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to create leave request");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Leave Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Leave Type
        </label>
        <select
          value={formData.leaveType}
          onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-portal-primary focus:border-transparent"
          required
        >
          <option value="ANNUAL_LEAVE">Annual Leave</option>
          <option value="CASUAL_LEAVE">Casual Leave</option>
          <option value="SICK_LEAVE">Sick Leave</option>
          <option value="HALF_DAY">Half Day</option>
          <option value="UNPAID_LEAVE">Unpaid Leave</option>
          <option value="MATERNITY_LEAVE">Maternity Leave</option>
          <option value="PATERNITY_LEAVE">Paternity Leave</option>
        </select>
      </div>

      {/* Half Day Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isHalfDay"
          checked={formData.isHalfDay}
          onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
          className="w-4 h-4 text-portal-primary border-gray-300 rounded focus:ring-portal-primary"
        />
        <label htmlFor="isHalfDay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          This is a half-day leave
        </label>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-portal-primary focus:border-transparent"
          required
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          End Date
        </label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          min={formData.startDate}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-portal-primary focus:border-transparent"
          required
        />
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reason (Optional)
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-portal-primary focus:border-transparent resize-none"
          placeholder="Provide a brief reason for your leave..."
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-portal-primary hover:bg-portal-500 text-white"
      >
        {loading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </form>
  );
}
