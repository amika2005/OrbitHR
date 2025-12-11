"use client";

import { useState, useEffect } from "react";
import { getEmployees } from "@/actions/employee-actions";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";
import { BulkImportDialog } from "@/components/employees/BulkImportDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";
import { CustomFieldManager } from "@/components/shared/CustomFieldManager";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  position?: string | null;
  createdAt: Date;
  customFields?: Record<string, any> | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await getEmployees();

      if (result.success) {
        setEmployees(result.employees as unknown as Employee[]);
      } else {
        toast.error(result.error || "Failed to fetch employees");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = emp.email.toLowerCase();
    const department = emp.department?.toLowerCase() || "";
    const position = emp.position?.toLowerCase() || "";
    
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      department.includes(query) ||
      position.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Employees
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage employee accounts for your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Custom Fields */}
          <CustomFieldManager entityType="EMPLOYEE" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEmployees}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Import
          </Button>
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name, email, department, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Employees
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white">
            {employees.length}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Departments
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white">
            {new Set(employees.filter(e => e.department).map(e => e.department)).size}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              New This Month
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white">
            {employees.filter(e => {
              const created = new Date(e.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 text-zinc-400 animate-spin" />
          </div>
        ) : (
          <EmployeeTable 
            employees={filteredEmployees} 
            onRefresh={fetchEmployees} 
            onAddEmployee={() => setAddDialogOpen(true)}
          />
        )}
      </div>

      {/* Add Employee Dialog */}
      <AddEmployeeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchEmployees}
      />

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}
