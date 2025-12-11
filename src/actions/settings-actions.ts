"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCompanyEmailSettings() {
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

    const company = await db.company.findUnique({
      where: { id: user.companyId! },
      select: { settings: true },
    });

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Parse settings
    const currentSettings = company.settings as any || {};
    const emailSettings = currentSettings.emailSettings as { ccEmails: string[] } | undefined;
    
    return { 
      success: true, 
      ccEmails: emailSettings?.ccEmails || ["", "", ""] 
    };

  } catch (error) {
    console.error("Get Email Settings Error:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function updateCompanyEmailSettings(ccEmails: string[]) {
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

    // Get current settings first to merge
    const company = await db.company.findUnique({
      where: { id: user.companyId! },
      select: { settings: true },
    });

    const currentSettings = (company?.settings as any) || {};

    await db.company.update({
      where: { id: user.companyId! },
      data: {
        settings: {
          ...currentSettings,
          emailSettings: { ccEmails }
        },
      },
    });

    revalidatePath("/dashboard/payroll");
    return { success: true };

  } catch (error) {
    console.error("Update Email Settings Error:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
