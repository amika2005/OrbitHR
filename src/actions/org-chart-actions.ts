"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getOrgChartData() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    const companyUsers = await db.user.findMany({
      where: {
        companyId: dbUser.companyId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        department: true,
        managerId: true,
        email: true,
        employeeId: true,
        imageUrl: true,
      },
    });

    return { success: true, data: companyUsers };
  } catch (error) {
    console.error("Error fetching org chart data:", error);
    return { success: false, error: "Failed to fetch org chart data" };
  }
}

export async function updateOrgStructure(updates: { employeeId: string; managerId: string | null }[]) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Verify all employees belong to the same company
    // This is a simplified check; for production, you might want to verify each ID
    
    await db.$transaction(
      updates.map((update) =>
        db.user.update({
          where: { id: update.employeeId, companyId: dbUser.companyId },
          data: { managerId: update.managerId },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating org structure:", error);
    return { success: false, error: "Failed to update structure" };
  }
}

export async function addOrgMember(data: {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  employeeId: string;
  managerId: string | null;
  imageUrl?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Check if email or employee ID already exists in the company
    const existingUser = await db.user.findFirst({
      where: {
        companyId: dbUser.companyId,
        OR: [{ email: data.email }, { employeeId: data.employeeId }],
      },
    });

    if (existingUser) {
      return { success: false, error: "Employee with this email or ID already exists" };
    }

    const newUser = await db.user.create({
      data: {
        ...data,
        companyId: dbUser.companyId,
        role: "EMPLOYEE", // Default role
        clerkId: null, // Will be linked when they sign up/invited
      },
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error adding org member:", error);
    return { success: false, error: "Failed to add member" };
  }
}

export async function deleteOrgMember(employeeId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Check if employee exists and belongs to company
    const employee = await db.user.findFirst({
      where: { id: employeeId, companyId: dbUser.companyId },
      include: { subordinates: true },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Check for subordinates
    if (employee.subordinates.length > 0) {
      return { 
        success: false, 
        error: `Cannot delete ${employee.firstName} ${employee.lastName} because they have ${employee.subordinates.length} direct reports. Please reassign them first.` 
      };
    }

    // Delete employee
    await db.user.delete({
      where: { id: employeeId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting org member:", error);
    return { success: false, error: "Failed to delete member" };
  }
}
