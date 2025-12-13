"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generatePayrollData } from "@/lib/calculateSalary";

// Define enums locally
enum Country {
  JAPAN = "JAPAN",
  SRI_LANKA = "SRI_LANKA",
}

enum Currency {
  JPY = "JPY",
  LKR = "LKR",
}

const payrollSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  month: z.number().min(1).max(12, "Month must be between 1 and 12"),
  year: z.number().min(2020).max(2030, "Year must be between 2020 and 2030"),
  basicSalary: z.number().min(0, "Basic salary must be positive"),
  allowances: z.record(z.number()).optional(),
  deductions: z.record(z.number()).optional(),
  bonuses: z.number().min(0, "Bonuses must be positive").optional(),
  country: z.nativeEnum(Country),
  currency: z.nativeEnum(Currency),
  notes: z.string().optional(),
  slip: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

export async function generatePayroll(data: z.infer<typeof payrollSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Validate data
    const validatedData = payrollSchema.parse(data);

    // Check if employee exists and belongs to company
    const employee = await db.user.findUnique({
      where: { 
        id: validatedData.employeeId,
        companyId: user.companyId!,
      },
      select: { 
        salary: true,
        position: true,
      },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Check if payroll already exists for this period
    const existingPayroll = await db.payrollRecord.findUnique({
      where: {
        employeeId_month_year: {
          employeeId: validatedData.employeeId,
          month: validatedData.month,
          year: validatedData.year,
        },
      },
    });

    // Check for previous month's carry-over if this is a new record or current data is empty
    const areAllowancesEmpty = !data.allowances || Object.values(data.allowances).every(v => v === 0);
    const areDeductionsEmpty = !data.deductions || Object.values(data.deductions).every(v => v === 0);

    let finalAllowances = data.allowances || {};
    let finalDeductions = data.deductions || {};

    if ((!existingPayroll && (areAllowancesEmpty || areDeductionsEmpty)) || (existingPayroll && areAllowancesEmpty && areDeductionsEmpty)) {
       let previousMonth = validatedData.month - 1;
       let previousYear = validatedData.year;
       if (previousMonth === 0) {
          previousMonth = 12;
          previousYear = validatedData.year - 1;
       }

       const previousPayroll = await db.payrollRecord.findUnique({
          where: {
            employeeId_month_year: {
               employeeId: validatedData.employeeId,
               month: previousMonth,
               year: previousYear,
            },
          },
          select: {
             allowances: true,
             otherDeductions: true,
          },
       });

       if (previousPayroll) {
          if (areAllowancesEmpty) {
             finalAllowances = previousPayroll.allowances as Record<string, number> || {};
          }
          if (areDeductionsEmpty) {
             finalDeductions = previousPayroll.otherDeductions as Record<string, number> || {};
          }
       }
    }

    // Generate payroll data using our calculation function
    const payrollData = generatePayrollData({
      employeeId: validatedData.employeeId,
      month: validatedData.month,
      year: validatedData.year,
      basicSalary: validatedData.basicSalary,
      allowances: finalAllowances,
      deductions: finalDeductions,
      bonuses: validatedData.bonuses || 0,
      country: validatedData.country,
      currency: validatedData.currency,
      employmentStatus: employee.position?.toLowerCase().includes("intern") ? "INTERN" : "PERMANENT",
    });

    let payroll;

    if (existingPayroll) {
      // Update existing record instead of blocking
      payroll = await db.payrollRecord.update({
        where: { id: existingPayroll.id },
        data: {
          ...payrollData,
          notes: validatedData.notes,
          slip: validatedData.slip,
          customFields: validatedData.customFields || undefined,
          payDate: new Date(),
          isProcessed: true,
        },
      });
    } else {
      // Create new record
      payroll = await db.payrollRecord.create({
        data: {
          ...payrollData,
          companyId: user.companyId!,
          notes: validatedData.notes,
          slip: validatedData.slip,
          customFields: validatedData.customFields || undefined,
          payDate: new Date(),
          isProcessed: true,
        },
      });
    }

    console.log("✅ Payroll saved to database:", {
      id: payroll.id,
      employeeId: payroll.employeeId,
      month: payroll.month,
      year: payroll.year,
      companyId: payroll.companyId,
    });

    // Verify the record actually exists in the database
    const verification = await db.payrollRecord.findUnique({
      where: { id: payroll.id },
    });
    
    console.log("🔍 Verification - Record exists in DB:", !!verification, verification?.id);

    revalidatePath("/dashboard/payroll");
    return { success: true, data: payroll };
  } catch (error) {
    console.error("Generate Payroll Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function batchGeneratePayroll(
  month: number,
  year: number,
  employeeIds?: string[]
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Get company details for currency and country
    const company = await db.company.findUnique({
      where: { id: user.companyId! },
      select: { currency: true, country: true },
    });

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Get employees
    const whereClause: any = {
      companyId: user.companyId!,
      role: "EMPLOYEE",
    };

    if (employeeIds && employeeIds.length > 0) {
      whereClause.id = { in: employeeIds };
    }

    const employees = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        salary: true,
        position: true,
      },
    });

    let processed = 0;
    let failed = 0;

    // Process each employee
    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await db.payrollRecord.findUnique({
          where: {
            employeeId_month_year: {
              employeeId: employee.id,
              month,
              year,
            },
          },
        });

        if (existingPayroll) {
          failed++;
          continue;
        }

        if (!employee.salary) {
          failed++;
          continue;
        }

        // Check for previous month's payroll to carry over details
        let previousMonth = month - 1;
        let previousYear = year;
        if (previousMonth === 0) {
          previousMonth = 12;
          previousYear = year - 1;
        }

        const previousPayroll = await db.payrollRecord.findUnique({
          where: {
            employeeId_month_year: {
              employeeId: employee.id,
              month: previousMonth,
              year: previousYear,
            },
          },
          select: {
            allowances: true,
            otherDeductions: true,
          },
        });

        const allowances = previousPayroll?.allowances as Record<string, number> || {};
        const deductions = previousPayroll?.otherDeductions as Record<string, number> || {};

        // Generate payroll data
        const payrollData = generatePayrollData({
          employeeId: employee.id,
          month,
          year,
          basicSalary: Number(employee.salary),
          allowances,
          deductions,
          bonuses: 0,
          country: company.country,
          currency: company.currency,
          employmentStatus: employee.position?.toLowerCase().includes("intern") ? "INTERN" : "PERMANENT",
        });

        // Create payroll record
        await db.payrollRecord.create({
          data: {
            ...payrollData,
            companyId: user.companyId!,
            payDate: new Date(),
            isProcessed: true, // Mark as processed since it's generated
          },
        });

        processed++;
      } catch (error) {
        console.error(`Failed to generate payroll for employee ${employee.id}:`, error);
        failed++;
      }
    }

    revalidatePath("/dashboard/payroll");
    return { success: true, processed, failed };
  } catch (error) {
    console.error("Batch Generate Payroll Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPayrollRecords(
  month?: number,
  year?: number
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Build where clause
    const whereClause: any = { companyId: user.companyId! };
    if (month && year) {
      whereClause.month = month;
      whereClause.year = year;
    }

    // Get payroll records
    const payrollRecords = await db.payrollRecord.findMany({
      where: whereClause,
      orderBy: [
        { year: "desc" },
        { month: "desc" },
      ],
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            employeeId: true,
            epfNumber: true,
            department: true,
            position: true,
            hireDate: true,
            bankName: true,
            branch: true,
            accountNumber: true,
          },
        },
      },
    });

    console.log("📊 Fetched payroll records:", {
      count: payrollRecords.length,
      month,
      year,
      companyId: user.companyId!,
      records: payrollRecords.map(r => ({
        id: r.id,
        employeeId: r.employeeId,
        employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
        epfNumber: r.employee.epfNumber,
        hasEPF: !!r.employee.epfNumber,
        month: r.month,
        year: r.year,
      })),
    });

    return { success: true, data: payrollRecords };
  } catch (error) {
    console.error("Get Payroll Records Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function processPayroll(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Check if payroll exists and belongs to user's company
    const existingPayroll = await db.payrollRecord.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingPayroll || existingPayroll.companyId !== user.companyId) {
      return { success: false, error: "Payroll record not found" };
    }

    // Mark as processed
    const updatedPayroll = await db.payrollRecord.update({
      where: { id },
      data: {
        isProcessed: true,
        payDate: new Date(),
      },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true, data: updatedPayroll };
  } catch (error) {
    console.error("Process Payroll Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deletePayrollRecord(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Check if payroll exists and belongs to user's company
    const existingPayroll = await db.payrollRecord.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingPayroll || existingPayroll.companyId !== user.companyId) {
      return { success: false, error: "Payroll record not found" };
    }

    // Delete record
    await db.payrollRecord.delete({
      where: { id },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true };
  } catch (error) {
    console.error("Delete Payroll Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePayrollRecord(id: string, data: Partial<z.infer<typeof payrollSchema>>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Check if payroll exists and belongs to user's company
    const existingPayroll = await db.payrollRecord.findUnique({
      where: { id },
      select: { 
        companyId: true,
        employeeId: true,
        month: true,
        year: true,
        currency: true,
        customFields: true,
        company: {
          select: {
            country: true,
          },
        },
      },
    });

    if (!existingPayroll || existingPayroll.companyId !== user.companyId) {
      return { success: false, error: "Payroll record not found" };
    }

    // Get employee details for employment status
    const employee = await db.user.findUnique({
      where: { id: existingPayroll.employeeId },
      select: { position: true },
    });

    // If salary-related fields are being updated, recalculate the entire payroll
    if (data.basicSalary !== undefined || data.allowances !== undefined || data.bonuses !== undefined || data.deductions !== undefined) {
      const payrollData = generatePayrollData({
        employeeId: existingPayroll.employeeId,
        month: existingPayroll.month,
        year: existingPayroll.year,
        basicSalary: data.basicSalary ?? 0,
        allowances: data.allowances || {},
        deductions: data.deductions || {},
        bonuses: data.bonuses || 0,
        country: existingPayroll.company.country,
        currency: existingPayroll.currency,
        employmentStatus: employee?.position?.toLowerCase().includes("intern") ? "INTERN" : "PERMANENT",
      });

      // Update record with recalculated data
      const updatedPayroll = await db.payrollRecord.update({
        where: { id },
        data: {
          ...payrollData,
          customFields: data.customFields ?? existingPayroll.customFields ?? undefined, // Preserves or updates custom fields
          isProcessed: true, // Mark as processed after regeneration
          payDate: new Date(),
          updatedAt: new Date(),
        },
      });

      revalidatePath("/dashboard/payroll");
      return { success: true, data: updatedPayroll };
    }

    // If only non-salary fields are updated, just update those
    const updatedPayroll = await db.payrollRecord.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true, data: updatedPayroll };
  } catch (error) {
    console.error("Update Payroll Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
