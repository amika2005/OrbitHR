"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, User } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  email: string;
  department?: string;
  managerId?: string;
}

interface OrgListViewProps {
  employees: Employee[];
}

export function OrgListView({ employees }: OrgListViewProps) {
  // Group employees by department
  const departments = Array.from(new Set(employees.map((e) => e.department || "Unassigned")));

  return (
    <div className="space-y-8">
      {departments.map((dept) => {
        const deptEmployees = employees.filter((e) => (e.department || "Unassigned") === dept);
        
        return (
          <div key={dept} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-olive-500 rounded-full"></span>
                {dept}
                <Badge variant="secondary" className="ml-2 bg-olive-100 text-olive-700 dark:bg-olive-900/30 dark:text-olive-400">
                  {deptEmployees.length}
                </Badge>
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {deptEmployees.map((employee) => (
                <div key={employee.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                      <AvatarFallback className="bg-olive-100 text-olive-700 dark:bg-olive-900/50 dark:text-olive-400">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-olive-600 transition-colors">
                        {employee.firstName} {employee.lastName}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Briefcase className="w-3 h-3" />
                        <span>{employee.position || "No Position"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span>{employee.email}</span>
                    </div>
                    {employee.managerId && (
                      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <User className="w-3 h-3" />
                        <span>
                          Reports to: {employees.find(m => m.id === employee.managerId)?.firstName} {employees.find(m => m.id === employee.managerId)?.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
