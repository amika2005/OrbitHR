"use client";

import { useState, useEffect } from "react";
import { updateEmployee } from "@/actions/employee-actions";
import { getCustomFieldDefinitions } from "@/actions/custom-field-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId?: string | null;
    department?: string | null;
    position?: string | null;
    hireDate?: Date | null;
    contactNumber?: string | null;
    emergencyContactNumber?: string | null;
    employmentStatus?: string | null;
    salary?: number | null;
    bankName?: string | null;
    accountNumber?: string | null;
    branch?: string | null;
    customFields?: Record<string, any> | null;
  };
}

export function EditEmployeeDialog({ open, onOpenChange, onSuccess, employee }: EditEmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    employeeId: employee.employeeId || "",
    department: employee.department || "",
    position: employee.position || "",
    hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : "",
    contactNumber: employee.contactNumber || "",
    emergencyContactNumber: employee.emergencyContactNumber || "",
    employmentStatus: employee.employmentStatus || "PERMANENT",
    salary: employee.salary?.toString() || "",
    bankName: employee.bankName || "",
    accountNumber: employee.accountNumber || "",

    branch: employee.branch || "",
    customFields: employee.customFields || {},
  });

  const [customFieldDefinitions, setCustomFieldDefinitions] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      const fetchFields = async () => {
        try {
          const result = await getCustomFieldDefinitions(null, "EMPLOYEE");
          if (result.success && result.data) {
            setCustomFieldDefinitions(result.data);
          }
        } catch (error) {
          console.error("Failed to load custom fields", error);
        }
      };
      fetchFields();
    }
  }, [open]);

  const handleCustomFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...(prev.customFields as Record<string, any>),
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateEmployee({
        id: employee.id,
        ...formData,
        hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      });

      if (result.success) {
        toast.success(result.message || "Employee updated successfully!");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update employee");
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-olive-600" />
            Edit Employee
          </DialogTitle>
          <DialogDescription>
            Update employee information for {employee.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              />
            </div>
          </div>

          {/* Employee ID & Hire Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="EMP001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hire Date
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleChange("hireDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
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

          {/* Employment Status & Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Status
              </label>
              <select
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="50000.00"
              />
            </div>
          </div>


          {/* Custom Fields */}
          {customFieldDefinitions.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {customFieldDefinitions.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === "Select" || field.type === "SELECT" ? (
                      <select
                        required={field.required}
                        value={(formData.customFields as any)?.[field.name] || ""}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "NUMBER" ? "number" : field.type === "DATE" ? "date" : "text"}
                        required={field.required}
                        value={(formData.customFields as any)?.[field.name] || ""}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder={field.type === "DATE" ? undefined : `Enter ${field.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
