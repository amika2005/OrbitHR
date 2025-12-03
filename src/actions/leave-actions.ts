"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const leaveRequestSchema = z.object({
  leaveType: z.enum([
    "ANNUAL_LEAVE",
    "CASUAL_LEAVE",
    "SICK_LEAVE",
    "HALF_DAY",
    "UNPAID_LEAVE",
    "MATERNITY_LEAVE",
    "PATERNITY_LEAVE",
  ]),
  casualSubType: z.enum(["FULL_DAY", "HALF_DAY", "SICK_LEAVE", "SHORT_LEAVE"]).optional(),
  startDate: z.string(),
  endDate: z.string(),
  isHalfDay: z.boolean().optional(),
  isShortLeave: z.boolean().optional(),
  reason: z.string().optional(),
  substituteId: z.string().optional(),
});

export async function createLeaveRequest(data: z.infer<typeof leaveRequestSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, companyId: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const validatedData = leaveRequestSchema.parse(data);

    // Calculate total days
    const start = new Date(validatedData.startDate);
    const end = new Date(validatedData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = validatedData.isHalfDay ? 0.5 : diffDays;

    const leaveRequest = await db.leaveRequest.create({
      data: {
        employeeId: user.id,
        companyId: user.companyId,
        leaveType: validatedData.leaveType,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        isHalfDay: validatedData.isHalfDay || false,
        totalDays,
        reason: validatedData.reason,
        substituteId: validatedData.substituteId,
        status: "PENDING",
      },
    });

    // Sync to Google Calendar if connected
    try {
      const calendarIntegration = await db.calendarIntegration.findUnique({
        where: { userId: user.id },
      });

      if (calendarIntegration?.syncEnabled && calendarIntegration.googleAccessToken) {
        const { createCalendarEvent } = await import("@/lib/google-calendar");
        
        const event = await createCalendarEvent(
          calendarIntegration.googleAccessToken,
          calendarIntegration.googleRefreshToken || undefined,
          {
            summary: `${validatedData.leaveType.replace("_", " ")} - Leave Request`,
            description: validatedData.reason || "Leave request pending approval",
            start: {
              dateTime: new Date(validatedData.startDate).toISOString(),
              timeZone: "Asia/Colombo",
            },
            end: {
              dateTime: new Date(validatedData.endDate).toISOString(),
              timeZone: "Asia/Colombo",
            },
          }
        );

        // Update leave request with Google event ID
        if (event.id) {
          await db.leaveRequest.update({
            where: { id: leaveRequest.id },
            data: { googleEventId: event.id },
          });
        }
      }
    } catch (calendarError) {
      console.error("Google Calendar Sync Error:", calendarError);
      // Don't fail the leave request if calendar sync fails
    }

    revalidatePath("/dashboard/leave");
    return { success: true, data: leaveRequest };
  } catch (error) {
    console.error("Create Leave Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getLeaveRequests(status?: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, companyId: true, role: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const whereClause: any = {
      companyId: user.companyId,
    };

    // If not HR_MANAGER, only show own requests
    if (user.role !== "HR_MANAGER" && user.role !== "SUPER_ADMIN") {
      whereClause.employeeId = user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const leaveRequests = await db.leaveRequest.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
          },
        },
        substitute: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: leaveRequests };
  } catch (error) {
    console.error("Get Leave Requests Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function approveLeaveRequest(id: string, notes?: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true, firstName: true, lastName: true },
    });

    if (!user || (user.role !== "HR_MANAGER" && user.role !== "SUPER_ADMIN")) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Get leave request with employee details
    const existingRequest = await db.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!existingRequest) {
      return { success: false, error: "Leave request not found" };
    }

    const leaveRequest = await db.leaveRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedById: user.id,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });

    // Send approval email
    try {
      const { sendLeaveApprovalEmail } = await import("@/lib/email");
      await sendLeaveApprovalEmail({
        employeeName: `${existingRequest.employee.firstName} ${existingRequest.employee.lastName}`,
        employeeEmail: existingRequest.employee.email,
        leaveType: existingRequest.leaveType,
        startDate: new Date(existingRequest.startDate).toLocaleDateString(),
        endDate: new Date(existingRequest.endDate).toLocaleDateString(),
        totalDays: existingRequest.totalDays,
        reviewerName: `${user.firstName} ${user.lastName}`,
        reviewNotes: notes,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the approval if email fails
    }

    revalidatePath("/dashboard/leave");
    return { success: true, data: leaveRequest };
  } catch (error) {
    console.error("Approve Leave Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function rejectLeaveRequest(id: string, notes?: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true, firstName: true, lastName: true },
    });

    if (!user || (user.role !== "HR_MANAGER" && user.role !== "SUPER_ADMIN")) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Get leave request with employee details
    const existingRequest = await db.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!existingRequest) {
      return { success: false, error: "Leave request not found" };
    }

    const leaveRequest = await db.leaveRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedById: user.id,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });

    // Send rejection email
    try {
      const { sendLeaveRejectionEmail } = await import("@/lib/email");
      await sendLeaveRejectionEmail({
        employeeName: `${existingRequest.employee.firstName} ${existingRequest.employee.lastName}`,
        employeeEmail: existingRequest.employee.email,
        leaveType: existingRequest.leaveType,
        startDate: new Date(existingRequest.startDate).toLocaleDateString(),
        endDate: new Date(existingRequest.endDate).toLocaleDateString(),
        totalDays: existingRequest.totalDays,
        reviewerName: `${user.firstName} ${user.lastName}`,
        reviewNotes: notes,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the rejection if email fails
    }

    revalidatePath("/dashboard/leave");
    return { success: true, data: leaveRequest };
  } catch (error) {
    console.error("Reject Leave Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


export async function getLeaveBalance(year?: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const currentYear = year || new Date().getFullYear();

    const balances = await db.leaveBalance.findMany({
      where: {
        employeeId: user.id,
        year: currentYear,
      },
    });

    return { success: true, data: balances };
  } catch (error) {
    console.error("Get Leave Balance Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
