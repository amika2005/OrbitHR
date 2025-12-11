"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ApplicationStatus } from "@prisma/client";

export interface PipelineCandidate {
  id: string; // Application ID
  name: string;
  role: string;
  exp: string;
  aiScore: number;
  source: "mail" | "linkedin"; // Derived from DB (e.g. if applied via email)
  sourceBy: string;
  stage: "inbox" | "screening" | "interview" | "offer" | "hired";
  department: "IT" | "Marketing" | "Finance" | string;
  imageUrl?: string;
}

// Map DB status to UI stage
function mapStatusToStage(status: ApplicationStatus): PipelineCandidate["stage"] {
  switch (status) {
    case "NEW": return "inbox";
    case "AI_SCREENED": return "screening";
    case "INTERVIEW_SCHEDULED": return "interview";
    case "HR_APPROVED": return "offer";
    case "HIRED": return "hired";
    default: return "inbox";
  }
}

export async function getCandidates() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !user.companyId) {
       return { success: false, error: "User or company not found" };
    }

    // Fetch applications for the company
    const applications = await db.application.findMany({
      where: {
        companyId: user.companyId,
        status: { not: "REJECTED" }, // Hide rejected from pipeline for now
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
            email: true,
          }
        },
        job: {
          select: {
            title: true,
            department: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to UI format
    const candidates: PipelineCandidate[] = applications.map(app => ({
      id: app.id,
      name: `${app.candidate.firstName} ${app.candidate.lastName}`,
      role: app.job.title,
      exp: "N/A", // We don't have experience field easily accessible in this query, placeholder
      aiScore: app.aiScore || 0,
      source: "linkedin", // Defaulting for now as we don't track source explicitly in Application model yet
      sourceBy: app.candidate.email,
      stage: mapStatusToStage(app.status),
      department: app.job.department,
      imageUrl: app.candidate.imageUrl || undefined,
    }));

    return { success: true, data: candidates };

  } catch (error) {
    console.error("Error fetching candidates:", error);
    return { success: false, error: "Failed to fetch candidates" };
  }
}
