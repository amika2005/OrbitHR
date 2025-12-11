
"use client";

import { useState, useEffect } from "react";
import { createEmployee } from "@/actions/employee-actions";
import { getLeaveAllocation, type EmploymentStatus } from "@/lib/leave-allocation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getCustomFieldDefinitions } from "@/actions/custom-field-actions";
import { useUser } from "@clerk/nextjs";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onSuccess }: AddEmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    employeeId: "",
    department: "",
    position: "",
    epfNumber: "",
    contactNumber: "",
    emergencyContactNumber: "",
    bankName: "",
    accountNumber: "",
    branch: "",
    employmentStatus: "PERMANENT" as EmploymentStatus,
    customFields: {} as Record<string, any>,
  });

  const [customFields, setCustomFields] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      import("@/actions/custom-field-actions").then(({ getCustomFieldDefinitions }) => {
        // We need companyId, but here we don't have it easily available in props.
        // However, the action finds it from the user. using a dummy ID or handling it in action.
        // Actually the action takes companyId. We can get it from user context if available, 
        // or we can allow the action to resolve it if not passed (if we modify action), 
        // but easier: rely on the user metadata hook if available or just fetch all for the user's company implicitly?
        // The action I wrote REQUIRES companyId.
        // Let's use useUser hook to get metadata.
      });
    }
  }, [open]);

  // We need useUser to get companyId for fetching definitions
  // But wait, createEmployee gets it from auth().
  // Let's modify getCustomFieldDefinitions to optionally find companyId from auth() if not provided?
  // Or just use the hook in the component.

  const leaveAllocation = getLeaveAllocation(formData.employmentStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createEmployee(formData);

      if (result.success) {
        toast.success(result.message || "Employee created successfully!");
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          employeeId: "",
          department: "",
          position: "",
          epfNumber: "",
          contactNumber: "",
          emergencyContactNumber: "",
          bankName: "",
          accountNumber: "",
          branch: "",
          employmentStatus: "PERMANENT",
          customFields: {},
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to create employee");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-olive-600" />
            Add New Employee
          </DialogTitle>
          <DialogDescription>
            Create a new employee account. They can log in immediately with the provided credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="employee@company.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum 8 characters
            </p>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="EMP-001"
            />
          </div>

          {/* Department & Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          {/* Contact Number & Emergency Contact */}
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="+94 77 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergencyContactNumber}
                onChange={(e) => handleChange("emergencyContactNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="+94 71 987 6543"
              />
            </div>
          </div>

          {/* EPF Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              EPF Number
            </label>
            <input
              type="text"
              value={formData.epfNumber}
              onChange={(e) => handleChange("epfNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="EPF-12345"
            />
          </div>

          {/* Bank Details */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Bank Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Bank Name"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => handleChange("branch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Branch"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange("accountNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Account Number"
                />
              </div>
            </div>
          </div>

          {/* Employment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employment Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.employmentStatus}
              onChange={(e) => handleChange("employmentStatus", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="PERMANENT">Permanent</option>
              <option value="PROBATION">Probation</option>
              <option value="INTERN">Intern</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          {/* Leave Balance Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Initial Leave Balance
            </h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Annual:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">{leaveAllocation.annual} days</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Casual:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">{leaveAllocation.casual} days</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Sick:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">{leaveAllocation.sick} days</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-olive-600 hover:bg-olive-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
