"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  Eye,
  X,
  Trash2,
  Edit,
  Download,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePayslipPDF } from "@/lib/payslip-generator";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { 
  generatePayroll as generatePayrollAction,
  deletePayrollRecord,
  updatePayrollRecord
} from "@/actions/payroll-actions";
import PayslipEmailSettings from "./PayslipEmailSettings";
import { generatePayslipEmail } from "@/lib/email-generator";
import { getCompanyEmailSettings } from "@/actions/settings-actions";
import { sendPayslipEmail } from "@/actions/email-actions";
import { Mail, Send, Loader2, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type Currency = "USD" | "LKR" | "JPY" | "EUR" | "GBP";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  LKR: "Rs.",
  JPY: "¥",
  EUR: "€",
  GBP: "£",
};

interface PayrollRecord {
  id: string;
  employeeId?: string; // Database ID (UUID)
  customEmployeeId?: string; // Human readable ID (e.g. EMP-001)
  employeeName: string;
  employeeEmail?: string; // Employee email for distribution
  epfNumber?: string;
  nicNumber?: string; // NIC or Passport number
  position?: string;
  department?: string;
  employmentType?: string; // Full-time, Part-time, Contract, etc.
  dateOfJoining?: string;
  bankName?: string;
  branch?: string;
  accountNumber?: string;
  basicSalary: number;
  workedDays: number; // Days worked in month (e.g., 28)
  totalDays: number; // Total days in month (e.g., 30)
  allowances: {
    fixed?: number;
    operational: number;
    wellBeing: number;
    utilityTravel: number;
    salesCommission: number;
    other: number;
  };
  deductions: {
    apit: number;
    unpaidLeave: number;
    lateAttendance: number;
    other: number;
  };
  commission: number;
  notes?: string; // Additional notes for payslip
  slip?: string; // Data URL of the PDF
  isGenerated: boolean;
  generatedAt?: string;
  customFields?: Record<string, any>;
}

interface PayrollClientProps {
  initialRecords: any[];
  summary: {
    totalPayroll: number;
    employeeCount: number;
    avgSalary: number;
    totalDeductions: number;
  };
  initialMonth: number;
  initialYear: number;
}

export default function PayrollClient({ 
  initialRecords, 
  summary: initialSummary,
  initialMonth,
  initialYear
}: PayrollClientProps) {
  const router = useRouter();
  const { user } = useUser();
  const [currency, setCurrency] = useState<Currency>("LKR");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [customFieldDefs, setCustomFieldDefs] = useState<any[]>([]);
  
  // Email Distribution State
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionProgress, setDistributionProgress] = useState({ current: 0, total: 0 });
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  
  // Ref to store generated slips locally to persist across router refreshes
  const generatedSlipsRef = useRef<Record<string, string>>({});

  const isIntern = (position?: string) => {
    return position?.toLowerCase().includes('intern') || false;
  };

  const calculateEPF = (basicSalary: number, position?: string) => {
    if (isIntern(position)) return 0;
    return basicSalary * 0.08; // 8% Employee
  };

  const calculateEPFEmployer = (basicSalary: number, position?: string) => {
    if (isIntern(position)) return 0;
    return basicSalary * 0.12; // 12% Employer
  };

  const calculateETF = (basicSalary: number, position?: string) => {
    if (isIntern(position)) return 0;
    return basicSalary * 0.03; // 3% Employer
  };

  const calculateNetPay = (record: PayrollRecord) => {
    // Attendance is for display only - no salary deduction
    const epf = calculateEPF(record.basicSalary, record.position);
    // ETF is employer contribution, not deducted from employee
    const allowances = record.allowances || {
      operational: 0,
      wellBeing: 0,
      utilityTravel: 0,
      salesCommission: 0,
      other: 0,
    };
    const deductions = record.deductions || {
      apit: 0,
      unpaidLeave: 0,
      lateAttendance: 0,
      other: 0,
    };
    const totalAllowances = 
      allowances.operational +
      allowances.wellBeing +
      allowances.utilityTravel +
      allowances.salesCommission +
      allowances.other;
    const totalDeductions =
      deductions.apit +
      deductions.unpaidLeave +
      deductions.lateAttendance +
      deductions.other;
    return record.basicSalary + totalAllowances + record.commission - epf - totalDeductions;
  };
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        if (response.ok) {
          const data = await response.json();
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    };

    // Load custom field definitions
    if (user?.publicMetadata?.companyId) {
      import("@/actions/custom-field-actions").then(async ({ getCustomFieldDefinitions }) => {
        const result = await getCustomFieldDefinitions(user.publicMetadata.companyId as string, "PAYROLL");
        if (result.success) {
          setCustomFieldDefs(result.data || []);
        }
      });
    }

    const savedSettings = localStorage.getItem("company_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      // Update company name to correct value permanently
      settings.companyName = "Infinit Tech Systems (PVT) LTD";
      setCompanySettings(settings);
      localStorage.setItem("company_settings", JSON.stringify(settings));
    } else {
      // Set default company settings if none exist
      const defaultSettings = {
        companyName: "Infinit Tech Systems (PVT) LTD",
        address: "Level 35, West Tower, World Trade Center, Colombo 01, Sri Lanka",
        phone: "+94 11 749 4398",
        mobile: "+94 77 029 1591",
        email: "hr@infinit.lk",
        pvNumber: "00338004"
      };
      setCompanySettings(defaultSettings);
      localStorage.setItem("company_settings", JSON.stringify(defaultSettings));
    }

    const mappedRecords = initialRecords.map(r => {
      console.log("🔍 Mapping payroll record:", {
        id: r.id,
        employeeId: r.employeeId,
        employeeName: r.employee?.firstName ? `${r.employee.firstName} ${r.employee.lastName}` : "Unknown",
        epfNumber: r.employee?.epfNumber,
        hasEmployee: !!r.employee,
        hasEPF: !!r.employee?.epfNumber,
        otherDeductions: (r as any).otherDeductions,
      });

      // Get days in current month for default values
      const daysInMonth = new Date(year, month, 0).getDate();

      const record = {
        id: r.id,
        employeeId: r.employeeId,
        customEmployeeId: r.employee?.employeeId || "",
        employeeName: r.employee?.firstName ? `${r.employee.firstName} ${r.employee.lastName}` : "Unknown",
        employeeEmail: r.employee?.email || "",
        epfNumber: r.employee?.epfNumber || "",
        position: r.employee?.position || "",
        department: r.employee?.department || "",
        dateOfJoining: r.employee?.hireDate || "",
        bankName: r.employee?.bankName || "",
        branch: r.employee?.branch || "",
        accountNumber: r.employee?.accountNumber || "",
        basicSalary: Number(r.basicSalary),
        workedDays: Number((r.otherDeductions as any)?.workedDays || daysInMonth),
        totalDays: Number((r.otherDeductions as any)?.totalDays || daysInMonth),
        allowances: {
          operational: Number((r.allowances as any)?.operational || 0),
          wellBeing: Number((r.allowances as any)?.wellBeing || 0),
          utilityTravel: Number((r.allowances as any)?.utilityTravel || 0),
          salesCommission: Number((r.allowances as any)?.salesCommission || 0),
          other: Number((r.allowances as any)?.other || 0),
        },
        deductions: {
          apit: Number((r.otherDeductions as any)?.apit || 0),
          unpaidLeave: Number((r.otherDeductions as any)?.unpaidLeave || 0),
          lateAttendance: Number((r.otherDeductions as any)?.lateAttendance || 0),
          other: Number((r.otherDeductions as any)?.other || 0),
        },
        commission: Number(r.bonuses),
        isGenerated: r.isProcessed,
        generatedAt: r.updatedAt,
        // Check if we have a locally generated slip OR one from DB
        slip: r.slip || generatedSlipsRef.current[r.id],
        notes: r.notes || "",
      };

      // If the record is already processed, regenerate the payslip PDF
      if (r.isProcessed && savedSettings) {
        const settings = JSON.parse(savedSettings);
        const epf = calculateEPF(record.basicSalary, record.position);
        const etf = calculateETF(record.basicSalary, record.position);
        const netPay = calculateNetPay(record);

        record.slip = generatePayslipPDF({
          employeeName: record.employeeName,
          employeeId: record.customEmployeeId || record.employeeId,
          epfNumber: record.epfNumber,
          designation: record.position || "Employee",
          department: record.department || "General",
          dateOfJoining: record.dateOfJoining || new Date().toISOString().split('T')[0],
          payPeriod: new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
          workedDays: 30,
          basicSalary: record.basicSalary,
          allowances: record.allowances,
          deductions: record.deductions,
          commission: record.commission,
          epf,
          epfEmployer: calculateEPFEmployer(record.basicSalary, record.position),
          etf,
          netPay,
          bankName: record.bankName,
          branch: record.branch,
          accountNumber: record.accountNumber,
          companyName: settings?.companyName || "OrbitHR Inc.",
          companyAddress: settings?.address || "123 Business Rd, Tech City",
          companyLogo: "/assets/payslip_logo.png",
        });
      }

      return record;
    });
    
    setPayrollRecords(prevRecords => {
      if (prevRecords.length === 0) {
        return mappedRecords;
      }
      
      // Start with server records
      const mergedRecords = mappedRecords.map(serverRecord => {
        let localRecord = prevRecords.find(r => r.id === serverRecord.id);

        // If not found by ID, and serverRecord is a placeholder (new-), 
        // try to find by employeeId in prevRecords (assuming prevRecords has the real ID)
        if (!localRecord && serverRecord.id.startsWith("new-")) {
             localRecord = prevRecords.find(r => r.employeeId === serverRecord.employeeId && !r.id.startsWith("new-"));
        }

        if (localRecord && localRecord.isGenerated && localRecord.slip) {
          // Keep the local slip if it exists
          return localRecord;
        }
        return serverRecord;
      });
      
      // Add any local records that were generated but not yet in server data
      // This prevents disappearing records when server data is stale
      prevRecords.forEach(prevRecord => {
        if (prevRecord.isGenerated && !prevRecord.id.startsWith("new-")) {
          // Check if this record is already in mergedRecords
          const existsInMerged = mergedRecords.some(r => r.id === prevRecord.id);
          if (!existsInMerged) {
            // Add it to preserve the generated record
            mergedRecords.push(prevRecord);
          }
        }
      });
      
      return mergedRecords;
    });

    loadEmployees();
  }, [initialRecords]);

  useEffect(() => {
    setMonth(initialMonth);
    setYear(initialYear);
  }, [initialMonth, initialYear]);

  const handleMonthChange = (newMonth: number) => {
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
    router.push(`/dashboard/payroll?month=${newMonth}&year=${newYear}`);
  };
  const formatCurrency = (amount: number) => {
    return `${currencySymbols[currency]}${amount.toLocaleString()}`;
  };

  // Dynamic Summary Calculation
  const summary = {
    totalPayroll: payrollRecords.reduce((acc, r) => acc + calculateNetPay(r), 0),
    employeeCount: payrollRecords.length,
    avgSalary: payrollRecords.length > 0 ? payrollRecords.reduce((acc, r) => acc + calculateNetPay(r), 0) / payrollRecords.length : 0,
    totalDeductions: payrollRecords.reduce((acc, r) => acc + calculateEPF(r.basicSalary, r.position) + calculateETF(r.basicSalary, r.position), 0),
  };

  const addNewRow = () => {
    // Get days in current month
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const newRecord: PayrollRecord = {
      id: `new-${Date.now()}`,
      employeeId: "",
      customEmployeeId: "",
      employeeName: "",
      basicSalary: 0,
      workedDays: daysInMonth, // Default to full month
      totalDays: daysInMonth,
      allowances: {
        operational: 0,
        wellBeing: 0,
        utilityTravel: 0,
        salesCommission: 0,
        other: 0,
      },
      deductions: {
        apit: 0,
        unpaidLeave: 0,
        lateAttendance: 0,
        other: 0,
      },
      commission: 0,
      isGenerated: false,
    };
    setPayrollRecords([...payrollRecords, newRecord]);
  };

  const updateRecord = (id: string, field: keyof PayrollRecord, value: any) => {
    setPayrollRecords(records =>
      records.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payroll record?")) {
      // If it's a new record (not in DB), just remove from state
      if (id.startsWith("new-")) {
        setPayrollRecords(records => records.filter(r => r.id !== id));
        return;
      }

      // If it's a DB record, call server action
      try {
        const result = await deletePayrollRecord(id);
        if (result.success) {
          setPayrollRecords(records => records.filter(r => r.id !== id));
          toast.success("Record deleted");
        } else {
          toast.error(result.error || "Failed to delete record");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  const handleEdit = (id: string) => {
    setPayrollRecords(records =>
      records.map(record =>
        record.id === id ? { ...record, isGenerated: false } : record
      )
    );
  };

  // Helper function to load logo as base64 with resizing and compression
  const loadLogoAsBase64 = async (): Promise<string> => {
    try {
      const response = await fetch('/assets/payslip_logo.png');
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Resize logic
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500; // Limit width to 500px
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Use PNG to preserve transparency and quality
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading logo:', error);
      return '';
    }
  };

  const generatePayroll = async (record: PayrollRecord) => {
    if (!record.employeeName || record.basicSalary === 0) {
      toast.error("Please fill in employee name and basic salary");
      return;
    }

    if (!record.employeeId) {
        toast.error("Please select an employee first");
        return;
    }

    const epf = calculateEPF(record.basicSalary, record.position);
    const etf = calculateETF(record.basicSalary, record.position);
    const netPay = calculateNetPay(record);

    try {
        console.log("🚀 Starting payroll generation for:", record.employeeName);
        
        // 1. Load logo as base64 first
        const logoBase64 = await loadLogoAsBase64();
        console.log("✅ Logo loaded, length:", logoBase64?.length || 0);

        // 2. Generate Advanced PDF Payslip FIRST (so we can save it)
        const slip = generatePayslipPDF({
          employeeName: record.employeeName,
          employeeId: record.customEmployeeId || record.employeeId,
          epfNumber: record.epfNumber,
          nicNumber: record.nicNumber,
          designation: record.position || "Employee",
          department: record.department || "General",
          employmentType: record.employmentType || "Full-time",
          dateOfJoining: record.dateOfJoining || new Date().toISOString().split('T')[0],
          payPeriod: new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
          workedDays: record.workedDays,
          totalDays: record.totalDays,
          basicSalary: record.basicSalary,
          allowances: record.allowances || {
            fixed: 0,
            operational: 0,
            wellBeing: 0,
            utilityTravel: 0,
            salesCommission: 0,
            other: 0,
          },
          deductions: record.deductions || {
            apit: 0,
            unpaidLeave: 0,
            lateAttendance: 0,
            other: 0,
          },
          commission: record.commission,
          epf,
          epfEmployer: calculateEPFEmployer(record.basicSalary, record.position),
          etf,
          netPay,
          bankName: record.bankName,
          branch: record.branch,
          accountNumber: record.accountNumber,
          notes: record.notes,
          companyName: companySettings?.companyName || "Infinit Tech Systems (PVT) LTD",
          companyAddress: companySettings?.address || "123 Business Rd, Tech City",
          companyPhone: companySettings?.phone || "",
          companyMobile: companySettings?.mobile || "",
          companyEmail: companySettings?.email || "",
          companyPvNumber: companySettings?.pvNumber || "",
          companyLogo: logoBase64 || "/assets/payslip_logo.png",
        });
        
        console.log("✅ PDF generated, size:", slip?.length || 0, "bytes");
        console.log("📝 Notes:", record.notes || "none");

        // 3. Call Server Action to Save Data + Slip + Notes
        let result;
        
        // If it's a new record, create it
        if (record.id.startsWith("new-")) {
          console.log("📤 Creating new payroll record...");
          result = await generatePayrollAction({
              employeeId: record.employeeId,
              month: month,
              year: year,
              basicSalary: record.basicSalary,
              allowances: record.allowances,
              bonuses: record.commission,
              deductions: record.deductions,
              country: "SRI_LANKA" as any,
              currency: "LKR" as any,
              notes: record.notes, // Persist Notes
              slip: slip,          // Persist Slip
              customFields: record.customFields, // Persist Custom Fields
          });
        } else {
          console.log("📤 Updating existing payroll record:", record.id);
          result = await updatePayrollRecord(record.id, {
            basicSalary: record.basicSalary,
            allowances: record.allowances,
            deductions: record.deductions,
            bonuses: record.commission,
            notes: record.notes, // Persist Notes
            slip: slip,          // Persist Slip
            customFields: record.customFields, // Persist Custom Fields
          });
        }

        console.log("📥 Server response:", result);

        if (!result.success) {
            console.error("❌ Server action failed:", result.error);
            toast.error(result.error || "Failed to save payroll record");
            return;
        }

        console.log("✅ Server save successful, returned ID:", result.data?.id);

        // 4. Update Local State & Ref (Redundant if persistent, but keeps UI fast)
        generatedSlipsRef.current[record.id] = slip;

        setPayrollRecords(records =>
          records.map(r =>
            r.id === record.id ? { 
              ...r, 
              id: result.data?.id || r.id, // Update ID from server result
              slip, 
              isGenerated: true, 
              generatedAt: new Date().toISOString() 
            } : r
          )
        );

        console.log("✅ Local state updated with slip");
        console.log("📊 Final record state:", { id: result.data?.id || record.id, hasSlip: !!slip, slipLength: slip?.length });
        toast.success("Payroll generated and saved successfully!");
        // Don't refresh - it overwrites local state before server data is ready
        // router.refresh();
    } catch (error) {
        console.error("❌ Generation error:", error);
        toast.error("An unexpected error occurred");
    }
  };

  const handleExport = () => {
    const data = payrollRecords.map(record => {
      const epf = calculateEPF(record.basicSalary, record.position);
      const etf = calculateETF(record.basicSalary, record.position);
      const netPay = calculateNetPay(record);
      
      const totalAllowances = 
        (record.allowances?.operational || 0) +
        (record.allowances?.wellBeing || 0) +
        (record.allowances?.utilityTravel || 0) +
        (record.allowances?.salesCommission || 0) +
        (record.allowances?.other || 0);
      
      return {
        "Employee Name": record.employeeName,
        "Designation": record.position || "-",
        "Basic Salary": record.basicSalary,
        "Total Allowances": totalAllowances,
        "Commission": record.commission,
        "EPF (8%)": epf,
        "ETF (3%) - Employer": etf,
        "Net Pay": netPay,
        "Status": record.isGenerated ? "Processed" : "Pending",
        "Generated At": record.generatedAt ? new Date(record.generatedAt).toLocaleDateString() : "-"
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");
    XLSX.writeFile(wb, `Payroll_Export_${year}_${month}.xlsx`);
    XLSX.writeFile(wb, `Payroll_Export_${year}_${month}.xlsx`);
    toast.success("Payroll data exported successfully");
  };

  const handleDistributePayslips = async () => {
    const generatedRecords = payrollRecords.filter(r => r.isGenerated);
    
    if (generatedRecords.length === 0) {
      toast.error("No generated payslips to distribute");
      return;
    }

    setShowDistributionModal(true);
    setIsDistributing(true);
    setDistributionProgress({ current: 0, total: generatedRecords.length });

    try {
      // Fetch CC settings
      const settingsResult = await getCompanyEmailSettings();
      const ccEmails = settingsResult.success ? settingsResult.ccEmails?.filter(e => e) : [];

      console.log("🚀 Starting Payslip Distribution");
      console.log(`📧 CC Recipients: ${ccEmails?.join(", ") || "None"}`);

      for (let i = 0; i < generatedRecords.length; i++) {
        const record = generatedRecords[i];
        
        // Update progress
        setDistributionProgress({ current: i + 1, total: generatedRecords.length });
        
        // Generate Email HTML
        const emailHtml = generatePayslipEmail({
          employeeName: record.employeeName,
          month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
          year: year,
          basicSalary: record.basicSalary,
          totalAllowances: (record.allowances?.operational || 0) + 
                          (record.allowances?.wellBeing || 0) + 
                          (record.allowances?.utilityTravel || 0) + 
                          (record.allowances?.salesCommission || 0) + 
                          (record.allowances?.other || 0),
          totalDeductions: (record.deductions?.apit || 0) + 
                          (record.deductions?.unpaidLeave || 0) + 
                          (record.deductions?.lateAttendance || 0) + 
                          (record.deductions?.other || 0) + 
                          calculateEPF(record.basicSalary, record.position),
          netSalary: calculateNetPay(record),
          companyName: companySettings?.companyName || "OrbitHR Inc."
        });

        // Send Real Email
        if (!record.employeeEmail) {
          console.warn(`⚠️ Skipping ${record.employeeName} - no email found`);
          continue;
        }

        // Send to N8N with complete data
        const emailResult = await sendPayslipEmail(
          record.employeeEmail,
          ccEmails || [],
          `Salary Slip for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
          emailHtml,
          {
            employeeName: record.employeeName,
            employeeId: record.customEmployeeId || record.employeeId,
            department: record.department || 'N/A',
            position: record.position || 'N/A',
            month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
            year: year,
            basicSalary: record.basicSalary,
            totalAllowances: (record.allowances?.operational || 0) + 
                            (record.allowances?.wellBeing || 0) + 
                            (record.allowances?.utilityTravel || 0) + 
                            (record.allowances?.salesCommission || 0) + 
                            (record.allowances?.other || 0),
            totalDeductions: (record.deductions?.apit || 0) + 
                            (record.deductions?.unpaidLeave || 0) + 
                            (record.deductions?.lateAttendance || 0) + 
                            (record.deductions?.other || 0) + 
                            calculateEPF(record.basicSalary, record.position),
            netSalary: calculateNetPay(record),
            companyName: companySettings?.companyName || "OrbitHR Inc."
          },
          record.slip // Pass the PDF as attachment
        );

        if (!emailResult.success) {
          console.error(`❌ Failed to send to ${record.employeeName}:`, emailResult.error);
        } else {
          console.log(`✅ Sent to ${record.employeeName} <${record.employeeEmail}>`);
        }
      }

      toast.success(`Successfully distributed ${generatedRecords.length} payslips`);
      setTimeout(() => setShowDistributionModal(false), 1500);

    } catch (error) {
      console.error("Distribution failed:", error);
      toast.error("Failed to distribute payslips");
    } finally {
      setIsDistributing(false);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Payroll Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage employee compensation and benefits
          </p>
        </div>
        <div className="flex gap-2 items-center">
            {/* Month Selector */}
            <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md mr-2">
                <button 
                    onClick={() => handleMonthChange(month - 1)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-md"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-sm font-medium min-w-[120px] text-center">
                    {monthName} {year}
                </div>
                <button 
                    onClick={() => handleMonthChange(month + 1)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-md"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="h-8 px-3 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          >
            <option value="USD">USD ($)</option>
            <option value="LKR">LKR (Rs.)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => setShowEmailSettings(!showEmailSettings)}>
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Email Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
            Export Data
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDistributePayslips}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Distribute Payslips
          </Button>
          <Button size="sm" onClick={addNewRow}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Employee
          </Button>
        </div>

      {/* Email Settings Modal */}
      <PayslipEmailSettings 
        isOpen={showEmailSettings} 
        onClose={() => setShowEmailSettings(false)} 
      />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Payroll
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {formatCurrency(summary.totalPayroll)}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            For {monthName}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Employees
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {summary.employeeCount}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Active employees
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Avg. Salary
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {formatCurrency(Math.round(summary.avgSalary))}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Per employee
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Deductions
            </span>
          </div>
          <div className="text-3xl font-semibold text-zinc-900 dark:text-white mb-1">
            {formatCurrency(Math.round(summary.totalDeductions))}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            ETF + EPF
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Payroll Records for {monthName} {year}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  EPF Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Deductions
                </th>
                {customFieldDefs.map((def) => (
                  <th key={def.name} className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {def.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  EPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Slip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {payrollRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No payroll records for this month. Click "Add Employee" to create a new record.
                  </td>
                </tr>
              ) : (
                payrollRecords.map((record) => {
                  const epf = calculateEPF(record.basicSalary, record.position);
                  const etf = calculateETF(record.basicSalary, record.position);
                  const deductions = epf; // Only EPF is deducted from employee
                  const netPay = calculateNetPay(record);

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <div>
                            <div className="text-sm font-medium text-zinc-900 dark:text-white">
                              {record.employeeName}
                            </div>
                            {record.position && (
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {record.position}
                              </div>
                            )}
                          </div>
                        ) : (
                          <select
                            value={record.employeeId || ""}
                            onChange={(e) => {
                              const selectedEmp = employees.find(emp => emp.id === e.target.value);
                              if (selectedEmp) {
                                updateRecord(record.id, 'employeeId', selectedEmp.id);
                                updateRecord(record.id, 'customEmployeeId', selectedEmp.employeeId || '');
                                updateRecord(record.id, 'employeeName', `${selectedEmp.firstName} ${selectedEmp.lastName}`);
                                updateRecord(record.id, 'epfNumber', selectedEmp.epfNumber || '');
                                updateRecord(record.id, 'position', selectedEmp.position || '');
                                updateRecord(record.id, 'department', selectedEmp.department || '');
                                updateRecord(record.id, 'dateOfJoining', selectedEmp.dateOfJoining || '');
                                updateRecord(record.id, 'bankName', selectedEmp.bankName || '');
                                updateRecord(record.id, 'branch', selectedEmp.branch || '');
                                updateRecord(record.id, 'accountNumber', selectedEmp.accountNumber || '');
                              } else {
                                updateRecord(record.id, 'employeeId', "");
                                updateRecord(record.id, 'customEmployeeId', "");
                                updateRecord(record.id, 'employeeName', "");
                                updateRecord(record.id, 'epfNumber', "");
                              }
                            }}
                            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white w-full max-w-[200px]"
                          >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName} {emp.position ? `(${emp.position})` : ''}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                            {record.epfNumber || '-'}
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={record.epfNumber || ""}
                            onChange={(e) => updateRecord(record.id, 'epfNumber', e.target.value)}
                            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-32 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                            placeholder="EPF-XXXXX"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-900 dark:text-white">
                            {formatCurrency(record.basicSalary)}
                          </span>
                        ) : (
                          <input
                            type="number"
                            value={record.basicSalary || ""}
                            onChange={(e) => updateRecord(record.id, 'basicSalary', Number(e.target.value))}
                            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-28 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            placeholder="0"
                          />
                        )}
                      </td>
                      {/* Attendance Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-900 dark:text-white font-mono">
                            {record.workedDays}/{record.totalDays}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={record.workedDays || ""}
                              onChange={(e) => updateRecord(record.id, 'workedDays', Number(e.target.value))}
                              className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-14 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-center font-mono"
                              placeholder="28"
                              min="0"
                              max={record.totalDays}
                            />
                            <span className="text-zinc-500 dark:text-zinc-400">/</span>
                            <input
                              type="number"
                              value={record.totalDays || ""}
                              onChange={(e) => updateRecord(record.id, 'totalDays', Number(e.target.value))}
                              className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-14 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-center font-mono"
                              placeholder="30"
                              min="1"
                              max="31"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-900 dark:text-white">
                            {formatCurrency(
                              (record.allowances?.operational || 0) +
                              (record.allowances?.wellBeing || 0) +
                              (record.allowances?.utilityTravel || 0) +
                              (record.allowances?.salesCommission || 0) +
                              (record.allowances?.other || 0)
                            )}
                          </span>
                        ) : (
                          <div className="space-y-1 max-w-[180px]">
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.allowances?.operational || ""}
                                onChange={(e) => {
                                  const newAllowances = { 
                                    ...(record.allowances || { operational: 0, wellBeing: 0, utilityTravel: 0, salesCommission: 0, other: 0 }), 
                                    operational: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'allowances', newAllowances);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Operational</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.allowances?.wellBeing || ""}
                                onChange={(e) => {
                                  const newAllowances = { 
                                    ...(record.allowances || { operational: 0, wellBeing: 0, utilityTravel: 0, salesCommission: 0, other: 0 }), 
                                    wellBeing: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'allowances', newAllowances);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Well-being</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.allowances?.utilityTravel || ""}
                                onChange={(e) => {
                                  const newAllowances = { 
                                    ...(record.allowances || { operational: 0, wellBeing: 0, utilityTravel: 0, salesCommission: 0, other: 0 }), 
                                    utilityTravel: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'allowances', newAllowances);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Utility/Travel</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.allowances?.salesCommission || ""}
                                onChange={(e) => {
                                  const newAllowances = { 
                                    ...(record.allowances || { operational: 0, wellBeing: 0, utilityTravel: 0, salesCommission: 0, other: 0 }), 
                                    salesCommission: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'allowances', newAllowances);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Sales Comm.</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.allowances?.other || ""}
                                onChange={(e) => {
                                  const newAllowances = { 
                                    ...(record.allowances || { operational: 0, wellBeing: 0, utilityTravel: 0, salesCommission: 0, other: 0 }), 
                                    other: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'allowances', newAllowances);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Other</span>
                            </div>
                          </div>
                        )}
                      </td>
                      {/* DEDUCTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-red-600 dark:text-red-400">
                            -{formatCurrency(
                              (record.deductions?.apit || 0) +
                              (record.deductions?.unpaidLeave || 0) +
                              (record.deductions?.lateAttendance || 0) +
                              (record.deductions?.other || 0)
                            )}
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.deductions?.apit || ""}
                                onChange={(e) => {
                                  const newDeductions = { 
                                    ...(record.deductions || { apit: 0, unpaidLeave: 0, lateAttendance: 0, other: 0 }), 
                                    apit: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'deductions', newDeductions);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">APIT</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.deductions?.unpaidLeave || ""}
                                onChange={(e) => {
                                  const newDeductions = { 
                                    ...(record.deductions || { apit: 0, unpaidLeave: 0, lateAttendance: 0, other: 0 }), 
                                    unpaidLeave: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'deductions', newDeductions);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Unpaid Leave</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.deductions?.lateAttendance || ""}
                                onChange={(e) => {
                                  const newDeductions = { 
                                    ...(record.deductions || { apit: 0, unpaidLeave: 0, lateAttendance: 0, other: 0 }), 
                                    lateAttendance: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'deductions', newDeductions);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Late Attend.</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                value={record.deductions?.other || ""}
                                onChange={(e) => {
                                  const newDeductions = { 
                                    ...(record.deductions || { apit: 0, unpaidLeave: 0, lateAttendance: 0, other: 0 }), 
                                    other: Number(e.target.value) 
                                  };
                                  updateRecord(record.id, 'deductions', newDeductions);
                                }}
                                className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5 w-16 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                placeholder="0"
                              />
                              <span className="text-[10px] text-zinc-500">Other</span>
                            </div>
                          </div>
                        )}
                      </td>
                      
                      {/* Dynamic Custom Fields */}
                      {customFieldDefs.map((def) => (
                        <td key={def.name} className="px-6 py-4 whitespace-nowrap">
                          {record.isGenerated ? (
                             <span className="text-sm text-zinc-900 dark:text-white">
                                {record.customFields?.[def.name] || '-'}
                             </span>
                          ) : (
                            <input
                              type={def.type === "NUMBER" ? "number" : "text"}
                              value={record.customFields?.[def.name] || ""}
                              onChange={(e) => {
                                const newVal = def.type === "NUMBER" ? Number(e.target.value) : e.target.value;
                                const newCustomFields = { ...record.customFields, [def.name]: newVal };
                                updateRecord(record.id, 'customFields', newCustomFields);
                              }}
                              className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-28 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                              placeholder={def.label}
                            />
                          )}
                        </td>
                      ))}
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-900 dark:text-white">
                            {formatCurrency(record.commission)}
                          </span>
                        ) : (
                          <input
                            type="number"
                            value={record.commission || ""}
                            onChange={(e) => updateRecord(record.id, 'commission', Number(e.target.value))}
                            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-28 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            placeholder="0"
                          />
                        )}
                      </td>
                      {/* Notes Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.isGenerated ? (
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 max-w-[100px] truncate block">
                            {record.notes || '-'}
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={record.notes || ""}
                            onChange={(e) => updateRecord(record.id, 'notes', e.target.value)}
                            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-32 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            placeholder="Notes..."
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-red-600 dark:text-red-400">
                          -{formatCurrency(Math.round(deductions))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {formatCurrency(Math.round(netPay))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.slip ? (
                          <button
                            onClick={() => setSelectedSlip(record.slip!)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {record.isGenerated ? (
                            <>
                              <button
                                onClick={() => handleEdit(record.id)}
                                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => generatePayroll(record)}
                                className="h-7 text-xs"
                              >
                                Generate
                              </Button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Preview Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col h-[85vh]">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Payslip Preview</h3>
              <div className="flex items-center gap-2">
                <a
                  href={selectedSlip}
                  download="payslip.pdf"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
                <button
                  onClick={() => setSelectedSlip(null)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-4 overflow-hidden">
               {/* Convert Data URI to Blob for reliable iframe display */}
              <iframe 
                src={(() => {
                    try {
                        const byteString = atob(selectedSlip.split(',')[1]);
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        const blob = new Blob([ab], { type: 'application/pdf' });
                        return URL.createObjectURL(blob);
                    } catch (e) {
                        return selectedSlip;
                    }
                })()} 
                className="w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white"
                title="Payslip Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


