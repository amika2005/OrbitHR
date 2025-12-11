"use server";

import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";
import { getLeaveAllocation, type EmploymentStatus } from "@/lib/leave-allocation";

export interface CreateEmployeeData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  position?: string;
  epfNumber?: string;
  contactNumber?: string;
  emergencyContactNumber?: string;
  employmentStatus?: EmploymentStatus;
  bankName?: string;
  accountNumber?: string;
  branch?: string;
  customFields?: Record<string, any>;
}

interface UpdateEmployeeData {
  id: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  epfNumber?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  contactNumber?: string;
  emergencyContactNumber?: string;
  employmentStatus?: string;
  bankName?: string;
  accountNumber?: string;
  branch?: string;
  salary?: number;
  customFields?: Record<string, any>;
}

export async function createEmployee(data: CreateEmployeeData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is HR_MANAGER or SUPER_ADMIN
    const hrUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, companyId: true },
    });

    if (!hrUser || (hrUser.role !== UserRole.HR_MANAGER && hrUser.role !== UserRole.SUPER_ADMIN)) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Validate password strength
    if (data.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    // Create user in Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.createUser({
      emailAddress: [data.email],
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: UserRole.EMPLOYEE,
      },
    });

    // Get leave allocation based on employment status
    const employmentStatus = data.employmentStatus || 'PERMANENT';
    const leaveAllocation = getLeaveAllocation(employmentStatus);

    // Create user in database
    await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department || null,
        position: data.position || null,
        epfNumber: data.epfNumber || null,
        contactNumber: data.contactNumber || null,
        emergencyContactNumber: data.emergencyContactNumber || null,
        bankName: data.bankName || null,
        accountNumber: data.accountNumber || null,
        branch: data.branch || null,
        role: UserRole.EMPLOYEE,
        companyId: hrUser.companyId,
        employmentStatus,
        annualLeaveBalance: leaveAllocation.annual,
        casualLeaveBalance: leaveAllocation.casual,
        sickLeaveBalance: leaveAllocation.sick,
        unpaidLeaveTaken: 0,
        customFields: data.customFields || undefined,
      },
    });

    // TODO: Send welcome email (implement sendWelcomeEmail in @/lib/email)
    // try {
    //   await sendWelcomeEmail({
    //     email: data.email,
    //     password: data.password,
    //     firstName: data.firstName,
    //   });
    // } catch (emailError) {
    //   console.error("Error sending welcome email:", emailError);
    //   // Don't fail the employee creation if email fails
    // }

    return { success: true, message: "Employee created successfully" };
  } catch (error: any) {
    console.error("Error creating employee:", error);
    
    // Handle Clerk-specific errors
    if (error?.errors?.[0]?.message) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: "Failed to create employee" };
  }
}

export async function updateEmployee(data: UpdateEmployeeData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is HR_MANAGER or SUPER_ADMIN
    const hrUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, companyId: true },
    });

    if (!hrUser || (hrUser.role !== UserRole.HR_MANAGER && hrUser.role !== UserRole.SUPER_ADMIN)) {
      return { success: false, error: "Unauthorized" };
    }

    // Get employee to update
    const employee = await db.user.findUnique({
      where: { id: data.id },
      select: { clerkId: true, companyId: true, role: true },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Verify employee belongs to same company
    if (employee.companyId !== hrUser.companyId) {
      return { success: false, error: "Unauthorized" };
    }

    // Only allow updating employees, not other HR managers
    if (employee.role !== UserRole.EMPLOYEE) {
      return { success: false, error: "Cannot update non-employee users" };
    }

    // Update in Clerk
    const client = await clerkClient();
    if (employee.clerkId) {
      await client.users.updateUser(employee.clerkId, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }

    // Update in database
    await db.user.update({
      where: { id: data.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        employeeId: data.employeeId,
        epfNumber: data.epfNumber,
        department: data.department,
        position: data.position,
        hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
        contactNumber: data.contactNumber,
        emergencyContactNumber: data.emergencyContactNumber,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        branch: data.branch,
        employmentStatus: data.employmentStatus as any,
        salary: data.salary,
        customFields: data.customFields || undefined,
      },
    });

    return { success: true, message: "Employee updated successfully" };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Failed to update employee" };
  }
}

export async function deleteEmployee(employeeId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is HR_MANAGER or SUPER_ADMIN
    const hrUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, companyId: true },
    });

    if (!hrUser || (hrUser.role !== UserRole.HR_MANAGER && hrUser.role !== UserRole.SUPER_ADMIN)) {
      return { success: false, error: "Unauthorized" };
    }

    // Get employee to delete
    const employee = await db.user.findUnique({
      where: { id: employeeId },
      select: { clerkId: true, companyId: true, role: true },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Verify employee belongs to same company
    if (employee.companyId !== hrUser.companyId) {
      return { success: false, error: "Unauthorized" };
    }

    // Only allow deleting employees
    if (employee.role !== UserRole.EMPLOYEE) {
      return { success: false, error: "Cannot delete non-employee users" };
    }

    try {
      // Delete from Clerk first
      const client = await clerkClient();
      if (employee.clerkId) {
        await client.users.deleteUser(employee.clerkId);
        console.log(`Deleted user from Clerk: ${employee.clerkId}`);
      }
    } catch (clerkError: any) {
      console.error("Error deleting from Clerk:", clerkError);
      // Continue with database deletion even if Clerk deletion fails
      // The user might have been manually deleted from Clerk already
    }

    // Delete from database
    await db.user.delete({
      where: { id: employeeId },
    });
    console.log(`Deleted user from database: ${employeeId}`);

    return { success: true, message: "Employee deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    
    // Provide more specific error messages
    if (error?.code === 'P2025') {
      return { success: false, error: "Employee not found in database" };
    }
    
    return { success: false, error: error?.message || "Failed to delete employee" };
  }
}

export async function getEmployees() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated", employees: [] };
    }

    // Get current user
    const hrUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, companyId: true },
    });

    if (!hrUser || (hrUser.role !== UserRole.HR_MANAGER && hrUser.role !== UserRole.SUPER_ADMIN)) {
      return { success: false, error: "Unauthorized", employees: [] };
    }

    // Get all employees in the company
    const employees = await db.user.findMany({
      where: {
        companyId: hrUser.companyId,
        role: UserRole.EMPLOYEE,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        employeeId: true,
        epfNumber: true,
        department: true,
        position: true,
        hireDate: true,
        contactNumber: true,
        emergencyContactNumber: true,
        bankName: true,
        accountNumber: true,
        branch: true,
        employmentStatus: true,
        salary: true,
        createdAt: true,
        customFields: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "Failed to fetch employees", employees: [] };
  }
}

// Bulk import employees from CSV
export async function bulkImportEmployees(csvData: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated", results: [] };
    }

    // Verify user is HR_MANAGER or SUPER_ADMIN
    const hrUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, companyId: true },
    });

    if (!hrUser || (hrUser.role !== UserRole.HR_MANAGER && hrUser.role !== UserRole.SUPER_ADMIN)) {
      return { success: false, error: "Unauthorized", results: [] };
    }

    // Parse CSV
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return {
        success: false,
        error: "Invalid CSV format",
        results: [],
      };
    }

    const rows = parsed.data as any[];
    const results: Array<{
      email: string;
      success: boolean;
      error?: string;
    }> = [];

    // Validate required headers
    const requiredHeaders = ["email", "firstName", "lastName", "password"];
    const standardHeaders = ["email", "firstName", "lastName", "password", "department", "position"];
    const headers = Object.keys(rows[0] || {});
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return {
        success: false,
        error: `Missing required columns: ${missingHeaders.join(", ")}`,
        results: [],
      };
    }

    // Detect custom fields (columns not in standard list)
    const customFieldKeys = headers.filter((h) => !standardHeaders.includes(h));

    // Process each row
    for (const row of rows) {
      try {
        // Extract standard fields
        const employeeData: CreateEmployeeData = {
          email: row.email?.trim(),
          password: row.password?.trim(),
          firstName: row.firstName?.trim(),
          lastName: row.lastName?.trim(),
          department: row.department?.trim() || undefined,
          position: row.position?.trim() || undefined,
        };

        // Extract custom fields
        if (customFieldKeys.length > 0) {
          const customFields: Record<string, any> = {};
          customFieldKeys.forEach((key) => {
            const value = row[key];
            if (value !== undefined && value !== null && value !== "") {
              customFields[key] = value.toString().trim();
            }
          });
          if (Object.keys(customFields).length > 0) {
            employeeData.customFields = customFields;
          }
        }

        // Validate required fields
        if (!employeeData.email || !employeeData.password || !employeeData.firstName || !employeeData.lastName) {
          results.push({
            email: employeeData.email || "Unknown",
            success: false,
            error: "Missing required fields",
          });
          continue;
        }

        // Create employee
        const result = await createEmployee(employeeData);

        results.push({
          email: employeeData.email,
          success: result.success,
          error: result.error,
        });
      } catch (error: any) {
        results.push({
          email: row.email || "Unknown",
          success: false,
          error: error.message || "Failed to create employee",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      success: true,
      message: `Imported ${successCount} employees successfully. ${failureCount} failed.`,
      results,
    };
  } catch (error) {
    console.error("Error bulk importing employees:", error);
    return {
      success: false,
      error: "Failed to import employees",
      results: [],
    };
  }
}
