"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define enums locally since Prisma imports are failing
enum JobStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

enum Country {
  JAPAN = "JAPAN",
  SRI_LANKA = "SRI_LANKA",
}

enum Currency {
  JPY = "JPY",
  LKR = "LKR",
}

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  country: z.nativeEnum(Country),
  location: z.string().min(1, "Location is required"),
  salaryMin: z.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.number().min(0, "Maximum salary must be positive"),
  currency: z.nativeEnum(Currency),
  department: z.string().min(1, "Department is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  keySkills: z.array(z.string()).min(1, "At least one skill is required"),
  screeningTemplateId: z.string().optional(),
});

export async function createJob(data: z.infer<typeof jobSchema>) {
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

    if (!user.companyId) {
      return { success: false, error: "User must belong to a company" };
    }

    // Validate data
    const validatedData = jobSchema.parse(data);

    // Create job
    const job = await db.job.create({
      data: {
        ...validatedData,
        status: JobStatus.DRAFT,
        companyId: user.companyId!,
      },
    });

    revalidatePath("/dashboard/jobs");
    return { success: true, data: job };
  } catch (error) {
    console.error("Create Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateJob(
  id: string,
  data: Partial<z.infer<typeof jobSchema>>
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

    // Check if job exists and belongs to user's company
    const existingJob = await db.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingJob || existingJob.companyId !== user.companyId) {
      return { success: false, error: "Job not found" };
    }

    // Validate partial data
    const validatedData = jobSchema.partial().parse(data);

    // Update job
    const updatedJob = await db.job.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/dashboard/jobs");
    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Update Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishJob(id: string) {
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

    // Check if job exists and belongs to user's company
    const existingJob = await db.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingJob || existingJob.companyId !== user.companyId) {
      return { success: false, error: "Job not found" };
    }

    // Update job status to OPEN
    const updatedJob = await db.job.update({
      where: { id },
      data: {
        status: JobStatus.OPEN,
        postedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/dashboard/jobs/${id}`);
    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Publish Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Form action wrapper for publishJob
export async function publishJobAction(formData: FormData) {
  const id = formData.get("jobId") as string;
  await publishJob(id);
}

export async function closeJob(id: string) {
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

    // Check if job exists and belongs to user's company
    const existingJob = await db.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingJob || existingJob.companyId !== user.companyId) {
      return { success: false, error: "Job not found" };
    }

    // Update job status to CLOSED
    const updatedJob = await db.job.update({
      where: { id },
      data: {
        status: JobStatus.CLOSED,
        closedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/dashboard/jobs/${id}`);
    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Close Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Form action wrapper for closeJob
export async function closeJobAction(formData: FormData) {
  const id = formData.get("jobId") as string;
  await closeJob(id);
}

export async function deleteJob(id: string) {
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

    // Check if job exists and belongs to user's company
    const existingJob = await db.job.findUnique({
      where: { id },
      select: { companyId: true, _count: { select: { applications: true } } },
    });

    if (!existingJob || existingJob.companyId !== user.companyId) {
      return { success: false, error: "Job not found" };
    }

    // Don't allow deletion if there are applications
    if (existingJob._count.applications > 0) {
      return { 
        success: false, 
        error: "Cannot delete job with existing applications. Close the job instead." 
      };
    }

    // Delete job
    await db.job.delete({
      where: { id },
    });

    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    console.error("Delete Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getJobs() {
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

    if (!user.companyId) {
      return { success: false, error: "User must belong to a company" };
    }

    // Get all jobs for the company
    const jobs = await db.job.findMany({
      where: { companyId: user.companyId! },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return { success: true, data: jobs };
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getJob(id: string) {
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

    if (!user.companyId) {
      return { success: false, error: "User must belong to a company" };
    }

    // Get job with applications
    const job = await db.job.findUnique({
      where: { 
        id,
        companyId: user.companyId!,
      },
      include: {
        applications: {
          include: {
            candidate: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        screeningTemplate: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    return { success: true, data: job };
  } catch (error) {
    console.error("Get Job Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
