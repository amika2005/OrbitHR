import PayrollPageContent from "./PayrollContent"; 
import { getPayrollRecords } from "@/actions/payroll-actions";

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const month = searchParams.month ? parseInt(searchParams.month as string) : new Date().getMonth() + 1;
  const year = searchParams.year ? parseInt(searchParams.year as string) : new Date().getFullYear();

  // Fetch payroll records and employees
  const payrollResult = await getPayrollRecords(month, year);
  
  const payrollRecords = payrollResult.success && payrollResult.data ? payrollResult.data : [];

  return (
    <PayrollPageContent 
      initialRecords={payrollRecords}
      initialMonth={month}
      initialYear={year}
    />
  );
}
