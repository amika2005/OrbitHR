import { getPayrollRecords } from "@/actions/payroll-actions";
import { getEmployees } from "@/actions/employee-actions";
import PayrollClient from "../../../components/payroll/PayrollClient";

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const month = searchParams.month ? parseInt(searchParams.month as string) : new Date().getMonth() + 1;
  const year = searchParams.year ? parseInt(searchParams.year as string) : new Date().getFullYear();

  // Fetch payroll records and employees
  const payrollResult = await getPayrollRecords(month, year);
  const employeesResult = await getEmployees();

  const payrollRecords = payrollResult.success && payrollResult.data ? payrollResult.data : [];
  const employees = employeesResult.success ? employeesResult.employees : [];
  const employeeCount = employees.length;

  // Calculate summary statistics
  const totalPayroll = payrollRecords.reduce((sum, record) => sum + Number(record.basicSalary || 0), 0);
  const avgSalary = employeeCount > 0 ? totalPayroll / employeeCount : 0;
  const totalDeductions = payrollRecords.reduce((sum, record) => {
    const basicSalary = Number(record.basicSalary || 0);
    return sum + (basicSalary * 0.15); // EPF 12% + ETF 3%
  }, 0);

  const summary = {
    totalPayroll,
    employeeCount,
    avgSalary,
    totalDeductions,
  };

  return (
    <PayrollClient 
      initialRecords={payrollRecords} 
      summary={summary} 
      initialMonth={month}
      initialYear={year}
    />
  );
}
