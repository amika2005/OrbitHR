"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const salaryStructureSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  basicSalary: z.number().min(0, "Basic salary must be positive"),
  hra: z.number().min(0).optional(),
  transportAllowance: z.number().min(0).optional(),
  medicalAllowance: z.number().min(0).optional(),
  specialAllowance: z.number().min(0).optional(),
  effectiveFrom: z.string().optional(),
});

/**
 * Create or update salary structure for an employee
 */
export async function createSalaryStructure(
  data: z.infer<typeof salaryStructureSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const validatedData = salaryStructureSchema.parse(data);

    // Check if salary structure already exists
    const existing = await db.salaryStructure.findUnique({
      where: { employeeId: validatedData.employeeId },
    });

    if (existing) {
      // Deactivate existing structure
      await db.salaryStructure.update({
        where: { employeeId: validatedData.employeeId },
        data: {
          isActive: false,
          effectiveTo: new Date(),
        },
      });
    }

    // Create new salary structure
    const salaryStructure = await db.salaryStructure.create({
      data: {
        employeeId: validatedData.employeeId,
        basicSalary: validatedData.basicSalary,
        hra: validatedData.hra || validatedData.basicSalary * 0.4, // Default 40% of basic
        transportAllowance: validatedData.transportAllowance || 5000,
        medicalAllowance: validatedData.medicalAllowance || 3000,
        specialAllowance: validatedData.specialAllowance || 0,
        effectiveFrom: validatedData.effectiveFrom
          ? new Date(validatedData.effectiveFrom)
          : new Date(),
        isActive: true,
      },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true, data: salaryStructure };
  } catch (error) {
    console.error("Create Salary Structure Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get salary structure for an employee
 */
export async function getSalaryStructure(employeeId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const salaryStructure = await db.salaryStructure.findUnique({
      where: { employeeId, isActive: true },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    if (!salaryStructure) {
      return { success: false, error: "Salary structure not found" };
    }

    return { success: true, data: salaryStructure };
  } catch (error) {
    console.error("Get Salary Structure Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all salary structures for a company
 */
export async function getAllSalaryStructures() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const salaryStructures = await db.salaryStructure.findMany({
      where: {
        employee: {
          companyId: user.companyId,
        },
        isActive: true,
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
            employeeId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: salaryStructures };
  } catch (error) {
    console.error("Get All Salary Structures Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete salary structure
 */
export async function deleteSalaryStructure(employeeId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    await db.salaryStructure.update({
      where: { employeeId },
      data: {
        isActive: false,
        effectiveTo: new Date(),
      },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true };
  } catch (error) {
    console.error("Delete Salary Structure Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
