"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Currency } from "@prisma/client";
import { ArrowUpDown, Search, Download } from "lucide-react";
import { convertCurrency } from "@/lib/calculateSalary";

interface PayrollRecord {
  id: string;
  month: number;
  year: number;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string | null;
    department: string | null;
  };
  basicSalary: number;
  netSalary: number;
  taxDeductions: number;
  currency: Currency;
  isProcessed: boolean;
}

interface PayrollTableProps {
  data: PayrollRecord[];
  selectedCurrency: Currency;
}

export function PayrollTable({ data, selectedCurrency }: PayrollTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Convert currency for display
  const convertedData = useMemo(() => {
    return data.map((record) => ({
      ...record,
      displayBasicSalary:
        record.currency === selectedCurrency
          ? record.basicSalary
          : convertCurrency(
              record.basicSalary,
              record.currency,
              selectedCurrency
            ),
      displayNetSalary:
        record.currency === selectedCurrency
          ? record.netSalary
          : convertCurrency(record.netSalary, record.currency, selectedCurrency),
      displayTaxDeductions:
        record.currency === selectedCurrency
          ? record.taxDeductions
          : convertCurrency(
              record.taxDeductions,
              record.currency,
              selectedCurrency
            ),
    }));
  }, [data, selectedCurrency]);

  const columns: ColumnDef<(typeof convertedData)[0]>[] = [
    {
      accessorKey: "employee.employeeId",
      header: "Employee ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.employee.employeeId || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "employee.firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100"
          >
            Employee Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.original.employee.firstName} {row.original.employee.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {row.original.employee.department || "No Department"}
          </p>
        </div>
      ),
    },
    {
      id: "period",
      header: "Period",
      cell: ({ row }) => {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return (
          <span className="text-sm">
            {monthNames[row.original.month - 1]} {row.original.year}
          </span>
        );
      },
    },
    {
      accessorKey: "displayBasicSalary",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100"
          >
            Basic Salary
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(row.original.displayBasicSalary, selectedCurrency)}
        </span>
      ),
    },
    {
      accessorKey: "displayTaxDeductions",
      header: "Tax Deductions",
      cell: ({ row }) => (
        <span className="text-red-600">
          -{formatCurrency(row.original.displayTaxDeductions, selectedCurrency)}
        </span>
      ),
    },
    {
      accessorKey: "displayNetSalary",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100"
          >
            Net Pay
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-bold text-green-600 text-lg">
          {formatCurrency(row.original.displayNetSalary, selectedCurrency)}
        </span>
      ),
    },
    {
      accessorKey: "isProcessed",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.isProcessed ? "default" : "secondary"}
          className={
            row.original.isProcessed
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }
        >
          {row.original.isProcessed ? "Processed" : "Pending"}
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data: convertedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const exportToCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Period",
      "Basic Salary",
      "Tax Deductions",
      "Net Pay",
      "Status",
    ];
    const rows = convertedData.map((record) => [
      record.employee.employeeId || "N/A",
      `${record.employee.firstName} ${record.employee.lastName}`,
      record.employee.department || "N/A",
      `${record.month}/${record.year}`,
      record.displayBasicSalary,
      record.displayTaxDeductions,
      record.displayNetSalary,
      record.isProcessed ? "Processed" : "Pending",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_${selectedCurrency}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Search & Export */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No payroll records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-blue-900">
            {convertedData.length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 mb-1">Total Net Pay</p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(
              convertedData.reduce((sum, r) => sum + r.displayNetSalary, 0),
              selectedCurrency
            )}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">
            {convertedData.filter((r) => !r.isProcessed).length}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === Currency.JPY ? "JPY" : "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}
