"use client";

import { useState, useEffect } from "react";
import { deleteEmployee } from "@/actions/employee-actions";
import { Edit, Trash2, Mail, User, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { useUser } from "@clerk/nextjs";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId?: string | null;
  epfNumber?: string | null;
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
  createdAt: Date;
  customFields?: Record<string, any> | null;
}

interface EmployeeTableProps {
  employees: Employee[];
  onRefresh: () => void;
  onAddEmployee: () => void;
}

export function EmployeeTable({ employees, onRefresh, onAddEmployee }: EmployeeTableProps) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [customFieldDefs, setCustomFieldDefs] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user?.publicMetadata?.companyId) {
      import("@/actions/custom-field-actions").then(async ({ getCustomFieldDefinitions }) => {
        const result = await getCustomFieldDefinitions(user.publicMetadata.companyId as string, "EMPLOYEE");
        if (result.success) {
          setCustomFieldDefs(result.data || []);
        }
      });
    }
  }, [user]);

  const handleDelete = async (employee: Employee) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(employee.id);
    try {
      const result = await deleteEmployee(employee.id);

      if (result.success) {
        toast.success(result.message || "Employee deleted successfully");
        onRefresh();
      } else {
        toast.error(result.error || "Failed to delete employee");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const getEmploymentStatusBadge = (status?: string | null) => {
    const statusColors: Record<string, string> = {
      PERMANENT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      PROBATION: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      INTERN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      CONTRACT: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };

    if (!status) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  if (employees.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 mx-4 my-4">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
          No employees yet
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
          Add your first employee to start managing their payroll and records efficiently.
        </p>
        <Button onClick={onAddEmployee}>
          Add Employee
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Employee</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Employee ID</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">EPF Number</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Hire Date</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Email</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Department</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Position</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Contact</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Bank Name</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Account Number</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Branch</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Status</th>
              {/* Dynamic custom field columns */}
              {customFieldDefs.map((def) => (
                <th key={def.name} className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                  {def.label}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                {/* Employee Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-olive-100 dark:bg-olive-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-olive-600 dark:text-olive-400" />
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </div>
                </td>

                {/* Employee ID */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.employeeId ? (
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {employee.employeeId}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* EPF Number */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.epfNumber ? (
                    <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
                      {employee.epfNumber}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Hire Date */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.hireDate ? (
                    new Date(employee.hireDate).toLocaleDateString()
                  ) : employee.createdAt ? (
                    <span className="text-zinc-400 text-xs">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    {employee.email}
                  </div>
                </td>

                {/* Department */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.department ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-zinc-400" />
                      {employee.department}
                    </div>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Position */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.position ? (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-zinc-400" />
                      {employee.position}
                    </div>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Contact Number */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.contactNumber || <span className="text-zinc-400">-</span>}
                </td>

                {/* Bank Name */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.bankName || <span className="text-zinc-400">-</span>}
                </td>

                {/* Account Number */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.accountNumber ? (
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {employee.accountNumber}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Branch */}
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {employee.branch || <span className="text-zinc-400">-</span>}
                </td>

                {/* Employment Status */}
                <td className="px-6 py-4">
                  {employee.employmentStatus ? (
                    getEmploymentStatusBadge(employee.employmentStatus)
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>

                {/* Dynamic custom field values */}
                {customFieldDefs.map((def) => (
                  <td key={def.name} className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {employee.customFields?.[def.name] ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {employee.customFields[def.name]}
                      </span>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>
                ))}

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEmployee(employee)}
                      className="text-olive-600 hover:text-olive-700 hover:bg-olive-50 dark:hover:bg-olive-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(employee)}
                      disabled={deletingId === employee.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEmployee && (
        <EditEmployeeDialog
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
          onSuccess={onRefresh}
          employee={editingEmployee}
        />
      )}
    </>
  );
}
