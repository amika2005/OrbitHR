"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ========================================
// HELPER: Get user's company ID
// ========================================
async function getUserCompany() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, companyId: true, role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// ========================================
// CREATE APPLICATION WITH RESUME UPLOAD
// ========================================
export async function createApplication(formData: FormData) {
  try {
        const { uploadFile, validateFileType, validateFileSize } = await import("@/lib/storage");
const user = await getUserCompany();

    // Extract form data
    const jobId = formData.get("jobId") as string;
    const candidateId = formData.get("candidateId") as string;
    const resumeFile = formData.get("resumeFile") as File;
    const coverLetter = formData.get("coverLetter") as string | null;
    const portfolioUrl = formData.get("portfolioUrl") as string | null;

    if (!jobId || !candidateId || !resumeFile) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Validate file
    if (!validateFileType(resumeFile, ["application/pdf"])) {
      return {
        success: false,
        error: "Only PDF files are allowed",
      };
    }

    if (!validateFileSize(resumeFile, 5)) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }

    // Verify job belongs to company
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { companyId: true },
    });

    if (!job || job.companyId !== user.companyId) {
      return {
        success: false,
        error: "Job not found or access denied",
      };
    }

    // Upload resume to Supabase Storage
    const uploadResult = await uploadFile(resumeFile, "resumes", "uploads");

    if (!uploadResult.success || !uploadResult.url) {
      return {
        success: false,
        error: uploadResult.error || "Failed to upload resume",
      };
    }

    // Create application
    const application = await db.application.create({
      data: {
        jobId,
        candidateId,
        resumeUrl: uploadResult.url,
        coverLetter: coverLetter || undefined,
        portfolioUrl: portfolioUrl || undefined,
        companyId: user.companyId!,
        status: ApplicationStatus.NEW,
      },
    });

    // Trigger AI screening asynchronously (don't wait for it)
    extractAndScreenResume(application.id, uploadResult.url).catch((error) => {
      console.error("Background AI screening failed:", error);
    });

    revalidatePath("/dashboard/candidates");
    revalidatePath(`/dashboard/jobs/${jobId}`);

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error("Create application error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create application",
    };
  }
}

// ========================================
// EXTRACT TEXT AND TRIGGER AI SCREENING
// ========================================
async function extractAndScreenResume(applicationId: string, resumeUrl: string) {
  try {
        const { extractTextFromPDF } = await import("@/lib/pdf-parser");
    const { screenCandidate } = await import("./screen-candidate");
// Extract text from PDF
    const pdfResult = await extractTextFromPDF(resumeUrl);

    if (!pdfResult.success || !pdfResult.text) {
      console.error("PDF extraction failed:", pdfResult.error);
      return;
    }

    // Trigger AI screening
    await screenCandidate(applicationId, pdfResult.text);
  } catch (error) {
    console.error("Extract and screen error:", error);
  }
}

// ========================================
// SCHEDULE INTERVIEW
// ========================================
export async function scheduleInterview(
  applicationId: string,
  interviewDate: Date,
  notes?: string
) {
  try {
    const user = await getUserCompany();

    // Verify application belongs to company
    const application = await db.application.findUnique({
      where: { id: applicationId },
      select: { companyId: true },
    });

    if (!application || application.companyId !== user.companyId) {
      return {
        success: false,
        error: "Application not found or access denied",
      };
    }

    // Update application
    const updated = await db.application.update({
      where: { id: applicationId },
      data: {
        interviewDate,
        interviewNotes: notes,
        status: ApplicationStatus.INTERVIEW_SCHEDULED,
      },
    });

    revalidatePath("/dashboard/candidates");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Schedule interview error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to schedule interview",
    };
  }
}

// ========================================
// HIRE CANDIDATE
// ========================================
export async function hireCandidate(applicationId: string) {
  try {
    const user = await getUserCompany();

    // Verify application belongs to company
    const application = await db.application.findUnique({
      where: { id: applicationId },
      select: { companyId: true, candidateId: true },
    });

    if (!application || application.companyId !== user.companyId) {
      return {
        success: false,
        error: "Application not found or access denied",
      };
    }

    // Update application status to HIRED
    await db.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.HIRED,
      },
    });

    // TODO: Optionally convert candidate to employee
    // This would involve creating an Employee record from the candidate

    revalidatePath("/dashboard/candidates");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Hire candidate error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to hire candidate",
    };
  }
}

// ========================================
// GET APPLICATIONS BY JOB
// ========================================
export async function getApplicationsByJob(jobId?: string) {
  try {
    const user = await getUserCompany();

    const applications = await db.application.findMany({
      where: {
        companyId: user.companyId!,
        ...(jobId && { jobId }),
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: applications,
    };
  } catch (error) {
    console.error("Get applications error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch applications",
    };
  }
}

// ========================================
// GET APPLICATION BY ID
// ========================================
export async function getApplicationById(applicationId: string) {
  try {
    const user = await getUserCompany();

    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: true,
        job: true,
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!application || application.companyId !== user.companyId) {
      return {
        success: false,
        error: "Application not found or access denied",
      };
    }

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error("Get application error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch application",
    };
  }
}



