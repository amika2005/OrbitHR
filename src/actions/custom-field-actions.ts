"use server";

import { prisma } from "@/lib/prisma";
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
    const customField = await prisma.customFieldDefinition.create({
      data: {
        entityType: data.entityType,
        name: data.name,
        label: data.label,
        type: data.type,
        options: data.options || [],
        required: data.required || false,
        companyId: data.companyId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: customField };
  } catch (error: any) {
    console.error("Error creating custom field:", error);
    return { success: false, error: error.message };
  }
}

export async function getCustomFieldDefinitions(companyId: string, entityType: string) {
  try {
    const fields = await prisma.customFieldDefinition.findMany({
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
    await prisma.customFieldDefinition.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting custom field:", error);
    return { success: false, error: error.message };
  }
}
