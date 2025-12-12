"use client";

import { useState, useEffect } from "react";
import PayrollClient from "../../../components/payroll/PayrollClient";
import { CustomFieldManager } from "@/components/shared/CustomFieldManager";
import { getCustomFieldDefinitions } from "@/actions/custom-field-actions";

interface PayrollPageContentProps {
  initialRecords: any[];
  initialMonth: number;
  initialYear: number;
}

export default function PayrollPageContent({
  initialRecords,
  initialMonth,
  initialYear
}: PayrollPageContentProps) {
  const [customFieldDefs, setCustomFieldDefs] = useState<any[]>([]);

  const fetchCustomFields = async () => {
    try {
      const result = await getCustomFieldDefinitions(null, "PAYROLL");
      if (result.success) {
        setCustomFieldDefs(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load custom fields", error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  // Calculate summary statistics client-side or use prop if static
  const employeeCount = initialRecords.length;
  // This summary is approximate based on loaded records
  const summary = {
    totalPayroll: initialRecords.reduce((sum, record) => sum + Number(record.basicSalary || 0), 0),
    employeeCount,
    avgSalary: employeeCount > 0 ? initialRecords.reduce((sum, record) => sum + Number(record.basicSalary || 0), 0) / employeeCount : 0,
    totalDeductions: initialRecords.reduce((sum, record) => {
      const basicSalary = Number(record.basicSalary || 0);
      return sum + (basicSalary * 0.15); // EPF 12% + ETF 3%
    }, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mb-4 gap-2">
         {/* We can place the custom field manager here or inside the client if preferred. 
             Placing it here keeps it consistent with EmployeesPage structure */}
        <CustomFieldManager 
          entityType="PAYROLL" 
          onChange={fetchCustomFields} 
        />
      </div>
      <PayrollClient 
        initialRecords={initialRecords} 
        summary={summary}
        initialMonth={initialMonth}
        initialYear={initialYear}
        customFieldDefs={customFieldDefs}
      />
    </div>
  );
}
