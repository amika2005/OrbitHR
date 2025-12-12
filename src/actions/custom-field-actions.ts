"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type CustomFieldType = "TEXT" | "NUMBER" | "DATE" | "SELECT";

export interface CreateCustomFieldInput {
  entityType: string;
  name: string;
  label: string;
  type: CustomFieldType;
  options?: string[];
  required?: boolean;
  companyId: string;
}

export async function createCustomFieldDefinition(data: CreateCustomFieldInput) {
  try {
    let { companyId } = data;

    if (!companyId) {
       const { userId } = await auth();
       if (!userId) {
         return { success: false, error: "Not authenticated" };
       }
       
       const user = await db.user.findUnique({
         where: { clerkId: userId },
         select: { companyId: true },
       });
       
       if (!user?.companyId) {
          return { success: false, error: "User has no company assigned" };
       }
       companyId = user.companyId;
    }

    const customField = await db.customFieldDefinition.create({
      data: {
        entityType: data.entityType,
        name: data.name,
        label: data.label,
        type: data.type,
        options: data.options || [],
        required: data.required || false,
        companyId: companyId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: customField };
  } catch (error: any) {
    console.error("Error creating custom field:", error);
    return { success: false, error: error.message };
  }
}

export async function getCustomFieldDefinitions(companyId: string | null | undefined, entityType: string) {
  try {
    if (!companyId) {
      const { userId } = await auth();
      if (!userId) {
        return { success: false, error: "Not authenticated" };
      }
      
      const user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { companyId: true },
      });
      
      if (!user?.companyId) {
         return { success: false, error: "User has no company assigned" };
      }
      companyId = user.companyId;
    }

    const fields = await db.customFieldDefinition.findMany({
      where: {
        companyId,
        entityType,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: fields };
  } catch (error: any) {
    console.error("Error fetching custom fields:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCustomFieldDefinition(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true },
    });

    if (!user?.companyId) {
       return { success: false, error: "User has no company assigned" };
    }

    // Verify ownership before deleting
    const field = await db.customFieldDefinition.findFirst({
      where: { 
        id,
        companyId: user.companyId 
      }
    });

    if (!field) {
      return { success: false, error: "Field not found or access denied" };
    }

    await db.customFieldDefinition.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting custom field:", error);
    return { success: false, error: error.message };
  }
}
